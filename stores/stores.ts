import { atom } from "recoil";
import { Gradient, State } from "../utils/interfaces";

const stateStore = atom<State>({
  key: "state",
  default: "ready",
});

const codeStore = atom<string>({
  key: "code",
  default: "Click and paste your code",
});

const canvasBgGradientStore = atom<Gradient>({
  key: "canvasBgGradientStore",
  default: {
    id: 1,
    angle: 90,
    values: [0, "#D397FA", 0.0001, "#D397FA", 1, "#8364E8"],
    cssString:
      "linear-gradient(90deg, #D397FA 0%, #D397FA 0.01%, #8364E8 100%)",
  },
});

const canvasDimensionsStore = atom<{
  width: number;
  height: number;
}>({
  key: "canvasDimensions",
  default: {
    width: 960,
    height: 540,
  },
});

const codeFontSizeStore = atom<number>({
  key: "codeFontSize",
  default: 16,
});

const microphoneIdStore = atom<string>({
  key: "microphoneId",
  default: '',
});

const codeLanguageStore = atom<string>({
  key: "codeLanguage",
  default: "javascript",
});

export {
  stateStore,
  codeStore,
  canvasBgGradientStore,
  canvasDimensionsStore,
  codeFontSizeStore,
  microphoneIdStore,
  codeLanguageStore,
};
