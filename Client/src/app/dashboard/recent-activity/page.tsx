//@ts-nocheck
//@ts-ignore

"use client";

import { useState } from "react";
import RangePills from "@/components/dashboard/RangePills";
import { useActivity } from "@/lib/hooks/useActivity";
import EventCarousel from "@/components/EventCarousel";
import CommunityRow from "@/components/dashboard/CommunityRow";

export default function RecentActivity() {
	const [range, setRange] = useState<"1m" | "6m" | "1y">("1m");
	const { data, isLoading } = useActivity(range);

	if (isLoading) return <p className="text-white">Loading…</p>;

	return (
		<div className="space-y-12">
			<RangePills
				value={range}
				onChange={setRange}
			/>

			<section>
				<h3 className="text-lg text-purple-300 mb-4">Communities Joined</h3>
				<div className="space-y-4">
					{data.communitiesJoined.map((c) => (
						<CommunityRow
							key={c._id}
							community={c}
						/>
					))}
					{data.communitiesJoined.length === 0 && (
						<p className="text-gray-400">
							No communities joined in this period.
						</p>
					)}
				</div>
			</section>

			<EventCarousel
				category="Events Attended"
				ev={data.eventsAttended}
			/>
		</div>
	);
}
