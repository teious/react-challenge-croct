import React from "react";
import { render, screen } from "@testing-library/react";

import { AvatarUpload } from "./AvatarUpload";

describe("<AvatarUpload />", () => {
  test("rendered text", () => {
    render(<AvatarUpload />);
    expect(screen.getByText("sample component")).toBeDefined();
  });
});