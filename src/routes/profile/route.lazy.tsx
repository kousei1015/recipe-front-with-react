import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "@/styles/Sign.module.css";
import { z } from "zod";
import { useFetchAuthInfo, usePatchProfile } from "@/hooks/useQueryHooks";
import { ProfileEditProps } from "@/types";
import imageCompression from "browser-image-compression";

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

  const [compressedFile, setCompressedFile] = useState<File | null>(null);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const options = {
        maxSizeMB: 0.3,
        maxWidthOrHeight: 1000,
      };

      try {
        // 画像を圧縮
        const compressed = await imageCompression(file, options);
        setCompressedFile(compressed);
      } catch (error) {
        window.alert("画像の圧縮中にエラーが発生しました。");
      }
    }
  };

  const onSubmit = async (data: ProfileEditProps) => {
    const formData = new FormData();
    formData.append("name", data.name);

    // 圧縮された画像が存在する場合のみ追加
    if (compressedFile) {
      formData.append("avatar", compressedFile);
    }

    await editProfileMutation.mutateAsync(formData);
    navigate({
      to: "/",
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
      <h2>プロフィール編集</h2>
      <p>名前</p>
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
      <p>プロフィール画像</p>
      <input
        className={styles.file_input}
        type="file"
        data-testid="avatar"
        ref={(e) => {
          ref(e);
          fileInput.current = e;
        }}
        onChange={handleFileChange}
      />
      <button type="submit">送信する</button>
    </form>
  );
}

export default ProfileEdit;
