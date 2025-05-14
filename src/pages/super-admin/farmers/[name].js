import useFarmerStore from '@/store/farmerStore';
import { Briefcase, Camera, CheckCircle, ChevronLeft, CreditCard, FileText, Mail, MapPin, Phone, XCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import SuperAdminLayout from '../layout';

export default function FarmerViewPage() {
  const router = useRouter();
  const { id } = router.query;
  
  const { farmers, getFarmerDetailsById, updateFarmerStatus, fetchFarmers } = useFarmerStore();
  const [farmer, setFarmer] = useState(null);
  const [farmerDetails, setFarmerDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRejectConfirmModal, setShowRejectConfirmModal] = useState(false);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  useEffect(() => {
    // Fetch farmers data if not already loaded
    if (farmers.length === 0) {
      fetchFarmers();
    }
  }, [fetchFarmers, farmers.length]);

  useEffect(() => {
    // Find the farmer once we have the ID and farmers data
    if (id && farmers.length > 0) {
      const foundFarmer = farmers.find(f => f.id === id);
      if (foundFarmer) {
        setFarmer(foundFarmer);
        
        // Fetch complete farmer details from the database
        const fetchDetails = async () => {
          try {
            const details = await getFarmerDetailsById(foundFarmer.userId);
            if (details) {
              setFarmerDetails(details);
            }
          } catch (error) {
            console.error("Failed to fetch farmer details:", error);
          } finally {
            setLoading(false);
          }
        };
        
        fetchDetails();
      } else {
        setLoading(false);
      }
    }
  }, [id, farmers, getFarmerDetailsById]);

  const handleApproveConfirm = () => {
    setShowApproveConfirmModal(true);
  };

  const handleApprove = async () => {
    if (farmer) {
      const success = await updateFarmerStatus(farmer.originalId, 'Approved');
      if (success) {
        setShowApproveConfirmModal(false);
        router.push('/super-admin/farmers');
      }
    }
  };

  const handleRejectConfirm = () => {
    setShowRejectConfirmModal(true);
  };

  const handleShowRejectModal = () => {
    setShowRejectConfirmModal(false);
    setShowRejectModal(true);
  };

  const handleReject = async () => {
    if (farmer) {
      const success = await updateFarmerStatus(farmer.originalId, 'Rejected', rejectReason);
      if (success) {
        setShowRejectModal(false);
        router.push('/super-admin/farmers');
      }
    }
  };

  if (loading) {
    return (
      <SuperAdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          <p className="ml-3 text-lg text-gray-600">Loading farmer data...</p>
        </div>
      </SuperAdminLayout>
    );
  }

  if (!farmer) {
    return (
      <SuperAdminLayout>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-lg text-red-600">Farmer not found</p>
          <Link href="/super-admin/farmers" className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Farmers
          </Link>
        </div>
      </SuperAdminLayout>
    );
  }

  // Use detailed data if available, otherwise use basic farmer data
  const displayData = farmerDetails || {
    farm_name: farmer.farmName || `${farmer.farmer}'s Farm`,
    farm_type: "Mixed Crop",
    first_name: farmer.farmer.split(' ')[0],
    last_name: farmer.farmer.split(' ').slice(1).join(' '),
    email: farmer.email,
    phone: farmer.phone,
    farm_size: "25",
    farm_size_unit: "acres",
    farm_location: farmer.location || "Not specified",
    farm_address: "123 Farm Road",
    farm_city: "Farmville",
    farm_state: farmer.location || "Not specified",
    farm_postal_code: "12345",
    farm_country: "Ghana",
    years_farming: "5",
    main_products: farmer.products ? farmer.products.split(', ') : ["Not specified"],
    growing_methods: ["Conventional", "Sustainable"],
    organic_certified: false,
    certifications: ["Good Agricultural Practices"],
    business_entity: "Sole Proprietorship",
    tax_id: "TX-" + Math.floor(10000 + Math.random() * 90000),
    business_license: "BL-" + Math.floor(10000 + Math.random() * 90000),
    insurance_policy: "INS-" + Math.floor(10000 + Math.random() * 90000),
    bank_name: "GhanaBank",
    account_holder: farmer.farmer,
    account_number_last4: "4321",
    routing_number_last4: "5678",
    bio: `${farmer.farmer} is a dedicated farmer with years of experience in sustainable agriculture.`,
    profile_image_url: farmer.profileImage,
    farm_image_urls: [],
    website: "",
    social_media: {
      facebook: "",
      instagram: "",
      twitter: ""
    },
    rejection_reason: farmer.rejection_reason || ""
  };

  return (
    <SuperAdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/super-admin/farmers" className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Farmers
            </Link>
            <h1 className="text-2xl font-bold text-gray-800 mt-2">Farmer Application: {farmer.farmer}</h1>
          </div>
          
          <div className="flex space-x-3">
            {farmer.status === 'Pending' && (
              <>
                <button
                  onClick={handleApproveConfirm}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={handleRejectConfirm}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </>
            )}
            
            {farmer.status === 'Approved' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approved
              </span>
            )}
            
            {farmer.status === 'Rejected' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <XCircle className="h-4 w-4 mr-2" />
                Rejected
              </span>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Application Details</h2>
            <p className="text-sm text-gray-600">ID: {farmer.id} • Submitted: {farmer.date}</p>
          </div>
          
          {/* Profile Section with Image */}
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row items-start">
              <div className="w-full md:w-1/4 mb-6 md:mb-0 flex justify-center">
                {displayData.profile_image_url ? (
                  <div className="w-32 h-32 rounded-full overflow-hidden">
                    <img 
                      src={displayData.profile_image_url} 
                      alt={`${displayData.first_name} ${displayData.last_name}`}
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              
              <div className="w-full md:w-3/4">
                <h3 className="text-xl font-semibold text-gray-800">{displayData.farm_name}</h3>
                <div className="mt-2 flex flex-wrap items-center text-gray-600">
                  <div className="flex items-center mr-6 mb-2">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{displayData.farm_type}</span>
                  </div>
                  <div className="flex items-center mr-6 mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{displayData.farm_location}</span>
                  </div>
                  <div className="flex items-center mr-6 mb-2">
                    <Mail className="h-4 w-4 mr-1" />
                    <span>{displayData.email}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    <Phone className="h-4 w-4 mr-1" />
                    <span>{displayData.phone}</span>
                  </div>
                </div>
                <p className="mt-3 text-gray-700">{displayData.bio}</p>
              </div>
            </div>
          </div>
          
          {/* Farm Images Gallery */}
          {displayData.farm_image_urls && displayData.farm_image_urls.length > 0 && (
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Farm Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {displayData.farm_image_urls.map((imageUrl, index) => (
                  <div key={index} className="h-48 rounded-lg overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={`Farm image ${index + 1}`}
                      width={300}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Personal Details */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-600" />
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">First Name</p>
                <p className="mt-1">{displayData.first_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Last Name</p>
                <p className="mt-1">{displayData.last_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="mt-1">{displayData.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p className="mt-1">{displayData.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Farm Name</p>
                <p className="mt-1">{displayData.farm_name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Farm Type</p>
                <p className="mt-1">{displayData.farm_type}</p>
              </div>
            </div>
          </div>
          
          {/* Farm Details */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-gray-600" />
              Farm Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Farm Size</p>
                <p className="mt-1">{displayData.farm_size} {displayData.farm_size_unit}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Years Farming</p>
                <p className="mt-1">{displayData.years_farming} years</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Location</p>
                <p className="mt-1">{displayData.farm_location}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Address</p>
                <p className="mt-1">{displayData.farm_address}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">City</p>
                <p className="mt-1">{displayData.farm_city}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">State</p>
                <p className="mt-1">{displayData.farm_state}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Postal Code</p>
                <p className="mt-1">{displayData.farm_postal_code}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Country</p>
                <p className="mt-1">{displayData.farm_country}</p>
              </div>
            </div>
          </div>
          
          {/* Production Details */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
              Production Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Main Products</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {displayData.main_products && displayData.main_products.length > 0 ? (
                    displayData.main_products.map((product, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {product}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No products specified</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Growing Methods</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {displayData.growing_methods && displayData.growing_methods.length > 0 ? (
                    displayData.growing_methods.map((method, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {method}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No methods specified</span>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Organic Certified</p>
                <p className="mt-1">{displayData.organic_certified ? 'Yes' : 'No'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Certifications</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {displayData.certifications && displayData.certifications.length > 0 ? (
                    displayData.certifications.map((cert, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
                      >
                        {cert}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No certifications</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Business Details */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <Briefcase className="h-5 w-5 mr-2 text-gray-600" />
              Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Business Entity</p>
                <p className="mt-1">{displayData.business_entity || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Tax ID</p>
                <p className="mt-1">{displayData.tax_id || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Business License</p>
                <p className="mt-1">{displayData.business_license || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Insurance Policy</p>
                <p className="mt-1">{displayData.insurance_policy || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          {/* Bank Details */}
          <div className="p-6 border-b">
            <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
              Bank Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500">Bank Name</p>
                <p className="mt-1">{displayData.bank_name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Holder</p>
                <p className="mt-1">{displayData.account_holder || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Number</p>
                <p className="mt-1">
                  {displayData.account_number_last4 ? `****${displayData.account_number_last4}` : 'Not specified'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Routing Number</p>
                <p className="mt-1">
                  {displayData.routing_number_last4 ? `****${displayData.routing_number_last4}` : 'Not specified'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Website & Social Media */}
          {(displayData.website || (displayData.social_media && Object.values(displayData.social_media).some(val => val))) && (
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Online Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayData.website && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Website</p>
                    <a 
                      href={displayData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline"
                    >
                      {displayData.website}
                    </a>
                  </div>
                )}
                
                {displayData.social_media && displayData.social_media.facebook && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Facebook</p>
                    <a 
                      href={displayData.social_media.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline"
                    >
                      {displayData.social_media.facebook}
                    </a>
                  </div>
                )}
                
                {displayData.social_media && displayData.social_media.instagram && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Instagram</p>
                    <a 
                      href={displayData.social_media.instagram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline"
                    >
                      {displayData.social_media.instagram}
                    </a>
                  </div>
                )}
                
                {displayData.social_media && displayData.social_media.twitter && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Twitter</p>
                    <a 
                      href={displayData.social_media.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-1 text-blue-600 hover:underline"
                    >
                      {displayData.social_media.twitter}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Additional Info & Rejection Reason */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Additional Information</h3>
            <div>
              <p className="text-sm font-medium text-gray-500">Bio</p>
              <p className="mt-1">{displayData.bio || 'No bio provided'}</p>
            </div>
            
            {displayData.rejection_reason && (
              <div className="mt-6 p-4 border border-red-300 rounded-md bg-red-50">
                <h4 className="font-medium text-red-800">Rejection Reason</h4>
                <p className="mt-1 text-red-700">{displayData.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Approve Confirmation Modal */}
      {showApproveConfirmModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Approve Application</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to approve this farmer application? This will grant the farmer access to the platform.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleApprove}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowApproveConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Confirmation Modal */}
      {showRejectConfirmModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reject Application</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to reject this farmer application? You will need to provide a reason for rejection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleShowRejectModal}
                >
                  Continue to Reject
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRejectConfirmModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Reject Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Provide Rejection Reason</h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500 mb-4">
                        Please provide a reason for rejecting this farmer application. This reason will be shared with the applicant.
                      </p>
                      <textarea
                        rows={4}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Enter rejection reason..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleReject}
                  disabled={!rejectReason.trim()}
                >
                  Reject Application
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowRejectModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </SuperAdminLayout>
  );
}