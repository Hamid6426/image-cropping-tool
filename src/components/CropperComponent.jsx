import { useRef, useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import * as faceapi from "face-api.js";

const CropperComponent = ({
  image,
  aspectRatio,
  isPanning,
  setState,
  state,
}) => {
  const cropperRef = useRef(null);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
      await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
      await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
    };
    loadModels();
  }, []);

  useEffect(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper && aspectRatio) {
      const [w, h] = aspectRatio.split(":").map(Number);
      cropper.setAspectRatio(w / h); // Ensure aspect ratio updates correctly
    }
  }, [aspectRatio]);

  useEffect(() => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      cropper.setDragMode(isPanning ? "move" : "crop");
    }
  }, [isPanning]);

  const calculateBoundingBox = (detections) => {
    const xMin = Math.min(...detections.map((det) => det.box.x));
    const yMin = Math.min(...detections.map((det) => det.box.y));
    const xMax = Math.max(...detections.map((det) => det.box.x + det.box.width));
    const yMax = Math.max(...detections.map((det) => det.box.y + det.box.height));

    return {
      x: xMin,
      y: yMin,
      width: xMax - xMin,
      height: yMax - yMin,
    };
  };

  const autoCrop = (boundingBox) => {
    const cropper = cropperRef.current?.cropper;
    if (cropper) {
      const padding = 0.8;

      cropper.setData({
        x: boundingBox.x - boundingBox.width * padding,
        y: boundingBox.y - boundingBox.height * padding,
        width: boundingBox.width * (1.2 + 2 * padding),
        height: boundingBox.height * (1.2 + 2 * padding),
      });
    }
  };

  useEffect(() => {
    if (state.isLoading) {
      const image = new Image();
      image.src = state.image;
      image.onload = async () => {
        const detections = await faceapi.detectAllFaces(image);
        setState((prevState) => ({
          ...prevState,
          detections,
          isLoading: false, // Set loading state to false after detection
        }));
        if (detections.length > 0) {
          const boundingBox = calculateBoundingBox(detections);
          autoCrop(boundingBox);
        }
      };
    }
  }, [state.isLoading, state.image, setState]);

  return (
    <>
      {state.isLoading && <div className="absolute z-2 loader mt-4"></div>}
      <div className="relative flex justify-center items-center">
        <Cropper
        src={image}
        className="max-h-[460px]"
          initialAspectRatio={
            parseFloat(aspectRatio.split(":")[0]) /
            parseFloat(aspectRatio.split(":")[1])
          }
          aspectRatio={aspectRatio === "free" ? NaN : parseFloat(aspectRatio.split(":")[0]) / parseFloat(aspectRatio.split(":")[1])}
          guides={false}
          ref={cropperRef}
          crop={() => {
            const cropper = cropperRef.current?.cropper;
            if (cropper) {
              const croppedCanvas = cropper.getCroppedCanvas();
              setState((prevState) => ({
                ...prevState,
                croppedImage: croppedCanvas
                  ? croppedCanvas.toDataURL()
                  : null,
              }));
            }
          }}
          dragMode={isPanning ? "move" : "crop"}
        />
      </div>
    </>
  );
};

export default CropperComponent;
