export type ScreenId =
  | "dashboard" | "maintenance" | "issues" | "cultural" | "booking"
  | "policies" | "polls" | "members" | "notifications";

export interface NavProps {
  navigate: (id: ScreenId) => void;
  goBack: () => void;
}
