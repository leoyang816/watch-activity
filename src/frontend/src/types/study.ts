export interface Participant { participantId: string; deviceId: string; site: string; enrolledOn: string }
export interface CalendarDay { date: string; wearHours: number; syncCount: number }
export interface CalendarResponse { studyId: string; participantId: string; deviceId: string; site: string; month: string; days: CalendarDay[] }
