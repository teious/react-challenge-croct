import React, { useState } from "react";
import  AvatarUpload  from "./AvatarUpload";

import { Meta } from "@storybook/react/types-6-0";

// Primary will be the name for the first story
export const Demo: React.FC<{}> = () => {
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);

  const handleCrop = ({ rawImageURL, croppedImageURL }: any) => {
    setRawImage(rawImageURL)
    setCroppedImage(croppedImageURL)
  }

  return <>
    <AvatarUpload onCrop={handleCrop} />

    {rawImage && croppedImage && <div>
      <div>
        <p>Raw Image</p>
        <img src={rawImage} />
      </div>
      <div>
        <p>Cropped Image</p>
        <img src={croppedImage} />
      </div>
    </div>}
  </>
}



// Secondary will be the name for the second story
export default {
  title: "AvatarUpload", // Title of you main menu entry for this group of stories
  component: AvatarUpload, // This is the component documented by this Storybook page
} as Meta;