import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "../../styles/Sign.module.css";
import { z } from "zod";
import { usePatchProfile } from "../../hooks/useQueryHooks";
import { ProfileEditProps } from "../../types";

export const Route = createLazyFileRoute("/profile")({
  component: ProfileEdit,
});

const validationSchema = z.object({
  name: z.string().min(1, "名前を入力して下さい"),
});

function ProfileEdit() {
  const editProfileMutation = usePatchProfile();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileEditProps>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
  });

  const fileInput = useRef<HTMLInputElement | null>(null);

  const { ref } = register("avatar");

  const onSubmit = async (data: ProfileEditProps) => {
  
    await editProfileMutation.mutateAsync(data)
  
    navigate({
      to: "/",
    });
  };
  

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
      <h2>プロフィール編集</h2>
      <input
        type="text"
        {...register("name")}
        placeholder="名前を入力してください"
        className={styles.input}
      />
      {errors.name?.message && (
        <p className={styles.error} data-testid="name-validation">
          {errors.name?.message}
        </p>
      )}
      <input
        type="file"
        ref={(e) => {
          ref(e);
          fileInput.current = e;
        }}
      />
      <button type="submit">送信する</button>
    </form>
  );
}

export default ProfileEdit;
