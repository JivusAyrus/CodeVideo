import { useRef, useState } from "react";
import { saveAs } from "file-saver";
import { extension } from "mime-types";
// import { getSeekableWebM } from "utils/src";

const types = [
  "video/x-matroska;codecs=avc1",
  "video/webm;codecs=h264",
  "video/webm",
  "video/webm,codecs=vp9",
  "video/vp8",
  "video/webm;codecs=vp8",
  "video/webm;codecs=daala",
  "video/mpeg",
];

type ElementType<T extends ReadonlyArray<unknown>> = T extends ReadonlyArray<
  infer ElementType
>
  ? ElementType
  : never;

interface CanvasElement extends HTMLCanvasElement {
  captureStream(frameRate?: number): MediaStream;
}

export type AudioType = "transition" | "shorts" | "points";
export type MusicAction = "start" | "stop" | "modifyVolume";

const useCanvasRecorder = ({
  videoBitsPerSecond = 12000000,
}: {
  videoBitsPerSecond?: number;
}) => {
  const recordedBlobs = useRef<Blob[]>([]);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const [type, setType] = useState<ElementType<typeof types>>();

  const handleDataAvailable = (event: BlobEvent): any => {
    if (event.data && event.data.size > 0) {
      console.log(event.data.size)
      recordedBlobs.current.push(event.data);
    }
  };

  const ctx = useRef<AudioContext | null>(null);
  const dest = useRef<MediaStreamAudioDestinationNode | null>(null);

  /**
   * Starts recording...
   */
  const startRecording = (
    canvas: HTMLCanvasElement,
    audioStream: MediaStream
  ) => {
    if (!canvas) return;

    const canvasStream = (canvas as CanvasElement).captureStream(60);

    if (!canvasStream) {
      throw Error("No stream found");
    }

    const videoType = types.find((t) => MediaRecorder.isTypeSupported(t));
    if (!videoType) {
      throw Error("No supported type found for MediaRecorder");
    }

    setType(videoType);

    try {
      ctx.current = new AudioContext({});

      dest.current = ctx.current.createMediaStreamDestination();

      ctx.current.createMediaStreamSource(audioStream).connect(dest.current);

      const recorder = new MediaRecorder(
        new MediaStream([
          ...canvasStream.getTracks(),
          ...dest.current.stream.getTracks(),
        ]),
        {
          videoBitsPerSecond,
          mimeType: videoType,
        }
      );

      recorder.ondataavailable = handleDataAvailable;
      recorder.start(100); // collect 100ms of data blobs

      setMediaRecorder(recorder);
    } catch (e) {
      console.error(e);
    }
  };

  const stopRecording = () => {
    console.log('stop')
    if (mediaRecorder?.state === "inactive") return;
    if (mediaRecorder?.state === "recording") {
      try {
        mediaRecorder?.stop();
      } catch (e) {
        console.log("Stop recording error: ", e);
      }
    } else console.error("Cannot stop canvas recorder", mediaRecorder?.state);
  };

  const download = async (fileName?: string) => {
    const blob = await getBlobs();
    fileName = fileName || "CodeVideo.webm";
    saveAs(blob, fileName);
  };

  const getBlobs = async () => {
    try {
      const superblob = new Blob(recordedBlobs.current, { type });
      // const arrayBuffer = await superblob.arrayBuffer();
      // if (arrayBuffer) {
      //   try {
      //   //   return getSeekableWebM(arrayBuffer);
      //   } catch (e) {
      //     console.error(e);
      //   }
      // }
      return superblob;
    } catch (e) {
      console.error(e);
      return undefined;
    }
  };

  const reset = () => {
    recordedBlobs.current = [];
    setMediaRecorder(null);
  };

  return {
    startRecording,
    stopRecording,
    getBlobs,
    reset,
    download,
  };
};

export default useCanvasRecorder;
