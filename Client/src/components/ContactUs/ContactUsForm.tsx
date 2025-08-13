import { motion } from "framer-motion";
import {
	Card,
	CardTitle,
	CardDescription,
	CardHeader,
	CardContent,
} from "@/components/ui/card";
import {
	Form,
	FormField,
	FormControl,
	FormLabel,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { formSchema } from "@/components/ContactUs/formvalidator";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertCircle, Send } from "lucide-react";

const form = useForm<z.infer<typeof formSchema>>({
	resolver: zodResolver(formSchema),
	defaultValues: {
		name: "",
		email: "",
		subject: "",
		message: "",
	},
});

export default function ContactUsForm({
	onSubmit,
	isSubmitting,
	error,
}: {
	onSubmit: (data: z.infer<typeof formSchema>) => void;
	isSubmitting: boolean;
	error: string | null;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.5 }}
		>
			<Card className="bg-gradient-to-br from-gray-900 to-purple-950/30 border-purple-500/20">
				<CardHeader>
					<CardTitle>Send Us a Message</CardTitle>
					<CardDescription className="text-gray-400">
						Fill out the form below to get in touch with our team.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-6"
						>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Your Name</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your name"
													{...field}
													className="bg-gray-800 border-gray-700 focus:border-purple-500"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Your Email</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter your email"
													{...field}
													className="bg-gray-800 border-gray-700 focus:border-purple-500"
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="subject"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Subject</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter message subject"
												{...field}
												className="bg-gray-800 border-gray-700 focus:border-purple-500"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Your Message</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Type your message here"
												{...field}
												className="bg-gray-800 border-gray-700 focus:border-purple-500 min-h-[150px]"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							{error && (
								<div className="bg-red-500/20 border border-red-500/50 rounded-md p-3 flex items-center gap-2">
									<AlertCircle className="h-5 w-5 text-red-500" />
									<p className="text-red-500 text-sm">{error}</p>
								</div>
							)}

							<motion.div
								whileHover={{ scale: 1.03 }}
								whileTap={{ scale: 0.97 }}
							>
								<Button
									type="submit"
									className="w-full bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<motion.div
												animate={{ rotate: 360 }}
												transition={{
													duration: 1,
													repeat: Number.POSITIVE_INFINITY,
													ease: "linear",
												}}
												className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
											/>
											<span>Sending...</span>
										</>
									) : (
										<>
											<Send className="h-4 w-4" />
											<span>Send Message</span>
										</>
									)}
								</Button>
							</motion.div>
						</form>
					</Form>
				</CardContent>
			</Card>
		</motion.div>
	);
}
