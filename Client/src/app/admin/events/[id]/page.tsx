import EventStatsPage from "@/components/admin/EventStatsPage";

export default function AdminEventStatsRoute({
	params,
}: {
	params: { id: string };
}) {
	return <EventStatsPage eventId={params.id} />;
}
