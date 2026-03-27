import { EpicDetails } from "@/Pages/Epics/EpicDetails";
import { createPortal } from "react-dom";

export default function EpicsModal({ epic, onClose, onUpdate }: any) {
  if (!epic) return null;

  return createPortal(
    <div onClick={onClose} className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white relative w-full max-w-3xl mx-4 rounded-xl p-6 shadow-xl"
      >
        <EpicDetails epic={epic} onUpdate={onUpdate} />
      </div>
    </div>,

    document.getElementById("modal-root")!
  );
}
