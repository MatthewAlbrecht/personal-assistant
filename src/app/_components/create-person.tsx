"use client";

import FormInputText from "./form-inputs/text";
import RadioSmallCards, {
  type OptionType,
} from "./form-inputs/radio-small-cards";
import { type PersonCreateInput, type Nullable } from "~/utils/types";
import { AssertedCheckInCadenceUnitValues } from "~/utils/enums";

import { useRouter } from "next/navigation";

import { z } from "zod";
import { api } from "~/trpc/react";
import Form, { FormBody, FormButton, FormInputContainer } from "./form/form";
import useFormState from "~/utils/hooks/useFormState";

export function CreatePerson() {
  const router = useRouter();
  const [person, setPersonProperty, setPerson] =
    useFormState<PersonState>(DEFAULT_PERSON);

  const createPersonMutation = api.person.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setPerson(DEFAULT_PERSON);
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validatedPerson = validateInput();
    if (!validatedPerson) return;

    createPersonMutation.mutate(validatedPerson);
  }

  // TODO: handle validation errors
  function validateInput(): Nullable<PersonCreateInput> {
    if (
      !person.name ||
      !person.slug ||
      !person.checkInCadence ||
      !person.yearMet
    ) {
      return null;
    }

    const [rawNumber, rawUnit] = person.checkInCadence.split(" ");
    const parseResult = z
      .tuple([z.number(), z.enum(AssertedCheckInCadenceUnitValues)])
      .safeParse([Number(rawNumber), rawUnit]);

    if (!parseResult.success) {
      return null;
    }

    const [checkInCadenceNumber, checkInCadenceUnit] = parseResult.data;

    return {
      ...person,
      name: person.name,
      slug: person.slug,
      checkInCadenceNumber: checkInCadenceNumber,
      checkInCadenceUnit: checkInCadenceUnit,
      birthday: person.birthday ? new Date(person.birthday) : null,
    };
  }

  return (
    <Form handleSubmit={handleSubmit}>
      <FormBody>
        <FormInputContainer width="4col">
          <FormInputText
            name="name"
            value={person.name ?? ""}
            id="name"
            placeholder="Lionel Messi"
            label="Name"
            required
            onChange={(event) =>
              setPersonProperty("name", event.target.value || null)
            }
          />
        </FormInputContainer>

        <FormInputContainer width="4col">
          <FormInputText
            name="slug"
            value={person.slug ?? ""}
            id="slug"
            placeholder="lionel-messi"
            label="Slug"
            leadingText={{ text: "people/", variant: "inline-block" }}
            required
            onChange={(event) =>
              setPersonProperty(
                "slug",
                event.target.value
                  .replaceAll(/[^A-Za-z0-9]+/g, "-") // replace non-alphanumeric characters with dashes
                  .toLowerCase() || null,
              )
            }
          />
        </FormInputContainer>

        <FormInputContainer width="full">
          <RadioSmallCards
            name="checkInCadence"
            value={person.checkInCadence ?? ""}
            id={"checkInCadence"}
            label="Check In Cadence"
            options={CADENCE_OPTIONS}
            size="large"
            onChange={(value) => {
              setPersonProperty("checkInCadence", value);
            }}
          />
        </FormInputContainer>

        <FormInputContainer width="4col">
          <FormInputText
            name="throwoff_phoneNumber"
            value={person.phoneNumber ?? ""}
            id="phoneNumber"
            placeholder="(555) 623-4567"
            label="Phone Number"
            onChange={(event) =>
              setPersonProperty("phoneNumber", event.target.value || null)
            }
          />
        </FormInputContainer>

        <FormInputContainer width="4col">
          <FormInputText
            name="throwoff_email"
            value={person.email ?? ""}
            type="email"
            id="email"
            placeholder="lionel@messi.com"
            label="Email Address"
            onChange={(event) =>
              setPersonProperty("email", event.target.value || null)
            }
          />
        </FormInputContainer>

        <FormInputContainer width="4col">
          <FormInputText
            name="throwoff_birthday"
            type="date"
            value={person.birthday ?? ""}
            id="birthday"
            placeholder="08/18/1994"
            label="Birthday"
            onChange={(event) =>
              setPersonProperty("birthday", event.target.value || null)
            }
          />
        </FormInputContainer>

        <FormInputContainer width="full">
          <RadioSmallCards<number>
            name="yearMet"
            value={String(person.yearMet)}
            id={"yearMet"}
            label="Year Met"
            options={YEAR_MET_OPTIONS}
            size="small"
            onChange={(value) => {
              setPersonProperty("yearMet", Number(value));
            }}
          />
        </FormInputContainer>
      </FormBody>
      <FormButton isLoading={createPersonMutation.isLoading} />
    </Form>
  );
}

const DEFAULT_PERSON: PersonState = {
  name: null,
  slug: null,
  checkInCadence: null,
  phoneNumber: null,
  email: null,
  yearMet: new Date().getFullYear(),
  birthday: null,
};

type PersonState = {
  name: Nullable<string>;
  slug: Nullable<string>;
  checkInCadence: Nullable<string>;
  phoneNumber: Nullable<string>;
  email: Nullable<string>;
  yearMet: number;
  birthday: Nullable<string>;
};

const CADENCE_OPTIONS = [
  { label: "2 Weeks", value: "2 week" },
  { label: "Monthly", value: "1 month" },
  { label: "Quarterly", value: "3 month" },
  { label: "Yearly", value: "1 year" },
];

const YEAR_MET_OPTIONS: OptionType<number>[] = [
  { label: "This year", value: new Date().getFullYear() },
  { label: "AT", value: 2023 },
  { label: "NYC", value: 2022 },
  { label: "Pandemic", value: 2020 },
  { label: "Mondo", value: 2019 },
  { label: "Made", value: 2018 },
  { label: "Galvanize", value: 2017 },
  { label: "CU 3&4", value: 2015 },
  { label: "CU 1&2", value: 2013 },
  { label: "CHS 3&4", value: 2012 },
  { label: "CHS 1&2", value: 2010 },
  { label: "MMS ", value: 2007 },
  { label: "Van Zant ", value: 2003 },
  { label: "Always ", value: 1994 },
];
