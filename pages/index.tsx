import Konva from "konva";
import { nanoid } from "nanoid";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  AuthProviders,
  S3Provider,
  useMutation,
  useWunderGraph,
} from "../components/generated/nextjs";
import useCanvasRecorder from "../hooks/useCanvasRecorder";
import {
  canvasDimensionsStore,
  codeStore,
  microphoneIdStore,
  stateStore,
} from "../stores/stores";
import Configuration from "./components/Configuration";
import { saveAs } from "file-saver";

const CanvasComponent = dynamic(() => import("./components/CanvasComponent"), {
  ssr: false,
});

export default function Home() {
  const { user, login, logout, uploadFiles } = useWunderGraph();
  const [state, setState] = useRecoilState(stateStore);
  const microphoneId = useRecoilValue(microphoneIdStore);
  const code = useRecoilValue(codeStore);
  const { width, height } = useRecoilValue(canvasDimensionsStore);
  const [videoURL, setVideoURL] = useState("");
  const [microphoneStream, setMicrophoneStream] = useState<MediaStream>();
  const { startRecording, stopRecording, getBlobs, download, reset } =
    useCanvasRecorder({});

  const stageRef = useRef<Konva.Stage>(null);

  const { mutate: createVideo } = useMutation.CreateVideo();

  const prepareVideo = async () => {
    const blob = await getBlobs();
    if (!blob || blob?.size <= 0) {
      console.log("Could not produce the video");
      setState("ready");
      return;
    }
    setVideoURL(URL.createObjectURL(blob));
    setState("preview");
  };

  const captureCanvas = async () => {
    const thumbnailURL = stageRef.current.toDataURL();
    const thumbnailBlob = await fetch(thumbnailURL).then((r) => r.blob());
    saveAs(thumbnailBlob, "Code.png");
  };

  const saveAndContinue = async () => {
    setState("ready");
    download();
    const blob = await getBlobs();
    const myFile = new File([blob], `${nanoid()}.webm`, {
      type: blob.type,
    });
    var dt = new DataTransfer();
    dt.items.add(myFile);
    var file_list = dt.files;
    const result = await uploadFiles({
      provider: S3Provider.minio,
      files: file_list,
    });
    if (result.status === "ok")
      createVideo({
        input: {
          code,
          videoObjectName: result.fileKeys[0],
        },
      });
  };

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId: microphoneId },
    });
    setMicrophoneStream(stream);
    const canvas = document
      .getElementsByClassName("konvajs-content")[0]
      .getElementsByTagName("canvas")[0];
    startRecording(canvas, stream);
  };

  useEffect(() => {
    if (state === "stopRecording") {
      stopRecording();
      microphoneStream?.getTracks()?.forEach((track) => {
        track.stop();
      });
      setTimeout(() => {
        prepareVideo();
      }, 250);
    }
  }, [state, microphoneStream]);

  if (!user)
    return (
      <div className="bg-gradient-to-br from-[#2C3E50] to-black w-screen h-screen">
        <h1 className="absolute text-4xl font-bold font-main text-white p-4">
          {"<video/>"}
        </h1>
        <p className="absolute font-code opacity-0">{"<video/>"}</p>
        <div className="flex flex-col justify-center items-start h-screen w-full px-16 gap-y-6">
          <div className="text-white text-7xl font-main">
            Have a code snippet
            <br />
            Create a <span className="text-cyan-500">code video</span>
          </div>
          <button
            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold font-main py-2 px-4 rounded "
            onClick={() => {
              login(AuthProviders.google);
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  return (
    <div className="bg-[#080B1C] w-screen h-screen flex flex-col overflow-hidden">
      <button
        className="absolute right-4 top-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold font-main py-2 px-4 rounded"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
      <div className="grid grid-cols-5">
        <div className="h-screen col-span-1 col-start-1 bg-[#14162A] z-50">
          <h1 className="text-4xl font-bold font-main text-white p-4">
            {"<video/>"}
          </h1>
          <hr />
          <Configuration />
        </div>
        {/* Canvas or video based on state */}
        <div className="col-span-4 col-start-2">
          {state !== "preview" && <CanvasComponent stageRef={stageRef} />}
          {state === "preview" && (
            <div className="flex flex-col w-full h-full justify-center items-center">
              <video
                height={height}
                width={width}
                controls
                autoPlay={false}
                src={videoURL}
                key={nanoid()}
              />
            </div>
          )}
          {/* Controls */}
          <div className=" absolute bottom-4 pl-4">
            {state === "ready" && (
              <div className="flex gap-x-4">
                <button
                  className="flex gap-x-2 items-center bg-red-500 text-white font-main px-4 py-2 rounded-md text-size-sm-title"
                  type="button"
                  onClick={() => {
                    setState("recording");
                    start();
                  }}
                >
                  <div className="w-3 h-3 bg-white rounded-full" />
                  Start Recording
                </button>
                <button
                  className="items-center bg-green-500 text-white font-main px-4 py-2 rounded-md text-size-sm-title"
                  type="button"
                  onClick={() => {
                    captureCanvas();
                  }}
                >
                  Capture Canvas
                </button>
              </div>
            )}
            {state === "recording" && (
              <button
                className="flex gap-x-2 items-center bg-white text-red-500 font-main px-4 py-2 rounded-md text-size-sm-title"
                type="button"
                onClick={() => {
                  setState("stopRecording");
                }}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                Stop Recording
              </button>
            )}
            {state === "preview" && (
              <div className="flex gap-x-4">
                <button
                  className="flex gap-x-2 items-center bg-red-500 text-white font-main px-4 py-2 rounded-md text-size-sm-title"
                  type="button"
                  onClick={() => {
                    setState("ready");
                    reset();
                    URL.revokeObjectURL(videoURL);
                  }}
                >
                  Retake
                </button>
                <button
                  className="flex gap-x-2 items-center bg-green-500 text-white font-main px-4 py-2 rounded-md text-size-sm-title"
                  type="button"
                  onClick={() => {
                    saveAndContinue();
                  }}
                >
                  Save and download
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
