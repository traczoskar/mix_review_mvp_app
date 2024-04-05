interface FileInfoProps {
  fileInfo: {
    title: string;
    duration: number | string;
    sampleRate: number | string;
    bitrate?: string;
    fileSize: number | string;
  };
}

export const FileInfoDisplay: React.FC<FileInfoProps> = ({ fileInfo }) => (
  <div>
    <p>Title: {fileInfo.title}</p>
    <p>Duration: {fileInfo.duration}</p>
    <p>Sample rate: {fileInfo.sampleRate}</p>
    <p>Bitrate: {fileInfo.bitrate}</p>
    <p>File size: {fileInfo.fileSize}</p>
  </div>
);
