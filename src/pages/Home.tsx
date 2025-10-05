import React from 'react';
import { Link } from 'react-router-dom';
import { Vote, ShieldCheck, BarChart3, UserSquare2, History } from 'lucide-react';
import { useBlockchain } from '../context/BlockchainContext';

const Home: React.FC = () => {
  const { currentElection, candidates, blockchain } = useBlockchain();
  
  const isElectionActive = currentElection?.isActive;
  const totalVotes = blockchain.getTotalVotes();
  const totalCandidates = candidates.length;
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Secure College Elections with Blockchain
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Cast your vote with confidence in a transparent, secure, and immutable election system powered by blockchain technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              {isElectionActive ? (
                <>
                  <Link to="/voter-dashboard" className="bg-white text-blue-700 font-medium py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300 flex items-center justify-center">
                    <Vote className="mr-2" size={20} />
                    Cast Your Vote
                  </Link>
                  <Link to="/candidate-registration" className="bg-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-900 transition duration-300 flex items-center justify-center">
                    <UserSquare2 className="mr-2" size={20} />
                    Register as Candidate
                  </Link>
                </>
              ) : (
                <div className="bg-orange-500 text-white font-medium py-3 px-6 rounded-lg shadow-md">
                  Election is currently inactive
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Election Details Section */}
      {currentElection && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentElection.title}</h2>
              <p className="text-gray-600 mb-6">{currentElection.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <History className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Timeline</h3>
                    <p className="text-gray-600 text-sm">
                      {currentElection.startDate.toLocaleDateString()} - {currentElection.endDate.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <UserSquare2 className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Candidates</h3>
                    <p className="text-gray-600 text-sm">{totalCandidates} registered candidates</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-3 rounded-full mr-4">
                    <Vote className="text-purple-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Votes Cast</h3>
                    <p className="text-gray-600 text-sm">{totalVotes} total votes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose SecureVote</h2>
            <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
              Our blockchain-based voting system offers unparalleled security and transparency for college elections.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="text-blue-600 mb-4">
                <ShieldCheck size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Secure & Immutable</h3>
              <p className="text-gray-600">
                Once a vote is recorded on the blockchain, it cannot be altered or deleted, ensuring the integrity of each vote.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="text-purple-600 mb-4">
                <Vote size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Transparent Voting</h3>
              <p className="text-gray-600">
                Every vote transaction is publicly verifiable while maintaining voter anonymity, ensuring complete transparency.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="text-green-600 mb-4">
                <BarChart3 size={40} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Real-time Results</h3>
              <p className="text-gray-600">
                View election results in real-time as votes are tallied, with detailed analytics and visualizations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-700 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Participate?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join the future of secure voting. Register as a candidate or cast your vote securely using our blockchain platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/voter-dashboard" className="bg-white text-blue-700 font-medium py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition duration-300">
              Cast Your Vote
            </Link>
            <Link to="/candidate-registration" className="bg-blue-800 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:bg-blue-900 transition duration-300">
              Register as Candidate
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;