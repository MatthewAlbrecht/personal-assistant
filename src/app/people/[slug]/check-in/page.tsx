import React from "react";

type Props = { params: { slug: string } };

export default function NewCheckIn({ params }: Props) {
  // get route params
  const { slug } = params;

  return <div>NewCheckIn</div>;
}
