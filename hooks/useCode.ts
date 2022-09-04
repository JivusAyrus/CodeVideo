import { useRef } from "react";
import Konva from "konva";
import { ComputedToken, Token } from "../utils/interfaces";

const useCode = () => {
  const computedLineNumber = useRef(0);
  const lineNumber = useRef(0);
  const computedTokens = useRef<ComputedToken[]>([]);
  const currentWidth = useRef(0);
  let startFromIndex = 0;

  const initUseCode = ({
    tokens,
    canvasWidth,
    canvasHeight,
    gutter,
    fontSize,
    fontFamily,
  }: {
    tokens: Token[];
    canvasWidth: number;
    canvasHeight: number;
    gutter: number;
    fontSize: number;
    fontFamily?: string;
  }) => {
    const layer = new Konva.Layer({ width: canvasWidth });
    computedTokens.current = [];
    computedLineNumber.current = 0;
    lineNumber.current = 0;
    currentWidth.current = 0;
    startFromIndex = 0;

    tokens.forEach((token, index) => {
      if (lineNumber.current !== token.lineNumber) {
        computedLineNumber.current += token.lineNumber - lineNumber.current;
        currentWidth.current = 0;

        if ((fontSize + gutter) * computedLineNumber.current > canvasHeight) {
          computedLineNumber.current = 0;
          startFromIndex = index;
        }

        lineNumber.current = token.lineNumber;
      }

      const text = new Konva.Text({
        text: token.content,
        fontSize,
        fontFamily,
      });
      layer.add(text);

      const width = text.textWidth;

      // Check for wrapping...
      if (width + currentWidth.current > canvasWidth) {
        // wrap
        if (currentWidth.current !== 0) {
          computedLineNumber.current += 1;
          currentWidth.current = 0;
        }
      }

      const computedToken: ComputedToken = {
        ...token,
        x: currentWidth.current,
        y: (fontSize + gutter) * computedLineNumber.current,
        width,
        startFromIndex,
      };

      currentWidth.current += width;

      computedTokens.current.push(computedToken);

      text.destroy();
    });
    return computedTokens.current;
  };

  return { initUseCode, computedTokens };
};

export default useCode;
