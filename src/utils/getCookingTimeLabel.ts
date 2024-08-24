import { CookingTime } from "../types";

export const getCookingTImeLabel = (cookingTime: CookingTime): string => {
  switch (cookingTime) {
    case CookingTime.LessThan5Minutes:
      return "5分未満";
    case CookingTime.LessThan10Minutes:
      return "10分未満";
    case CookingTime.LessThan20Minutes:
      return "20分未満";
    case CookingTime.LessThan30Minutes:
      return "30分未満";
    case CookingTime.MoreThan30Minutes:
      return "30分以上";
    default:
      return "不明";
  }
};
