import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { PlayerContainer } from "./styled";

export const WaveformGenerator = () => {
  const [fileUploaded, setFileUploaded] = useState("");
  const waveformRef = useRef<HTMLDivElement>(null);
  let wavesurfer: WaveSurfer;

  // Function to handle the file upload
  const handleUpload = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = (e.target as HTMLFormElement).file.files[0] as File;
    const fileUrl = URL.createObjectURL(file);
    setFileUploaded(fileUrl as any);
    console.log("File uploaded and stored:", fileUrl);
  };

  // Function (useEffect) to create the waveform
  useEffect(() => {
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
  }, [fileUploaded]);

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

  return (
    <>
      <form onSubmit={handleUpload}>
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
