import { ModalProps } from "react-native";

export type CustomModalProps = {
  animation: Pick<ModalProps, "animationType">["animationType"]; 
  themeColor: string;
};