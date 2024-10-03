import {
  createLazyFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import imageCompression from "browser-image-compression";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import styles from "@/styles/Create.module.css";
import { useFetchRecipe, usePutRecipe } from "@/hooks/useQueryHooks";

export const Route = createLazyFileRoute("/$recipeId/edit")({
  component: Index,
});

export function Index() {
  const { recipeId }= useParams({ experimental_returnIntersection: true, strict: false });

  const { data: recipe, isSuccess } = useFetchRecipe(recipeId!);
  const navigate = useNavigate();
  const putMutation = usePutRecipe();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      instructions: [{ description: "" }],
      ingredients: [{ name: "", quantity: "" }],
      cookingTime: "1",
    },
  });

  const {
    fields: instructionFields,
    append: addInstruction,
    remove: removeInstruction,
  } = useFieldArray({
    control,
    name: "instructions",
  });

  const {
    fields: ingredientFields,
    append: addIngredient,
    remove: removeIngredient,
  } = useFieldArray({
    control,
    name: "ingredients",
  });

  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (isSuccess && recipe) {
      reset({
        name: recipe.recipe_name,
        instructions: recipe.instructions || [{ description: "" }],
        ingredients: recipe.ingredients,
        cookingTime: recipe.cooking_time.toString(),
      });
    }
  }, [isSuccess, recipe, reset]);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 500,
      };

      try {
        const compressedFile = await imageCompression(file, options);
        setImage(compressedFile);
      } catch (error) {
        window.alert("エラーが発生しました。もう一度やり直してください");
      }
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("name", data.name);

    data.instructions.forEach((inst: any, index: number) => {
      formData.append(`instructions[${index}][description]`, inst.description);
    });
    data.ingredients.forEach((ingredient: any, index: number) => {
      formData.append(`ingredients[${index}][name]`, ingredient.name);
      formData.append(`ingredients[${index}][quantity]`, ingredient.quantity);
    });

    if (image) {
      formData.append("image", image);
    }
    formData.append("cooking_time", data.cookingTime);

    await putMutation.mutateAsync({ id: recipeId!, data: formData });
    navigate({ to: "/" });
  };

  return (
    <div className={styles.wrapper}>
      <h2>レシピ編集画面</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* handleSubmitを使用してフォーム送信 */}
        <input
          type="text"
          placeholder="レシピのタイトルを入力して下さい"
          {...register("name", {
            required: "レシピのタイトルを入力してください",
            maxLength: {
              value: 30,
              message: "タイトルは30文字以内で入力してください",
            },
          })}
        />
        {errors.name && (
          <p className={styles.error_text}>{errors.name.message}</p>
        )}
        <h2>レシピ画像</h2>
        <input
          className={styles.file_input}
          type="file"
          name="file"
          onChange={handleFile}
        />
        <div>
          <h2>作り方</h2>
          {instructionFields.map((field, index) => (
            <div key={field.id} className={styles.instruction_container}>
              <input
                className={styles.instruction_input}
                type="text"
                placeholder="手順の内容を入力"
                {...register(`instructions.${index}.description`, {
                  required: "手順の内容を入力してください",
                  maxLength: {
                    value: 200,
                    message: "手順は200文字以内で入力してください",
                  },
                })}
              />
              <button
                type="button"
                className={styles.delete_button}
                onClick={() => removeInstruction(index)}
              >
                削除
              </button>
              {errors.instructions?.[index]?.description && (
                <p className={styles.error_text}>
                  {errors?.instructions[index]?.description?.message}
                </p>
              )}
            </div>
          ))}
          <button
            type="button"
            className={styles.add_button}
            onClick={() => addInstruction({ description: "" })}
          >
            + 手順を追加
          </button>
        </div>
        <h2>所要時間</h2>
        <select {...register("cookingTime")} className={styles.cooking_time}>
          <option value="1">5分未満</option>
          <option value="2">10分未満</option>
          <option value="3">20分未満</option>
          <option value="4">30分未満</option>
          <option value="5">30分以上</option>
        </select>
        <div>
          <h2>材料</h2>
          {ingredientFields.map((field, index) => (
            <div key={field.id} className={styles.ingredient}>
              <input
                type="text"
                placeholder="材料の名前"
                {...register(`ingredients.${index}.name`, {
                  required: "材料の名前を入力してください",
                  maxLength: {
                    value: 20,
                    message: "材料の名前は20字以内にしてください",
                  },
                })}
              />
              <input
                type="text"
                placeholder="量"
                {...register(`ingredients.${index}.quantity`, {
                  required: "材料の量を入力してください",
                  maxLength: {
                    value: 20,
                    message: "材料の量は20字以内にしてください",
                  },
                })}
              />
              {errors.ingredients?.[index]?.name && (
                <p className={styles.error_text}>
                  {errors.ingredients[index]?.name?.message}
                </p>
              )}
              {errors.ingredients?.[index]?.quantity && (
                <p className={styles.error_text}>
                  {errors.ingredients[index]?.quantity?.message}
                </p>
              )}
              <button
                type="button"
                className={styles.delete_button}
                onClick={() => removeIngredient(index)}
              >
                削除
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.add_button}
            onClick={() => addIngredient({ name: "", quantity: "" })}
          >
            + 材料を追加
          </button>
        </div>
        <button className={styles.submit_button} type="submit">
          送信
        </button>
      </form>
    </div>
  );
}

export default Index;
