// hooks/useFriendManager.ts
import { useState } from "react";
import { friendSchema, type Friend } from "@/lib/utils/validation";

export function useFriendManager() {
	const [friends, setFriends] = useState<Friend[]>([]);
	const [showFriends, setShowFriends] = useState(false);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");

	const [errors, setErrors] = useState<Partial<Record<keyof Friend, string>>>(
		{},
	);

	function validateField(field: keyof Friend, value: string) {
		const fieldSchema = friendSchema.shape[field];
		const res = fieldSchema.safeParse(value.trim());
		setErrors((prev) => {
			const next = { ...prev };
			if (!res.success) next[field] = res.error.errors[0].message;
			else delete next[field];
			return next;
		});
	}

	function addFriend() {
		// run schema on the combined object
		const candidate = {
			name: name.trim(),
			email: email.trim(),
			phone: phone.trim(),
		};
		const res = friendSchema.safeParse(candidate);
		if (!res.success) {
			const next: Partial<Record<keyof Friend, string>> = {};
			res.error.errors.forEach((e) => {
				const field = e.path[0] as keyof Friend;
				next[field] = e.message;
			});
			setErrors(next);
			return;
		}

		const dup = friends.find(
			(f) =>
				f.name === candidate.name ||
				f.email === candidate.email ||
				f.phone === candidate.phone,
		);
		if (dup) {
			if (dup.name === candidate.name)
				setErrors({ name: "A friend with this name already exists" });
			else if (dup.email === candidate.email)
				setErrors({ email: "A friend with this email already exists" });
			else
				setErrors({
					phone: "A friend with this phone number already exists",
				});
			return;
		}

		setFriends((prev) => [...prev, candidate]);
		setName("");
		setEmail("");
		setPhone("");
		setErrors({});
	}

	function removeFriend(friend: Friend) {
		setFriends((prev) => prev.filter((f) => f.name !== friend.name));
	}

	function handleEnter(e: React.KeyboardEvent) {
		if (
			e.key === "Enter" &&
			name &&
			email &&
			phone &&
			Object.keys(errors).length === 0
		) {
			addFriend();
		}
	}

	return {
		friends,
		showFriends,
		setShowFriends,
		name,
		setName,
		email,
		setEmail,
		phone,
		setPhone,
		errors,
		validateField,
		addFriend,
		removeFriend,
		handleEnter,
	};
}
