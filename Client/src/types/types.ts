export interface EventPageProps {
	readonly event: Event;
	readonly onClose: () => void;
}

export interface TeamResponse {
	team: {
		teamName: string;
		teamLeader: string;
		teamCode: string;
		teamMembers: string[];
		maxMembers: number;
		_id: string;
		__v: number;
	};
	teamCode: string;
}

export interface Event {
	_id: string;
	name: string;
	category: string;
	mode: "offline" | "online";
	location?: string;
	duration: string;
	ticketPrice: string;
	totalSeats: number;
	slots: number;
	visibility: "public" | "private";
	prizes?: string;
	photographs?: string[];
	startDate: Date;
	startTime: string;
	endRegistrationDate: Date;
	eventDescription?: string;
	isLive?: boolean;
	isLiked: boolean | null;
	paymentQRcode?: string;
	registrationLink?: string;
	isPaid: boolean;
}

export type RegistrationState =
	| "initial"
	| "teamOptions"
	| "joinTeamPhone"
	| "joinTeamCode"
	| "createTeamPhone"
	| "createTeamName"
	| "createTeamCode"
	| "teamJoined"
	| "error"
	| "booked"
	| "passCreated";
