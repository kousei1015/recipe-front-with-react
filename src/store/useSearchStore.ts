import { create } from "zustand";
import { SUGGESTED_RECIPES } from "../types";

type SearchState = {
  query: string;
  setQuery: (query: string) => void;
  filteredRecipes: SUGGESTED_RECIPES;
  setFilteredRecipes: (recipes: SUGGESTED_RECIPES) => void;
};

export const useSearchStore = create<SearchState>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  filteredRecipes: [],
  setFilteredRecipes: (recipes) => set({ filteredRecipes: recipes }),
}));
