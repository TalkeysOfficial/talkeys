import {
	Database,
	FileText,
	Shield,
	Users,
	Clock,
	Eye,
	Lock,
	AlertTriangle,
	Mail,
} from "lucide-react";

export const sections = [
	{
		id: "information-collection",
		title: "1. Information Collection",
		icon: <Database className="h-5 w-5" />,
		description: "What data we collect and how",
		content: (
			<p>
				At Talkeys, we collect information such as your name, email address,
				contact number, and other relevant details when you sign up,
				register for events, or interact with our platform. This information
				is solely used to provide services such as event registration,
				ticketing, user support, and to enhance your overall experience on
				Talkeys.
			</p>
		),
	},
	{
		id: "information-usage",
		title: "2. Information Usage",
		icon: <FileText className="h-5 w-5" />,
		description: "How we use your information",
		content: (
			<p>
				We do not sell or rent your personal data to third parties. However,
				your information may be shared with trusted partners or event
				organizers strictly for event-related purposes. To improve our
				website's functionality, we may use cookies and analytics tools,
				which help us understand user behavior and enhance platform
				performance.
			</p>
		),
	},
	{
		id: "data-security",
		title: "3. Data Security",
		icon: <Shield className="h-5 w-5" />,
		description: "How we protect your information",
		content: (
			<p>
				Talkeys follows industry-standard security protocols to safeguard
				your information against unauthorized access or misuse. We implement
				appropriate data collection, storage, and processing practices and
				security measures to protect against unauthorized access,
				alteration, disclosure, or destruction of your personal information.
			</p>
		),
	},
	{
		id: "user-rights",
		title: "4. User Rights",
		icon: <Users className="h-5 w-5" />,
		description: "Your rights regarding your data",
		content: (
			<p>
				As a user, you have the right to access, update, or request the
				deletion of your personal data at any time by contacting our support
				team. You can also choose to opt out of certain communications or
				data collection practices by adjusting your account settings or
				contacting us directly.
			</p>
		),
	},
	{
		id: "data-retention",
		title: "5. Data Retention",
		icon: <Clock className="h-5 w-5" />,
		description: "How long we keep your information",
		content: (
			<p>
				We retain your personal information for as long as it is required to
				deliver our services and comply with legal obligations. Once the
				purpose for which the information was collected has been fulfilled,
				we will securely delete or anonymize your data unless retention is
				necessary for legal or regulatory reasons.
			</p>
		),
	},
	{
		id: "cookies",
		title: "6. Cookies & Tracking",
		icon: <Eye className="h-5 w-5" />,
		description: "Our use of cookies and similar technologies",
		content: (
			<p>
				Our website uses cookies and similar tracking technologies to
				enhance your browsing experience, analyze site traffic, and
				personalize content. You can control cookie settings through your
				browser preferences, although disabling certain cookies may limit
				your ability to use some features of our platform.
			</p>
		),
	},
	{
		id: "third-parties",
		title: "7. Third-Party Services",
		icon: <Lock className="h-5 w-5" />,
		description: "How we work with third parties",
		content: (
			<p>
				We may employ third-party companies and individuals to facilitate
				our service, provide the service on our behalf, perform
				service-related tasks, or assist us in analyzing how our service is
				used. These third parties have access to your personal information
				only to perform these tasks on our behalf and are obligated not to
				disclose or use it for any other purpose.
			</p>
		),
	},
	{
		id: "policy-changes",
		title: "8. Policy Changes",
		icon: <AlertTriangle className="h-5 w-5" />,
		description: "How we handle policy updates",
		content: (
			<p>
				This privacy policy may be updated periodically, and we will notify
				users of significant changes through our platform or via email. We
				encourage you to review this policy regularly to stay informed about
				how we are protecting your information.
			</p>
		),
	},
	{
		id: "contact",
		title: "9. Contact Us",
		icon: <Mail className="h-5 w-5" />,
		description: "How to reach our support team",
		content: (
			<p>
				If you have any questions or concerns regarding our privacy policy,
				please feel free to contact us at: talkeys11@gmail.com
			</p>
		),
	},
];
