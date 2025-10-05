import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Vote, Check, AlertCircle, Shield, Eye, EyeOff, Clock } from 'lucide-react';
import { useBlockchain } from '../context/BlockchainContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface VoterCredentials {
  id: string;
  name: string;
  studentId: string;
  department: string;
}

const defaultImage = 'https://images.pexels.com/photos/7709020/pexels-photo-7709020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const VoterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { candidates, voters, castVote, registerVoter, hasVoted, currentElection, blockchain } = useBlockchain();
  
  const [isRegistered, setIsRegistered] = useState(false);
  const [voterCredentials, setVoterCredentials] = useState<VoterCredentials>({
    id: '',
    name: '',
    studentId: '',
    department: ''
  });
  
  const [currentVoter, setCurrentVoter] = useState<VoterCredentials | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [registrationError, setRegistrationError] = useState({
    name: '',
    studentId: '',
    department: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const departments = [
    'Computer Science',
    'Engineering',
    'Business',
    'Arts',
    'Sciences',
    'Law',
    'Medicine',
    'Education'
  ];
  
  // Check if user has previously registered or voted using localStorage
  useEffect(() => {
    const savedVoter = localStorage.getItem('currentVoter');
    if (savedVoter) {
      const voter = JSON.parse(savedVoter);
      setCurrentVoter(voter);
      setIsRegistered(true);
      
      // Check if voter has already voted
      if (hasVoted(voter.id)) {
        setHasUserVoted(true);
      }
    }
  }, [hasVoted]);
  
  const validateRegistrationForm = (): boolean => {
    let isValid = true;
    const newErrors = { ...registrationError };
    
    if (!voterCredentials.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else {
      newErrors.name = '';
    }
    
    if (!voterCredentials.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
      isValid = false;
    } else {
      newErrors.studentId = '';
    }
    
    if (!voterCredentials.department) {
      newErrors.department = 'Department is required';
      isValid = false;
    } else {
      newErrors.department = '';
    }
    
    setRegistrationError(newErrors);
    return isValid;
  };
  
  const handleRegisterVoter = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegistrationForm()) return;
    
    // Generate unique voter ID
    const voterId = `voter-${Date.now()}`;
    const newVoter = {
      id: voterId,
      name: voterCredentials.name,
      studentId: voterCredentials.studentId,
      department: voterCredentials.department,
      hasVoted: false
    };
    
    // Check if voter with this student ID already exists
    const voterExists = voters.some(v => v.studentId === voterCredentials.studentId);
    if (voterExists) {
      toast.error('A voter with this Student ID is already registered.');
      return;
    }
    
    registerVoter(newVoter);
    
    // Save current voter to localStorage
    localStorage.setItem('currentVoter', JSON.stringify({
      id: voterId,
      name: voterCredentials.name,
      studentId: voterCredentials.studentId,
      department: voterCredentials.department
    }));
    
    setCurrentVoter({
      id: voterId,
      name: voterCredentials.name,
      studentId: voterCredentials.studentId,
      department: voterCredentials.department
    });
    
    setIsRegistered(true);
    toast.success('Registration successful! You can now vote.');
  };
  
  const handleCandidateSelect = (candidateId: string) => {
    setSelectedCandidate(candidateId);
    setShowConfirmation(true);
  };
  
  const handleVoteConfirmation = () => {
    if (!currentVoter || !selectedCandidate) return;
    
    setIsVoting(true);
    
    // Simulate blockchain processing time
    setTimeout(() => {
      const success = castVote(currentVoter.id, selectedCandidate);
      
      if (success) {
        setHasUserVoted(true);
        toast.success('Your vote has been cast successfully and recorded on the blockchain!');
      } else {
        toast.error('You have already voted in this election.');
      }
      
      setIsVoting(false);
      setShowConfirmation(false);
    }, 2000);
  };
  
  const cancelVote = () => {
    setShowConfirmation(false);
    setSelectedCandidate(null);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('currentVoter');
    setCurrentVoter(null);
    setIsRegistered(false);
    setHasUserVoted(false);
  };
  
  // Filter candidates by position
  const [selectedPosition, setSelectedPosition] = useState('All');
  const positions = ['All', ...new Set(candidates.map(c => c.position))];
  
  const filteredCandidates = selectedPosition === 'All' 
    ? candidates 
    : candidates.filter(c => c.position === selectedPosition);
  
  // Check if election is active
  if (!currentElection?.isActive) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md mb-6">
          <p className="font-medium">Election Inactive</p>
          <p>Voting is currently closed. Please check back when the election period begins.</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Voter Dashboard</h1>
        {currentElection && (
          <div className="flex justify-center items-center text-gray-600 mb-2">
            <Clock size={18} className="mr-2" />
            <p>
              Election Period: {new Date(currentElection.startDate).toLocaleDateString()} - {new Date(currentElection.endDate).toLocaleDateString()}
            </p>
          </div>
        )}
        <p className="text-gray-600 max-w-3xl mx-auto">
          Cast your vote securely for the {currentElection?.title}. Your vote is encrypted and stored on our blockchain system for maximum security and transparency.
        </p>
      </div>
      
      {/* Blockchain Stats */}
      <div className="mb-8 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-lg shadow-md p-6 animate-fadeIn">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h3 className="text-sm font-medium mb-1">Blockchain Length</h3>
            <p className="text-2xl font-bold">{blockchain.chain.length} Blocks</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h3 className="text-sm font-medium mb-1">Total Votes</h3>
            <p className="text-2xl font-bold">{blockchain.getTotalVotes()}</p>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
            <h3 className="text-sm font-medium mb-1">Registered Voters</h3>
            <p className="text-2xl font-bold">{voters.length}</p>
          </div>
        </div>
      </div>
      
      {!isRegistered ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <User className="mr-2 text-blue-600" size={24} />
              Voter Registration
            </h2>
            
            <form onSubmit={handleRegisterVoter}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={voterCredentials.name}
                    onChange={(e) => setVoterCredentials({...voterCredentials, name: e.target.value})}
                    className={`w-full px-4 py-2 border ${registrationError.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    placeholder="Enter your full name"
                  />
                  {registrationError.name && <p className="mt-1 text-sm text-red-500">{registrationError.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1">
                    Student ID
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="studentId"
                      value={voterCredentials.studentId}
                      onChange={(e) => setVoterCredentials({...voterCredentials, studentId: e.target.value})}
                      className={`w-full px-4 py-2 border ${registrationError.studentId ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                      placeholder="Enter your student ID"
                    />
                    <button 
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {registrationError.studentId && <p className="mt-1 text-sm text-red-500">{registrationError.studentId}</p>}
                </div>
                
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    value={voterCredentials.department}
                    onChange={(e) => setVoterCredentials({...voterCredentials, department: e.target.value})}
                    className={`w-full px-4 py-2 border ${registrationError.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {registrationError.department && <p className="mt-1 text-sm text-red-500">{registrationError.department}</p>}
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <div className="flex">
                    <Shield className="flex-shrink-0 h-5 w-5 text-blue-500" />
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Security Notice</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        Your information is securely stored and your vote will be anonymous. Each student can register and vote only once.
                      </p>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Register to Vote
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : hasUserVoted ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 md:p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Thank You for Voting!</h2>
            <p className="text-gray-600 mb-6">
              Your vote has been securely recorded on the blockchain. You've contributed to the democratic process.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 inline-block">
              <p className="text-sm text-blue-800">
                Your vote is secure, anonymous, and cannot be altered. Blockchain technology ensures the integrity of the election.
              </p>
            </div>
            
            <div className="mt-6 space-y-4">
              <button
                onClick={() => navigate('/results')}
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Election Results
              </button>
              
              <div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  Log out from this device
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Position filter */}
          <div className="mb-6 flex flex-wrap gap-2">
            {positions.map(position => (
              <button
                key={position}
                onClick={() => setSelectedPosition(position)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedPosition === position
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {position}
              </button>
            ))}
          </div>
          
          {candidates.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="flex-shrink-0 h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No candidates have registered yet. Check back later or consider running for a position yourself!
                  </p>
                </div>
              </div>
            </div>
          ) : filteredCandidates.length === 0 ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <AlertCircle className="flex-shrink-0 h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No candidates found for the selected position.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCandidates.map((candidate) => (
                <div 
                  key={candidate.id} 
                  className={`bg-white rounded-lg shadow-md overflow-hidden transition-all ${
                    selectedCandidate === candidate.id ? 'ring-2 ring-blue-500 transform scale-105' : 'hover:shadow-lg'
                  }`}
                >
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img 
                      src={candidate.image || defaultImage} 
                      alt={candidate.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{candidate.name}</h3>
                        <p className="text-gray-500 text-sm">{candidate.department}</p>
                      </div>
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {candidate.position}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">{candidate.manifesto}</p>
                    <div className="mt-4">
                      <button
                        onClick={() => handleCandidateSelect(candidate.id)}
                        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Vote
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* User Info */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-blue-100 p-2 rounded-full">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Logged in as: {currentVoter?.name}</p>
                <p className="text-xs text-gray-500">Department: {currentVoter?.department}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Log Out
            </button>
          </div>
          
          {/* Vote Confirmation Modal */}
          {showConfirmation && selectedCandidate && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl animate-scaleIn">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Confirm Your Vote</h3>
                
                {isVoting ? (
                  <div className="py-6 flex flex-col items-center">
                    <div className="mb-4">
                      <svg className="animate-spin h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                    <p className="text-gray-600 text-center">
                      Processing your vote on the blockchain...
                    </p>
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Your vote is being securely recorded and cannot be altered once confirmed.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <p className="text-gray-600">
                        You are about to vote for:
                      </p>
                      <div className="mt-2 flex items-center p-3 bg-gray-50 rounded-md">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          <img 
                            src={candidates.find(c => c.id === selectedCandidate)?.image || defaultImage} 
                            alt="Candidate" 
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {candidates.find(c => c.id === selectedCandidate)?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {candidates.find(c => c.id === selectedCandidate)?.position}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 mb-4">
                      <div className="flex">
                        <AlertCircle className="flex-shrink-0 h-5 w-5 text-yellow-400" />
                        <div className="ml-2">
                          <p className="text-sm text-yellow-700">
                            This action cannot be undone. Your vote is final once submitted.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={cancelVote}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleVoteConfirmation}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <Vote className="mr-2 h-4 w-4" />
                        Confirm Vote
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoterDashboard;