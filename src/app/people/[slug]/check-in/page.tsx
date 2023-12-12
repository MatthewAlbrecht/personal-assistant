import React from "react";
import { api } from "~/trpc/server";
import CheckInForm from "./check-in-form";
import Link from "next/link";
import ButtonLink from "~/app/_components/buttons/button-link";
import { BaseLayoutMain, BaseLayoutAside } from "~/app/_layouts/base-layout";

type Props = { params: { slug: string } };

export default async function NewCheckIn({ params }: Props) {
  // get route params
  const { slug } = params;
  const person = await api.person.getPerson.query({ slug });

  if (!person) {
    return (
      <h2 className="text-base font-semibold leading-7 text-gray-900">
        Person not found, please <Link href="/">try again</Link>.
      </h2>
    );
  }

  return (
    <>
      <BaseLayoutMain>
        <div className="space-y-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              New check in for {person.name}
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Please describe anything notable that happened last time you
              spoke.
            </p>
          </div>
          <CheckInForm person={person} />
        </div>
      </BaseLayoutMain>
      <BaseLayoutAside>
        <ButtonLink
          text="New Person"
          href="/people/new"
          size="base"
          variant="primary"
          leadingIcon="Plus"
        />
      </BaseLayoutAside>
    </>
  );
}
