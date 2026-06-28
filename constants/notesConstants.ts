import { Dimensions } from "react-native";

export const { width: screenWidthModal, height: screenHeightModal } =
  Dimensions.get("window");

export const NOTE_CATEGORIES = [
  "personnel",
  "travail",
  "études",
  "santé",
  "finances",
  "loisirs",
  "autre",
] as const;

export const NOTE_COLORS = [
  "#FF6868",
  "#4ECDC4",
  "#45B7D1",
  "#96CEB4",
  "#FFEAA7",
  "#DDA0DD",
  "#FFB347",
  "#F8F9FA",
] as const;
