import React from "react";
import NoProfileImage from "../assets/UserIcon.webp";
import styles from "./AvatarImage.module.css";

interface AvatarImageProps {
  avatar_url: string;
}

export const ClickableAvatarImage: React.FC<AvatarImageProps> = ({ avatar_url }) => {
  return (
    <img
      src={avatar_url || NoProfileImage}
      alt={avatar_url ? "プロフィール画像" : "画像なし"}
      width={100}
      height={100}
      className={`${styles.avatar_img} ${styles.clickable}`} 
    />
  );
};

export const NonClickableAvatarImage: React.FC<AvatarImageProps> = ({ avatar_url }) => {
    return (
      <img
        src={avatar_url || NoProfileImage}
        alt={avatar_url ? "プロフィール画像" : "画像なし"}
        width={100}
        height={100}
        className={styles.avatar_img}
      />
    );
  };