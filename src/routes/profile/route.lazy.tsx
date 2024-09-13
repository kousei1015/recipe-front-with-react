import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "../../styles/Sign.module.css";
import { z } from "zod";
import { useFetchAuthInfo, usePatchProfile } from "../../hooks/useQueryHooks";
import { ProfileEditProps } from "../../types";

export const Route = createLazyFileRoute("/profile")({
  component: ProfileEdit,
});

const validationSchema = z.object({
  name: z.string().min(1, "名前を入力して下さい"),
});

function ProfileEdit() {
  const { data: authInfo } = useFetchAuthInfo();
  const editProfileMutation = usePatchProfile();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileEditProps>({
    mode: "onChange",
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: "",
    },
  });

  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // ユーザーがログイン状態ならば、既存の名前をセット
    if (authInfo?.is_login) {
      reset({
        name: authInfo.user_name,
      });
    }
  }, [authInfo, reset]);

  const { ref } = register("avatar");

  const onSubmit = async (data: ProfileEditProps) => {
    const formData = new FormData();

    formData.append("name", data.name);

    if (fileInput.current?.files?.[0]) {
      formData.append("avatar", fileInput.current.files[0]);
    }

    await editProfileMutation.mutateAsync(formData);
    navigate({
      to: "/",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
      <h2>プロフィール編集</h2>
      <input
        data-testid="user-name"
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
        data-testid="avatar"
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
