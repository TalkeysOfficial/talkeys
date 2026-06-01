import EditEventPage from "@/components/admin/EditEventPage";

export default function AdminEditEventRoute({
	params,
}: {
	params: { id: string };
}) {
	return <EditEventPage eventId={params.id} />;
}
