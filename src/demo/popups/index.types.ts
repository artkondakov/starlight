export interface PopupProps {
  title: string;
  text: string;
  button: string;
  // Returns id of popup to close
  onClose: any;
}