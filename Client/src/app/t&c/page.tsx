"use client";
import React from "react";
import { urbanist } from "@/components/fonts/fonts";
import { motion } from "framer-motion";

function TermsPage() {
  return (
    <motion.div
      className={`min-h-screen flex flex-col text-white p-6 sm:p-24 max-sm:pt-32 lg:p-40 ${urbanist.className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.05 }}
    >
      <h1 className="font-bold text-3xl sm:text-4xl text-center mb-6">
        Terms of Service
      </h1>

      <div className="flex flex-col gap-6">
        <p>
          Welcome to Talkeys! Before you dive in, it's important to understand the terms and conditions under which we operate. By using Talkeys, 
          you agree to the following terms. Let's work together to make this platform a great space for everyone.
        </p>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">1. Introduction</h2>
          <p>
            Talkeys is a platform that connects people through communities and events. Our mission is to help users discover, engage, and participate
            in various communities while offering a space for event creators to host their events with a global audience.
            These Terms of Service govern your use of our platform. By using Talkeys, you agree to comply with these terms. If you don't agree, please
            refrain from using our services.
          </p>
          <p>
            Note: Talkeys is solely a ticketing platform. We do not organize or manage events listed on our platform.
          </p>

          <h2 className="text-xl font-bold">2. Eligibility</h2>
          <p>
            To use Talkeys, you must be at least 13 years old (or older, depending on your local laws). By using the platform, you represent that you are
            legally permitted to use Talkeys and are responsible for complying with all applicable laws and regulations.
          </p>
          <p>
            To access certain features of Talkeys, you'll need to create an account. When you sign up, please provide accurate information and keep 
            your account secure. You are responsible for all activity that happens through your account, so please choose a strong password and keep 
            it private.
          </p>
          <p>
            We reserve the right to suspend or terminate your account if we detect any breach of these terms.
          </p>

          <h2 className="text-xl font-bold">3. Community Guidelines</h2>
          <p>
            We believe in fostering a positive and respectful environment for all users. As such, when participating in community chats, forums, or 
            events, please abide by the following guidelines:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Respect others. No harassment, hate speech, or abusive behavior will be tolerated.</li>
            <li>Keep it legal. Don't share any illegal content or engage in illegal activities.</li>
            <li>No spamming. Refrain from unsolicited promotions, advertising, or irrelevant content.</li>
            <li>Any violation of these guidelines may result in a suspension or ban from Talkeys.</li>
          </ul>

          <h2 className="text-xl font-bold">4. User-Generated Content</h2>
          <p>
            At Talkeys, you have the opportunity to create and share content (e.g., messages, event listings, posts). By doing so, you retain ownership
            of your content, but you also grant a license to use, display, and promote it on our platform.
            We are not responsible for the content shared by users, but we reserve the right to remove any content that violates these terms or our
            community guidelines.
          </p>

          <h2 className="text-xl font-bold">5. Event Hosting</h2>
          <p>
            One of the most exciting features of Talkeys is the ability to create and host events. As an event host, you are responsible for the accuracy
            and content of your event listing. Please ensure your event follows our guidelines and complies with all applicable laws.
          </p>
          <p>
            Important: Talkeys does not promote alcohol consumption or endorse any specific activities at events. We solely provide a ticketing
            platform to connect users with events.
          </p>

          <h2 className="text-xl font-bold">6. Intellectual Property</h2>
          <p>
            All content, design, branding, and features on Talkeys are the intellectual property of Talkeys or our licensors. You may not copy,
            reproduce, or distribute any part of Talkeys without our permission.<br></br>
            That said, any content you create on Talkeys remains yours, and we're excited to see what you build!
          </p>

          <h2 className="text-xl font-bold">7. Privacy</h2>
          <p>
            Your privacy is incredibly important to us. Please refer to our Privacy Policy for details on how we collect, store, and use your personal data.
          </p>

          <h2 className="text-xl font-bold">8. Prohibited Activities</h2>
          <p>
            We are committed to creating a safe, enjoyable experience for everyone. Certain behaviors are strictly prohibited on Talkeys, including:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Engaging in unlawful activities or promoting illegal content.</li>
            <li>Using the platform for fraudulent purposes.</li>
            <li>Sharing offensive, obscene, or otherwise inappropriate content.</li>
            <li>Impersonating others or misrepresenting your identity.</li>
          </ul>
          <p>
            Failure to comply may result in account suspension or termination.
          </p>

          <h2 className="text-xl font-bold">9. Liability Disclaimer</h2>
          <p>
            While we strive to provide the best possible experience on Talkeys, we do not guarantee that everything will always function perfectly. We
            are not responsible for:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Downtime, interruptions, or data loss.</li>
            <li>Any issues arising from user-generated content or third-party events.</li>
            <li>The success or outcome of any event hosted on our platform.</li>
          </ul>
          <p>
            You use Talkeys at your own risk.
          </p>

          <h2 className="text-xl font-bold">10. Termination of Services</h2>
          <p>
            You may close your account at any time. We also reserve the right to terminate or suspend accounts that violate our terms or pose risks to
            the community. We will notify you if your account is at risk of termination unless you've engaged in serious violations that require
            immediate action.
          </p>

          <h2 className="text-xl font-bold">11. Changes to the Terms</h2>
          <p>
            We may update these terms periodically. If we make changes, we will notify you through the platform or via email. Your continued use of
            Talkeys following any changes means that you accept the new terms.
          </p>

          <h2 className="text-xl font-bold">12. Contact Us</h2>
          <p>
            If you have any questions about these Terms of Service, please contact us at:
            Talkeys@gmail.com
          </p>
        </section>

        <p className="mt-6">
          Thank you for being a part of the Talkeys community. We can't wait to see what you create, and we're thrilled to have you on board!
        </p>
        <p>
          Sincerely,<br />
          Team Talkeys
        </p>
      </div>
    </motion.div>
  );
}

export default TermsPage;