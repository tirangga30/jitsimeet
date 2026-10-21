import toast from "react-hot-toast";

export const errorMessage = (message: string) =>
  toast.error(message, { duration: 3000 });

export const rightSuccessMessage = (message: string) =>
  toast.success(message, { position: "top-right", duration: 5000 });
export const SuccessMessage = (message: string) =>
  toast.success(message, { position: "top-center", duration: 4000 });

export const infoMessage = (message: string) =>
  toast(message, {
    icon: "👋",
    position: "top-center",
    duration: 3000,
  });
