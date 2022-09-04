import { useRef, useState } from "react";
import { Html } from "react-konva-utils";
import { useRecoilState, useRecoilValue } from "recoil";
import { codeFontSizeStore, codeStore } from "../../stores/stores";
import { Group, Text } from "react-konva";
import { ComputedToken } from "../../utils/interfaces";
import { getTokens } from "./TypingEffect";

const getStyle = ({
  width,
  height,
  codeFontSize,
}: {
  width: number;
  height: number;
  codeFontSize: number;
}) => {
  const baseStyle = {
    width: `${width}px`,
    height: `${height}px`,
    border: "none",
    padding: "0px",
    margin: "0px",
    background: "none",
    outline: "none",
    color: "#e5e7eb",
    fontSize: `${codeFontSize}px`,
    fontFamily: "Roboto Mono",
  };
  return baseStyle;
};

const EditableText = ({
  x,
  y,
  width,
  height,
  computedTokens,
}: {
  x: number;
  y: number;
  width: number;
  height: number;
  computedTokens: ComputedToken[];
}) => {
  const codeFontSize = useRecoilValue(codeFontSizeStore);
  const [code, setCode] = useRecoilState(codeStore);

  const [localCode, setLocalCode] = useState<string>(code);
  const [isEditing, setIsEditing] = useState(false);
  const style = getStyle({ width, height, codeFontSize });

  const onTextClick = () => {
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <Html groupProps={{ x, y }} divProps={{ style: { opacity: 1 } }}>
        <textarea
          defaultValue={code}
          onChange={(e) => setLocalCode(e.target.value)}
          style={style}
          onBlur={() => {
            setCode(localCode);
            setIsEditing(false);
          }}
          autoFocus
        />
      </Html>
    );
  }
  return (
    <Group x={x} y={y}>
      {getTokens({
        tokens: computedTokens,
        opacity: 1,
        fontSize: codeFontSize,
        font:'Roboto Mono',
        onClick: onTextClick,
      })}
    </Group>
  );
};

export default EditableText;
