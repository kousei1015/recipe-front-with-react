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
};

export type RECIPES = {
  data: {
    id: string;
    recipe_name: string;
    image_url: string;
    user_id: string;
    user_name: string;
  }[];
  pagination?: {
    total_count: number;
    total_pages: number;
    current_page: number;
  };
};

export type FavRecipes = {
  favorite_id: string;
  recipe_id: string;
  recipe_name: string;
  user_id: string;
  user_name: string;
  image_url: string;
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
}