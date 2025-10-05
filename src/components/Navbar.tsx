import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Vote, UserSquare2, BarChart3, Shield, Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Vote size={28} />
              <span className="font-bold text-xl">SecureVote</span>
            </Link>
          </div>
          
          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/candidate-registration" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center">
              <UserSquare2 size={16} className="mr-1" />
              Candidates
            </Link>
            <Link to="/voter-dashboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center">
              <Vote size={16} className="mr-1" />
              Vote
            </Link>
            <Link to="/results" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors flex items-center">
              <BarChart3 size={16} className="mr-1" />
              Results
            </Link>
            <Link to="/admin" className="px-3 py-2 rounded-md text-sm font-medium bg-blue-800 hover:bg-blue-900 transition-colors flex items-center">
              <Shield size={16} className="mr-1" />
              Admin
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/candidate-registration"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Candidates
            </Link>
            <Link
              to="/voter-dashboard"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Vote
            </Link>
            <Link
              to="/results"
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-blue-600 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Results
            </Link>
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium bg-blue-800 hover:bg-blue-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;