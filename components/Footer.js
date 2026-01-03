import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto px-2 lg:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <nav>
              <h4 className="text-white font-semibold mb-4">Popular Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/category/video-editing" className="hover:text-white transition-colors">
                    Video Editing
                  </Link>
                </li>
                <li>
                  <Link href="/category/website-development" className="hover:text-white transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/category/graphic-design" className="hover:text-white transition-colors">
                    Graphic Design
                  </Link>
                </li>
                <li>
                  <Link href="/plugins" className="hover:text-white transition-colors">
                    WordPress Plugins
                  </Link>
                </li>
              </ul>
            </nav>

            <nav>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
                <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Info</Link></li>
              </ul>
            </nav>

            <nav>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="/partnership" className="hover:text-white transition-colors">Partnership</Link></li>
              </ul>
            </nav>

            <nav>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </nav>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              <div>
                <h3 className="text-white font-semibold mb-2">Contact Information</h3>
                <p className="text-sm">
                  Email:{' '}
                  <a href="mailto:support@foxbeep.com" className="hover:text-white">
                    support@foxbeep.com
                  </a>
                </p>
                <p className="text-sm">
                  Website:{' '}
                  <a
                    href="https://foxbeep.com.np"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white"
                  >
                    foxbeep.com.np
                  </a>
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-2">Follow Us</h3>
                <div className="flex gap-4 text-sm">
                  <Link href="https://facebook.com/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</Link>
                  <Link href="https://twitter.com/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</Link>
                  <Link href="https://linkedin.com/company/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</Link>
                  <Link href="https://instagram.com/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</Link>
                </div>
              </div>
            </div>

            <div className="text-center text-sm border-t border-gray-800 pt-6">
              <p>&copy; 2025 Foxbeep Digital Solutions. All rights reserved.</p>
              <p className="text-xs text-gray-400 mt-2">
                Headquarters: Bhaktapur, Nepal | Global Service Provider
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
