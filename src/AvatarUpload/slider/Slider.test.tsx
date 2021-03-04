import React from "react";
import { render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import Slider from "./Slider";

describe("<Slider />", () => {
    const handleChangeSpy = jest.fn()
    const minValue = 0, maxValue = 10, value = 5;
    const SliderWithTestingValues = () => <Slider minValue={minValue} maxValue={maxValue} value={value} onChange={handleChangeSpy} />

    test("it renders without crashing", () => {
        const { container } = render(<SliderWithTestingValues />);

        expect(container.firstChild).toBeInTheDocument()
    });

    test("expect slider track to be in the middle of slider rail", () => {
        const { getByTestId } = render(<SliderWithTestingValues />);

        const trackElement = getByTestId('sliderTrack')

        expect(trackElement.style.width).toBe('50%');
    })
    test("expect slider track to be on the end of slider rail", () => {

        const { getByTestId } = render(<SliderWithTestingValues />);
        const containerElement = getByTestId('sliderContainer')

        const trackElement = getByTestId('sliderTrack')

        fireEvent.mouseDown(containerElement)
        fireEvent.mouseMove(containerElement, { clientX: 500 })
        expect(trackElement.style.width).toBe('100%');



    })
    test("expect slider track to be on the start of slider rail", () => {
        const { getByTestId } = render(<SliderWithTestingValues />);
        const containerElement = getByTestId('sliderContainer')

        const trackElement = getByTestId('sliderTrack')

        fireEvent.mouseDown(containerElement)
        fireEvent.mouseMove(containerElement, { clientX: -1000 })

        expect(trackElement.style.width).toBe('0%');


    })

    test("expect slider to fire onChange with minValue on mouseup", () => {
        const { getByTestId } = render(<SliderWithTestingValues />);
        const containerElement = getByTestId('sliderContainer')

        fireEvent.mouseDown(containerElement)
        fireEvent.mouseMove(containerElement, { clientX: -1000 })
        fireEvent.mouseUp(containerElement)
        expect(handleChangeSpy).toBeCalledWith(minValue);

    })
    test("expect slider to fire onChange with maxValue on mouseup", () => {
        const { getByTestId } = render(<SliderWithTestingValues />);
        const containerElement = getByTestId('sliderContainer')


        fireEvent.mouseDown(containerElement)
        fireEvent.mouseMove(containerElement, { clientX: 1000 })
        fireEvent.mouseUp(containerElement)

        expect(handleChangeSpy).toBeCalledWith(maxValue);


    })
});