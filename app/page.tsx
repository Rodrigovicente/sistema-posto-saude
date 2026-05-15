import Image from "next/image";
import WeekCalendar from "@/components/week-calendar";
import WeekEventList from "@/components/week-event-list";
import { WeeklyEvent } from "./types/calendar";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { redirect } from "next/navigation";

export default function Home() {

	redirect('/search')

	const mockEvents: WeeklyEvent[] = [
		{ id: '1', title: 'Daily Standup', startHour: 9, startMinute: 0, duration: 1, day: 1 },
		{ id: '2', title: 'Deep Work', startHour: 13, startMinute: 0, duration: 3, day: 3, color: 'emerald' },
		{ id: '3', title: 'Client Meeting', startHour: 10, startMinute: 0, duration: 3, day: 5, color: 'purple' },
		{ id: '4', title: 'Client Meeting', startHour: 12, startMinute: 30, endHour: 15, day: 5, color: 'purple' },
		{ id: '5', title: 'Client Meeting', startHour: 15, startMinute: 15, endHour: 15, endMinute: 45, day: 5, color: 'purple' },
		{ id: '6', title: 'Client Meeting', startHour: 16, endHour: 16, endMinute: 30, day: 5, color: 'purple' },
		{ id: '7', title: 'Client Meeting', startHour: 16, startMinute: 40, endHour: 17, endMinute: 10, day: 5, color: 'purple' },
	];

	return (
		<div className="flex flex-col flex-1 items-center justify-center font-sans bg-white">
			<main className="flex flex-1 w-full max-w-6xl flex-col items-center justify-between py-32 px-1 bg-white sm:items-start">
				<Image
					className="invert"
					src="/next.svg"
					alt="Next.js logo"
					width={100}
					height={20}
					priority
				/>

				Rua:
				<input type="text" className="border-1 border-black"></input>

				Número:
				<input type="text" className="border-1 border-black"></input>

				<br />
				<br />
				<br />
				<br />
				<br />
				<br />

				<Card className="w-full">
				<CardHeader>
					<CardTitle>Card Title</CardTitle>
					<CardDescription>Card Description</CardDescription>
					<CardAction>Card Action</CardAction>
				</CardHeader>
				<CardContent>
					<p>Card Content</p>
				</CardContent>
				<CardFooter>
					<p>Card Footer</p>
				</CardFooter>
				</Card>
				<WeekEventList events={mockEvents} />
				<WeekCalendar events={mockEvents} />
				<div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
					<h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
						To get started, edit the page.tsx file.
					</h1>
					<p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
						Looking for a starting point or more instructions? Head over to{" "}
						<a
							href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							className="font-medium text-zinc-950 dark:text-zinc-50"
						>
							Templates
						</a>{" "}
						or the{" "}
						<a
							href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
							className="font-medium text-zinc-950 dark:text-zinc-50"
						>
							Learning
						</a>{" "}
						center.
					</p>
				</div>
				<div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
					<a
						className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
						href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						<Image
							className="dark:invert"
							src="/vercel.svg"
							alt="Vercel logomark"
							width={16}
							height={16}
						/>
						Deploy Now
					</a>
					<a
						className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
						href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
						target="_blank"
						rel="noopener noreferrer"
					>
						Documentation
					</a>
				</div>
			</main>
		</div>
	);
}
