import React from 'react';
import Link from 'next/link';

export function AppFooter() {
  return (
    <footer className="bg-surface border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 2L15 21H9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M17 8l4 7h5a5 5 0 015 5v11a5 5 0 01-5 5h-5l-4 7H7a5 5 0 01-5-5V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><circle cx="3" cy="12" r="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-text-primary">DwaaDekho</h3>
                <p className="text-xs text-text-secondary">Smart Medicine Discovery</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
              Connecting patients with trusted pharmacies, verified doctors, and quality medicines at affordable prices.
            </p>
            <div className="flex gap-3 mt-4">
              {/* Social links would go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Quick Links</h3>
            <ul className="space-y-2">
              {[
                'Home', 'Search Medicines', 'Find Pharmacies', 'Prescription', 'Consult Doctor', 'Safety Information', 'Contact', 'FAQ', 'Privacy Policy', 'Terms of Service',
              ].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-text-secondary hover:text-brand-600 hover:font-medium transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Resources</h3>
            <ul className="space-y-2">
              {[
                'Jan Aushadhi Kendras', 'Generic Medicines', 'Medicine Safety', 'DPDP Act', 'CDSCO Guidelines', 'How It Works', 'For Pharmacies', 'For Doctors', 'Blog', 'Careers',
              ].map((item) => (
                <li key={item}>
                  <Link href={`/resources/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-text-secondary hover:text-brand-600 hover:font-medium transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">Support</h3>
            <ul className="space-y-2">
              {[
                'Help Center', 'Prescription Support', 'Technical Support', 'Partner with Us', 'Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy', 'Grievance Redressal',
              ].map((item) => (
                <li key={item}>
                  <Link href={`/support/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-sm text-text-secondary hover:text-brand-600 hover:font-medium transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-3">
          <span className="text-xs text-text-secondary">© {new Date().getFullYear()} DwaaDekho. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            <span>🔒 HTTPS Protected</span>
            <span>🛡️ Privacy Compliance</span>
            <span>🏥 Medical Services</span>
          </div>
        </div>
      </div>
    </footer>
  );
}