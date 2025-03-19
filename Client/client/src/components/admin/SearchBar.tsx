"use client";

import type React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion } from "framer-motion";

interface SearchBarProps {
	onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
	return (
		<motion.div
			className="relative w-full sm:w-64"
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
			<Input
				type="text"
				placeholder="Search events..."
				onChange={(e) => onSearch(e.target.value)}
				className="bg-gray-800 text-white pl-10 border-gray-700 focus:border-purple-500 transition-colors"
			/>
		</motion.div>
	);
};

export default SearchBar;
