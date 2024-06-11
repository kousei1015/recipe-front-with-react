import { create } from "zustand";
import { SelectValueType } from "../types";

const useSelectForSort = create<SelectValueType>((set) => ({
  orderType: "",
  changeOrderType: (orderType) => set({ orderType }),
}));

export default useSelectForSort;
