import { create } from "zustand";
import { PaginationType } from "../types";

const usePaginateStore = create<PaginationType>((set) => ({
  page: 1,
  clickPage: (page: number) => set({ page }),
}));

export default usePaginateStore;
