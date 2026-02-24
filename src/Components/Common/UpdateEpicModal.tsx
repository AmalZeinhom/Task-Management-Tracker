import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";
import { Epic } from "../Types/Epic";
import UpdateEpic from "@/Pages/Epics/UpdateEpic";

type UpdateEpicModalProps = {
  epic: Epic | null;
  isOpen: boolean;
  onClose(): void;
  onSuccess(): Promise<void> | void;
};

export function UpdateEpicModal({ epic, isOpen, onClose, onSuccess }: UpdateEpicModalProps) {
  if (!isOpen || !epic) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-brightness-primary w-[50%] rounded-lg p-6 relative"
      >
        <button onClick={onClose} className="absolute top-2 right-2">
          <IoIosClose size={24} />
        </button>
        <UpdateEpic epic={epic} onClose={onClose} onSuccess={onSuccess} />
      </motion.div>
    </div>
  );
}
