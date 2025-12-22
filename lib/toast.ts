import { toast as sonnerToast } from "sonner";

export function toast(type: string, message: string | undefined) {
  switch (type) {
    case "success":
      return sonnerToast.success(message, {
        position: "top-center",
        duration: 3000,
        style: {
          "--normal-border": "var(--color-custom-green-500)",
        } as React.CSSProperties,
      });
    case "warning":
      return sonnerToast.warning(message, {
        position: "top-center",
        duration: 3000,
        style: {
          "--normal-border": "var(--color-custom-orange-500)",
        } as React.CSSProperties,
      });
    case "error":
      return sonnerToast.error(message, {
        position: "top-center",
        duration: 3000,
        style: {
          "--normal-border": "var(--color-custom-red-500)",
        } as React.CSSProperties,
      });
  }
}
