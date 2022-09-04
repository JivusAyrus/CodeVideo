import Konva from "konva";
import { MutableRefObject, useEffect, useState } from "react";
import { Circle, Group, Layer, Rect, Stage } from "react-konva";
import {
  useRecoilBridgeAcrossReactRoots_UNSTABLE,
  useRecoilValue,
} from "recoil";
import { useMutation } from "../../components/generated/nextjs";
import useCode from "../../hooks/useCode";
import {
  canvasBgGradientStore,
  canvasDimensionsStore,
  codeFontSizeStore,
  codeLanguageStore,
  codeStore,
  stateStore,
} from "../../stores/stores";
import {
  ComputedToken,
  GradientConfig,
  Position,
} from "../../utils/interfaces";
import { clipRect, getGradientConfig } from "../../utils/utils";
import EditableText from "./EditableText";
import { getRenderedTokens, RenderTokens } from "./TypingEffect";

const CanvasComponent = ({
  stageRef,
}: {
  stageRef: MutableRefObject<Konva.Stage>;
}) => {
  Konva.pixelRatio = 2;
  const Bridge = useRecoilBridgeAcrossReactRoots_UNSTABLE();

  const state = useRecoilValue(stateStore);
  const { width, height } = useRecoilValue(canvasDimensionsStore);
  const gradient = useRecoilValue(canvasBgGradientStore);
  const code = useRecoilValue(codeStore);
  const codeLanguage = useRecoilValue(codeLanguageStore);
  const codeFontSize = useRecoilValue(codeFontSizeStore);

  const [gradientConfig, setGradientConfig] = useState<GradientConfig>({
    id: 1,
    cssString:
      "linear-gradient(90deg, #D397FA 0%, #D397FA 0.01%, #8364E8 100%)",
    values: [0, "#D397FA", 0.0001, "#D397FA", 1, "#8364E8"],
    startIndex: { x: 0, y: 269.9 },
    endIndex: { x: 960, y: 270.0 },
  });
  const [computedTokens, setComputedTokens] = useState<ComputedToken[]>([]);
  const [position, setPosition] = useState<Position>({
    prevIndex: -1,
    currentIndex: 0,
  });
  const [colorCodes, setColorCodes] = useState<any>([]);

  const { initUseCode } = useCode();

  const { mutate: getColorCodes, result } = useMutation.GetColorCodes();

  useEffect(() => {
    setGradientConfig(getGradientConfig({ gradient, width, height }));
  }, [width, height, gradient]);

  useEffect(() => {
    // get color codes
    getColorCodes({
      input: { code, language: codeLanguage, theme: "dark_plus" },
    });
  }, [code, codeLanguage]);

  useEffect(() => {
    if (result.status === "ok") {
      setColorCodes(result.data.colorcodes_postColorCodes.data);
    }
  }, [result]);

  useEffect(() => {
    if (
      !colorCodes ||
      colorCodes.length === 0 ||
      !width ||
      !height ||
      !codeFontSize
    )
      return;
    // get computed tokens
    setComputedTokens(
      initUseCode({
        tokens: colorCodes,
        canvasWidth: width - 80,
        canvasHeight: height - 120,
        gutter: codeFontSize / 2,
        fontSize: codeFontSize,
        fontFamily: "Roboto Mono",
      })
    );
  }, [colorCodes, width, height, codeFontSize]);

  return (
    <>
      <div className="flex flex-col h-screen justify-center items-center">
        <Stage className="mt-auto mb-auto" width={width} height={height} ref={stageRef}>
          <Bridge>
            <Layer>
              <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fillLinearGradientColorStops={gradientConfig.values}
                fillLinearGradientStartPoint={gradientConfig.startIndex}
                fillLinearGradientEndPoint={gradientConfig.endIndex}
              />
              <Group
                clipFunc={(ctx: any) => {
                  clipRect(ctx, {
                    x: 16,
                    y: 16,
                    width: width - 32,
                    height: height - 32,
                    borderRadius: 8,
                  });
                }}
              >
                <Rect
                  x={16}
                  y={16}
                  width={width - 32}
                  height={40}
                  fill="#ffffff"
                  opacity={0.2}
                />
                <Group x={36} y={36} key="circleGroup">
                  <Circle
                    key="redCircle"
                    x={0}
                    y={0}
                    fill="#FF605C"
                    radius={6}
                  />
                  <Circle
                    key="yellowCircle"
                    x={20}
                    y={0}
                    fill="#FFBD44"
                    radius={6}
                  />
                  <Circle
                    key="greenCircle"
                    x={40}
                    y={0}
                    fill="#00CA4E"
                    radius={6}
                  />
                </Group>
                <Rect
                  x={16}
                  y={56}
                  width={width - 32}
                  height={height - 72}
                  fill="#1E1E1E"
                  // opacity={0.8}
                />
                {state === "ready" && (
                  <EditableText
                    x={40}
                    y={80}
                    width={width - 80}
                    height={height - 120}
                    computedTokens={computedTokens}
                  />
                )}
                {(state === "recording" || state === "stopRecording") && (
                  <Group x={40} y={80}>
                    {getRenderedTokens(computedTokens, position, codeFontSize)}
                    {computedTokens.length > 0 && (
                      <RenderTokens
                        key={position.prevIndex}
                        tokens={computedTokens}
                        startIndex={position.prevIndex}
                        endIndex={position.currentIndex}
                        fontSize={codeFontSize}
                      />
                    )}
                  </Group>
                )}
              </Group>
            </Layer>
          </Bridge>
        </Stage>
      </div>
      <div className="absolute right-4 bottom-4">
        {state === "recording" && (
          <button
            className="flex gap-x-2 items-center bg-green-500 text-white font-main font-bold px-4 py-2 rounded-md text-size-sm-title disabled:cursor-not-allowed"
            disabled={position.currentIndex === computedTokens.length}
            type="button"
            onClick={() => {
              if (position.currentIndex === computedTokens.length) return;
              const current = computedTokens?.[position?.currentIndex];
              let next = computedTokens?.findIndex(
                (t: any) => t.lineNumber > current?.lineNumber
              );
              if (next === -1) next = computedTokens.length;
              setPosition({
                prevIndex: position.currentIndex,
                currentIndex: next,
              });
            }}
          >
            Next
          </button>
        )}
      </div>
    </>
  );
};
export default CanvasComponent;
