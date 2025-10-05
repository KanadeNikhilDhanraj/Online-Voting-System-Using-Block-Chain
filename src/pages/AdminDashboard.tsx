import React, { useState, useEffect } from 'react';
import { Shield, User, Award, Calendar, Play, Pause, Trash2, Edit, Save, Check, X, AlertTriangle } from 'lucide-react';
import { useBlockchain } from '../context/BlockchainContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const defaultImage = 'https://images.pexels.com/photos/7709020/pexels-photo-7709020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const AdminDashboard: React.FC = () => {
  const { candidates, voters, blockchain, currentElection } = useBlockchain();
  
  // Admin credentials (in a real system, this would be authenticated properly)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: ''
  });
  
  // Election settings
  const [electionSettings, setElectionSettings] = useState({
    title: currentElection?.title || '',
    description: currentElection?.description || '',
    startDate: currentElection ? new Date(currentElection.startDate).toISOString().split('T')[0] : '',
    endDate: currentElection ? new Date(currentElection.endDate).toISOString().split('T')[0] : '',
    isActive: currentElection?.isActive || false
  });
  
  // Tabs
  const [activeTab, setActiveTab] = useState('overview');
  
  // Admin authentication (simplified for demo)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real system, this would validate against a secure authentication system
    if (adminCredentials.username === 'admin' && adminCredentials.password === 'admin123') {
      setIsAuthenticated(true);
      toast.success('Admin login successful');
    } else {
      toast.error('Invalid credentials');
    }
  };
  
  // Toggle election status
  const toggleElectionStatus = () => {
    const updatedElection = {
      ...currentElection!,
      isActive: !currentElection?.isActive
    };
    
    // In a real system, this would update the database
    localStorage.setItem('currentElection', JSON.stringify(updatedElection));
    
    // Reload the page to reflect changes
    window.location.reload();
  };
  
  // Candidate management
  const [editingCandidate, setEditingCandidate] = useState<string | null>(null);
  const [candidateData, setCandidateData] = useState({
    name: '',
    position: '',
    department: '',
    manifesto: ''
  });
  
  const startEditingCandidate = (candidateId: string) => {
    const candidate = candidates.find(c => c.id === candidateId);
    if (candidate) {
      setCandidateData({
        name: candidate.name,
        position: candidate.position,
        department: candidate.department,
        manifesto: candidate.manifesto
      });
      setEditingCandidate(candidateId);
    }
  };
  
  const saveEditedCandidate = (candidateId: string) => {
    // In a real system, this would update the database
    const updatedCandidates = candidates.map(c => 
      c.id === candidateId ? { ...c, ...candidateData } : c
    );
    
    localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
    setEditingCandidate(null);
    toast.success('Candidate updated successfully');
    
    // Reload the page to reflect changes
    window.location.reload();
  };
  
  const deleteCandidate = (candidateId: string) => {
    if (window.confirm('Are you sure you want to delete this candidate?')) {
      // In a real system, this would update the database
      const updatedCandidates = candidates.filter(c => c.id !== candidateId);
      localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
      toast.success('Candidate deleted successfully');
      
      // Reload the page to reflect changes
      window.location.reload();
    }
  };
  
  // Update election settings
  const updateElectionSettings = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate dates
    const start = new Date(electionSettings.startDate);
    const end = new Date(electionSettings.endDate);
    
    if (end <= start) {
      toast.error('End date must be after start date');
      return;
    }
    
    // Update election settings
    const updatedElection = {
      id: currentElection?.id || 'election-' + Date.now(),
      title: electionSettings.title,
      description: electionSettings.description,
      startDate: start,
      endDate: end,
      isActive: electionSettings.isActive
    };
    
    // In a real system, this would update the database
    localStorage.setItem('currentElection', JSON.stringify(updatedElection));
    toast.success('Election settings updated successfully');
    
    // Reload the page to reflect changes
    window.location.reload();
  };
  
  // Calculate stats
  const totalVotes = blockchain.getTotalVotes();
  const voterTurnout = voters.length > 0 ? (totalVotes / voters.length) * 100 : 0;
  const mostVotedCandidate = candidates.reduce((prev, current) => {
    const prevVotes = blockchain.getVotesForCandidate(prev?.id || '');
    const currentVotes = blockchain.getVotesForCandidate(current.id);
    return currentVotes > prevVotes ? current : (prev || current);
  }, null);
  const mostVotes = mostVotedCandidate ? blockchain.getVotesForCandidate(mostVotedCandidate.id) : 0;
  
  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ToastContainer position="top-right" autoClose={3000} />
        
        <div className="flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-md w-full">
            <div className="px-6 py-8">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Shield className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              
              <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Admin Login</h2>
              
              <form onSubmit={handleAdminLogin}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                      Username
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={adminCredentials.username}
                      onChange={(e) => setAdminCredentials({...adminCredentials, username: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Enter admin username"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={adminCredentials.password}
                      onChange={(e) => setAdminCredentials({...adminCredentials, password: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      placeholder="Enter password"
                      required
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Log In
                  </button>
                </div>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  For demo purposes: username = "admin", password = "admin123"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center">
          <span className="mr-2 text-sm text-gray-500">Logged in as Admin</span>
          <button
            onClick={() => setIsAuthenticated(false)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Logout
          </button>
        </div>
      </div>
      
      {/* Admin Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px">
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'overview'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'candidates'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('candidates')}
          >
            Candidates
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'voters'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('voters')}
          >
            Voters
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'election'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('election')}
          >
            Election Settings
          </button>
          <button
            className={`py-4 px-6 font-medium text-sm focus:outline-none ${
              activeTab === 'blockchain'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('blockchain')}
          >
            Blockchain
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Election Overview</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full mr-4">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Voters</p>
                    <p className="text-2xl font-bold text-gray-900">{voters.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-full mr-4">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Candidates</p>
                    <p className="text-2xl font-bold text-gray-900">{candidates.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full mr-4">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Election Status</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block h-3 w-3 rounded-full mr-2 ${currentElection?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <p className="text-lg font-semibold text-gray-900">
                        {currentElection?.isActive ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Statistics</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-500">Total Votes Cast</span>
                      <span className="text-sm font-medium text-gray-900">{totalVotes}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-500">Voter Turnout</span>
                      <span className="text-sm font-medium text-gray-900">{voterTurnout.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-600 h-2.5 rounded-full" 
                        style={{ width: `${voterTurnout}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-500">Leading Candidate</span>
                      <span className="text-sm font-medium text-gray-900">
                        {mostVotedCandidate?.name || 'N/A'} ({mostVotes} votes)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full" 
                        style={{ width: totalVotes > 0 ? `${(mostVotes / totalVotes) * 100}%` : '0%' }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={toggleElectionStatus}
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                      currentElection?.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {currentElection?.isActive ? (
                      <>
                        <Pause className="mr-2 h-5 w-5" />
                        Stop Election
                      </>
                    ) : (
                      <>
                        <Play className="mr-2 h-5 w-5" />
                        Start Election
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={() => window.open('/results', '_blank')}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Results
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex">
                <AlertTriangle className="flex-shrink-0 h-5 w-5 text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    Note: This is a demo dashboard. In a production environment, additional security measures would be implemented.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Candidates Tab */}
        {activeTab === 'candidates' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Candidates</h2>
            
            {candidates.length === 0 ? (
              <div className="bg-gray-50 rounded-md p-6 text-center">
                <p className="text-gray-500">No candidates have registered yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Candidate
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Votes
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {candidates.map((candidate) => (
                      <tr key={candidate.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                              <img src={candidate.image || defaultImage} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="ml-4">
                              {editingCandidate === candidate.id ? (
                                <input
                                  type="text"
                                  value={candidateData.name}
                                  onChange={(e) => setCandidateData({...candidateData, name: e.target.value})}
                                  className="text-sm font-medium text-gray-900 border border-gray-300 rounded-md px-2 py-1"
                                />
                              ) : (
                                <div className="text-sm font-medium text-gray-900">{candidate.name}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCandidate === candidate.id ? (
                            <input
                              type="text"
                              value={candidateData.position}
                              onChange={(e) => setCandidateData({...candidateData, position: e.target.value})}
                              className="text-sm text-gray-900 border border-gray-300 rounded-md px-2 py-1"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">{candidate.position}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingCandidate === candidate.id ? (
                            <input
                              type="text"
                              value={candidateData.department}
                              onChange={(e) => setCandidateData({...candidateData, department: e.target.value})}
                              className="text-sm text-gray-900 border border-gray-300 rounded-md px-2 py-1"
                            />
                          ) : (
                            <div className="text-sm text-gray-900">{candidate.department}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {blockchain.getVotesForCandidate(candidate.id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {editingCandidate === candidate.id ? (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => saveEditedCandidate(candidate.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Save className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => setEditingCandidate(null)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <X className="h-5 w-5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => startEditingCandidate(candidate.id)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => deleteCandidate(candidate.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Voters Tab */}
        {activeTab === 'voters' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Registered Voters</h2>
            
            {voters.length === 0 ? (
              <div className="bg-gray-50 rounded-md p-6 text-center">
                <p className="text-gray-500">No voters have registered yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {voters.map((voter) => (
                      <tr key={voter.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{voter.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{voter.studentId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {voter.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {voter.hasVoted || blockchain.hasVoted(voter.id) ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <Check className="mr-1 h-3 w-3" />
                              Voted
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Not Voted
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {/* Election Settings Tab */}
        {activeTab === 'election' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Election Settings</h2>
            
            <form onSubmit={updateElectionSettings}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Election Title
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        id="title"
                        value={electionSettings.title}
                        onChange={(e) => setElectionSettings({...electionSettings, title: e.target.value})}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        rows={3}
                        value={electionSettings.description}
                        onChange={(e) => setElectionSettings({...electionSettings, description: e.target.value})}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      ></textarea>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">Brief description of the election.</p>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="startDate"
                        value={electionSettings.startDate}
                        onChange={(e) => setElectionSettings({...electionSettings, startDate: e.target.value})}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-3">
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="mt-1">
                      <input
                        type="date"
                        id="endDate"
                        value={electionSettings.endDate}
                        onChange={(e) => setElectionSettings({...electionSettings, endDate: e.target.value})}
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="sm:col-span-6">
                    <div className="flex items-center">
                      <input
                        id="isActive"
                        type="checkbox"
                        checked={electionSettings.isActive}
                        onChange={(e) => setElectionSettings({...electionSettings, isActive: e.target.checked})}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                        Election is active
                      </label>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      When active, students can register and vote in the election.
                    </p>
                  </div>
                </div>
                
                <div className="pt-5">
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
        
        {/* Blockchain Tab */}
        {activeTab === 'blockchain' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Blockchain Explorer</h2>
            
            <div className="mb-6">
              <div className="flex items-center">
                <div className={`px-4 py-2 rounded-md text-sm font-medium ${blockchain.isChainValid() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="flex items-center">
                    {blockchain.isChainValid() ? (
                      <>
                        <Check className="mr-1.5 h-5 w-5" />
                        Blockchain Integrity Verified
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="mr-1.5 h-5 w-5" />
                        Blockchain Integrity Compromised
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {blockchain.chain.map((block, index) => (
                <div key={index} className="border border-gray-200 rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2 flex justify-between items-center">
                    <span className="font-medium text-gray-700">Block #{block.index}</span>
                    <span className="text-xs text-gray-500">{new Date(block.timestamp).toLocaleString()}</span>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <div>
                        <span className="text-xs font-medium text-gray-500 block">Hash</span>
                        <span className="text-sm font-mono text-gray-800 break-all">{block.hash}</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 block">Previous Hash</span>
                        <span className="text-sm font-mono text-gray-800 break-all">{block.previousHash}</span>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500 block">Nonce</span>
                        <span className="text-sm text-gray-800">{block.nonce}</span>
                      </div>
                    </div>
                    
                    {block.index > 0 ? (
                      <div>
                        <span className="text-xs font-medium text-gray-500 block mb-2">Vote Data</span>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500 text-xs">Voter ID:</span>
                              <p className="font-mono text-gray-800 truncate">{block.data.voterId}</p>
                            </div>
                            <div>
                              <span className="text-gray-500 text-xs">Candidate ID:</span>
                              <p className="font-mono text-gray-800 truncate">{block.data.candidateId}</p>
                            </div>
                            <div className="col-span-2">
                              <span className="text-gray-500 text-xs">Timestamp:</span>
                              <p className="text-gray-800">{new Date(block.data.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500 italic">Genesis Block</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;