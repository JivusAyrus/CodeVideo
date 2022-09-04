import { cx } from "@emotion/css";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  canvasDimensionsStore,
  codeFontSizeStore,
  codeLanguageStore,
  microphoneIdStore,
  stateStore,
} from "../../stores/stores";
import { Device } from "../../utils/interfaces";
import { supportedLanguages } from "../../utils/supportedLanguages";
import BackgroundGradients from "./BackgroundGradients";

const Configuration = () => {
  const [{ width, height }, setCanvasDimensions] = useRecoilState(
    canvasDimensionsStore
  );
  const [codeFontSize, setCodeFontSize] = useRecoilState(codeFontSizeStore);
  const [microphoneId, setMicrophoneId] = useRecoilState(microphoneIdStore);
  const [codeLanguage, setCodeLanguage] = useRecoilState(codeLanguageStore);
  const state = useRecoilValue(stateStore);

  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
    (async () => {
      const mediaDevices = (
        await navigator.mediaDevices.enumerateDevices()
      ).reverse();
      const audioDevices: Device[] = mediaDevices
        .filter((device) => device.kind === "audioinput")
        .map((device) => ({ id: device.deviceId, label: device.label }));
      setDevices(audioDevices);
    })();
  }, []);

  useEffect(() => {
    const preferredMicrophone = localStorage.getItem("preferred-microphone");
    setMicrophoneId(preferredMicrophone);
  }, [devices]);

  return (
    <div>
      <h1 className="font-bold font-main text-white p-4">Background</h1>
      <BackgroundGradients />
      <h1 className="font-bold font-main text-white p-4">Video Dimensions</h1>
      <div className="flex flex-row px-4 pb-4 gap-x-4 border-b border-gray-700">
        <div className="flex gap-x-2">
          <h3 className="font-main text-sm text-white flex items-center">
            Width
          </h3>
          <input
            type="number"
            className="bg-gray-700 text-white text-sm text-center rounded-lg w-full p-2.5 disabled:cursor-not-allowed"
            defaultValue={width * 2}
            onChange={(event) => {
              let tempWidth: number = event.target.value as unknown as number;
              if (tempWidth < 300) tempWidth = 300;
              setCanvasDimensions({
                width: tempWidth / 2,
                height,
              });
            }}
            disabled={state === "recording"}
          />
        </div>
        <div className="flex gap-x-2">
          <h3 className="font-main text-sm text-white flex items-center">
            Height
          </h3>
          <input
            type="number"
            className="bg-gray-700 text-white text-sm text-center rounded-lg w-full p-2.5 disabled:cursor-not-allowed"
            defaultValue={height * 2}
            onChange={(event) => {
              let tempHeight: number = event.target.value as unknown as number;
              if (tempHeight < 300) {
                tempHeight = 300;
              }
              setCanvasDimensions({
                width,
                height: tempHeight / 2,
              });
            }}
            disabled={state === "recording"}
          />
        </div>
      </div>
      <h1 className="font-bold font-main text-white p-4">Font Size</h1>
      <div className="px-4 pb-4 border-b border-gray-700 flex justify-around gap-x-2">
        {[12, 16, 20].map((size) => (
          <button
            type="button"
            onClick={() => {
              setCodeFontSize(size);
            }}
            className={cx(
              "border border-gray-200 rounded-sm text-lg font-main px-4 py-1 bg-white hover:ring hover:ring-gray-300 disabled:cursor-not-allowed",
              {
                "ring ring-cyan-500": codeFontSize === size,
              }
            )}
            disabled={state === "recording"}
          >
            {size}px
          </button>
        ))}
      </div>
      <h1 className="font-bold font-main text-white p-4">Code Language</h1>
      <div className="px-4 pb-4 border-b border-gray-700 flex justify-around gap-x-2">
        <select
          className="bg-gray-700 text-white text-sm rounded-md w-full p-3 disabled:cursor-not-allowed"
          disabled={state === "recording"}
          onChange={(e) => {
            setCodeLanguage(e.target.value);
          }}
          defaultValue={codeLanguage}
        >
          {supportedLanguages.map((language) => (
            <option value={language}>{language}</option>
          ))}
        </select>
      </div>
      <h1 className="font-bold font-main text-white p-4">Microphone</h1>
      <div className="px-4 pb-4 border-b border-gray-700 flex justify-around gap-x-2">
        <select
          className="bg-gray-700 text-white text-sm rounded-md w-full p-3 disabled:cursor-not-allowed"
          disabled={state === "recording"}
          onChange={(e) => {
            setMicrophoneId(e.target.value);
            localStorage.setItem("preferred-microphone", e.target.value);
          }}
        >
          {devices.map((device) => (
            <option value={device.id} selected={device.id === microphoneId}>
              {device.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default Configuration;
