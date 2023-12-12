import { type TCheckInCadenceUnit } from "./enums";

export function addNUnitsToDate(
  number: number,
  unit: TCheckInCadenceUnit,
  date: Date,
) {
  switch (unit) {
    case "day":
      return new Date(date.getTime() + number * 24 * 60 * 60 * 1000);
    case "week":
      return new Date(date.getTime() + number * 7 * 24 * 60 * 60 * 1000);
    case "month":
      return new Date(
        date.getFullYear(),
        date.getMonth() + number,
        date.getDate(),
      );
    case "year":
      return new Date(
        date.getFullYear() + number,
        date.getMonth(),
        date.getDate(),
      );
  }
}
