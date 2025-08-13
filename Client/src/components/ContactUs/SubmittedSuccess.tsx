import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SubmittedSuccess({
	setIsSubmitted,
}: {
	setIsSubmitted: (value: boolean) => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
		>
			<Card className="bg-gradient-to-br from-gray-900 to-purple-950/30 border-purple-500/20">
				<CardContent className="p-8 flex flex-col items-center text-center">
					<motion.div
						initial={{ scale: 0, rotate: 180 }}
						animate={{ scale: 1, rotate: 0 }}
						transition={{
							type: "spring",
							stiffness: 200,
							damping: 20,
						}}
						className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
					>
						<CheckCircle className="w-10 h-10 text-green-500" />
					</motion.div>
					<h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
					<p className="text-gray-300 mb-6">
						Thank you for reaching out. We'll get back to you as soon as
						possible.
					</p>
					<Button
						onClick={() => setIsSubmitted(false)}
						className="bg-purple-600 hover:bg-purple-700"
					>
						Send Another Message
					</Button>
				</CardContent>
			</Card>
		</motion.div>
	);
}
