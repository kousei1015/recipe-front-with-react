import { create } from "zustand";
import { ModalType } from "../types";

const useModalStore = create<ModalType>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));


export default useModalStore;