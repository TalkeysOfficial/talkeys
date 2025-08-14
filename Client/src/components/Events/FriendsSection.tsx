// components/event/FriendsSection.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus, X } from "lucide-react";
import { type Friend } from "@/lib/utils/validation";

type Props = {
	show: boolean;
	toggle: () => void;

	name: string;
	setName: (v: string) => void;
	email: string;
	setEmail: (v: string) => void;
	phone: string;
	setPhone: (v: string) => void;

	errors: Partial<Record<keyof Friend, string>>;
	validateField: (field: keyof Friend, value: string) => void;

	onEnter: (e: React.KeyboardEvent) => void;
	add: () => void;
	remove: (f: Friend) => void;

	friends: Friend[];
};

export default function FriendsSection(props: Props) {
	const {
		show,
		toggle,
		name,
		setName,
		email,
		setEmail,
		phone,
		setPhone,
		errors,
		validateField,
		onEnter,
		add,
		remove,
		friends,
	} = props;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-white text-sm font-urbanist">
					Add friends (optional)
				</span>
				<button
					onClick={toggle}
					className="text-purple-400 hover:text-purple-300 transition-colors"
				>
					{show ? (
						<Minus className="w-4 h-4" />
					) : (
						<Plus className="w-4 h-4" />
					)}
				</button>
			</div>

			{show && (
				<div className="space-y-2">
					<div className="space-y-2">
						<div>
							<Input
								type="text"
								placeholder="Enter friend's name"
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									validateField("name", e.target.value);
								}}
								className={`bg-gray-800 text-white text-sm px-3 py-2 border-purple-500/50 focus:border-purple-500 ${
									errors.name ? "border-red-500" : ""
								}`}
							/>
							{errors.name && (
								<p className="text-red-400 text-xs mt-1">
									{errors.name}
								</p>
							)}
						</div>

						<div>
							<Input
								type="email"
								placeholder="Enter friend's email"
								value={email}
								onChange={(e) => {
									setEmail(e.target.value);
									validateField("email", e.target.value);
								}}
								className={`bg-gray-800 text-white text-sm px-3 py-2 border-purple-500/50 focus:border-purple-500 ${
									errors.email ? "border-red-500" : ""
								}`}
							/>
							{errors.email && (
								<p className="text-red-400 text-xs mt-1">
									{errors.email}
								</p>
							)}
						</div>

						<div className="flex gap-2">
							<div className="flex-1">
								<Input
									type="tel"
									placeholder="Enter friend's phone"
									value={phone}
									onChange={(e) => {
										setPhone(e.target.value);
										validateField("phone", e.target.value);
									}}
									onKeyDown={onEnter}
									className={`bg-gray-800 text-white text-sm px-3 py-2 border-purple-500/50 focus:border-purple-500 ${
										errors.phone ? "border-red-500" : ""
									}`}
								/>
								{errors.phone && (
									<p className="text-red-400 text-xs mt-1">
										{errors.phone}
									</p>
								)}
							</div>
							<Button
								onClick={add}
								disabled={
									!name.trim() ||
									!email.trim() ||
									!phone.trim() ||
									Object.keys(errors).length > 0
								}
								className="bg-purple-600 hover:bg-purple-700 px-3"
								size="sm"
							>
								<Plus className="w-4 h-4" />
							</Button>
						</div>
					</div>

					{friends.length > 0 && (
						<div className="space-y-1 max-h-32 overflow-y-auto">
							{friends.map((friend, idx) => (
								<div
									key={`friend-${friend.name}-${idx}`}
									className="flex items-center justify-between bg-gray-800/50 px-3 py-2 rounded text-xs"
								>
									<div className="flex flex-col text-white">
										<span className="font-medium">{friend.name}</span>
										<span className="text-gray-300">
											{friend.email}
										</span>
										<span className="text-gray-300">
											{friend.phone}
										</span>
									</div>
									<button
										onClick={() => remove(friend)}
										className="text-red-400 hover:text-red-300 transition-colors ml-2"
									>
										<X className="w-3 h-3" />
									</button>
								</div>
							))}
						</div>
					)}
				</div>
			)}
		</div>
	);
}
