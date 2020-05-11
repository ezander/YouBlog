import * as ImagePicker from "expo-image-picker";

// ImagePicker.getCameraPermissionsAsync()
// ImagePicker.getCameraRollPermissionsAsync()
export async function takeOrPickImage(
  take: boolean,
  onSelect: (uri: string) => void,
  onCancel?: () => void
) {
  const aspect: [number, number] = [16, 9];
  const options = {
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect,
    quality: 0.5,
    allowsMultipleSelection: false,
    exif: false,
    base64: false,
  };
  // let result = await ImagePicker.launchImageLibraryAsync();
  let result = take
    ? await ImagePicker.launchCameraAsync(options)
    : await ImagePicker.launchImageLibraryAsync(options);

  if (!result.cancelled) {
    onSelect(result.uri);
  } else if (onCancel) {
    onCancel();
  }
}

// useEffect(() => {ImagePicker.getCameraPermissionsAsync()}, [])
// useEffect(() => {ImagePicker.getCameraRollPermissionsAsync()}, [])
