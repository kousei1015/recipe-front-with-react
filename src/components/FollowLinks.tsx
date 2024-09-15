import { Link } from "@tanstack/react-router";

type FollowLinksProps = {
  userId: string;
  followingsCount: number;
  followersCount: number;
};

export const FollowLinks: React.FC<FollowLinksProps> = ({
  userId,
  followingsCount,
  followersCount,
}) => {
  return (
    <ul>
      <Link to={`/${userId}/followings`}>
        <li>フォロー中 {followingsCount}</li>
      </Link>
      <Link to={`/${userId}/followers`}>
        <li>フォロワー {followersCount}</li>
      </Link>
    </ul>
  );
};
