import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import './AvatarUpload.css'
import Button from "./Button/Button";
import Slider from "./Slider/Slider";
import ImageVector from "./vectors/ImageVector";
import ErrorVector from "./vectors/ErrorVector";
import CloseButtonVector from "./vectors/CloseButtonVector";

const DEFAULT_IMAGE_SCALE = 1;

interface AvatarCropData {
  rawImageURL: string;
  croppedImageURL: string;
}

interface AvatarUploadProps {
  onCrop: (cropData: AvatarCropData) => any;
}
const AvatarUpload: React.FC<AvatarUploadProps> = ({ onCrop }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [inputIsEnabled, setInputEnabled] = useState(true);
  const [highlight, setHighlight] = useState(false);
  const [imageURL, setImageURL] = useState<string | null>(null)
  const [croppedImageURL, setCroppedImageURL] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isCropping, setIsCropping] = useState(false)
  const [imageScale, setImageScale] = useState<number>(DEFAULT_IMAGE_SCALE);

  const handleContainerClick = () => {
    const hasInputRef = fileInputRef.current !== null;
    if (hasInputRef && inputIsEnabled) { fileInputRef.current?.click() }
  }

  const handleFilesAdded = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files[0] as File
      readFileIfImage(file)
      setInputEnabled(false);
    }
  }

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (inputIsEnabled) {
      setHighlight(true);
    }
  }

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (inputIsEnabled) {
      setHighlight(false);
    }
  }
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (inputIsEnabled) {
      setHighlight(false);
      if (event.dataTransfer.files.length) {
        const file = event.dataTransfer.files[0] as File;
        readFileIfImage(file)
      }
    }
  }

  const readFileIfImage = (file: File) => {
    if (file.type.includes('image')) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setImageURL(fileReader.result as string);
        setIsCropping(true);
      }
      fileReader.readAsDataURL(file);
    } else {
      setHasError(true);
    }

  }
  const handleImageError = () => setHasError(true);

  const resizeAndCrop = () => {

    const croppedWidth = 114, croppedHeight = 114

    const originalImage = imageRef.current as HTMLImageElement
    const { width: originalWidth, height: originalHeight } = originalImage;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const scaledWidth = originalWidth * imageScale
    const scaledHeight = originalHeight * imageScale;
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    ctx.drawImage(originalImage, 0, 0, scaledWidth, scaledHeight)

    const scaledImage = new Image()

    scaledImage.onload = () => {
      canvas.width = croppedWidth;
      canvas.height = croppedHeight;

      const cropOffsetX = scaledImage.width / 2 - croppedWidth / 2;
      const cropOffsetY = scaledImage.height / 2 - croppedHeight / 2;
      ctx.drawImage(scaledImage, cropOffsetX, cropOffsetY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);

      setCroppedImageURL(canvas.toDataURL())
    };

    scaledImage.src = canvas.toDataURL();

  }

  useEffect(() => {
    if (croppedImageURL) {
      onCrop({
        rawImageURL: imageURL as string,
        croppedImageURL: croppedImageURL
      });
      setImageURL(croppedImageURL);
      setIsCropping(false);
      setImageScale(DEFAULT_IMAGE_SCALE);
      setInputEnabled(true);
    }
  }, [croppedImageURL])

  const handleSliderChange = (newScale: number) => setImageScale(newScale)


  const handleReset = () => {
    setInputEnabled(true);
    setIsCropping(false);
    setImageScale(DEFAULT_IMAGE_SCALE);
    setHasError(false);
    setImageURL(null);
    setCroppedImageURL(null);
  }

  return (

    <div className="upload-dropzone"
      data-testid="dropzone"
      onClick={handleContainerClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        cursor: inputIsEnabled ? 'pointer' : 'auto',
        borderWidth: isCropping || hasError ? 0 : 2,
        borderStyle: 'dashed',
        borderColor: highlight ? '#3F80FF' : '#C7CDD3'
      }}>

      {imageURL && !hasError && <div className="image-container">
        <img className="image-viewer" ref={imageRef}
          style={{ transform: `scale(${imageScale})` }}
          src={imageURL} onError={handleImageError} />
      </div>}

      {!isCropping && !hasError && <div className="upload-message">
        <span> <ImageVector className="upload-vector" /> Organization logo</span>
        <p>Drop the image here or click to browse.</p>
        <input
          data-testid="fileInput"
          ref={fileInputRef}
          className="file-input"
          type="file"
          onChange={handleFilesAdded}
        />
      </div>}

      {isCropping && <div className="cropping-container">
        <label className="cropping-label">Crop</label>
        <Slider minValue={0.2} maxValue={2} value={imageScale} onChange={handleSliderChange} />
        <div className="button-container">
          <Button onClick={resizeAndCrop}>Save</Button>
        </div>
      </div>}

      {hasError && <>
        <div className="error-image">
          <ErrorVector />
        </div>
        <div className="error-container">
          <span className="error-message"> Sorry, the upload failed.</span>
          <a className="try-again" onClick={handleReset}>Try again</a>
        </div>
      </>}
      {(isCropping || hasError) && <div data-testid="resetButton" className="reset-button" onClick={handleReset}><CloseButtonVector /></div>}
    </div>

  );
};

export default AvatarUpload;