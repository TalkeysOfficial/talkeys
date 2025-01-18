import EventCarousel from "@/components/eventCarousel";
import React from "react";

function page() {
	return (
		<div className="py-36">
			<h1 className="text-white text-4xl px-10">Explore Events</h1>
			{Array.from({ length: 3 }).map((_, index) => (
				<EventCarousel
					key={index * 23}
					title={`Category ${index + 1}`}
				/>
			))}
		</div>
	);
}

export default page;
