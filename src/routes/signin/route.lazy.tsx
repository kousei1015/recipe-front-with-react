import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePostSignInData } from "@/hooks/useQueryHooks";
import styles from "@/styles/Sign.module.css"
import { SignInProps } from "@/types";

export const Route = createLazyFileRoute("/signin")({
  component: SignIn,
})

const validationSchema = z.object({
  email: z.string().email("正しいメールアドレスを入力して下さい"),
  password: z.string().min(6, "パスワードは6文字以上入力して下さい"),
});

function SignIn () {
  const postSignDataMutation = usePostSignInData()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInProps>({
    mode: "onBlur",
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = async (data: SignInProps) => {
    try {
      await postSignDataMutation.mutateAsync(data);
      navigate({
        to: "/",
      });
    } catch (error: any) {
      if (error.response.status === 401) {
        window.alert("ログイン情報が正しくありません。再度お試しください。");
      } else {
        window.alert("エラーが発生しました。時間をおいて試してみてください");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.wrapper}>
      <h2>ログインフォーム</h2>
      <p>Eメールを入力してください</p>
      <input
        type="text"
        {...register("email")}
        placeholder="emailを入力してください"
        className={styles.input}
      />
      {errors.email?.message && (
        <p className={styles.error} data-testid="email-validation">
          {errors.email?.message}
        </p>
      )}
      <p>パスワードを入力してください</p>
      <input
        type="password"
        {...register("password")}
        placeholder="passwordを入力してください"
        className={styles.input}
      />
      {errors.password?.message && (
        <p className={styles.error} data-testid="password-validation">
          {errors.password?.message}
        </p>
      )}
      <button type="submit">送信する</button>
    </form>
  );
};

export default SignIn;