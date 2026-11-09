import EventStatsPage from "@/features/admin/components/EventStatsPage";

export default function AdminEventStatsRoute({
	params,
}: {
	params: { id: string };
}) {
	return <EventStatsPage eventId={params.id} />;
}
