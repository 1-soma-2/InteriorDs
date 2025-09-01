import { Link } from 'react-router-dom';
import { Palette, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <Palette className="w-7 h-7 text-primary-600" />
              <span className="text-xl font-semibold">MoodPalette</span>
            </Link>
            <p className="mt-4 text-neutral-600">
              Create stunning interior design moodboards with our intuitive drag-and-drop tool.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-500 hover:text-primary-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/inspiration" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Inspiration
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/blog" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/tutorials" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link to="/support" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-2">
              <li className="text-neutral-600">
                1234 Design Avenue, Suite 567
              </li>
              <li className="text-neutral-600">
                New York, NY 10001
              </li>
              <li>
                <a href="mailto:info@moodpalette.com" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  info@moodpalette.com
                </a>
              </li>
              <li>
                <a href="tel:+1234567890" className="text-neutral-600 hover:text-primary-600 transition-colors">
                  (123) 456-7890
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-neutral-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">
            © {new Date().getFullYear()} MoodPalette. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link to="/privacy" className="text-neutral-500 text-sm hover:text-primary-600 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-neutral-500 text-sm hover:text-primary-600 transition-colors">
              Terms of Service
            </Link>
            <Link to="/cookies" className="text-neutral-500 text-sm hover:text-primary-600 transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;