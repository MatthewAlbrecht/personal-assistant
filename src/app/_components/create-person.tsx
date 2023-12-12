"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { api } from "~/trpc/react";

const DEFAULT_PERSON: PersonState = {
  name: null,
  checkInCadence: 1,
  phoneNumber: null,
  email: null,
  yearMet: new Date().getFullYear(),
  birthday: null,
};

type PersonState = {
  name: Nullable<string>;
  checkInCadence: number;
  phoneNumber: Nullable<string>;
  email: Nullable<string>;
  yearMet: number;
  birthday: Nullable<string>;
};

const CADENCE_OPTIONS: OptionType<number>[] = [
  { label: "2 Weeks", value: 1 },
  { label: "Monthly", value: 2 },
  { label: "Quarterly", value: 3 },
  { label: "Yearly", value: 4 },
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

type Person = typeof DEFAULT_PERSON;

export function CreatePerson() {
  const router = useRouter();
  const [person, setPerson] = useState(DEFAULT_PERSON);

  const createPerson = api.person.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setPerson(DEFAULT_PERSON);
    },
  });

  function handleFormInputChange<K extends keyof Person>(
    key: K,
    value: Person[K],
  ) {
    setPerson({ ...person, [key]: value });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!person.name) {
      return;
    }

    addPerson({
      ...person,
      name: person.name,
      birthday: person.birthday ? new Date(person.birthday) : null,
    });
  }

  function addPerson(input: NonNullable<typeof createPerson.variables>) {
    createPerson.mutate({
      ...input,
      yearMet: input.yearMet,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <FormInputText
                name="throwoff_name"
                value={person.name ?? ""}
                id="name"
                placeholder="Lionel Messi"
                label="Name"
                required
                onChange={(event) =>
                  handleFormInputChange("name", event.target.value || null)
                }
              />
            </div>

            <div className="col-span-full">
              <RadioSmallCards<number>
                name="checkInCadence"
                value={String(person.checkInCadence)}
                id={"checkInCadence"}
                label="Check In Cadence"
                options={CADENCE_OPTIONS}
                size="large"
                onChange={(value) => {
                  handleFormInputChange("checkInCadence", Number(value));
                }}
              />
            </div>

            <div className="sm:col-span-4">
              <FormInputText
                name="throwoff_phoneNumber"
                value={person.phoneNumber ?? ""}
                id="phoneNumber"
                placeholder="(555) 623-4567"
                label="Phone Number"
                onChange={(event) =>
                  handleFormInputChange(
                    "phoneNumber",
                    event.target.value || null,
                  )
                }
              />
            </div>

            <div className="sm:col-span-4">
              <FormInputText
                name="throwoff_email"
                value={person.email ?? ""}
                type="email"
                id="email"
                placeholder="lionel@messi.com"
                label="Email Address"
                onChange={(event) =>
                  handleFormInputChange("email", event.target.value || null)
                }
              />
            </div>

            <div className="sm:col-span-4">
              <FormInputText
                name="throwoff_birthday"
                type="date"
                value={person.birthday ?? ""}
                id="birthday"
                placeholder="08/18/1994"
                label="Birthday"
                onChange={(event) =>
                  handleFormInputChange("birthday", event.target.value || null)
                }
              />
            </div>

            <div className="col-span-full">
              <RadioSmallCards<number>
                name="yearMet"
                value={String(person.yearMet)}
                id={"yearMet"}
                label="Year Met"
                options={YEAR_MET_OPTIONS}
                size="small"
                onChange={(value) => {
                  handleFormInputChange("yearMet", Number(value));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {createPerson.isLoading ? "Submitting..." : "Save"}
        </button>
      </div>
    </form>
  );
}

import { PhotoIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import FormInputText from "./form-inputs/text";
import RadioSmallCards, { OptionType } from "./form-inputs/radio-small-cards";
import { date } from "drizzle-orm/mysql-core";
import { Nullable } from "~/utils/types";

export default function Example() {
  return <form></form>;
}
