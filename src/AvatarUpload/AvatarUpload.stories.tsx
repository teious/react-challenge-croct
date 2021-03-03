import React from "react";
import { AvatarUpload } from "./AvatarUpload";

import { Meta } from "@storybook/react/types-6-0";

// Primary will be the name for the first story
export const Default: React.FC<{}> = () => (
  <AvatarUpload />

);

// Secondary will be the name for the second story
export default {
  title: "AvatarUpload", // Title of you main menu entry for this group of stories
  component: AvatarUpload, // This is the component documented by this Storybook page
} as Meta;