import { create } from "zustand";
import { PaginationType } from "../types";

const usePaginateStore = create<PaginationType>((set) => ({
  currentPage: 1,
  clickPage: (currentPage: number) => {
    set({ currentPage });
    // スクロールをページのトップに即座に移動
    window.scrollTo({ top: 0, behavior: "instant" });
  },
}));

export default usePaginateStore;
