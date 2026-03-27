import { IoIosClose } from "react-icons/io";
import { motion } from "framer-motion";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

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
        {children}
      </motion.div>
    </div>
  );
}
