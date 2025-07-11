import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, Grid3X3, List, Plus, Minus, X, Home, Tag, Zap, Phone, Mail, MapPin, Clock, HelpCircle, Package, Users, Award, Flame, Timer, TrendingDown, Menu, CheckCircle } from 'lucide-react';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://dummyjson.com/products?limit=100');
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.products.map(product => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        (product.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.brand || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.category || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        // Keep original order
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  // Toast functions
  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type });
    
    setTimeout(() => {
      setToast(null);
    }, duration);
  };

  const removeToast = () => {
    setToast(null);
  };

  // Cart functions
  const addToCart = (product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        showToast(`Updated ${product.title} quantity in cart`, 'success');
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        showToast(`${product.title} added to cart!`, 'success');
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    const item = cart.find(item => item.id === productId);
    if (item) {
      showToast(`${item.title} removed from cart`, 'info');
    }
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
    }
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const discountedPrice = calculateDiscountedPrice(item.price, item.discountPercentage);
      return total + (discountedPrice * item.quantity);
    }, 0);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  const getDealsProducts = () => {
    return products.filter(product => product.discountPercentage >= 20);
  };

  const renderHomePage = () => (
    <>
      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products, brands, categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {categories.slice(0, 6).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="default">Sort by</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="name">Name A-Z</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                <Grid3X3 size={20} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'
                }`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
          {searchTerm && ` for "${searchTerm}"`}
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        </p>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              <div className={`${viewMode === 'list' ? 'w-48 flex-shrink-0' : ''}`}>
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className={`w-full object-cover ${
                    viewMode === 'list' ? 'h-48' : 'h-48'
                  }`}
                />
              </div>
              <div className="p-4 flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.title}
                  </h3>
                  {product.discountPercentage > 0 && (
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                      -{Math.round(product.discountPercentage)}%
                    </span>
                  )}
                </div>
                
                <p className="text-sm text-gray-600 mb-2 capitalize">{product.brand} • {product.category}</p>
                
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-2">
                    {renderStars(product.rating)}
                  </div>
                  <span className="text-sm text-gray-600">({product.rating})</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${calculateDiscountedPrice(product.price, product.discountPercentage).toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    product.stock > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.stock > 0 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>

                <button 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                  className={`w-full mt-4 py-2 px-4 rounded-lg transition-colors duration-200 font-medium ${
                    product.stock === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );

  const renderCategoriesPage = () => (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
        <p className="text-gray-600">Discover products across all our categories</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {categories.map((category) => {
          const categoryProducts = products.filter(p => p.category === category);
          const sampleProduct = categoryProducts[0];
          
          return (
            <div
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage('home');
              }}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer group"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={sampleProduct?.thumbnail || 'https://via.placeholder.com/300'}
                  alt={category}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 capitalize mb-2">{category}</h3>
                <p className="text-sm text-gray-600">{categoryProducts.length} products</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderDealsPage = () => {
    const dealsProducts = getDealsProducts();
    
    return (
      <div>
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-red-600 via-pink-600 to-purple-600 rounded-2xl p-8 mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="absolute top-4 right-4 animate-bounce">
            <Flame className="h-12 w-12 text-yellow-300" />
          </div>
          <div className="absolute bottom-4 left-4 animate-pulse">
            <Timer className="h-8 w-8 text-yellow-300" />
          </div>
          <div className="relative z-10 text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <Zap className="h-8 w-8 mr-2 text-yellow-300" />
              <h1 className="text-4xl font-bold">🔥 HOT DEALS 🔥</h1>
              <Zap className="h-8 w-8 ml-2 text-yellow-300" />
            </div>
            <p className="text-xl mb-4">Save BIG on Premium Products!</p>
            <div className="flex items-center justify-center space-x-4 text-lg">
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                <span className="font-bold">{dealsProducts.length}</span> Hot Deals
              </div>
              <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
                Up to <span className="font-bold">50%</span> OFF
              </div>
            </div>
          </div>
        </div>

        {/* Deal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200">
            <div className="flex items-center mb-3">
              <TrendingDown className="h-6 w-6 text-red-600 mr-2" />
              <h3 className="text-lg font-bold text-red-800">Mega Discounts</h3>
            </div>
            <p className="text-red-700 mb-2">Products with 30%+ OFF</p>
            <p className="text-2xl font-bold text-red-600">
              {dealsProducts.filter(p => p.discountPercentage >= 30).length} Items
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-2 border-orange-200">
            <div className="flex items-center mb-3">
              <Award className="h-6 w-6 text-orange-600 mr-2" />
              <h3 className="text-lg font-bold text-orange-800">Premium Deals</h3>
            </div>
            <p className="text-orange-700 mb-2">High-rated products on sale</p>
            <p className="text-2xl font-bold text-orange-600">
              {dealsProducts.filter(p => p.rating >= 4.5).length} Items
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
            <div className="flex items-center mb-3">
              <Package className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-bold text-purple-800">Limited Stock</h3>
            </div>
            <p className="text-purple-700 mb-2">Hurry! Limited quantities</p>
            <p className="text-2xl font-bold text-purple-600">
              {dealsProducts.filter(p => p.stock <= 10).length} Items
            </p>
          </div>
        </div>

        {/* Deals Products Grid */}
        {dealsProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Tag size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No deals available</h3>
            <p className="text-gray-600">Check back later for amazing deals!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dealsProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-red-100 hover:border-red-300 group relative"
              >
                {/* Deal Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-pulse">
                    🔥 {Math.round(product.discountPercentage)}% OFF
                  </div>
                </div>
                
                {/* Limited Stock Badge */}
                {product.stock <= 10 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      Only {product.stock} left!
                    </div>
                  </div>
                )}

                <div className="relative overflow-hidden">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-red-600 transition-colors">
                    {product.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 capitalize font-medium">
                    {product.brand} • {product.category}
                  </p>
                  
                  <div className="flex items-center mb-3">
                    <div className="flex items-center mr-2">
                      {renderStars(product.rating)}
                    </div>
                    <span className="text-sm text-gray-600 font-medium">({product.rating})</span>
                  </div>

                  {/* Price Section with Enhanced Styling */}
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 p-3 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl font-bold text-red-600">
                            ${calculateDiscountedPrice(product.price, product.discountPercentage).toFixed(2)}
                          </span>
                          <span className="text-lg text-gray-500 line-through">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-green-600 font-semibold">
                          You save ${(product.price - calculateDiscountedPrice(product.price, product.discountPercentage)).toFixed(2)}!
                        </p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className={`w-full py-3 px-4 rounded-lg transition-all duration-200 font-bold text-lg shadow-lg ${
                      product.stock === 0
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:from-red-600 hover:to-pink-600 transform hover:scale-105 hover:shadow-xl'
                    }`}
                  >
                    {product.stock === 0 ? 'Sold Out' : '🛒 Grab This Deal!'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderContactPage = () => (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
        <p className="text-gray-600">We're here to help! Get in touch with our team.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Form */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Send us a message</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="How can we help?"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us more about your inquiry..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Get in touch</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">support@smartkart.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">123 Commerce St, Business City, BC 12345</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-gray-700">Mon-Fri: 9AM-6PM EST</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">FAQ</h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">How do I track my order?</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">You'll receive a tracking number via email once your order ships.</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">What's your return policy?</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">We offer 30-day returns on most items in original condition.</p>
              </div>
              <div>
                <div className="flex items-center mb-1">
                  <HelpCircle className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="font-medium text-gray-900">Do you offer international shipping?</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">Yes, we ship to most countries worldwide with various shipping options.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-blue-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">SmartKart</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <nav className="hidden md:flex space-x-8">
                <button 
                  onClick={() => setCurrentPage('home')}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === 'home' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Home size={16} />
                  <span>Home</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('categories')}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === 'categories' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Tag size={16} />
                  <span>Categories</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('deals')}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === 'deals' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Zap size={16} />
                  <span>Deals</span>
                </button>
                <button 
                  onClick={() => setCurrentPage('contact')}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === 'contact' ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  <Phone size={16} />
                  <span>Contact</span>
                </button>
              </nav>
            </div>
          </div>
          
          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                <button 
                  onClick={() => {
                    setCurrentPage('home');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'home' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home size={20} />
                  <span>Home</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('categories');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'categories' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Tag size={20} />
                  <span>Categories</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('deals');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'deals' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Zap size={20} />
                  <span>Deals</span>
                </button>
                <button 
                  onClick={() => {
                    setCurrentPage('contact');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === 'contact' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Phone size={20} />
                  <span>Contact</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed top-20 right-4 z-50">
          <div
            className={`flex items-center p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out max-w-sm ${
              toast.type === 'success' 
                ? 'bg-green-500 text-white' 
                : toast.type === 'error' 
                ? 'bg-red-500 text-white' 
                : 'bg-blue-500 text-white'
            } animate-slide-in`}
          >
            <div className="flex items-center space-x-3">
              {toast.type === 'success' && <CheckCircle className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'error' && <X className="h-5 w-5 flex-shrink-0" />}
              {toast.type === 'info' && <ShoppingCart className="h-5 w-5 flex-shrink-0" />}
              <span className="text-sm font-medium flex-1">{toast.message}</span>
              <button
                onClick={removeToast}
                className="ml-2 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)}></div>
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex flex-col h-full">
              {/* Cart Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Shopping Cart</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Your cart is empty</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                          <p className="text-sm text-gray-600">${calculateDiscountedPrice(item.price, item.discountPercentage).toFixed(2)}</p>
                          <div className="flex items-center space-x-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-200 rounded"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Cart Footer */}
              {cart.length > 0 && (
                <div className="border-t p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render Current Page */}
        {currentPage === 'home' && renderHomePage()}
        {currentPage === 'categories' && renderCategoriesPage()}
        {currentPage === 'deals' && renderDealsPage()}
        {currentPage === 'contact' && renderContactPage()}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 SmartKart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;