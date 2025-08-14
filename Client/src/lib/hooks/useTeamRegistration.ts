// hooks/useTeamRegistration.ts
import { useState } from "react";
import { createTeamApi, joinTeam } from "@/lib/services/eventApi";

export type RegistrationState =
	| "initial"
	| "teamOptions"
	| "joinTeamPhone"
	| "createTeamPhone"
	| "createTeamName"
	| "joinTeamCode"
	| "createTeamCode"
	| "teamJoined"
	| "passCreated"
	| "booked"
	| "error";

export function useTeamRegistration(eventId: string) {
	const [state, setState] = useState<RegistrationState>("initial");
	const [phone, setPhone] = useState("");
	const [teamName, setTeamName] = useState("");
	const [teamCode, setTeamCode] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");

	const toJoin = () => setState("joinTeamPhone");
	const toCreate = () => setState("createTeamPhone");

	const submitPhone = () => {
		if (state === "joinTeamPhone") setState("joinTeamCode");
		else if (state === "createTeamPhone") setState("createTeamName");
	};

	async function submitJoin() {
		setIsLoading(true);
		setErrorMsg("");
		try {
			const data = await joinTeam(teamCode, phone);
			setTeamName(data.teamName);
			setState("teamJoined");
		} catch (e: any) {
			if (e?.status === 400)
				setErrorMsg("Team full or invalid phone number");
			else if (e?.status === 404) setErrorMsg("Team or user not found");
			else setErrorMsg("Server error");
			setState("error");
		} finally {
			setIsLoading(false);
		}
	}

	async function submitCreate() {
		setIsLoading(true);
		setErrorMsg("");
		try {
			const data = await createTeamApi({
				phoneNumber: phone,
				teamName,
				eventId,
			});
			setTeamCode(data.team.teamCode);
			setTeamName(data.team.teamName);
			setState("createTeamCode");
		} catch (e: any) {
			if (e?.status === 400) setErrorMsg("Invalid phone number");
			else if (e?.status === 401) setErrorMsg("Login Before Creating Team");
			else if (e?.status === 404) setErrorMsg("User not found");
			else setErrorMsg("Server error");
			setState("error");
		} finally {
			setIsLoading(false);
		}
	}

	const reset = () => {
		setState("initial");
		setErrorMsg("");
	};

	return {
		state,
		setState,
		phone,
		setPhone,
		teamName,
		setTeamName,
		teamCode,
		setTeamCode,
		isLoading,
		errorMsg,
		toJoin,
		toCreate,
		submitPhone,
		submitJoin,
		submitCreate,
		reset,
	};
}
