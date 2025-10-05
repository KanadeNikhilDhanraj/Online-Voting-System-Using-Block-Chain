import React from 'react';
import { Vote, Github, Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Vote size={24} />
              <span className="font-bold text-xl">SecureVote</span>
            </div>
            <p className="text-gray-300 text-sm">
              A secure blockchain-based voting platform for college elections, ensuring transparency, security, and trust in the democratic process.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
              </li>
              <li>
                <a href="/candidate-registration" className="hover:text-blue-400 transition-colors">Candidates</a>
              </li>
              <li>
                <a href="/voter-dashboard" className="hover:text-blue-400 transition-colors">Vote</a>
              </li>
              <li>
                <a href="/results" className="hover:text-blue-400 transition-colors">Results</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">About</h3>
            <p className="text-gray-300 text-sm mb-4">
              SecureVote leverages blockchain technology to create a trustless, transparent voting system that ensures vote integrity and prevents fraud.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition-colors">
                <Shield size={20} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-300 text-sm">
          <p>&copy; {new Date().getFullYear()} SecureVote. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;