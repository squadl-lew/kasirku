import { useEffect, useState } from "react";

export interface ToasterState {
  type: "success" | "error";
  message: string;
}

// Toast ala prototype: bawah-tengah, hijau tua #14532d, hilang sendiri 2600ms
export default function Toaster({ toaster }: { toaster: ToasterState | null }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!toaster) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2600);
    return () => clearTimeout(t);
  }, [toaster]);

  if (!toaster || !visible) return null;

  const isSuccess = toaster.type === "success";

  return (
    <div
      className={`fixed bottom-[26px] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
        isSuccess ? "bg-[#14532d]" : "bg-red-700"
      }`}
      role="status"
    >
      <i
        className={`fas ${isSuccess ? "fa-check-circle" : "fa-exclamation-circle"}`}
      ></i>
      <span>{toaster.message}</span>
    </div>
  );
}
