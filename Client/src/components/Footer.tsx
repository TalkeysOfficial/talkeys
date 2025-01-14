import React from "react";
import {
	FaFacebookF,
	FaInstagram,
	FaLinkedinIn,
	FaYoutube,
} from "react-icons/fa";
import Image from "next/image";
import image from "../public/images/Logo.png";
import Link from "next/link";

export default function Footer() {
	return (
		<footer className="bg-transparent w-full text-white py-8 px-4 sm:px-6 lg:px-8">
			<div className="container mx-auto">
				<div className="flex flex-col lg:flex-row justify-between items-center lg:items-start space-y-8 lg:space-y-0">
					<div className="w-full lg:w-1/3 text-center lg:text-left">
						<h3 className="text-lg font-bold mb-2">Team Talkeys</h3>
						<p className="text-sm">
							Address: Tikam University, Patalia, Punjab, India
						</p>
						<p className="text-sm">Call Us: +91 98765 43210</p>
						<p className="text-sm">info@tikam.com</p>
					</div>

					<div className="w-full lg:w-1/3 flex flex-col items-center">
						<div className="mb-4">
							<Image
								src={image}
								alt="Logo"
								width={100}
								height={100}
							/>
						</div>
						<div className="flex space-x-4">
							<Link
								href="#"
								className="hover:text-gray-400 transition-colors duration-200"
								aria-label="Facebook"
							>
								<FaFacebookF size={20} />
							</Link>
							<Link
								href="#"
								className="hover:text-gray-400 transition-colors duration-200"
								aria-label="Instagram"
							>
								<FaInstagram size={20} />
							</Link>
							<Link
								href="#"
								className="hover:text-gray-400 transition-colors duration-200"
								aria-label="LinkedIn"
							>
								<FaLinkedinIn size={20} />
							</Link>
							<Link
								href="#"
								className="hover:text-gray-400 transition-colors duration-200"
								aria-label="YouTube"
							>
								<FaYoutube size={20} />
							</Link>
						</div>
					</div>

					<div className="w-full lg:w-1/3 text-center lg:text-right">
						<ul className="space-y-2">
							<li>
								<Link
									href="#"
									className="hover:underline transition-colors duration-200"
								>
									Contact us
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="hover:underline transition-colors duration-200"
								>
									About us
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="hover:underline transition-colors duration-200"
								>
									Privacy Policy
								</Link>
							</li>
							<li>
								<Link
									href="#"
									className="hover:underline transition-colors duration-200"
								>
									Terms of Service
								</Link>
							</li>
						</ul>
					</div>
				</div>
			</div>
			<div className="text-center mt-8 text-xs">
				© 2024 Tikam. All rights reserved.
			</div>
		</footer>
	);
}
