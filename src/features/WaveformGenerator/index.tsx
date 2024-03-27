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
  Button,
  ControlsContainer,
  CurrentTimeWindow,
  FileInfoWindow,
  FormContainer,
  PlayerContainer,
  PlayerSection,
} from "./styled";

export const WaveformGenerator = () => {
  //States
  interface FileInfo {
    title: string;
    duration: number | string;
    sampleRate: number | string;
    bitrate?: string;
    fileSize: number | string;
  }
  const [fileInfo, setFileInfo] = useState<FileInfo>({
    title: "",
    duration: 0,
    sampleRate: 0,
    bitrate: "",
    fileSize: 0,
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("00.00.000");
  const fileUploaded = useSelector(selectFileUploaded);
  const isFileUploaded = useSelector(selectIsFileUploaded);
  //Refs
  const regionsRef = useRef<RegionsPlugin | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  //Dispatch
  const dispatch = useDispatch();

  // Function (useEffect) to create the waveform
  useEffect(() => {
    if (isFileUploaded && fileUploaded) {
      const regionsPlugin = RegionsPlugin.create();
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: "#dcdcdc",
        progressColor: "#e06c00",
        url: fileUploaded,
        backend: "MediaElement",
        dragToSeek: true,
        width: "50vw",
        height: 150,
        hideScrollbar: false,
        barGap: 1,
        barHeight: 10,
        barRadius: 10,
        barWidth: 1.75,
        normalize: true,
        plugins: [regionsPlugin],
      });
      regionsRef.current = regionsPlugin;

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

  const handleStop = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
      setCurrentTime("00.00.000");
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fileInput = e.currentTarget.file as HTMLInputElement;
    const file = fileInput.files ? fileInput.files[0] : null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      dispatch(setFileUploaded(fileUrl));
      console.log("File uploaded and stored:", fileUrl);

      const audioContext = new AudioContext();
      const arrayBuffer = await file.arrayBuffer();
      audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
        const sampleRate = audioBuffer.sampleRate;
        const duration = audioBuffer.duration;
        // Oblicz bitrate dla plików MP3
        let bitrate = 0;
        if (file.type === "audio/mpeg") {
          bitrate = (file.size * 8) / duration / 1000; // rozmiar w bitach / długość w sekundach / 1000 dla kbps
        }
        const fileSizeMB = (file.size / 1024 / 1024).toFixed(2) + " MB"; // konwersja na MB
        setFileInfo({
          title: file.name,
          duration: formatDuration(duration),
          sampleRate: formatSampleRate(sampleRate),
          bitrate: bitrate.toFixed(0) + " kbps",
          fileSize: fileSizeMB,
        });
      });
      console.log(fileInfo);
    }
  };

  // Function to format sample rate of file
  const formatSampleRate = (sampleRate: number): string => {
    const formattedSampleRate = (sampleRate / 1000).toFixed(1) + " kHz";
    return formattedSampleRate;
  };

  // Function to format duration of file
  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    const formattedDuration = `${minutes}:${seconds}`;
    return formattedDuration;
  };

  const handleAddMarker = () => {
    if (wavesurferRef.current && regionsRef.current) {
      const currentTime = wavesurferRef.current.getCurrentTime();
      regionsRef.current.addRegion({
        start: currentTime,
        end: currentTime + 1, // you can adjust this value as needed
        color: "rgba(0, 0, 255, 0.1)",
      });
    }
  };

  return (
    <PlayerSection>
      <FormContainer onSubmit={handleSubmit}>
        <input type="file" name="file" />
        <Button type="submit">Upload</Button>
      </FormContainer>
      <PlayerContainer ref={waveformRef} />
      <CurrentTimeWindow>Time: {currentTime}</CurrentTimeWindow>
      <FileInfoWindow>
        <p>Title: {fileInfo.title}</p>
        <p>Duration: {fileInfo.duration}</p>
        <p>Sample rate: {fileInfo.sampleRate}</p>
        <p>Bitrate: {fileInfo.bitrate}</p>
        <p>File size: {fileInfo.fileSize}</p>
      </FileInfoWindow>
      <ControlsContainer className="waveform-controls">
        <Button onClick={handlePlayPause}>Play | Pause</Button>
        <Button onClick={handleStop}>Stop</Button>
        <Button onClick={handleSkipForward}>Forward</Button>
        <Button onClick={handleSkipBackward}>Backward</Button>
        <Button onClick={handleGetCurrentTime}>GetCurrentTime</Button>
        <Button onClick={handleAddMarker}>Add Marker</Button>
      </ControlsContainer>
    </PlayerSection>
  );
};
