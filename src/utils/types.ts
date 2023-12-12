import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

// ------------------------------------------------------------

export type Nullable<T> = T | null;
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType[number];

// ------------------------------------------------------------

type RouterInput = inferRouterInputs<AppRouter>;
type RouterOutput = inferRouterOutputs<AppRouter>;

export type PersonCreateInput = RouterInput["person"]["create"];
export type PersonCreateOutput = RouterOutput["person"]["create"];
export type PersonGetNextNDaysOutput = RouterOutput["person"]["getNextNDays"];

// ------------------------------------------------------------
