export function updateProfile(body: { displayName: string; about: string }) {
	return fetch(`${process.env.BACKEND_URL}/dashboard/profile`, {
		method: "PATCH",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
		},
		body: JSON.stringify(body),
	});
}
