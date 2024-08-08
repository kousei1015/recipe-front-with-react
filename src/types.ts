export type SignInProps = {
  email: string;
  password: string;
};

export type SignUpProps = SignInProps & {
  name: string;
  password_confirmation: string;
};

export type AUTHINFO = {
  is_login: boolean;
  user_id?: string;
  user_name?: string;
  avatar_url?: string;
};

export type ModalProps = {
  user_name: string;
  avatar_url: string;
  refetch: () => void;
};

export type ProfileEditProps = {
  name: string;
  avatar: File;
};

export type RECIPEBASE = {
  id: string;
  name: string;
  image_url: string;
  user_id: string;
  user_name: string;
};

export enum CookingTime {
  LessThan5Minutes = 1,
  LessThan10Minutes = 2,
  LessThan20Minutes = 3,
  LessThan30Minutes = 4,
  MoreThan30Minutes = 5,
}

export type RECIPE = {
  id: string;
  recipe_name: string;
  process: string;
  ingredients: {
    name: string;
    quantity: string;
  }[];
  image_url: string;
  user_id: string;
  user_name: string;
  avatar_url: string;
  favorite_id?: string;
  follow_id?: string;
  cooking_time: CookingTime;
};

export type RECIPES = {
  data: {
    id: string;
    recipe_name: string;
    image_url: string;
    user_id: string;
    user_name: string;
    cooking_time: CookingTime;
  }[];
  pagination?: {
    total_count: number;
    total_pages: number;
    current_page: number;
  };
};

export type SUGGESTED_RECIPES = Pick<
  RECIPE,
  "id" | "recipe_name" | "image_url"
>[];

export type FavRecipes = {
  favorite_id: string;
  recipe_id: string;
  recipe_name: string;
  user_id: string;
  user_name: string;
  image_url: string;
  cooking_time: CookingTime;
}[];

export type FOLLOW = {
  id: string;
  follower_id: string;
  followed_id: string;
  user_name: string;
  avatar_url: string;
}[];

export type AVATAR_PROPS = {
  avatar_url: string;
};

export type AUTH_HEADER_PROPS = {
  avatar_url: string;
  user_name: string;
  refetch: () => void;
};

export type ModalType = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export type PaginationType = {
  page: number;
  clickPage: (pg: number) => void;
};

export type SelectValueType = {
  orderType: "" | "cookingTimeSort";
  changeOrderType: (option: "" | "cookingTimeSort") => void;
};
