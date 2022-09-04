import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import {Group, Text} from 'react-konva'
import { ComputedToken, Position, TokenRenderState } from "../../utils/interfaces";

const TypingEffect = ({
  token,
  fontSize,
}: {
  token: ComputedToken;
  fontSize: number;
}) => {
  const [text, setText] = useState("");
  useEffect(() => {
    if (!token) return;
    const chars = token.content.split('');
    chars.forEach((char, index) => {
      setTimeout(() => {
        setText((t) => t + char);
      }, 100 * index);
    });
  }, []);
  return (
    <Text
      key={nanoid()}
      fontSize={fontSize}
      fontFamily="Roboto Mono"
      fill={token?.color}
      text={text}
      x={token?.x}
      y={token?.y}
      align="left"
    />
  );
};

export const RenderTokens = ({
  tokens,
  startIndex,
  endIndex,
  fontSize,
}: {
  tokens: ComputedToken[];
  startIndex: number;
  endIndex: number;
  fontSize: number;
}) => {
  const tokenSegment = tokens.slice(startIndex, endIndex);

  const [renderState, setRenderState] = useState<TokenRenderState>({
    index: startIndex,
    tokens: [tokens[startIndex]],
  });

  useEffect(() => {
    if (renderState.index === endIndex - 1) return;
    const newToken = tokenSegment[renderState.index - startIndex + 1];
    const prevToken = tokenSegment[renderState.index - startIndex];
    setTimeout(() => {
      setRenderState((prev) => ({
        index: prev.index + 1,
        tokens: [...prev.tokens, newToken],
      }));
    }, (prevToken?.content?.length || 0) * 100);
  }, [renderState]);

  return (
    <Group>
      {renderState.tokens.length > 0 &&
        renderState.tokens.map((token, index) => (
          <TypingEffect fontSize={fontSize} key={index} token={token} />
        ))}
    </Group>
  );
};

export const getRenderedTokens = (
  tokens: ComputedToken[],
  position: Position,
  fontSize: number
) => {
  const startFromIndex = Math.max(
    ...tokens
      .filter((_, i) => i <= position.prevIndex)
      .map((token) => token.startFromIndex)
  );

  return tokens
    .filter((_, i) => i < position.prevIndex && i >= startFromIndex)
    .map((token, index) => (
      <Text
        key={index}
        fontSize={fontSize}
        fontFamily="Roboto Mono"
        fill={token.color}
        text={token.content}
        x={token.x}
        y={token.y}
        align="left"
      />
    ));
};

export const getTokens = ({
  tokens,
  opacity,
  fontSize,
  font,
  onClick
}: {
  tokens: ComputedToken[];
  opacity: number;
  font?: string;
  fontSize: number;
  onClick: () => void
}) => {
  let computedLineNumber = 0;
  let lineNumber = 0;

  return tokens.map((token, index) => {
    if (lineNumber !== token.lineNumber) {
      computedLineNumber += token.lineNumber - lineNumber;
      lineNumber = token.lineNumber;
    } else if (token.x === 0 && index !== 0) {
      computedLineNumber += 1;
    }
    return (
      <Text
        key={index}
        fontSize={fontSize}
        fill={token.color}
        text={token.content}
        x={token.x}
        y={(fontSize + 8) * computedLineNumber}
        opacity={opacity}
        align="left"
        fontFamily={font}
        onClick={onClick}
        onTap={onClick}
      />
    );
  });
};


export default TypingEffect