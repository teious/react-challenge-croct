import React from "react";

import "@testing-library/jest-dom/extend-expect";

import Button from "./Button";
import { render, screen } from "@testing-library/react";

describe("<Button />", () => {
    const onClickSpy = jest.fn();
    const TestingButton = () => <Button onClick={onClickSpy}>Testing Text</Button>

    test("it renders without crashing", () => {
        render(<TestingButton />);

        expect(screen.getByText('Testing Text')).toBeDefined()
    });

    test("it fires onClick when clicked", () => {
        const { getByRole } = render(<TestingButton />);
        const button = getByRole('button');
        button.click();
        expect(onClickSpy).toBeCalled()
    });

})