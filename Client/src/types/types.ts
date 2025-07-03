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
	duration: string;
	totalSeats: number;
	slots: number;
	visibility: "public" | "private";
	prizes?: string;
	eventDescription?: string;
	isLive?: boolean;
	isLiked: boolean | null;
	paymentQRcode?: string;
	registrationLink?: string;
	isPaid: boolean;
	isTeamEvent: boolean;
	ticketPrice: number;
	location: string;
	startDate: string;
	startTime: string;
	endRegistrationDate: string;
	photographs: string[];
	sponsorImages: string[];
	registrationCount: number;
	organizerName?: string;
	organizerEmail?: string;
	organizerContact?: string;
}

export interface FormData extends Omit<Event, "photographs" | "sponsorImages"> {
	photographs: FileList | null;
	sponsorImages: FileList | null;
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

	export interface BookTicketResponse {
		success: boolean;
		message: string;
		data: {
			passId: string;
			merchantOrderId: string;
			phonePeOrderId: string;
			amount: number;
			amountInPaisa: number;
			totalTickets: number;
			paymentUrl: string;
			expiresAt: string;
			event: {
				id: string;
			};
			friends: any[];
		};
	}