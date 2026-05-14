import { Calendar, Clock } from 'lucide-react';
import { WeeklyEvent } from '../app/types/calendar';

interface HorizontalWeekCalendarProps {
	events: WeeklyEvent[];
}

const DAYS = [
	'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'
];

export default function WeekEventList({ events }: HorizontalWeekCalendarProps) {
	return (
		<div className="flex flex-col gap-4 w-full max-w-4xl mx-auto p-4">
			<div className="flex items-center gap-2 mb-4">
				<Calendar className="text-blue-600" />
				<h2 className="text-xl font-bold text-gray-800">Weekly Agenda</h2>
			</div>

			<div className="space-y-1">
				{DAYS.map((dayName, index) => {
					// Filter and sort events for this specific day
					const dayEvents = events
						.filter((e) => e.day === index)
						.sort((a, b) => a.startHour - b.startHour);

					return (
						<div key={dayName}  className="bg-white px-4 py-2 rounded-lg border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center">
							<span className="text-lg font-bold text-gray-800">{dayName}</span>

							{dayEvents.length > 0 ? (
								<div className="group flex flex-col overflow-hidden">
									<div className="flex flex-wrap gap-2 items-center min-h-[80px]">
											{dayEvents.map((event) => {
												/* Events List */
												const endHour = event.endHour !== undefined ? event.endHour : (event.startHour + (event.duration || 1));
												const endMinute = event.endMinute !== undefined ? event.endMinute : 0;
												const startHour = Math.min(Math.max(event.startHour, 0), 23);
												const startMinute = event.startMinute !== undefined ? Math.min(Math.max(event.startMinute, 0), 59) : 0;
												return (
													<div 
														key={event.id}
														className={`flex flex-col p-3 bg-${event.color || 'blue'}-50 border border-${event.color || 'blue'}-200 rounded-lg min-w-[200px] flex-1 sm:flex-none`}
													>
														<span className={`font-bold text-${event.color || 'blue'}-900 text-sm`}>
															{event.title}
														</span>
														<div className={`flex items-center gap-1 text-${event.color || 'blue'}-700 mt-1`}>
															<Clock size={14} />
															<span className="text-xs font-medium">
																{`${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')} - ${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`}
															</span>
														</div>
													</div>
												)
											})}
									</div>
								</div>
							) : (
								<span className="text-gray-400 text-sm italic">Nenhum evento agendado</span>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
