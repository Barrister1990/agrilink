import { Star } from "lucide-react";
import { useState } from "react";

const ProductReviews = ({ product }) => {
  const [showModal, setShowModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    title: "",
    comment: "",
    name: "",
    email: ""
  });
  const [formErrors, setFormErrors] = useState({});
  
  // Sample review data - in a real app, this would come from props or an API
  const [reviews, setReviews] = useState([
    {
      name: "John D.",
      rating: 5,
      date: "2 weeks ago",
      title: "Excellent quality!",
      comment: "I'm extremely satisfied with this product. The quality is top-notch and delivery was faster than expected. Will definitely buy again!"
    },
    {
      name: "Sarah M.",
      rating: 4,
      date: "1 month ago",
      title: "Great product, slightly expensive",
      comment: "The product itself is fantastic but I feel like it's a bit overpriced compared to similar items. That said, the quality is undeniable."
    },
    {
      name: "Michael K.",
      rating: 5,
      date: "2 months ago",
      title: "Perfect for my needs",
      comment: "This is exactly what I was looking for. Great product that delivers on all its promises. The packaging was also very secure."
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReviewForm({
      ...reviewForm,
      [name]: value
    });
    
    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!reviewForm.title.trim()) errors.title = "Review title is required";
    if (!reviewForm.comment.trim()) errors.comment = "Review comment is required";
    if (!reviewForm.name.trim()) errors.name = "Your name is required";
    if (!reviewForm.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(reviewForm.email)) errors.email = "Email is invalid";
    if (userRating === 0) errors.rating = "Please select a rating";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    // In a real app, you would send this to your API
    const newReview = {
      name: reviewForm.name,
      rating: userRating,
      date: "Just now",
      title: reviewForm.title,
      comment: reviewForm.comment
    };
    
    // Add the new review to the list
    setReviews([newReview, ...reviews]);
    
    // Close modal and reset form
    setShowModal(false);
    setUserRating(0);
    setReviewForm({
      title: "",
      comment: "",
      name: "",
      email: ""
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white hover:bg-green-700 py-2 px-4 rounded-md text-sm font-medium transition"
        >
          Write a Review
        </button>
      </div>

      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="flex mr-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className="h-5 w-5" 
                fill="#FFD700" 
                stroke="#FFD700" 
              />
            ))}
          </div>
          <p className="text-lg font-medium">4.8 out of 5</p>
        </div>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center">
              <span className="text-sm w-8">{rating} star</span>
              <div className="flex-1 h-2 mx-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-yellow-400 rounded-full" 
                  style={{ 
                    width: `${rating === 5 ? 70 : rating === 4 ? 20 : rating === 3 ? 7 : rating === 2 ? 2 : 1}%` 
                  }}
                ></div>
              </div>
              <span className="text-sm w-8">
                {rating === 5 ? "70%" : rating === 4 ? "20%" : rating === 3 ? "7%" : rating === 2 ? "2%" : "1%"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.map((review, idx) => (
          <div key={idx} className="border-b border-gray-200 pb-6 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                  <span className="text-green-800 font-semibold">{review.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-medium">{review.name}</p>
                  <div className="flex items-center">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className="h-4 w-4" 
                          fill={star <= review.rating ? "#FFD700" : "none"} 
                          stroke={star <= review.rating ? "#FFD700" : "#6B7280"} 
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                  </div>
                </div>
              </div>
            </div>
            <h4 className="font-medium mb-1">{review.title}</h4>
            <p className="text-gray-600 text-sm">{review.comment}</p>
          </div>
        ))}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 pt-20">
          <div className="bg-white rounded-lg max-w-md w-full max-h-screen overflow-y-auto p-6 mt-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Write a Review</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmitReview}>
              {/* Rating Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating *</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star 
                      key={rating} 
                      className="h-8 w-8 cursor-pointer" 
                      fill={(hoverRating || userRating) >= rating ? "#FFD700" : "none"} 
                      stroke={(hoverRating || userRating) >= rating ? "#FFD700" : "#6B7280"} 
                      onMouseEnter={() => setHoverRating(rating)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setUserRating(rating)}
                    />
                  ))}
                </div>
                {formErrors.rating && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.rating}</p>
                )}
              </div>
              
              {/* Review Title */}
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Review Title *</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  value={reviewForm.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="E.g., Great product!"
                />
                {formErrors.title && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.title}</p>
                )}
              </div>
              
              {/* Review Comment */}
              <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                <textarea 
                  id="comment" 
                  name="comment" 
                  rows="4" 
                  value={reviewForm.comment}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="What did you like or dislike about this product?"
                ></textarea>
                {formErrors.comment && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.comment}</p>
                )}
              </div>
              
              {/* Name */}
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={reviewForm.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {formErrors.name && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                )}
              </div>
              
              {/* Email */}
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Your Email *</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={reviewForm.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Your email won't be published"
                />
                {formErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                )}
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;