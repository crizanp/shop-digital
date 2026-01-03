import React from 'react';

const Footer = () => {
  return (
    <>
      {/* Footer */}
      <footer className="bg-black text-gray-300 py-12 px-4" role="contentinfo">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <nav>
              <h4 className="text-white font-semibold mb-4">Popular Categories</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/category/video-editing" className="hover:text-white transition-colors">
                    Video Editing
                  </a>
                </li>
                <li>
                  <a href="/category/website-development" className="hover:text-white transition-colors">
                    Web Development
                  </a>
                </li>
                <li>
                  <a href="/category/graphic-design" className="hover:text-white transition-colors">
                    Graphic Design
                  </a>
                </li>
                <li>
                  <a href="/plugins" className="hover:text-white transition-colors">
                    WordPress Plugins
                  </a>
                </li>
              </ul>
            </nav>

            <nav>
              <h4 className="text-white font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/help" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="/faq" className="hover:text-white transition-colors">FAQs</a></li>
                <li><a href="/shipping" className="hover:text-white transition-colors">Shipping Info</a></li>
              </ul>
            </nav>

            <nav>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="/careers" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="/blog" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="/partnership" className="hover:text-white transition-colors">Partnership</a></li>
              </ul>
            </nav>

            <nav>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</a></li>
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
                  <a href="https://facebook.com/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">Facebook</a>
                  <a href="https://twitter.com/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">Twitter</a>
                  <a href="https://linkedin.com/company/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">LinkedIn</a>
                  <a href="https://instagram.com/foxbeeptech" target="_blank" rel="noopener noreferrer" className="hover:text-white">Instagram</a>
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
