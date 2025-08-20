import { useState } from 'react';
import { Linkedin, Twitter, Facebook, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import Image from "next/legacy/image";

export default function Footer() {
    // State for mobile menu toggling
    const [menuOpen, setMenuOpen] = useState({
        company: false,
        resources: false,
        services: false,
        insights: false,
        locations: false
    });

    const toggleMenu = (section) => {
        setMenuOpen({
            ...menuOpen,
            [section]: !menuOpen[section]
        });
    };

    return (
        <footer className="bg-white text-gray-900 py-8 px-4 md:px-8 border-t border-gray-200">
            <div className="max-w-7xl mx-auto">
                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    {/* Contact */}
                    <div className="col-span-1 mb-6 md:mb-0">
                        <div className="flex items-center mb-4">
                            <div className="w-2 h-2 rounded-full bg-purple-600 mr-2"></div>
                            <h3 className="text-gray-600 text-sm">Contact</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-lg font-bold text-gray-900">+977-9810570201</p>
                            <p className="text-lg font-bold text-gray-900">info@foxbeep.com</p>
                        </div>
                    </div>

                    {/* Logo & Copyright */}
                    <div className="col-span-1 flex flex-col items-center text-center mb-6 md:mb-0">
                        <div className="mb-2 relative w-34 h-14">
                            <Image
                                src="/images/logo_black.png"
                                alt="Logo"
                                width={300}
                                height={100}
                            />
                        </div>
                        <p className="text-gray-600 text-xs">© 2025 Foxbeep. All Rights Reserved</p>
                    </div>

                    {/* Social Links & Legal */}
                    <div className="col-span-1">
                        <div className="flex justify-center md:justify-end space-x-4 mb-4">
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                                <Linkedin size={20} />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
                                <Globe size={20} />
                            </a>
                        </div>
                        <div className="flex justify-center md:justify-end text-gray-600 text-xs">
                            <a href="#" className="hover:text-purple-600 transition-colors">Privacy Policy</a>
                            <span className="mx-2">|</span>
                            <a href="#" className="hover:text-purple-600 transition-colors">Terms & Conditions</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}