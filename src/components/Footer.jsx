import React from 'react';
import { Instagram, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact" className="bg-white border-t border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6">
        <div>
          <div className="text-xl font-bold text-blue-600">CarEase</div>
          <p className="text-slate-600 mt-2">Comfortable, affordable, reliable rides — anytime.</p>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">Contact</h4>
          <ul className="mt-2 text-slate-600 space-y-1">
            <li>Email: support@carease.com</li>
            <li>Phone: +1 (555) 012-3456</li>
            <li>Location: San Francisco, CA</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">Follow us</h4>
          <div className="mt-3 flex items-center gap-3 text-slate-600">
            <a href="#" aria-label="Instagram" className="hover:text-blue-600"><Instagram size={20} /></a>
            <a href="#" aria-label="Facebook" className="hover:text-blue-600"><Facebook size={20} /></a>
            <a href="#" aria-label="X" className="hover:text-blue-600"><Twitter size={20} /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-slate-500 text-sm py-4 border-t border-slate-200">
        © 2025 CarEase
      </div>
    </footer>
  );
};

export default Footer;
