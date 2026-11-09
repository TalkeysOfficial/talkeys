import EditEventPage from "@/features/admin/components/EditEventPage";

export default async function AdminEditEventRoute({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <EditEventPage eventId={id} />;
}
