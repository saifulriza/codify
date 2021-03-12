export default function checkSupport() {
  if (
    "showDirectoryPicker" in window &&
    "showOpenFilePicker" in window &&
    "showSaveFilePicker" in window
  ) {
    return true;
  } else {
    return false;
  }
}
