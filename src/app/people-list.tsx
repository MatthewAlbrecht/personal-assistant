"use client";

import React from "react";
import {
  type ArrayElement,
  type PersonGetNextNDaysOutput,
} from "~/utils/types";
import clsx from "clsx";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/solid";
import { Fragment } from "react";
import Button from "./_components/buttons/button";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import ButtonLink from "./_components/buttons/button-link";

type Props = {
  people: PersonGetNextNDaysOutput;
  headline: string;
  emptyMessage: string;
};

export default function PeopleList({ people, headline, emptyMessage }: Props) {
  const router = useRouter();

  const pushNextCheckInDate = api.person.pushNextCheckInDate.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  function handlePushDate(
    person: ArrayElement<PersonGetNextNDaysOutput>,
    days: number,
  ) {
    const today = new Date();
    today.setDate(today.getDate() + days);
    pushNextCheckInDate.mutate({
      personId: person.id,
      nextCheckInDate: today,
    });
  }

  return (
    <div className="overflow-hidden rounded-md bg-white shadow">
      <div className="border-b border-gray-200 bg-white px-4 py-5 sm:px-6">
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          {headline}
        </h3>
      </div>
      <ul role="list" className="divide-y divide-gray-100">
        {people.length === 0 && (
          <li className="flex flex-col items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
            <h3 className="mt-2 text-sm font-semibold text-gray-900">
              {emptyMessage}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Please check back in tomorrow.
            </p>
          </li>
        )}
        {people.map((person) => (
          <PeopleListItem
            person={person}
            key={person.id}
            onPushDate={handlePushDate}
          />
        ))}
      </ul>
    </div>
  );
}

function PeopleListItem({
  person,
  onPushDate,
}: {
  person: ArrayElement<PersonGetNextNDaysOutput>;
  onPushDate: (
    person: ArrayElement<PersonGetNextNDaysOutput>,
    days: number,
  ) => void;
}) {
  return (
    <li className="flex items-center justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6">
      <div className="min-w-0">
        <div className="flex items-start gap-x-3">
          <p className="text-sm font-semibold leading-6 text-gray-900">
            {person.name}
          </p>
          <p
            className={clsx(
              statuses.Complete,
              "mt-0.5 whitespace-nowrap rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset",
            )}
          >
            Complete
          </p>
        </div>
        <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
          <p className="whitespace-nowrap">
            Due on{" "}
            <time dateTime={new Date().toISOString()}>
              {new Date().toISOString()}
            </time>
          </p>
          <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current">
            <circle cx={1} cy={1} r={1} />
          </svg>
          <p className="truncate">Created by Owner</p>
        </div>
      </div>
      <div className="flex flex-none items-center gap-x-2">
        <ButtonLink
          href={`/people/${person.slug}/check-in`}
          variant="soft"
          size="xs"
          leadingIcon="CheckCircle"
        />
        <Button
          variant="secondary"
          size="xs"
          text="3D"
          onClick={() => {
            onPushDate(person, 3);
          }}
        />
        <Button
          variant="secondary"
          size="xs"
          text="W"
          onClick={() => {
            onPushDate(person, 7);
          }}
        />
        <Button
          variant="secondary"
          size="xs"
          text="M"
          onClick={() => {
            onPushDate(person, 30);
          }}
        />
        <Button
          variant="secondary"
          size="xs"
          text="Q"
          onClick={() => {
            onPushDate(person, 90);
          }}
        />
        <Menu as="div" className="relative flex-none">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
            <span className="sr-only">Open options</span>
            <EllipsisVerticalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                    )}
                  >
                    Edit
                    <span className="sr-only">, {person.name}</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                    )}
                  >
                    Move
                    <span className="sr-only">, {person.name}</span>
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#"
                    className={clsx(
                      active ? "bg-gray-50" : "",
                      "block px-3 py-1 text-sm leading-6 text-gray-900",
                    )}
                  >
                    Delete
                    <span className="sr-only">, {person.name}</span>
                  </a>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}

const statuses = {
  Complete: "text-green-700 bg-green-50 ring-green-600/20",
  "In progress": "text-gray-600 bg-gray-50 ring-gray-500/10",
  Archived: "text-yellow-800 bg-yellow-50 ring-yellow-600/20",
};
