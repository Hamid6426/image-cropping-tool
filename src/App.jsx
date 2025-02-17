import React, { useState, useEffect, useCallback } from "react";
import { MdCrop, MdCrop169, MdCropPortrait, MdCropSquare } from "react-icons/md";
import AspectRatioOptions from "./components/AspectRatioOptions";
import DownloadButton from "./components/DownloadButton";
import PanModeToggle from "./components/PanModeToggle";
import CropperComponent from "./components/CropperComponent";

const App = () => {
  const [state, setState] = useState({
    image: null,
    croppedImage: null,
    aspectRatio: "1:1",
    isPanning: false,
    isLoading: false,
    detections: [],
  });

  const options = [
    { value: "1:1", label: "1:1", icon: <MdCropSquare className="text-3xl" /> },
    { value: "4:5", label: "4:5", icon: <MdCropPortrait className="text-3xl" /> },
    { value: "9:16", label: "9:16", icon: <MdCrop169 className="text-3xl rotate-90" /> },
    { value: "16:9", label: "16:9", icon: <MdCrop169 className="text-3xl" /> },
    { value: "free", label: "Free Crop", icon: <MdCrop className="text-3xl" /> }, // Free crop
  ];

  const togglePanMode = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      isPanning: !prevState.isPanning,
    }));
  }, []);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = async () => {
      setState((prevState) => ({
        ...prevState,
        image: reader.result,
        isLoading: true,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
      image: null,
      croppedImage: null,
      detections: [],
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center">
      
      <header className="w-full px-6 py-3 gap-3 flex flex-row items-center justify-between bg-gray-900">
        <div className="text-blue-600 font-bold text-2xl">Image Cropping Tool</div>
        <div className="flex gap-3">
        <AspectRatioOptions
          options={options}
          onSelect={(value) =>
            setState((prevState) => ({ ...prevState, aspectRatio: value }))
          }
        />
        <PanModeToggle isPanning={state.isPanning} togglePanMode={togglePanMode} />
        {state.croppedImage && (
          <DownloadButton croppedImage={state.croppedImage} />
        )}
        {state.image && (
          <button
            onClick={handleReset}
            className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Remove Image
          </button>
        )}
        </div>
      </header>
      <div className="w-full flex flex-col justify-center items-center">
        {state.image ? (
          <CropperComponent
            image={state.image}
            aspectRatio={state.aspectRatio}
            isPanning={state.isPanning}
            setState={setState}
            state={state}
          />
        ) : (
          <label className="mt-52 cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
            Upload Image
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default App;
