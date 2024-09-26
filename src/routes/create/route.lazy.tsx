import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import imageCompression from "browser-image-compression";
import { useState } from "react";
import styles from "@/styles/Create.module.css";
import { usePostRecipe } from "@/hooks/useQueryHooks";

export const Route = createLazyFileRoute("/create")({
  component: Create,
});
export function Create() {
  const postMutation = usePostRecipe();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [process, setProcess] = useState("");
  const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
  const [image, setImage] = useState<File | null>(null);
  const [cookingTime, setCookingTIme] = useState("1");

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleProcess = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setProcess(e.target.value);
  };

  const handleIngredientName = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index].name = e.target.value;
    setIngredients(newIngredients);
  };

  const handleIngredientQuantity = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newIngredients = [...ingredients];
    newIngredients[index].quantity = e.target.value;
    setIngredients(newIngredients);
  };

  const handleAddIngredient = () => {
    // 新しい材料オブジェクトを作成し、初期値をセット
    const newIngredient = { name: "", quantity: "" };
    // 既存の材料リストに追加
    setIngredients([...ingredients, newIngredient]);
  };

  const handleRemoveIngredient = (index: number) => {
    // 指定されたインデックスの材料を削除
    const newIngredients = [...ingredients];
    newIngredients.splice(index, 1);
    setIngredients(newIngredients);
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1000,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
      } catch (error) {
        window.alert("エラーが発生しました。もう一度やり直してください");
      }
    }
  };

  const handleCookTime = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCookingTIme(e.target.value);
  };

  const validateIngredients = (
    ingredients: {
      name: string;
      quantity: string;
    }[]
  ) => {
    // 材料が1つもない場合はエラー
    if (ingredients.length === 0) {
      window.alert("材料の名前と量を入力してください");
      return false;
    }

    // 各材料の名前と量が空でないかチェック
    for (const ingredient of ingredients) {
      if (ingredient.name === "" || ingredient.quantity === "") {
        window.alert("材料の名前と量を両方とも入力してください");
        return false;
      }
    }

    return true;
  };

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // 材料のバリデーション
    if (!validateIngredients(ingredients)) return;
    const formData = new FormData();
    formData.append("name", name);
    formData.append("process", process);
    ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });

    if (image) {
      formData.append("image", image);
    }
    formData.append("cooking_time", cookingTime);
    await postMutation.mutateAsync(formData);
    navigate({
      to: "/",
    });
  };

  return (
    <div className={styles.wrapper}>
      <h2>レシピ投稿画面</h2>
      <input
        type="text"
        value={name}
        onChange={handleName}
        placeholder="レシピのタイトルを入力して下さい"
      />
      <input type="file" name="file" onChange={handleFile} />
      <textarea
        placeholder="レシピの作り方を書いて下さい"
        value={process}
        onChange={handleProcess}
        cols={30}
        rows={10}
      ></textarea>

      <p>所要時間</p>
      <select name="cooking-time" onChange={handleCookTime}>
        <option value="1">5分未満</option>
        <option value="2">10分未満</option>
        <option value="3">20分未満</option>
        <option value="4">30分未満</option>
        <option value="5">30分以上</option>
      </select>
      {ingredients.map((ingredient, index) => (
        <div key={index}>
          <input
            type="text"
            value={ingredient.name}
            onChange={(e) => handleIngredientName(e, index)}
            placeholder="材料の名前"
          />
          <input
            type="text"
            value={ingredient.quantity}
            onChange={(e) => handleIngredientQuantity(e, index)}
            placeholder="量"
          />
          <button onClick={() => handleRemoveIngredient(index)}>削除</button>
        </div>
      ))}
      <div className={styles.btn_wrapper}>
        <button onClick={handleAddIngredient}>材料を追加</button>
        <button onClick={handleClick} disabled={!name || !process}>
          送信
        </button>
      </div>
    </div>
  );
}

export default Create;
