// components/events/CategoryTabs.tsx
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CategoryTabs({
	categories,
	activeCategory,
	setActiveCategory,
}: any) {
	if (categories.length <= 1) return null;

	return (
		<Tabs
			defaultValue="all"
			className="w-full mb-6"
		>
			<TabsList className="p-1 rounded-lg overflow-x-auto flex w-full max-w-full no-scrollbar">
				<TabsTrigger
					value="all"
					onClick={() => setActiveCategory(null)}
					className="data-[state=active]:bg-purple-600 text-white"
				>
					All Categories
				</TabsTrigger>
				{categories.map((category: string) => (
					<TabsTrigger
						key={category}
						value={category}
						onClick={() => setActiveCategory(category)}
						className="data-[state=active]:bg-purple-600 text-white"
					>
						{category}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	);
}
