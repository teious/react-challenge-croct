import React, { useState } from "react";
import Slider from "./Slider";

import { Meta } from "@storybook/react/types-6-0";

// Primary will be the name for the first story
export const Demo: React.FC<{}> = () => {
    const [value, setValue] = useState(3);

    const handleChange = (newValue: number) => {
        setValue(newValue)
    }
    return <div style={{ width: 300 }}>
        <Slider minValue={0} maxValue={10} value={value} onChange={handleChange} />
        <div>
            <p>minValue: {0}</p>
            <p>maxValue: {10}</p>
            <p>value: {value}</p>
        </div>
    </div>
}



// Secondary will be the name for the second story
export default {
    title: "Slider", // Title of you main menu entry for this group of stories
    component: Slider, // This is the component documented by this Storybook page
} as Meta;