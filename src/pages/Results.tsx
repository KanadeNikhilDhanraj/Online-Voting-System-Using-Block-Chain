import React, { useState, useEffect } from 'react';
import { Trophy, BarChart3, ArrowUp, ArrowDown, User, Vote } from 'lucide-react';
import { useBlockchain } from '../context/BlockchainContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const defaultImage = 'https://images.pexels.com/photos/7709020/pexels-photo-7709020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#06B6D4'];

const Results: React.FC = () => {
  const { getResults, getWinner, candidates, currentElection, blockchain, voters } = useBlockchain();
  const [results, setResults] = useState<{ candidateId: string; votes: number }[]>([]);
  const [winner, setWinner] = useState<any>(null);
  const [selectedPosition, setSelectedPosition] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'votes' | 'name'>('votes');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showPercentages, setShowPercentages] = useState(true);
  
  // Get unique positions from candidates
  const positions = ['All', ...Array.from(new Set(candidates.map(c => c.position)))];
  
  useEffect(() => {
    // Fetch results
    const electionResults = getResults();
    setResults(electionResults);
    
    // Get winner
    const electionWinner = getWinner();
    setWinner(electionWinner);
  }, [getResults, getWinner]);
  
  // Filter results by position
  const filteredCandidates = selectedPosition === 'All'
    ? candidates
    : candidates.filter(c => c.position === selectedPosition);
  
  // Filter and sort results
  const filteredResults = results.filter(result => {
    const candidate = candidates.find(c => c.id === result.candidateId);
    return selectedPosition === 'All' || candidate?.position === selectedPosition;
  });
  
  // Sort results
  const sortedResults = [...filteredResults].sort((a, b) => {
    const candidateA = candidates.find(c => c.id === a.candidateId);
    const candidateB = candidates.find(c => c.id === b.candidateId);
    
    if (sortBy === 'votes') {
      return sortDirection === 'desc' ? b.votes - a.votes : a.votes - b.votes;
    } else {
      // Sort by name
      const nameA = candidateA?.name || '';
      const nameB = candidateB?.name || '';
      return sortDirection === 'desc' 
        ? nameB.localeCompare(nameA)
        : nameA.localeCompare(nameB);
    }
  });
  
  // Calculate total votes for the selected position
  const totalVotesForPosition = filteredResults.reduce((sum, result) => sum + result.votes, 0);
  
  // Format data for charts
  const barChartData = sortedResults.map(result => {
    const candidate = candidates.find(c => c.id === result.candidateId);
    return {
      name: candidate?.name || 'Unknown',
      votes: result.votes,
      department: candidate?.department || 'Unknown',
      position: candidate?.position || 'Unknown'
    };
  });
  
  const pieChartData = sortedResults.map(result => {
    const candidate = candidates.find(c => c.id === result.candidateId);
    return {
      name: candidate?.name || 'Unknown',
      value: result.votes
    };
  });
  
  // Calculate detailed statistics
  const totalRegisteredVoters = voters.length;
  const totalVotesCast = blockchain.getTotalVotes();
  const voterTurnout = totalRegisteredVoters > 0 
    ? ((totalVotesCast / totalRegisteredVoters) * 100).toFixed(1) 
    : '0';
  
  const handleSort = (column: 'votes' | 'name') => {
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default direction
      setSortBy(column);
      setSortDirection(column === 'votes' ? 'desc' : 'asc');
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Election Results</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          View the results of the {currentElection?.title}. All votes are securely recorded on the blockchain for transparency and verification.
        </p>
      </div>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Candidates</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{candidates.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <User className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Votes Cast</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalVotesCast}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Vote className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Voter Turnout</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{voterTurnout}%</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">{totalVotesCast} out of {totalRegisteredVoters} registered voters</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-yellow-500">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-500">Blockchain Blocks</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{blockchain.chain.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      {/* Winner Spotlight (if available) */}
      {winner && totalVotesCast > 0 && (
        <div className="mb-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center">
              <div className="mb-6 md:mb-0 md:mr-8 flex-shrink-0">
                <div className="relative">
                  <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                    <img 
                      src={winner.image || defaultImage} 
                      alt={winner.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                    <Trophy className="h-6 w-6 text-yellow-500" />
                  </div>
                </div>
              </div>
              
              <div className="text-center md:text-left text-white">
                <div className="flex flex-col md:flex-row items-center md:items-baseline">
                  <h2 className="text-2xl md:text-3xl font-bold">Election Winner</h2>
                  <span className="inline-block bg-white text-yellow-600 text-xs font-medium px-2.5 py-0.5 rounded-full ml-0 md:ml-3 mt-1 md:mt-0">
                    {winner.position}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold mt-1">{winner.name}</h3>
                <p className="text-white/90 mt-1">{winner.department}</p>
                <div className="mt-3">
                  <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white font-medium">
                    {results.find(r => r.candidateId === winner.id)?.votes || 0} votes
                    {totalVotesCast > 0 && (
                      <span className="ml-1">
                        ({((results.find(r => r.candidateId === winner.id)?.votes || 0) / totalVotesCast * 100).toFixed(1)}%)
                      </span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filter and Controls */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <label htmlFor="position-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Position
            </label>
            <select
              id="position-filter"
              value={selectedPosition}
              onChange={(e) => setSelectedPosition(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {positions.map((position) => (
                <option key={position} value={position}>
                  {position}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setShowPercentages(!showPercentages)}
              className={`px-4 py-2 rounded-md text-sm font-medium border ${
                showPercentages ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 text-gray-700'
              }`}
            >
              {showPercentages ? 'Showing %' : 'Show %'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
        {/* Bar Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Vote Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'votes') {
                      if (showPercentages && totalVotesForPosition > 0) {
                        return [`${value} (${((value as number / totalVotesForPosition) * 100).toFixed(1)}%)`, 'Votes'];
                      }
                      return [value, 'Votes'];
                    }
                    return [value, name];
                  }}
                />
                <Bar dataKey="votes" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Pie Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Percentage Share</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => showPercentages ? `${name}: ${(percent * 100).toFixed(1)}%` : name}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} votes`, 'Votes']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Detailed Results Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
        </div>
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
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('votes')}
                >
                  <div className="flex items-center">
                    Votes
                    {sortBy === 'votes' && (
                      sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                    )}
                  </div>
                </th>
                {showPercentages && (
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedResults.map((result) => {
                const candidate = candidates.find(c => c.id === result.candidateId);
                return (
                  <tr key={result.candidateId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          <img src={candidate?.image || defaultImage} alt="" className="h-full w-full object-cover" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{candidate?.name}</div>
                          {candidate?.id === winner?.id && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              <Trophy size={12} className="mr-1" />
                              Winner
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate?.position}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{candidate?.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.votes}
                    </td>
                    {showPercentages && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative pt-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-semibold inline-block text-blue-600">
                                {totalVotesForPosition > 0 ? ((result.votes / totalVotesForPosition) * 100).toFixed(1) : '0'}%
                              </span>
                            </div>
                          </div>
                          <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                            <div 
                              style={{ width: `${totalVotesForPosition > 0 ? (result.votes / totalVotesForPosition) * 100 : 0}%` }} 
                              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            ></div>
                          </div>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
              
              {sortedResults.length === 0 && (
                <tr>
                  <td colSpan={showPercentages ? 5 : 4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No results available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Blockchain Verification Section */}
      <div className="mb-12">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Blockchain Verification</h3>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-4">
              All votes in this election are securely stored on our blockchain system. The blockchain consists of {blockchain.chain.length} blocks, with the first block being the genesis block.
            </p>
            
            <div className="flex items-center">
              <div className={`px-4 py-2 rounded-md text-sm font-medium ${blockchain.isChainValid() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                <div className="flex items-center">
                  {blockchain.isChainValid() ? (
                    <>
                      <svg className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Blockchain Verified
                    </>
                  ) : (
                    <>
                      <svg className="h-5 w-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      Blockchain Verification Failed
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;