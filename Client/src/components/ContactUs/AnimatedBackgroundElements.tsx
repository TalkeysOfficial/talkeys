import React from "react";
import { motion } from "framer-motion";

function AnimatedBackgroundElements() {
	return (
		<div className="fixed inset-0 z-0 overflow-hidden">
			{[...Array(15)].map((_, i) => (
				<motion.div
					key={i}
					className="absolute rounded-full bg-purple-500/10"
					style={{
						width: Math.random() * 300 + 50,
						height: Math.random() * 300 + 50,
						left: `${Math.random() * 100}%`,
						top: `${Math.random() * 100}%`,
					}}
					initial={{ opacity: 0.1 }}
					animate={{
						opacity: [0.1, 0.2, 0.1],
						scale: [1, 1.1, 1],
						x: [0, Math.random() * 20 - 10, 0],
						y: [0, Math.random() * 20 - 10, 0],
					}}
					transition={{
						duration: Math.random() * 8 + 5,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
				/>
			))}
		</div>
	);
}

export default AnimatedBackgroundElements;
