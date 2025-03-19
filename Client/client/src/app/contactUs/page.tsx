import ContactForm from "@/components/ContactForm";
import React from "react";

import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Contact Us",
	description: "Contact Us",
};

const page = () => {
	return (
		<div className="pt-12">
			<ContactForm />
		</div>
	);
};

export default page;
