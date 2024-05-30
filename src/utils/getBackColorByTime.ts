import { CookingTime } from "../types";

export const getBackColorByTime = (cookingTime: CookingTime): string => {
  switch (cookingTime) {
    case CookingTime.LessThan5Minutes:
      return "#007bff"; // Blue
    case CookingTime.LessThan10Minutes:
      return "#2ca559"; // Bright Green
    case CookingTime.LessThan20Minutes:
      return "#FFB74D"; // Orange
    case CookingTime.LessThan30Minutes:
      return "#FF8A65"; // Light Red
    case CookingTime.MoreThan30Minutes:
      return "#EF5350"; // Red
    default:
      return "#000"; // black (default)
  }
};
