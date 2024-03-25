import {
  setFileUploaded,
  selectFileUploaded,
  selectIsFileUploaded,
} from "../UploadFile/uploadFileSlice";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import { PlayerContainer } from "./styled";

export const WaveformGenerator = () => {
  const fileUploaded = useSelector(selectFileUploaded);
  const isFileUploaded = useSelector(selectIsFileUploaded);
  const waveformRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  let wavesurfer: WaveSurfer;

  // Function (useEffect) to create the waveform
  useEffect(() => {
    if (isFileUploaded && fileUploaded) {
      wavesurfer = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: "#ffffff40",
        progressColor: "#a200ff",
        url: fileUploaded,
        dragToSeek: true,
        width: "35vw",
        height: 60,
        hideScrollbar: false,
        barGap: 1,
        barHeight: 10,
        barRadius: 10,
        barWidth: 1.5,
        normalize: true,
      });
      return () => {
        wavesurfer.destroy();
      };
    }
  }, [isFileUploaded, fileUploaded]);

  const handleStop = () => {
    if (wavesurfer) {
      wavesurfer.stop();
    }
  };
  const handlePlayPause = () => {
    if (wavesurfer) {
      wavesurfer.playPause();
    }
  };

  const handleSkipForward = () => {
    if (wavesurfer) {
      wavesurfer.skip(2);
    }
  };
  const handleSkipBackward = () => {
    if (wavesurfer) {
      wavesurfer.skip(-2);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.file as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      dispatch(setFileUploaded(fileUrl));
      console.log("File uploaded and stored:", fileUrl);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </form>
      <PlayerContainer ref={waveformRef} />
      <div className="waveform-controls">
        <button onClick={handlePlayPause}>Play | Pause</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleSkipForward}>Forward</button>
        <button onClick={handleSkipBackward}>Backward</button>
      </div>
    </>
  );
};
