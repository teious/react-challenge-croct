import React, { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import './AvatarUpload.css'
import Slider from "./slider/Slider";
import ImageVector from "./vectors/ImageVector";
export const AvatarUpload: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [inputIsEnabled, setInputEnabled] = useState(true);
  const [highlight, setHighlight] = useState(false);
  const [rawImageURL, setRawImageURL] = useState<string | null>(null)
  const [hasError, setHasError] = useState(false);
  const [isCropping, setIsCropping] = useState(false)
  const [imageScale, setImageScale] = useState<number>(1);
  const [destImageSrc, setDestImageSrc] = useState<string | null>(null);
  const handleContainerClick = () => {
    const hasInputRef = fileInputRef.current !== null;
    if (hasInputRef && inputIsEnabled) { fileInputRef.current?.click() }
  }

  const handleFilesAdded = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const file = event.target.files.item(0) as File
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
        const file = event.dataTransfer.files.item(0) as File;
        readFileIfImage(file)
      }
    }
  }

  const readFileIfImage = (file: File) => {
    if (file.type.includes('image')) {
      const fileReader = new FileReader()
      fileReader.onload = () => {
        setRawImageURL(fileReader.result as string);
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

      setDestImageSrc(canvas.toDataURL())
    };

    scaledImage.src = canvas.toDataURL();






  }

  // useEffect(() => {
  //   if (rawImageURL) {
  //     const canvas = canvasRef.current as HTMLCanvasElement;
  //     const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  //     imagevent.onload = () => {
  //       ctx?.drawImage(image,
  //         (ctx.canvas.width - imagevent.width) / 2,
  //         (ctx.canvas.height - imagevent.height) / 2,
  //       )


  //     }

  //     imagevent.src = rawImageURL;

  //   }
  // }, [rawImageURL])

  const handleSliderChange = (newScale: number) => setImageScale(newScale)

  return (
    <>
      <div className="upload-dropzone"
        onClick={handleContainerClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          cursor: inputIsEnabled ? 'pointer' : 'auto',
          border: isCropping || hasError ? 'none' : '2px dashed',
          borderColor: highlight ? '#3F80FF' : '#C7CDD3'
        }}>

        {rawImageURL && <div className="image-container">
          <img className="image-viewer" ref={imageRef}
            style={{ transform: `scale(${imageScale})` }}
            src={rawImageURL} onError={handleImageError} />
        </div>}

        {!isCropping && !hasError && <div className="upload-message">
          <span> <ImageVector className="image" /> Organization logo</span>
          <p>Drop the image here or click to browsevent.</p>
          <input
            ref={fileInputRef}
            className="file-input"
            type="file"
            onChange={handleFilesAdded}
          />
        </div>}

        {isCropping && <div className="cropping-container">
          <label className="cropping-label">Crop</label>
          <Slider minValue={0.2} maxValue={2} value={imageScale} onChange={handleSliderChange} />
          <p>
            <button onClick={resizeAndCrop}>Save</button>
          </p>
          <img id="target"></img>
        </div>}

      </div>
      {destImageSrc && <img src={destImageSrc} />}
    </>
  );
};

