import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './styles/pages.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (searchCategory) params.append('category', searchCategory);
    navigate(`/services?${params.toString()}`);
  };

  const categories = [
    {
      id: 'cleaning',
      name: 'Premium Cleaning',
      desc: 'Deep cleaning, disinfection & maid services',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      count: '15 Experts near you'
    },
    {
      id: 'handyman',
      name: 'Repairs & Plumbing',
      desc: 'Electrical repairs, pipe plumbing & leakage patches',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
      count: '24 Experts near you'
    },
    {
      id: 'wellness',
      name: 'Salon & Wellness',
      desc: 'Relaxing massages, haircuts & facial treatments',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      count: '18 Experts near you'
    },
    {
      id: 'moving',
      name: 'Relocation & Moving',
      desc: 'Secure home/office shift & packing support',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" width="13" height="15" rx="2" ry="2" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
      count: '9 Crews near you'
    },
    {
      id: 'tech',
      name: 'Smart Tech Support',
      desc: 'WiFi repairs, TV mounting & laptop setups',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
      count: '12 Technicians near you'
    },
    {
      id: 'gardening',
      name: 'Gardening & Lawns',
      desc: 'Grass trimming, watering, potting & design',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2a15 3 0 1 0 0 30 15 3 0 1 0 0-30z" />
          <path d="M12 2a3 15 0 1 0 0 30 3 15 0 1 0 0-30z" />
        </svg>
      ),
      count: '6 Landscapers near you'
    }
  ];

  const featuredServices = [
    {
      id: 'deep-clean',
      title: 'Full House Deep Cleaning',
      category: 'cleaning',
      price: 89,
      rating: 4.9,
      reviews: 142,
      duration: '4-5 Hours',
      badge: 'Bestseller',
      img: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'ac-repair',
      title: 'AC Maintenance & Servicing',
      category: 'handyman',
      price: 49,
      rating: 4.8,
      reviews: 98,
      duration: '1.5 Hours',
      badge: 'Popular',
      img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'body-massage',
      title: 'Deep Tissue Body Massage',
      category: 'wellness',
      price: 75,
      rating: 4.9,
      reviews: 215,
      duration: '60 Minutes',
      badge: 'Top Rated',
      img: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 'sofa-shampoo',
      title: 'Sofa & Fabric Upholstery Cleaning',
      category: 'cleaning',
      price: 39,
      rating: 4.7,
      reviews: 82,
      duration: '2 Hours',
      badge: 'Discount',
      img: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-text-content">
            <div className="badge-promo">
              <span className="sparkle-icon">✨</span> Elite Local Booking Platform
            </div>
            <h1>Book Premium Local Services <span className="highlight-text">In Seconds</span></h1>
            <p className="hero-subtitle">
              Get matched instantly with pre-screened, five-star local professionals for home deep cleaning, electrical repairs, relaxing therapy, and more.
            </p>

            {/* Search Bar Form */}
            <form onSubmit={handleSearchSubmit} className="search-form-wrapper glass-panel">
              <div className="search-input-field">
                <svg className="field-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input 
                  type="text" 
                  placeholder="What service do you need today?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="main-search-input"
                />
              </div>
              <div className="category-select-field">
                <svg className="field-icon" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
                </svg>
                <select 
                  value={searchCategory} 
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="main-category-select"
                >
                  <option value="">All Categories</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="handyman">Repairs & Plumbing</option>
                  <option value="wellness">Salon & Wellness</option>
                  <option value="moving">Relocation & Moving</option>
                  <option value="tech">Smart Tech Support</option>
                  <option value="gardening">Gardening & Outdoor</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary search-submit-btn">
                Search Services
              </button>
            </form>

            {/* Search Keywords */}
            <div className="search-keywords-chips">
              <span className="chips-title">Popular:</span>
              <span onClick={() => { setSearchQuery('Deep Cleaning'); navigate('/services?q=Deep+Cleaning'); }} className="chip">Deep Cleaning</span>
              <span onClick={() => { setSearchQuery('Massage'); navigate('/services?q=Massage'); }} className="chip">Massage</span>
              <span onClick={() => { setSearchQuery('Plumbing'); navigate('/services?q=Plumbing'); }} className="chip">Plumbing</span>
            </div>
          </div>

          {/* Floating Visual Cards */}
          <div className="hero-visual-content">
            <div className="main-visual-glass glass-panel">
              <div className="visual-circle bg-glow-primary"></div>
              <div className="visual-circle bg-glow-secondary"></div>
              <div className="visual-mock-image"></div>
              
              {/* Floating Widget 1 */}
              <div className="floating-card glass-panel card-review slide-up-anim-1">
                <div className="widget-header">
                  <span className="stars">★★★★★</span>
                  <span className="time">Just now</span>
                </div>
                <p>"Excellent bathroom deep clean. Super professional!"</p>
                <span className="author">- Marcus K.</span>
              </div>

              {/* Floating Widget 2 */}
              <div className="floating-card glass-panel card-stats slide-up-anim-2">
                <div className="widget-icon">⚡</div>
                <div className="widget-text">
                  <h4>Instant Match</h4>
                  <p>In less than 45 seconds</p>
                </div>
              </div>

              {/* Floating Widget 3 */}
              <div className="floating-card glass-panel card-trust slide-up-anim-3">
                <span className="shield-icon">🛡️</span>
                <p>100% Vetted Service Pros</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="categories-section container">
        <div className="section-header">
          <h2 className="section-title">Explore Service Categories</h2>
          <p className="section-subtitle">Select a service category below to browse verified local booking professionals.</p>
        </div>
        <div className="categories-grid">
          {categories.map((cat) => (
            <Link to={`/services?category=${cat.id}`} key={cat.id} className="category-card glass-panel">
              <div className="category-icon-wrapper">
                {cat.icon}
              </div>
              <h3>{cat.name}</h3>
              <p className="category-desc">{cat.desc}</p>
              <span className="category-count">{cat.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Services */}
      <section className="featured-section">
        <div className="container">
          <div className="section-header-row">
            <div className="section-header">
              <h2 className="section-title">Trending Services</h2>
              <p className="section-subtitle">Our most frequently booked premium service packages this month.</p>
            </div>
            <Link to="/services" className="btn btn-secondary view-all-btn">
              View All Services →
            </Link>
          </div>

          <div className="services-grid">
            {featuredServices.map((service) => (
              <div key={service.id} className="service-item-card glass-panel">
                <div className="service-card-image" style={{ backgroundImage: `url(${service.img})` }}>
                  <span className="card-badge">{service.badge}</span>
                </div>
                <div className="service-card-body">
                  <div className="service-card-meta">
                    <span className="service-card-category">{service.category.toUpperCase()}</span>
                    <span className="service-card-duration">⏱️ {service.duration}</span>
                  </div>
                  <h3 className="service-card-title">{service.title}</h3>
                  <div className="service-card-rating">
                    <span className="rating-stars">★ {service.rating}</span>
                    <span className="rating-count">({service.reviews} reviews)</span>
                  </div>
                  <div className="service-card-footer">
                    <div className="service-card-price">
                      <span className="price-label">Starts from</span>
                      <span className="price-val">₹{service.price}</span>
                    </div>
                    <Link to={`/services?id=${service.id}`} className="btn btn-primary btn-sm service-book-btn">
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="pillars-section container">
        <div className="pillars-grid">
          <div className="pillar-item glass-panel">
            <div className="pillar-icon">🛡️</div>
            <h3>Fully Insured & Vetted</h3>
            <p>Every single service professional undergoes strict criminal checkups, identification audits, and practical tests.</p>
          </div>
          <div className="pillar-item glass-panel">
            <div className="pillar-icon">💰</div>
            <h3>Transparent Upfront Pricing</h3>
            <p>No hidden fees, no shady hourly surprises. Confirm exact service prices before scheduling your expert.</p>
          </div>
          <div className="pillar-item glass-panel">
            <div className="pillar-icon">🤝</div>
            <h3>100% Satisfaction Guarantee</h3>
            <p>Not happy with the output quality? We will dispatch another crew to solve it free of charge, or issue a refund.</p>
          </div>
        </div>
      </section>

      {/* Interactive Stats Showcase */}
      <section className="stats-section">
        <div className="stats-container container">
          <div className="stat-box">
            <h3 className="stat-number">120K+</h3>
            <p className="stat-desc">Bookings Completed</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number">4.9/5</h3>
            <p className="stat-desc">Rating Average</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number">1,200+</h3>
            <p className="stat-desc">Vetted Experts</p>
          </div>
          <div className="stat-box">
            <h3 className="stat-number">24/7</h3>
            <p className="stat-desc">Premium Support</p>
          </div>
        </div>
      </section>

      {/* Beautiful Testimonials Section */}
      <section className="testimonials-section container">
        <div className="section-header">
          <h2 className="section-title">What Our Elite Clients Say</h2>
          <p className="section-subtitle">Real feedback from homes and offices that trust LuxeBook daily.</p>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card glass-panel">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "LuxeBook completely changed my house cleaning routine. I booked a deep cleaner in 2 minutes, she showed up with high-end tools and left the house sparkling like a resort!"
            </p>
            <div className="testimonial-profile">
              <div className="profile-info">
                <h4>Sarah Jenkins</h4>
                <p>New York, NY</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card glass-panel">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "I had a critical plumbing leakage at midnight. Opened LuxeBook, booked an emergency handyman, and he arrived inside 30 minutes. Solved it instantly and cost exactly what was listed!"
            </p>
            <div className="testimonial-profile">
              <div className="profile-info">
                <h4>Daniel Craig</h4>
                <p>Austin, TX</p>
              </div>
            </div>
          </div>
          <div className="testimonial-card glass-panel">
            <div className="testimonial-stars">★★★★★</div>
            <p className="testimonial-text">
              "Their at-home salon and relaxation therapy packages are absolute bliss. Best massage therapist I have ever had, and I didn't even have to leave my living room."
            </p>
            <div className="testimonial-profile">
              <div className="profile-info">
                <h4>Elena Rostova</h4>
                <p>Miami, FL</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
