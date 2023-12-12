export const CheckInCadenceUnit = {
  Day: "day",
  Week: "week",
  Month: "month",
  Year: "year",
} as const;

export const CheckInCadenceUnitValues = Object.values(CheckInCadenceUnit);
export type TCheckInCadenceUnit =
  (typeof CheckInCadenceUnit)[keyof typeof CheckInCadenceUnit];

// HACK: zod wants a tuple w/ at least 1 element, CheckInCadenceUnitValues is generated from Object.values
// which doesn't garunteed at least 1 element, so we cast it to a tuple since we know it has at least 1 element
// and that will never change
export const AssertedCheckInCadenceUnitValues = CheckInCadenceUnitValues as [
  TCheckInCadenceUnit,
  ...TCheckInCadenceUnit[],
];
