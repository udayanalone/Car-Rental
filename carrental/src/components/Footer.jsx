import React from 'react'
import { assets } from '../assets/assets';

const Footer = () => {
    const linkSections = [
        {
            title: "Quick Links",
            links: ["Home", "Best Sellers", "Offers & Deals", "Contact Us", "FAQs"]
        },
        {
            title: "Need Help?",
            links: ["Delivery Information", "Return & Refund Policy", "Payment Methods", "Track your Order", "Contact Us"]
        },
        {
            title: "Follow Us",
            links: ["Instagram", "Twitter", "Facebook", "YouTube"]
        }
    ];

    return (
        <footer className="px-6 md:px-16 lg:px-24 xl:px-32 bg-gray-100">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-600">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="Car Rental Logo" />
                    <p className="max-w-[410px] mt-6">
                        Car Rental offers reliable and affordable vehicles for your travel needs. Book online and enjoy a smooth ride, whether for business or leisure.
                    </p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    {linkSections.map((section, index) => (
                        <div key={index}>
                            <h3 className="font-semibold text-base text-gray-900 md:mb-5 mb-2">{section.title}</h3>
                            <ul className="text-sm space-y-1">
                                {section.links.map((link, i) => (
                                    <li key={i}>
                                        <a href="#" className="hover:underline transition">{link}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
            <p className="py-4 text-center text-sm md:text-base text-gray-500/80">
                &copy; {new Date().getFullYear()} Car Rental. All rights reserved.
            </p>
        </footer>
    );
};

export default Footer
