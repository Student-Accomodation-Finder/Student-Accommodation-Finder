import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import { 
  IoHeartOutline, 
  IoShareOutline, 
  IoImagesOutline, 
  IoChevronForward, 
  IoChatbubbleEllipsesOutline, 
  IoClose,
  IoChevronBack
} from "react-icons/io5";
import { MdShield, MdVerified } from "react-icons/md";
import { PiMapPinAreaBold, PiWifiHighBold, PiShowerBold, PiCookingPotBold } from "react-icons/pi";
import { HiMiniUsers } from "react-icons/hi2";
import { CiLock, CiCamera } from "react-icons/ci";
import { IoBulbOutline } from "react-icons/io5";
import profile  from "../../assets/profile.jpg"

function PropertyDetails() {
  const { id } = useParams();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [moveInDate, setMoveInDate] = useState("2026-10-01");

  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Fetch single property from database
  useEffect(() => {
    const fetchPropertyDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/properties/${id}`);
        const json = await response.json();

        if (json.success || json.data) {
          setProperty(json.data || json);
        } else {
          setError("Property not found");
        }
      } catch (err) {
        setError("Error connecting to server");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  if (loading) return <div className="details-loading-state">Loading property details...</div>;
  if (error || !property) return <div className="details-error-state">{error || "Property not found."}</div>;

 const defaultImages = [
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"
  ];

  const images = property.images && property.images.length > 0 ? property.images : defaultImages;

  const extraImagesCount = images.length - 3;

  const openLightbox = (index = 0) => {
    setActiveImageIndex(index);
    setIsLightboxOpen(true);
  };

  const closeLightbox = () => setIsLightboxOpen(false);

  const handleNextImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="property-details-container">
      <div className="details-gallery-grid">
        {/* Main Large Image */}
        <div className="gallery-main-item clickable" onClick={() => openLightbox(0)}>
          <img src={images[0]} alt={property.propertyName} className="gallery-main-img" />
          <button 
            className="view-all-photos-btn" 
            onClick={(e) => {
              e.stopPropagation();
              openLightbox(0);
            }}
          >
            <IoImagesOutline /> View all {images.length} photos
          </button>
        </div>

        {/* Side Preview Images */}
        <div className="gallery-sidebar-items">
          {images.length > 1 && (
            <div className="gallery-sub-item clickable" onClick={() => openLightbox(1)}>
              <img src={images[1]} alt="Secondary view" />
            </div>
          )}

          {images.length > 2 && (
            <div className="gallery-sub-item relative clickable" onClick={() => openLightbox(2)}>
              <img src={images[2]} alt="Tertiary view" />
              
              {extraImagesCount > 0 && (
                <div className="gallery-overlay-badge">
                  +{extraImagesCount} More
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Image Modal Slider */}
      {isLightboxOpen && (
        <div className="lightbox-modal-backdrop" onClick={closeLightbox}>
          <div className="lightbox-modal-content" onClick={(e) => e.stopPropagation()}>
            
            <button className="lightbox-close-btn" onClick={closeLightbox} aria-label="Close">
              <IoClose />
            </button>

            {/* Slider Controls */}
            {images.length > 1 && (
              <button className="lightbox-arrow left" onClick={handlePrevImage} aria-label="Previous image">
                <IoChevronBack />
              </button>
            )}

            <div className="lightbox-image-wrapper">
              <img src={images[activeImageIndex]} alt={`Listing ${activeImageIndex + 1}`} />
              <div className="lightbox-counter">
                {activeImageIndex + 1} / {images.length}
              </div>
            </div>

            {images.length > 1 && (
              <button className="lightbox-arrow right" onClick={handleNextImage} aria-label="Next image">
                <IoChevronForward />
              </button>
            )}

            <div className="lightbox-thumbnails-bar">
              {images.map((img, idx) => (
                <img 
                  key={idx} 
                  src={img} 
                  alt="" 
                  className={`lightbox-thumb ${idx === activeImageIndex ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                />
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Main Content & Sidebar Layout */}
      <div className="details-content-layout">
        <div className="details-main-left">
          <div className="details-title-row">
            <div>
              <h1 className="details-property-title">{property.propertyName || "Pine Breeze Apartments"}</h1>
              <p className="details-location-subtext">
                <PiMapPinAreaBold className="loc-icon" /> {property.location || "Juja, near JKUAT Main Gate"}
              </p>
            </div>
            <div className="details-header-actions">
              <button className="action-circle-btn" title="Save to wishlist"><IoHeartOutline /></button>
              <button className="action-circle-btn" title="Share property"><IoShareOutline /></button>
            </div>
          </div>

          <div className="details-amenity-pills">
            <span className="details-pill"><PiWifiHighBold /> High-Speed WiFi</span>
            <span className="details-pill"><PiShowerBold /> Instant Shower</span>
            <span className="details-pill"><PiCookingPotBold /> Kitchenette</span>
          </div>

          <div className="safety-first-card">
            <div className="safety-card-header">
              <div className="safety-title-group">
                <MdShield className="shield-icon-gold" />
                <h3>Student Safety First</h3>
              </div>
              <span className="safety-rating-badge">4.8 / 5.0 Rating</span>
            </div>

            <div className="safety-specs-grid">
              <div className="safety-spec-item">
                <span className="spec-title"><CiLock style={{fontSize: '16px'}}/> Gated Community</span>
                <p className="spec-desc">Controlled access with a 24/7 security guard at the main entrance.</p>
              </div>
              <div className="safety-spec-item">
                <span className="spec-title"><CiCamera style={{fontSize: '16px'}}/> CCTV Surveillance</span>
                <p className="spec-desc">Full coverage of corridors, parking, and common areas with cloud backup.</p>
              </div>
              <div className="safety-spec-item">
                <span className="spec-title"><IoBulbOutline style={{fontSize: '16px'}}/> Well-lit Path</span>
                <p className="spec-desc">Motion-sensor lighting from the gate to your room door for night safety.</p>
              </div>
            </div>
          </div>

          <div className="landlord-profile-card">
            <div className="landlord-info-group">
              <img 
                src={profile} 
                alt="Landlord" 
                className="landlord-avatar" 
              />
              <div>
                <div className="landlord-name-row">
                  <h4>John Doe</h4>
                  <span className="verified-host-badge"><MdVerified /> VERIFIED HOST</span>
                </div>
                <p className="landlord-stats-text">Host since 2019 • 45 Verified Bookings</p>
              </div>
            </div>
            <button className="message-landlord-btn">
              <IoChatbubbleEllipsesOutline /> Message Landlord
            </button>
          </div>

          <div className="details-section-block">
            <h3 className="section-block-title">About this Property</h3>
            <p className="section-block-body">
              {property.about || 
                "Welcome to Pine Breeze, Juja's premier student accommodation. This studio was designed specifically for the modern student who values both focus and comfort. Located just a 5-minute walk from the JKUAT main gate, you'll save on commute time while enjoying a serene environment. The studio comes with high-speed internet included in the rent, a dedicated study desk, and premium security features that give you and your parents peace of mind."}
            </p>
          </div>
        </div>

        <div className="details-sidebar-right">
          <div className="booking-sticky-card">
            <h2 className="booking-price-header">{property.price} KES <span className="per-month">/ month</span></h2>

            <div className="booking-input-group">
              <label>MOVE-IN DATE</label>
              <input 
                type="date" 
                value={moveInDate} 
                onChange={(e) => setMoveInDate(e.target.value)} 
                className="booking-date-picker" 
              />
            </div>

            <button className="book-viewing-cta-btn">Book a Viewing</button>

            <p className="booking-guarantee-text">
              No payment required until you've seen the property and signed the protected lease.
            </p>

            <hr className="booking-divider" />

            <div className="roommates-wanted-block">
              <div className="roommates-header">
                <HiMiniUsers className="roommates-icon" />
                <span>Roommates Wanted (2)</span>
              </div>

              <div className="roommate-item-card">
                <img src={profile} alt="roommate" />
                <div className="roommate-info">
                  <h5>Kevin, Computer Science</h5>
                  <p>Quiet, late-night coder</p>
                </div>
                <IoChevronForward className="arrow-icon" />
              </div>

              <div className="roommate-item-card">
                <img src={profile} alt="roommate" />
                <div className="roommate-info">
                  <h5>Sarah, Engineering</h5>
                  <p>Clean, loves weekend hikes</p>
                </div>
                <IoChevronForward className="arrow-icon" />
              </div>

              <Link to="/" className="find-more-roommates-link">
                Find more matches here
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default PropertyDetails;
