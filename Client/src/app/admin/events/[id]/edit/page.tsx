import EditEventPage from "@/features/admin/components/EditEventPage";

export default function AdminEditEventRoute({
	params,
}: {
	params: { id: string };
}) {
	return <EditEventPage eventId={params.id} />;
}
