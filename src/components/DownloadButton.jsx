import { useState, useCallback } from "react";

const DownloadButton = ({ croppedImage }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = useCallback(() => {
    if (!croppedImage) return;

    setIsDownloading(true);

    setTimeout(() => {
      const link = document.createElement("a");
      link.href = croppedImage;
      link.download = "image-cropping-tool.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsDownloading(false);
    }, 1000);
  }, [croppedImage]);

  return (
    <button
      onClick={handleDownload}
      disabled={!croppedImage || isDownloading}
      className={`px-2 py-2 cursor-pointer bg-green-600 rounded-md text-white border-none flex items-center gap-2 ${
        !croppedImage || isDownloading ? "cursor-not-allowed bg-gray-400" : ""
      }`}
    >
      {isDownloading ? <div className="loader"></div> : "Download"}
    </button>
  );
};

export default DownloadButton;
