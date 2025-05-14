import { CheckCircle, Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Send, Twitter } from 'lucide-react';
import { useState } from 'react';

const AboutPage = () => {
  const [formStatus, setFormStatus] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setFormStatus('submitting');
    setTimeout(() => {
      setFormStatus('success');
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  // Company stats
  const stats = [
    { value: '5000+', label: 'Farmers Connected' },
    { value: '32', label: 'Districts Covered' },
    { value: '78%', label: 'Average Price Savings' },
    { value: '2K+', label: 'Monthly Orders' }
  ];

  // Team values
  const values = [
    { 
      title: 'Empowering Farmers', 
      description: 'Creating sustainable income opportunities for local farmers across Ghana.',
      icon: <CheckCircle size={24} className="text-green-500" />
    },
    { 
      title: 'Technology Driven', 
      description: 'Using innovative tech solutions to solve agricultural challenges.',
      icon: <CheckCircle size={24} className="text-green-500" />
    },
    { 
      title: 'Quality Assurance', 
      description: 'Ensuring the highest standards in all products on our platform.',
      icon: <CheckCircle size={24} className="text-green-500" />
    },
    { 
      title: 'Community First', 
      description: 'Building relationships that strengthen local communities.',
      icon: <CheckCircle size={24} className="text-green-500" />
    }
  ];



  // Timeline milestones
  const milestones = [
    {
      year: '2024',
      title: 'AgriLink Concept Born',
      description: 'The idea for AgriLink is sparked to digitally connect farmers and buyers across Ghana.'
    },
    {
      year: '2024',
      title: 'Team Formation',
      description: 'A small team of passionate innovators comes together to build the AgriLink platform.'
    },
    {
      year: '2025',
      title: 'Official Launch',
      description: 'AgriLink officially launches its platform, empowering farmers with digital tools to sell their produce.'
    },
    {
      year: '2025',
      title: 'First 100 Farmers Onboarded',
      description: 'Within weeks of launch, over 100 farmers sign up to join the AgriLink marketplace.'
    },
    {
      year: '2025',
      title: 'Website Goes Live',
      description: 'The AgriLink Website is released, offering farmers easy access to manage their inventory on the go.'
    },
    {
      year: '2025',
      title: 'Pilot Program Expansion',
      description: 'AgriLink begins expanding into nearby districts to pilot services in more communities.'
    }
  ];
  

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-green-50 to-white py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden -z-10">
            <div className="absolute top-20 -right-20 w-96 h-96 rounded-full bg-green-100 opacity-30"></div>
            <div className="absolute -bottom-40 -left-20 w-80 h-80 rounded-full bg-yellow-50 opacity-60"></div>
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400">Our Story</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Bridging the gap between farmers and consumers through innovative technology
            </p>
          </div>
          
          {/* Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 max-w-5xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white shadow-lg rounded-xl p-6 transform hover:-translate-y-1 transition-all duration-300">
                <div className="font-bold text-2xl md:text-3xl text-green-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* About Company Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="md:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Revolutionizing Ghana's Agricultural Supply Chain
              </h2>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  Founded in 2024, AgriLink is Ghana's premier digital marketplace connecting farmers directly to consumers, eliminating intermediaries and ensuring fair prices for both parties.
                </p>
                <p>
                  Our platform enables farmers to list their products, set fair prices, and receive direct payments, while consumers enjoy access to fresh produce delivered straight to their doorstep.
                </p>
                <p>
                  We're committed to supporting sustainable farming practices, reducing food waste, and creating economic opportunities throughout Ghana's agricultural sector.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                {values.map((value, index) => (
                  <div key={index} className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-2">
                      {value.icon}
                      <h3 className="font-medium text-gray-800">{value.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="relative">
                <div className="absolute -inset-4 bg-green-100 rounded-tr-3xl rounded-bl-3xl -rotate-3"></div>
                <div className="absolute -inset-4 bg-green-200 rounded-tr-3xl rounded-bl-3xl rotate-3 opacity-50"></div>
                <div className="relative rounded-tr-3xl rounded-bl-3xl overflow-hidden shadow-xl">
                  <img 
                    src="/images/team.jpg" 
                    alt="AgriLink Team" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Founder Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
            <div className="md:w-2/5">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-green-400 to-green-600 rounded-full transform scale-95 blur opacity-20"></div>
                <div className="relative rounded-full overflow-hidden border-4 border-white shadow-xl aspect-square max-w-md mx-auto">
                  <img 
                    src="/images/charles.jpg" 
                    alt="Charles Awuku - Founder" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="absolute -bottom-4 -right-4 bg-white shadow-lg rounded-lg p-4">
                  <div className="flex space-x-3">
                    <a href="#" className="text-gray-600 hover:text-blue-500">
                      <Linkedin size={20} />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-blue-400">
                      <Twitter size={20} />
                    </a>
                    <a href="#" className="text-gray-600 hover:text-pink-500">
                      <Instagram size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-3/5">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Meet Our Founder
              </h2>
              <h3 className="text-xl text-green-600 font-medium mb-6">Charles Awuku</h3>
              
              <div className="space-y-4 text-gray-600">
                <p>
                  Charles Awuku is a visionary tech entrepreneur and developer with a passion for leveraging technology to solve pressing challenges in Ghana.
                </p>
                <p>
                  After witnessing firsthand the struggles of farmers in rural communities to access fair markets for their produce, Charles founded AgriLink with a mission to transform Ghana's agricultural value chain.
                </p>
                <p>
                  With a background in software engineering and agricultural economics, Charles has built a platform that not only connects farmers to markets but also provides them with tools to improve productivity and increase their income.
                </p>
                <p>
                  Under his leadership, AgriLink has grown from a small startup to Ghana's leading agricultural marketplace, serving thousands of farmers across the country.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Timeline Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Milestones in our mission to transform Ghana's agricultural ecosystem
            </p>
          </div>
          
          <div className="relative mt-12">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-green-200"></div>
            
            <div className="space-y-12 md:space-y-0">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex flex-col md:flex-row items-center">
                  <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:order-2'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                      <div className="text-green-600 font-bold mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                  
                  <div className={`hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-white border-4 border-green-400 absolute left-1/2 transform -translate-x-1/2 ${index % 2 === 0 ? '' : ''}`}>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                Get In Touch
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions about AgriLink? We'd love to hear from you!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <MapPin className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Our Office</h3>
                    <p className="text-gray-600">123 Innovation Drive, Accra, Ghana</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Mail className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Email Us</h3>
                    <p className="text-gray-600">contact@agrilink.com</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Phone className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Call Us</h3>
                    <p className="text-gray-600">+233 20 123 4567</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Business Hours</h3>
                    <p className="text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <h3 className="font-medium text-gray-800 mb-3">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-white shadow-md rounded-full p-3 hover:bg-green-50 transition-colors">
                    <Facebook className="text-green-600" size={24} />
                  </a>
                  <a href="#" className="bg-white shadow-md rounded-full p-3 hover:bg-green-50 transition-colors">
                    <Twitter className="text-green-600" size={24} />
                  </a>
                  <a href="#" className="bg-white shadow-md rounded-full p-3 hover:bg-green-50 transition-colors">
                    <Instagram className="text-green-600" size={24} />
                  </a>
                  <a href="#" className="bg-white shadow-md rounded-full p-3 hover:bg-green-50 transition-colors">
                    <Linkedin className="text-green-600" size={24} />
                  </a>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2">
              <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Send Us a Message</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Your email address"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Message subject"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Your message"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className={`w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-medium py-3 px-6 rounded-lg transition-all hover:shadow-lg focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 ${
                      formStatus === 'submitting' ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={formStatus === 'submitting'}
                  >
                    {formStatus === 'submitting' ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </span>
                    ) : formStatus === 'success' ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle size={20} />
                        Message Sent!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Send size={20} />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-700 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Join Our Newsletter
            </h2>
            <p className="text-green-100 text-lg mb-8">
              Stay updated with the latest news, farmer stories, and special offers from AgriLink
            </p>
            
            <form className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-lg border border-transparent focus:ring-2 focus:ring-green-300 focus:border-green-300"
              />
              <button 
                type="submit" 
                className="bg-white text-green-600 font-medium px-6 py-3 rounded-lg hover:bg-green-50 transition-colors focus:ring-2 focus:ring-green-300 focus:ring-opacity-50"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* FAQ Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Everything you need to know about AgriLink
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto divide-y divide-gray-200">
            {[
              {
                question: "How does AgriLink benefit farmers?",
                answer: "AgriLink provides farmers with direct market access, eliminating intermediaries and ensuring fair prices. Our platform allows farmers to list their products, set their own prices, and receive payments directly to their mobile money or bank accounts. We also provide farmers with market insights and training to improve their productivity."
              },
              {
                question: "How can I become a seller on AgriLink?",
                answer: "Farmers can register as sellers on our platform by downloading the AgriLink app or visiting our website. After creating an account, you'll need to provide information about your farm and the products you want to sell. Our team will verify this information before approving your account."
              },
              {
                question: "What areas does AgriLink currently serve?",
                answer: "AgriLink currently operates in 32 districts across Ghana, with plans to expand nationwide. Our service is available in major urban centers including Accra, Kumasi, Tamale, and Takoradi, as well as surrounding rural areas."
              },
              {
                question: "How does delivery work?",
                answer: "AgriLink has a network of delivery partners who collect products from farmers and deliver them to customers. Delivery timeframes and costs vary depending on your location and the products ordered. Most orders are delivered within 24-48 hours of placement."
              },
              {
                question: "What payment methods are accepted?",
                answer: "AgriLink accepts mobile money payments (MTN Mobile Money, Vodafone Cash, AirtelTigo Money), bank transfers, and credit/debit card payments. All transactions are secure and protected."
              }
            ].map((faq, index) => (
              <div key={index} className="py-6">
                <h3 className="text-xl font-medium text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;