import { Fragment, type ReactNode } from "react";

import { cn } from "@/lib/utils";

type EventDescriptionProps = {
	text?: string | null;
	fallback: string;
	className?: string;
	paragraphClassName?: string;
};

const inlineMarkdownPattern = /(\*\*[^*\n]+?\*\*|\*[^*\n]+?\*)/g;

function renderInlineMarkdown(text: string): ReactNode[] {
	return text.split(inlineMarkdownPattern).map((part, index) => {
		if (!part) return null;

		if (part.startsWith("**") && part.endsWith("**")) {
			return (
				<strong key={`${part}-${index}`} className="font-semibold text-white">
					{part.slice(2, -2)}
				</strong>
			);
		}

		if (part.startsWith("*") && part.endsWith("*")) {
			return (
				<em key={`${part}-${index}`} className="italic">
					{part.slice(1, -1)}
				</em>
			);
		}

		return <Fragment key={`${part}-${index}`}>{part}</Fragment>;
	});
}

export default function EventDescription({
	text,
	fallback,
	className,
	paragraphClassName,
}: EventDescriptionProps) {
	const content = (text || "").trim() || fallback;
	const paragraphs = content.replace(/\r\n?/g, "\n").split(/\n{2,}/);

	return (
		<div className={cn("space-y-3", className)}>
			{paragraphs.map((paragraph, paragraphIndex) => {
				const lines = paragraph.split("\n");

				return (
					<p
						key={`${paragraph}-${paragraphIndex}`}
						className={cn("break-words", paragraphClassName)}
					>
						{lines.map((line, lineIndex) => (
							<Fragment key={`${line}-${lineIndex}`}>
								{lineIndex > 0 ? <br /> : null}
								{renderInlineMarkdown(line)}
							</Fragment>
						))}
					</p>
				);
			})}
		</div>
	);
}
