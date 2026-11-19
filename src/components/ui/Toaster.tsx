export interface ToasterState {
  type: "success" | "error";
  message: string;
}

export default function Toaster({ toaster }: { toaster: ToasterState | null }) {
  if (!toaster) return null;

  const isSuccess = toaster.type === "success";

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-white shadow-lg ${
        isSuccess ? "bg-green-600" : "bg-red-600"
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
