import { ChevronLeft, ChevronRight } from 'lucide-react';
import { WeeklyEvent } from '../app/types/calendar';

interface WeekCalendarProps {
	events: WeeklyEvent[];
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export default function WeekCalendar({ events }: WeekCalendarProps) {
	return (
		<div className="flex flex-col w-full h-full bg-white rounded-lg shadow overflow-hidden">
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b">
				<h2 className="text-lg font-semibold">Weekly Schedule</h2>
				<div className="flex gap-2">
					<button className="p-2 hover:bg-gray-100 rounded-full"><ChevronLeft size={20} /></button>
					<button className="p-2 hover:bg-gray-100 rounded-full"><ChevronRight size={20} /></button>
				</div>
			</div>

			<div className="flex flex-col flex-1 overflow-auto">
				{/* Days Header */}
				<div className="grid grid-cols-[60px_1fr] border-b bg-gray-50">
					<div className="h-10" /> {/* Spacer for time column */}
					<div className="grid grid-cols-7 border-l">
						{DAYS.map((day) => (
							<div key={day} className="py-2 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
								{day}
							</div>
						))}
					</div>
				</div>

				{/* Calendar Body */}
				<div className="relative grid grid-cols-[60px_1fr] flex-1">
					{/* Time Labels */}
					<div className="bg-gray-50">
						{HOURS.map((hour) => (
							<div key={hour} className="h-16 text-right pr-2 text-xs text-gray-400 pt-1">
								{`${hour}:00`}
							</div>
						))}
					</div>

					{/* Grid Lines and Events */}
					<div className="relative grid grid-cols-7 border-l h-full">
						{/* Background Grid Lines */}
						{HOURS.map((hour) => (
							<div
								key={hour}
								className="absolute w-full border-b border-gray-100"
								style={{ top: `${hour * 4}rem`, height: '4rem' }}
							/>
						))}
						
						{/* Vertical Day Lines */}
						{DAYS.map((_, i) => (
							<div key={i} className="border-r border-gray-100 last:border-r-0 h-full" />
						))}

						{/* Events Overlay */}
						<div className="absolute inset-0 w-full grid grid-cols-7 justify-items-stretch pointer-events-none">
							{events.map((event) => {

								const startHour = Math.min(Math.max(event.startHour, 0), 23);
								const startMinute = event.startMinute !== undefined ? Math.min(Math.max(event.startMinute, 0), 59) : 0;
								const startTimeInHours = startHour + startMinute / 60;

								const duration = event.duration !== undefined ? event.duration : ((event.endHour || 0) + (event.endMinute || 0) / 60) - startTimeInHours;

								return (
									<div
										key={event.id}
										className="group absolute mx-1 pointer-events-auto z-1 hover:z-10" // Full width minus horizontal margin
										style={{
											gridColumnStart: event.day + 1,
											top: `${startTimeInHours * 4}rem`,
											height: `${duration * 4}rem`,
											width: `calc(100% / (7 - ${event.day}) - 0.5rem)`, // Adjust width based on day and margin
										}}
									>
										<div className={`h-full p-2 rounded-md text-xs font-semibold border-l-4 shadow-sm overflow-hidden ` +
											`${event.color ? `bg-${event.color}-100/85 text-${event.color}-700 border-${event.color}-500 group-hover:bg-${event.color}-100` : 'bg-blue-100/85 text-blue-700 border-blue-500 group-hover:bg-blue-100'}`}>
											<p className="truncate">{event.title}</p>
											<p className="opacity-80">{startHour}:{startMinute.toString().padStart(2, '0')}</p>
										</div>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
