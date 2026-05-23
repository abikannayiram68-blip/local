import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './styles/pages.css';

const Services = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryCategory = searchParams.get('category') || '';
  const querySearch = searchParams.get('q') || '';
  const querySelectedId = searchParams.get('id') || '';
  
  const navigate = useNavigate();

  // Local state for dynamic services & filters
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const selectedCategory = queryCategory;
  const searchTerm = querySearch;
  const [maxPrice, setMaxPrice] = useState(150);
  const [sortBy, setSortBy] = useState('popular');
  
  // Booking modal state
  const [bookingModalService, setBookingModalService] = useState(null);
  const [selectedProviderId, setSelectedProviderId] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingInstructions, setBookingInstructions] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const activeBookingService = useMemo(() => {
    if (bookingModalService) return bookingModalService;
    if (!querySelectedId) return null;
    return services.find((s) => String(s.id) === String(querySelectedId)) || null;
  }, [bookingModalService, querySelectedId, services]);

  const updateServiceParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    });
    setSearchParams(nextParams, { replace: true });
  };

  const closeBookingModal = () => {
    setBookingModalService(null);
    if (querySelectedId) {
      updateServiceParams({ id: '' });
    }
  };

  // Fetch all services from DB on load
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/services');
        setServices(data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services catalogue. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // Fetch available providers when booking modal opens
  useEffect(() => {
    if (activeBookingService) {
      const fetchProviders = async () => {
        try {
          const { data } = await api.get('/bookings/providers');
          setProviders(data);
          if (data.length > 0) {
            setSelectedProviderId(data[0].id);
          } else {
            setSelectedProviderId('');
          }
        } catch (err) {
          console.error('Error fetching providers:', err);
        }
      };
      fetchProviders();
    }
  }, [activeBookingService]);

  // Handle modal booking submission
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    
    try {
      const payload = {
        service_id: activeBookingService.id,
        provider_id: selectedProviderId ? parseInt(selectedProviderId) : null,
        booking_date: bookingDate,
        booking_time: bookingTime + ':00', // Format: HH:MM:SS
        special_instructions: bookingInstructions
      };

      await api.post('/bookings', payload);
      setBookingSuccess(true);
      
      setTimeout(() => {
        setBookingSuccess(false);
        setBookingModalService(null);
        setSearchParams({});
        setBookingDate('');
        setBookingTime('');
        setBookingInstructions('');
        setSelectedProviderId('');
        navigate('/dashboard'); // Take them to their booking feed!
      }, 3000);
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingError(
        err.response?.data?.message || 
        'Authorization failed. Please log in to request an appointment.'
      );
    }
  };

  // Filtering rules
  const filteredServices = services
    .filter((service) => {
      const matchCat = selectedCategory ? service.category === selectedCategory : true;
      const matchText = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchPrice = parseFloat(service.price) <= maxPrice;
      return matchCat && matchText && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return parseFloat(a.price) - parseFloat(b.price);
      if (sortBy === 'price-high') return parseFloat(b.price) - parseFloat(a.price);
      return b.id - a.id; // Sorted by popular / newness
    });

  return (
    <div className="services-page page-container">
      <div className="services-header-box">
        <h1>Premium Local Services</h1>
        <p>Browse through our verified catalogue of vetted domestic and commercial services and schedule instantly.</p>
      </div>

      {error && (
        <div className="auth-error-alert" style={{ marginBottom: '24px', maxWidth: '800px', marginLeft: 'auto', marginRight: 'auto' }}>
          <span className="alert-icon">⚠️</span>
          <span className="alert-message">{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
          <div className="loading-spinner" style={{ width: '40px', height: '40px', borderTopColor: 'var(--secondary)' }}></div>
        </div>
      ) : (
        <div className="services-body-layout">
          {/* Filters Sidebar */}
          <aside className="filters-sidebar glass-panel">
            <div className="sidebar-widget">
              <h3>Search Catalogue</h3>
              <div className="search-bar-widget">
                <input 
                  type="text" 
                  placeholder="Search service name..." 
                  value={searchTerm}
                  onChange={(e) => updateServiceParams({ q: e.target.value })}
                  className="filter-search-input"
                />
              </div>
            </div>

            <div className="sidebar-widget">
              <h3>Filter Categories</h3>
              <div className="filter-category-list">
                <button 
                  onClick={() => updateServiceParams({ category: '' })} 
                  className={`category-filter-btn ${selectedCategory === '' ? 'active' : ''}`}
                >
                  All Categories
                </button>
                <button 
                  onClick={() => updateServiceParams({ category: 'cleaning' })} 
                  className={`category-filter-btn ${selectedCategory === 'cleaning' ? 'active' : ''}`}
                >
                  Cleaning
                </button>
                <button 
                  onClick={() => updateServiceParams({ category: 'handyman' })} 
                  className={`category-filter-btn ${selectedCategory === 'handyman' ? 'active' : ''}`}
                >
                  Repairs & Plumbing
                </button>
                <button 
                  onClick={() => updateServiceParams({ category: 'wellness' })} 
                  className={`category-filter-btn ${selectedCategory === 'wellness' ? 'active' : ''}`}
                >
                  Salon & Wellness
                </button>
                <button 
                  onClick={() => updateServiceParams({ category: 'moving' })} 
                  className={`category-filter-btn ${selectedCategory === 'moving' ? 'active' : ''}`}
                >
                  Relocation & Moving
                </button>
                <button 
                  onClick={() => updateServiceParams({ category: 'tech' })} 
                  className={`category-filter-btn ${selectedCategory === 'tech' ? 'active' : ''}`}
                >
                  Smart Tech Support
                </button>
                <button 
                  onClick={() => updateServiceParams({ category: 'gardening' })} 
                  className={`category-filter-btn ${selectedCategory === 'gardening' ? 'active' : ''}`}
                >
                  Gardening & Outdoor
                </button>
              </div>
            </div>

            <div className="sidebar-widget">
              <h3>Max Price: <span className="price-tag-display">₹{maxPrice}</span></h3>
              <input 
                type="range" 
                min="20" 
                max="200" 
                step="5" 
                value={maxPrice} 
                onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                className="price-range-slider"
              />
              <div className="range-labels">
                <span>₹20</span>
                <span>₹200</span>
              </div>
            </div>

            <div className="sidebar-widget">
              <h3>Sort By</h3>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-sort-select"
              >
                <option value="popular">Popularity / Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </aside>

          {/* Content Listing */}
          <main className="services-grid-wrapper">
            <div className="results-info-bar">
              <span>Showing {filteredServices.length} premium services match</span>
              {(selectedCategory || searchTerm || maxPrice < 150) && (
                <button 
                  onClick={() => { updateServiceParams({ category: '', q: '' }); setMaxPrice(150); }}
                  className="clear-all-filters-btn"
                >
                  Clear All Filters
                </button>
              )}
            </div>

            {filteredServices.length > 0 ? (
              <div className="services-list-grid">
                {filteredServices.map((service) => (
                  <div key={service.id} className="service-list-card glass-panel">
                    <div className="service-card-image" style={{ backgroundImage: `url(${service.image_url})` }}>
                      <span className="card-badge">{parseFloat(service.price) < 50 ? 'Special Deal' : 'Luxe Standard'}</span>
                    </div>
                    <div className="service-card-body">
                      <div className="service-card-meta">
                        <span className="service-card-category">{service.category.toUpperCase()}</span>
                        <span className="service-card-duration">⏱️ {service.duration || '1.5 Hours'}</span>
                      </div>
                      <h3 className="service-card-title">{service.title}</h3>
                      <p className="service-card-desc">{service.description}</p>
                      
                      <div className="service-card-rating">
                        <span className="rating-stars">★ 5.0</span>
                        <span className="rating-count">(Verified Specialist)</span>
                      </div>

                      <div className="service-card-footer">
                        <div className="service-card-price">
                          <span className="price-label">Starts from</span>
                          <span className="price-val">₹{parseFloat(service.price).toFixed(2)}</span>
                        </div>
                        <button 
                          onClick={() => setBookingModalService(service)} 
                          className="btn btn-primary btn-sm service-book-btn"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-services-found glass-panel">
                <span className="no-results-icon">🔍</span>
                <h3>No Services Found</h3>
                <p>We couldn't find any services matching your active filters. Try searching for a different keyword or resetting filters.</p>
                <button 
                  onClick={() => { updateServiceParams({ category: '', q: '' }); setMaxPrice(150); }}
                  className="btn btn-primary"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Glassmorphic Interactive Booking Modal */}
      {activeBookingService && (
        <div className="booking-modal-overlay">
          <div className="booking-modal-card glass-panel">
            <button className="modal-close-btn" onClick={closeBookingModal}>x</button>
            
            {bookingSuccess ? (
              <div className="booking-success-wrapper">
                <span className="success-check-icon">✓</span>
                <h2>Booking Scheduled!</h2>
                <p>Your appointment for <strong>{activeBookingService.title}</strong> has been successfully booked.</p>
                <p className="success-note">We registered your appointment. Redirecting you to your schedule portal...</p>
              </div>
            ) : (
              <>
                <div className="modal-header-section">
                  <span className="modal-category">{activeBookingService.category.toUpperCase()}</span>
                  <h2>Book Service Appointment</h2>
                  <h3 className="modal-service-title">{activeBookingService.title}</h3>
                  <div className="modal-service-price">Price: <span>₹{parseFloat(activeBookingService.price).toFixed(2)}</span></div>
                </div>

                {bookingError && (
                  <div className="auth-error-alert" style={{ margin: '12px 0 20px 0' }}>
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-message">{bookingError}</span>
                  </div>
                )}

                <form className="booking-modal-form" onSubmit={handleBookingSubmit}>
                  <div className="form-group-row">
                    <div className="form-input-group">
                      <label>Preferred Date</label>
                      <input 
                        type="date" 
                        required 
                        value={bookingDate} 
                        onChange={(e) => setBookingDate(e.target.value)}
                        className="modal-form-input" 
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="form-input-group">
                      <label>Preferred Time</label>
                      <input 
                        type="time" 
                        required 
                        value={bookingTime} 
                        onChange={(e) => setBookingTime(e.target.value)}
                        className="modal-form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-input-group">
                    <label>Select Specialist / Provider</label>
                    <div className="select-wrapper" style={{ position: 'relative' }}>
                      <select
                        value={selectedProviderId}
                        onChange={(e) => setSelectedProviderId(e.target.value)}
                        className="modal-form-input"
                        required
                        style={{ appearance: 'none', background: 'transparent', width: '100%', paddingRight: '30px' }}
                      >
                        {providers.length > 0 ? (
                          providers.map((p) => (
                            <option key={p.id} value={p.id} style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>
                              {p.user?.name || 'Vetted Professional'} (★{parseFloat(p.rating || 5).toFixed(1)})
                            </option>
                          ))
                        ) : (
                          <option value="" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-primary)' }}>
                            No providers available (Auto-assign)
                          </option>
                        )}
                      </select>
                      <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-secondary)' }}>▼</div>
                    </div>
                  </div>

                  <div className="form-input-group">
                    <label>Special Instructions (optional)</label>
                    <textarea 
                      placeholder="e.g. entry codes, key locations, specific focus areas..." 
                      value={bookingInstructions}
                      onChange={(e) => setBookingInstructions(e.target.value)}
                      className="modal-form-textarea"
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="button" 
                      onClick={closeBookingModal} 
                      className="btn btn-secondary cancel-modal-btn"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="btn btn-primary confirm-booking-btn"
                    >
                      Confirm Schedule
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Services;
