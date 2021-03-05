# Croct Avatar Upload

### Installation and usage
```npm install croct-avatarupload --save```
or
```yarn add croct-avatarupload```

Then use it in your app:
```ts
import { AvatarUpload } from 'croct-avatarupload';

export default function App() {
  const [rawImageURL, setRawImage] = useState(null);
  const [croppedImageURL, setCroppedImage] = useState(null);

  const  handleCrop = ({ rawImageURL, croppedImageURL }) => {
	setRawImage(rawImageURL)
	setCroppedImage(croppedImageURL)
  }
  return (
    <div className="App">
      <AvatarUpload onCrop={handleCrop} />
    </div>
  );
}

```