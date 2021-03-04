import React from "react";
import { act, fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import AvatarUpload from "./AvatarUpload";



const INPUT_IMAGE_DATA = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAboAAAD4CAYAAACaECNWAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAOiSURBVHhe7dUxEQAgDAAxjNS/AiSho/j4yxANOffNAkCV6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoA0kQHQJroAEgTHQBpogMgTXQApIkOgDTRAZAmOgDSRAdAmugASBMdAGmiAyBNdACkiQ6ANNEBkCY6ANJEB0Ca6ABIEx0AaaIDIE10AKSJDoA00QGQJjoAwmY/oycOKMPl8hUAAAAASUVORK5CYII="

function dataURLtoFile(dataurl: string, filename: string) {

  const arr = dataurl.split(',') as string[];
  const matchArray = arr[0].match(/:(.*?);/) as RegExpMatchArray;
  const mime = matchArray[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}


jest.mock('./slider/Slider', () => (props: any) => {
  const handleChange = (e: any) => {
    props.onChange(e.target.value);
  }
  return (
    <input type="range" data-testid="slider" onChange={handleChange} />

  );
});


fdescribe("<AvatarUpload />", () => {
  const inputFile = dataURLtoFile(INPUT_IMAGE_DATA, 'testingpicture.jpeg');
  const onCropSpy = jest.fn();

  const AvatarUploadTest = () => <AvatarUpload onCrop={onCropSpy} />

  test("it renders without crashing", () => {
    const { container } = render(<AvatarUploadTest />);
    expect(container.firstChild).toBeInTheDocument();
  });


  test("it pops file input selecton on clicking on dropzone", async () => {
    const { getByTestId } = render(<AvatarUploadTest />);
    const input = getByTestId('fileInput') as HTMLInputElement;
    const dropzone = getByTestId('dropzone');
    const clickSpy = spyOn(input, 'click')
    dropzone.click();


    expect(clickSpy).toHaveBeenCalled()
  });

  test("it inputs image files by file input element", async () => {
    const { getByTestId, findByRole } = render(<AvatarUploadTest />);
    const input = getByTestId('fileInput') as HTMLInputElement;
    await waitFor(() => {
      fireEvent.change(input, {
        target: { files: [inputFile] }
      })
    })

    const image = (await findByRole('img')) as HTMLImageElement;
    expect(image.src).toBe(INPUT_IMAGE_DATA);
    expect(image.style.transform).toBe('scale(1)')
  });

  test("it inputs image files by dropzone", async () => {
    const { getByTestId, findByRole } = render(<AvatarUploadTest />);
    const dropzone = getByTestId('dropzone');
    await waitFor(() => {
      fireEvent.drop(dropzone, {
        dataTransfer: { files: [inputFile] }
      })
    })

    const image = (await findByRole('img')) as HTMLImageElement;
    expect(image.src).toBe(INPUT_IMAGE_DATA);
    expect(image.style.transform).toBe('scale(1)')

  })

  test("it resizes image on changing scale", async () => {
    const { getByTestId, findByRole } = render(<AvatarUploadTest />);

    const input = getByTestId('fileInput') as HTMLInputElement;
    await waitFor(() => {
      fireEvent.change(input, {
        target: { files: [inputFile] }
      })
    })

    const image = (await findByRole('img')) as HTMLImageElement;
    expect(image.style.transform).toBe('scale(1)');
    const mockedSlider = getByTestId('slider');
    fireEvent.change(mockedSlider, { target: { value: 0.2 } })
    expect(image.style.transform).toBe('scale(0.2)');
  })

  test("it outputs cropped image by clicking on save button", async () => {
    const { getByTestId, findByRole } = render(<AvatarUploadTest />);

    const input = getByTestId('fileInput') as HTMLInputElement;


    await waitFor(() => {
      fireEvent.change(input, {
        target: { files: [inputFile] }
      })
    })


    const button = await findByRole('button');
    button.click()

    await waitFor(() => expect(onCropSpy).toHaveBeenCalled())
  });

  test("it shows error message when inputing a non-valid image", async () => {
    const nonValidFile = new File(['🚀'], 'notaimage.txt', { type: 'text/plain' });

    const { getByTestId } = render(<AvatarUploadTest />);

    const input = getByTestId('fileInput') as HTMLInputElement;
    await waitFor(() => {
      fireEvent.change(input, {
        target: { files: [nonValidFile] }
      })
    })

    expect(screen.getByText('Sorry, the upload failed.')).toBeDefined()
  })

  test("it changes dropzone border color on dragover/dragleave", async () => {

    const highlightColor = "#3f80ff";
    const defaultColor = "#c7cdd3";
    const { getByTestId } = render(<AvatarUploadTest />);

    const dropzone = getByTestId('dropzone');

    fireEvent.dragOver(dropzone)

    expect(dropzone.style.borderColor).toBe(highlightColor)

    fireEvent.dragLeave(dropzone)

    expect(dropzone.style.borderColor).toBe(defaultColor)
  });

  test("it resets the upload flow when clicking on reset button", async () => {

    const { getByTestId, findByTestId } = render(<AvatarUploadTest />);

    const input = getByTestId('fileInput') as HTMLInputElement;
    await waitFor(() => {
      fireEvent.change(input, {
        target: { files: [inputFile] }
      })
    })

    const resetButton = await findByTestId('resetButton');
    resetButton.click();
    expect(screen.getByText("Drop the image here or click to browse.")).toBeDefined()
  })

});