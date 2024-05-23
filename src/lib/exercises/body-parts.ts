export enum BodyPartEnum {
  Back = "back",
  Biceps = "biceps",
  Chest = "chest",
  Core = "core",
  Forearms = "forearms",
  Legs = "legs",
  Shoulders = "shoulders",
  Triceps = "triceps",
  WholeBody = "wholeBody",
}

// Used for frontend display
export const BodyPartLabels: Record<BodyPartEnum, string> = {
  [BodyPartEnum.Back]: "Back",
  [BodyPartEnum.Biceps]: "Biceps",
  [BodyPartEnum.Chest]: "Chest",
  [BodyPartEnum.Core]: "Core",
  [BodyPartEnum.Forearms]: "Forearms",
  [BodyPartEnum.Legs]: "Legs",
  [BodyPartEnum.Shoulders]: "Shoulders",
  [BodyPartEnum.Triceps]: "Triceps",
  [BodyPartEnum.WholeBody]: "Whole Body",
};
