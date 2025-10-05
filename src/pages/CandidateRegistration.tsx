import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, FileText, School, Award, X, Check, Camera } from 'lucide-react';
import { useBlockchain } from '../context/BlockchainContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface CandidateFormData {
  name: string;
  position: string;
  department: string;
  manifesto: string;
  image: string;
}

const defaultImage = 'https://images.pexels.com/photos/7709020/pexels-photo-7709020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';

const CandidateRegistration: React.FC = () => {
  const { addCandidate, candidates, currentElection } = useBlockchain();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CandidateFormData>({
    name: '',
    position: '',
    department: '',
    manifesto: '',
    image: defaultImage
  });
  
  const [formError, setFormError] = useState({
    name: '',
    position: '',
    department: '',
    manifesto: ''
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const positions = [
    'President',
    'Vice President',
    'Secretary',
    'Treasurer',
    'Public Relations Officer',
    'Sports Coordinator',
    'Cultural Secretary'
  ];
  
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
  
  const validateForm = (step: number): boolean => {
    let isValid = true;
    const newErrors = { ...formError };
    
    if (step === 1) {
      if (!formData.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      } else {
        newErrors.name = '';
      }
      
      if (!formData.position) {
        newErrors.position = 'Position is required';
        isValid = false;
      } else {
        newErrors.position = '';
      }
    }
    
    if (step === 2) {
      if (!formData.department) {
        newErrors.department = 'Department is required';
        isValid = false;
      } else {
        newErrors.department = '';
      }
      
      if (!formData.manifesto.trim() || formData.manifesto.length < 50) {
        newErrors.manifesto = 'Manifesto must be at least 50 characters';
        isValid = false;
      } else {
        newErrors.manifesto = '';
      }
    }
    
    setFormError(newErrors);
    return isValid;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleNextStep = () => {
    if (validateForm(step)) {
      setStep(step + 1);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(step)) return;
    
    setIsSubmitting(true);
    
    // Generate unique ID for candidate
    const newCandidate = {
      id: `candidate-${Date.now()}`,
      name: formData.name,
      position: formData.position,
      department: formData.department,
      manifesto: formData.manifesto,
      image: formData.image
    };
    
    // Check if candidate name already exists
    const candidateExists = candidates.some(c => 
      c.name.toLowerCase() === formData.name.toLowerCase() && 
      c.position === formData.position
    );
    
    if (candidateExists) {
      toast.error('A candidate with this name and position already exists.');
      setIsSubmitting(false);
      return;
    }
    
    // Add candidate after a short delay to simulate registration process
    setTimeout(() => {
      addCandidate(newCandidate);
      
      toast.success('Candidate registered successfully!', {
        onClose: () => {
          navigate('/voter-dashboard');
        }
      });
      
      setIsSubmitting(false);
      
      // Reset form
      setFormData({
        name: '',
        position: '',
        department: '',
        manifesto: '',
        image: defaultImage
      });
      
      setStep(1);
    }, 1000);
  };
  
  // Check if election is active
  if (!currentElection?.isActive) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-orange-100 border-l-4 border-orange-500 text-orange-700 p-4 rounded-md mb-6">
          <p className="font-medium">Election Inactive</p>
          <p>Candidate registration is currently closed. Please check back when the election period begins.</p>
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
      
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Candidate Registration</h1>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Submit your candidature for the {currentElection?.title}. Fill out the form below with your information and manifesto.
        </p>
      </div>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            1
          </div>
          <div className={`h-1 w-24 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            2
          </div>
          <div className={`h-1 w-24 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            3
          </div>
        </div>
        <div className="flex items-center justify-center mt-2">
          <div className="w-10 text-center text-xs">Basic Info</div>
          <div className="w-24"></div>
          <div className="w-10 text-center text-xs">Details</div>
          <div className="w-24"></div>
          <div className="w-10 text-center text-xs">Review</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="p-6 md:p-8 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="mr-2 text-blue-600" size={24} />
                Basic Information
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formError.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    placeholder="Enter your full name"
                  />
                  {formError.name && <p className="mt-1 text-sm text-red-500">{formError.name}</p>}
                </div>
                
                <div>
                  <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <select
                    id="position"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formError.position ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  >
                    <option value="">Select position</option>
                    {positions.map((pos) => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                  {formError.position && <p className="mt-1 text-sm text-red-500">{formError.position}</p>}
                </div>
                
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Profile Image URL (Optional)
                  </label>
                  <div className="flex gap-4 items-start">
                    <div className="flex-shrink-0">
                      <div className="relative h-32 w-32 bg-gray-100 rounded-md overflow-hidden">
                        <img 
                          src={formData.image || defaultImage} 
                          alt="Profile Preview" 
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
                          <Camera className="text-white" size={24} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow">
                      <input
                        type="text"
                        id="image"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        placeholder="Enter image URL"
                      />
                      <p className="mt-1 text-xs text-gray-500">Enter a URL for your profile image, or leave default</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Next Step
                </button>
              </div>
            </div>
          )}
          
          {/* Step 2: Additional Details */}
          {step === 2 && (
            <div className="p-6 md:p-8 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FileText className="mr-2 text-blue-600" size={24} />
                Additional Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border ${formError.department ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                  >
                    <option value="">Select department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                  {formError.department && <p className="mt-1 text-sm text-red-500">{formError.department}</p>}
                </div>
                
                <div>
                  <label htmlFor="manifesto" className="block text-sm font-medium text-gray-700 mb-1">
                    Election Manifesto
                  </label>
                  <textarea
                    id="manifesto"
                    name="manifesto"
                    value={formData.manifesto}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-2 border ${formError.manifesto ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors`}
                    placeholder="Write your election manifesto, goals and vision..."
                  ></textarea>
                  {formError.manifesto && <p className="mt-1 text-sm text-red-500">{formError.manifesto}</p>}
                  <p className="mt-2 text-sm text-gray-500">
                    Min. 50 characters. Explain your goals, vision, and plans if elected.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Review Application
                </button>
              </div>
            </div>
          )}
          
          {/* Step 3: Review and Submit */}
          {step === 3 && (
            <div className="p-6 md:p-8 animate-fadeIn">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Award className="mr-2 text-blue-600" size={24} />
                Review Your Application
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-center mb-4">
                      <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img 
                          src={formData.image || defaultImage} 
                          alt={formData.name} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-center">{formData.name}</h3>
                    <div className="mt-2 flex justify-center items-center text-sm text-gray-500">
                      <School size={16} className="mr-1" />
                      <span>{formData.department}</span>
                    </div>
                    <div className="mt-1 text-center">
                      <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {formData.position}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Basic Information</h4>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500">Full Name</p>
                          <p>{formData.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Position</p>
                          <p>{formData.position}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Department</p>
                          <p>{formData.department}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Election Manifesto</h4>
                      <div className="mt-2 p-4 bg-gray-50 rounded-md text-sm">
                        <p className="whitespace-pre-line">{formData.manifesto}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                  <p className="text-sm text-blue-800">
                    By submitting this application, you confirm that all the information provided is accurate and that you agree to abide by the election rules and guidelines.
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-gray-300 bg-white text-gray-700 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2" size={18} />
                        Submit Application
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Current Candidates Section */}
      {candidates.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Current Candidates</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {candidates.map((candidate) => (
              <div key={candidate.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
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
                  <div className="mt-4">
                    <p className="text-gray-700 text-sm line-clamp-3">{candidate.manifesto}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateRegistration;