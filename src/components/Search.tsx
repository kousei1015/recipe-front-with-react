import { Link } from "@tanstack/react-router";
import styles from "./Search.module.css";
import Fuse from "fuse.js";
import { SUGGESTED_RECIPES } from "../types";
import NoImage from "../../public/NoImg.jpg";
import { useSearchStore } from "../store/useSearchStore";

const Search = ({ recipes }: { recipes: SUGGESTED_RECIPES | undefined }) => {
  const { query, setQuery, filteredRecipes, setFilteredRecipes } =
    useSearchStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQuery(query);

    if (!recipes || recipes.length === 0 || query.trim() === "") {
      setFilteredRecipes([]);
      return;
    }

    const fuse = new Fuse(recipes, {
      keys: ["recipe_name"],
      includeScore: true,
    });

    const results = fuse.search(query).map(({ item }) => item);
    setFilteredRecipes(results);
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        className={styles.search_input}
        value={query}
        onChange={handleInputChange}
        placeholder="レシピ検索"
      />
      {filteredRecipes.length > 0 && (
        <ul className={styles.suggestions}>
          {filteredRecipes.map((recipe) => (
            <Link to={`/${recipe.id}`} key={recipe.id}>
              <li className={styles.suggestion_item}>
                <img
                  src={recipe.image_url || NoImage}
                  alt={recipe.recipe_name}
                />
                <h3>{recipe.recipe_name}</h3>
              </li>
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
