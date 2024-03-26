import {
  setFileUploaded,
  selectFileUploaded,
  selectIsFileUploaded,
} from "../UploadFile/uploadFileSlice";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import {
  ControlsContainer,
  CurrentTimeWindow,
  FormContainer,
  PlayerContainer,
  PlayerSection,
} from "./styled";

export const WaveformGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const fileUploaded = useSelector(selectFileUploaded);
  const isFileUploaded = useSelector(selectIsFileUploaded);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [currentTime, setCurrentTime] = useState("0");
  const dispatch = useDispatch();

  // Function (useEffect) to create the waveform
  useEffect(() => {
    if (isFileUploaded && fileUploaded) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: "#dcdcdc",
        progressColor: "#e06c00",
        url: fileUploaded,
        dragToSeek: true,
        width: "50vw",
        height: 150,
        hideScrollbar: false,
        barGap: 1,
        barHeight: 10,
        barRadius: 10,
        barWidth: 1.75,
        normalize: true,
      });
      const wsRegions = wavesurferRef.current.registerPlugin(
        RegionsPlugin.create()
      );
      // Markers (zero-length regions)
      wsRegions.addRegion({
        start: 100,
        content: "Marker",
        color: "red",
      });
      return () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.destroy();
        }
      };
    }
  }, [isFileUploaded, fileUploaded]);

  useEffect(() => {
    if (isPlaying && wavesurferRef.current) {
      wavesurferRef.current.on("audioprocess", updatePlaybackTime);
    }
  }, [isPlaying]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault(); // Zapobiega domyślnemu zachowaniu przeglądarki
        handlePlayPause();
      } else if (event.key === "ArrowRight") {
        event.preventDefault(); // Zapobiega domyślnemu przewijaniu strony
        handleSkipForward();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault(); // Zapobiega domyślnemu przewijaniu strony
        handleSkipBackward();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  // Initialize the Regions plugin

  const handleStop = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setCurrentTime("0");
      setIsPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      const isPlaying = wavesurferRef.current.isPlaying();
      if (isPlaying) {
        wavesurferRef.current.pause();
      } else {
        wavesurferRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSkipForward = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.skip(2);
    }
  };
  const handleSkipBackward = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.skip(-2);
    }
  };
  const handleGetCurrentTime = () => {
    if (wavesurferRef.current) {
      const currentTime = wavesurferRef.current.getCurrentTime();
      console.log("Current time:", currentTime);
    }
  };

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 1000);
    return `${minutes.toString().padStart(2, "0")}.${seconds
      .toString()
      .padStart(2, "0")}.${milliseconds.toString().padStart(3, "0")}`;
  };

  const updatePlaybackTime = () => {
    if (isPlaying && wavesurferRef.current) {
      const currentTime = wavesurferRef.current.getCurrentTime();
      const formattedCurrentTime = formatTime(currentTime);
      setCurrentTime(formattedCurrentTime);
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
    <PlayerSection>
      <FormContainer onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <button type="submit">Upload</button>
      </FormContainer>
      <PlayerContainer ref={waveformRef} />
      <CurrentTimeWindow>{currentTime}</CurrentTimeWindow>
      <ControlsContainer className="waveform-controls">
        <button onClick={handlePlayPause}>Play | Pause</button>
        <button onClick={handleStop}>Stop</button>
        <button onClick={handleSkipForward}>Forward</button>
        <button onClick={handleSkipBackward}>Backward</button>
        <button onClick={handleGetCurrentTime}>GetCurrentTime</button>
        {/* <button onClick={handleAddMarker}>Add Marker</button> */}
      </ControlsContainer>
    </PlayerSection>
  );
};
