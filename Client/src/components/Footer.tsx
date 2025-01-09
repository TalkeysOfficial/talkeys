import React from 'react'
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa'
import Image from 'next/image'
import image from "../public/images/Logo.png"
export default function Footer() {
  return (
    <footer className="bg-transparent grid place-items-center bottom-0 w-full text-white py-8 pl-20">
      <div className="container flex w-full md:flex-row justify-between items-center">
        <div className="mb-6 md:mb-0 flex-1">
          <h3 className="text-lg font-bold mb-2">Team Talkeys</h3>
          <p className="text-sm">Address: Tikam University, Patalia, Punjab, India</p>
          <p className="text-sm">Call Us: +91 98765 43210</p>
          <p className="text-sm">info@tikam.com</p>
        </div>

        <div className="flex flex-col flex-1 items-center mb-6 md:mb-0 ">
          <div className="mb-4">
            <Image src={image} alt="Logo" width={100} height={100} />
          </div>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400"><FaFacebookF size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaInstagram size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaLinkedinIn size={20} /></a>
            <a href="#" className="hover:text-gray-400"><FaYoutube size={20} /></a>
          </div>
        </div>

        <div className="text-sm flex-1 items-center">
          <ul className="space-y-2 flex flex-col text-center">
            <li><a href="#" className="hover:underline">Contact us</a></li>
            <li><a href="#" className="hover:underline">About us</a></li>
            <li><a href="#" className="hover:underline">Privacy Policy</a></li>
            <li><a href="#" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-8 text-xs">
        © 2024 Tikam. All rights reserved.
      </div>
    </footer>
  )
}