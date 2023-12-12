import React from "react";
import { CreatePerson } from "~/app/_components/create-person";
import { BaseLayoutMain, BaseLayoutAside } from "~/app/_layouts/base-layout";

export default function NewPerson() {
  return (
    <>
      <BaseLayoutMain>
        <CreatePerson />
      </BaseLayoutMain>
      <BaseLayoutAside>aside</BaseLayoutAside>
    </>
  );
}
