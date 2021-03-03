import React, { useEffect, useRef, useState } from 'react';
import './Slider.css';

function getPointerPositionOnPage(event: MouseEvent) {
    const point = event;
    return { x: point.clientX, y: point.clientY };
}


interface SliderProps {
    minValue: number;
    maxValue: number;
    value: number;
    onChange: (newValue: number) => any;
}
const Slider: React.FC<SliderProps> = (props) => {
    const { minValue, maxValue, value, onChange } = props;
    const barRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isSliding, setIsSliding] = useState(false);
    const [percent, setPercent] = useState(value - minValue / maxValue - minValue);
    const [_value, setValue] = useState(value);



    useEffect(() => {
        if (value !== _value) {

            setValue(_value);
            const percentage = (_value - minValue) / (maxValue - minValue)
            setPercent(percentage);
        }

    }, [_value])

    useEffect(() => {
        const containerElement = containerRef.current
        if (containerElement) {
            containerElement.addEventListener('mousedown', handleMouseDown, { passive: false });
        }
    }, [containerRef])


    useEffect(() => {
        if (isSliding) {
            bindGlobalEvents()
        } else {
            if (_value !== value) {
                onChange(_value)
            }
            removeGlobalEvents();
        }

        return () => removeGlobalEvents();
    }, [isSliding])


    const handleMouseDown = (event: MouseEvent) => {
        event.preventDefault();
        if (isSliding) {
            return;
        }
        const pointerPosition = getPointerPositionOnPage(event);
        setIsSliding(true);
        updateValueFromPosition(pointerPosition)
    }

    const bindGlobalEvents = () => {
        document.addEventListener('mousemove', handleMouseMove, { passive: false });
        document.addEventListener('mouseup', handleMouseUp, { passive: false });
    }
    const removeGlobalEvents = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }


    const handleMouseMove = (event: MouseEvent) => {
        if (isSliding) {

            event.preventDefault();
            const pointerPosition = getPointerPositionOnPage(event);
            updateValueFromPosition(pointerPosition)
        }
    }

    const handleMouseUp = (event: MouseEvent) => {
        if (isSliding) {
            event.preventDefault();
            setIsSliding(false)
        }
    }

    const updateValueFromPosition = (pos: { x: number, y: number }) => {
        const barElement = barRef.current as HTMLDivElement;
        if (barElement) {
            const dimensions = barElement.getBoundingClientRect();
            const offset = dimensions.left;
            const size = dimensions.width;

            let percentage = (pos.x - offset) / size;

            if (percentage > 1) {
                setValue(maxValue)
            } else if (percentage < 0) {
                setValue(minValue)
            } else {
                const calculatedValue = minValue + percentage * (maxValue - minValue);
                setValue(calculatedValue)
            }

        }
    }


    return (
        <div className="slider-container" ref={containerRef}>
            <div className="slider-rail" ref={barRef}>
                <div className="slider-track" style={{ width: `${percent * 100}%` }} >
                    <div className="slider-thumb"  ></div>
                </div>
            </div>
        </div>)
}
export default Slider;