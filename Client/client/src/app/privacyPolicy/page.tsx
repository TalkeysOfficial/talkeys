"use client";
import React from "react";
import { urbanist } from "@/components/fonts/fonts";
import { motion } from "framer-motion";

function PrivacyPolicyPage() {
  return (
    <motion.div
      className={`min-h-screen flex flex-col text-white p-6 sm:p-24 max-sm:pt-32 lg:p-40 ${urbanist.className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.05 }}
    >
      <h1 className="font-bold text-3xl sm:text-4xl text-center mb-20">
        Privacy Policy
      </h1>

      <div className="flex flex-col gap-6">
        <p>
          At Talkeys, we value your privacy and are committed to protecting your personal data. We collect information,
          such as your name, email address, contact number, and other relevant details when you sign up, register for
          events, or interact with our platform. This information is solely used to provide services such as event
          registration, ticketing, user support, and to enhance your overall experience on Talkeys.
        </p>

        <p>
          We do not sell or rent your personal data to third parties. However, your information may be shared with
          trusted partners or event organizers strictly for event-related purposes. To improve our website's functionality,
          we may use cookies and analytics tools, which help us understand user behavior and enhance platform
          performance.
        </p>

        <p>
          Talkeys follows industry-standard security protocols to safeguard your information against unauthorized
          access or misuse. As a user, you have the right to access, update, or request the deletion of your personal data
          at any time by contacting our support team.
        </p>

        <p>
          We retain your personal information for as long as it is required to deliver our services and comply with legal
          obligations. This privacy policy may be updated periodically, and we will notify users of significant changes
          through our platform or via email.
        </p>

        <p>
          If you have any questions or concerns regarding our privacy policy, please feel free to contact us at:<br></br>
          talkeys11@gmail.com
        </p>

      </div>
    </motion.div>
  );
}

export default PrivacyPolicyPage;