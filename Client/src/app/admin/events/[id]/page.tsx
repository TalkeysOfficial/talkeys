import EventStatsPage from "@/features/admin/components/EventStatsPage";

export default async function AdminEventStatsRoute({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	return <EventStatsPage eventId={id} />;
}
