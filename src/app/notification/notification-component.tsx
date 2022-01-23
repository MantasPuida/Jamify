import { ToastOptions, toast } from "react-toastify";
import { TOAST_OPTIONS } from "./notification-options";

export function Notify(message: string, type: ToastOptions["type"]): void {
  toast(message, { ...TOAST_OPTIONS, type });
}
