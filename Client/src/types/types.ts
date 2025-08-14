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
	startRegistrationDate: string;
	photographs: string[];
	sponsorImages: string[];
	registrationCount: number;
	organizerName?: string;
	organizerEmail?: string;
	organizerContact?: string;
	collegeName?: string; 
	festName?: string; 
	likes: number; 
	type: "event" | "workshop" | "competition"; 
	status: "registration_closed" | "coming_soon" | "live" | "ended";
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

	// Pass types for the /getPass API response
	export interface QRString {
		id: string;
		// Add other properties if they exist in the actual response
	}

	export interface Pass {
		passUUID: string;
		qrStrings: QRString[];
		// Add other properties if they exist in the actual response
	}

	export interface PassResponse {
		passes: Pass[];
		success?: boolean;
		message?: string;
	}


	export interface PassQRString {
		id: string;
		personType: "user" | "friend";
		qrScanned: boolean;
		scannedAt: string | null;
		_id: string;
	}

	export interface PassDetails {
		passUUID: string;
		qrStrings: PassQRString[];
		passType: string;
		passId: string;
		email: string;
		eventId: string;
	}

	export interface PassDetailsResponse {
		passes: PassDetails[];
		count: number;
		message: string;
	}
