"use client";

import { useRouter } from "next/navigation";
import React from "react";
import { z } from "zod";
import RadioSmallCards from "~/app/_components/form-inputs/radio-small-cards";
import Textarea from "~/app/_components/form-inputs/textarea";
import Form, {
  FormBody,
  FormButton,
  FormInputContainer,
} from "~/app/_components/form/form";
import { api } from "~/trpc/react";
import { addNUnitsToDate } from "~/utils/dates";
import { AssertedCheckInCadenceUnitValues } from "~/utils/enums";
import useFormState from "~/utils/hooks/useFormState";
import {
  type CheckInCreateInput,
  type Nullable,
  type PersonGetPersonOutput,
} from "~/utils/types";

type Props = { person: NonNullable<PersonGetPersonOutput> };

export default function CheckInForm({ person }: Props) {
  const router = useRouter();
  const [checkIn, setCheckInProperty] =
    useFormState<CheckInState>(DEFAULT_CHECK_IN);

  const createCheckInMutation = api.checkIn.create.useMutation({
    onSuccess: () => {
      router.back();
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedCheckIn = validateInput();
    if (!validatedCheckIn) return;

    createCheckInMutation.mutate(validatedCheckIn);
  }

  // TODO: handle validation errors
  function validateInput(): Nullable<CheckInCreateInput> {
    if (!checkIn.dateOffset || !checkIn.notes) {
      return null;
    }

    const [rawNumber, rawUnit] = checkIn.dateOffset.split(" ");

    const parseResult = z
      .tuple([z.number(), z.enum(AssertedCheckInCadenceUnitValues)])
      .safeParse([Number(rawNumber), rawUnit]);

    if (!parseResult.success) {
      return null;
    }

    const [number, unit] = parseResult.data;
    const now = new Date();
    const checkInDate = addNUnitsToDate(number * -1, unit, now);

    return { notes: checkIn.notes, date: checkInDate, personId: person.id };
  }

  return (
    <Form handleSubmit={handleSubmit}>
      <FormBody>
        <FormInputContainer width="full">
          <RadioSmallCards
            name={"dateOffset"}
            value={checkIn.dateOffset ?? ""}
            id={"dateOffset"}
            label={"Check in date"}
            options={DATE_OFFSET_OPTIONS}
            onChange={(value) => setCheckInProperty("dateOffset", value)}
            size={"small"}
          />
        </FormInputContainer>
        <FormInputContainer width="4col">
          <Textarea
            name={"notes"}
            value={checkIn.notes ?? ""}
            id={"notes"}
            label={"Add your notes"}
            onChange={(event) =>
              setCheckInProperty("notes", event.target.value)
            }
            required={true}
          />
        </FormInputContainer>
      </FormBody>
      <FormButton isLoading={createCheckInMutation.isLoading} />
    </Form>
  );
}

type CheckInState = {
  dateOffset: Nullable<string>;
  notes: Nullable<string>;
};

const DEFAULT_CHECK_IN: CheckInState = {
  dateOffset: null,
  notes: null,
};

const DATE_OFFSET_OPTIONS = [
  { value: "0 day", label: "Today" },
  { value: "1 day", label: "Yesterday" },
  { value: "3 day", label: "3 days ago" },
  { value: "1 week", label: "1 week ago" },
  { value: "1 month", label: "1 month ago" },
];
