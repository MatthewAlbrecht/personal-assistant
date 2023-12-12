import { api } from "~/trpc/server";
import ButtonLink from "./_components/buttons/button-link";
import { BaseLayoutMain, BaseLayoutAside } from "./_layouts/base-layout";
import TodayList from "./people-list";

export default async function Home() {
  // use server component to fetch getNextNDays and pass 8 into as input
  const people = await api.person.getNextNDays.query({ days: 8 });
  // split list into two lists: nextCheckInDate is less than and including today and nextCheckInDate is greater than today

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const sevenDaysFromNow = new Date(endOfToday);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  const todaysPeople = people
    .filter((person) => person.nextCheckInDate <= endOfToday)
    .sort(
      (a, b) =>
        a.nextCheckInDate.getTime() / 1000 - b.nextCheckInDate.getTime() / 1000,
    );

  const futurePeople = people
    .filter(
      (person) =>
        person.nextCheckInDate > endOfToday &&
        person.nextCheckInDate <= sevenDaysFromNow,
    )
    .sort(
      (a, b) =>
        a.nextCheckInDate.getTime() / 1000 - b.nextCheckInDate.getTime() / 1000,
    );

  return (
    <>
      <BaseLayoutMain>
        <div className="space-y-8">
          <TodayList
            people={todaysPeople}
            headline="Today"
            emptyMessage="Nothing to do Today"
          />
          <TodayList
            people={futurePeople}
            headline="This Week"
            emptyMessage="Nothing left for this week"
          />
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
