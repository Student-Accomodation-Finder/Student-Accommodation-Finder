import React, { useState, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { MdOutlineVerified } from "react-icons/md";
import { MdVerified } from "react-icons/md";
import { RiMap2Line } from "react-icons/ri";
import { HiMiniArrowsUpDown } from "react-icons/hi2";
import { MdShield } from "react-icons/md";
import { PiMapPinAreaBold } from "react-icons/pi";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

const recentlyViewed = [
  { id: 1, title: "Apex Suites", price: "11,000 KES/mo", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=120&q=80" },
  { id: 2, title: "Oakwood Flats", price: "9,500 KES/mo", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=120&q=80" },
];

const studentFavorites = [
  { label: "Near Gate A", count: "12 Properties" },
  { label: "Bedsitters < 10k", count: "8 Properties" },
  { label: "Female Hostels", count: "15 Properties" },
];

function FindHousing() {

  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  
  const [searchInput, setSearchInput] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [maxPrice, setMaxPrice] = useState("");
  const [selectedRoomType, setSelectedRoomType] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties from your database
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/properties");
        const json = await response.json();
        
        if (json.success) {
          setProperties(json.data);
        } else {
          setError("Failed to fetch properties");
        }
      } catch (err) {
        setError("Error connecting to the server");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setActiveSearch(searchInput);
  };

  const filteredListings = properties.filter((property) => {

    const query = activeSearch.toLowerCase().trim();
    const matchesName = property.propertyName?.toLowerCase().includes(query);
    const matchesLocation = property.location?.toLowerCase().includes(query);
    const matchesSearch = !query || matchesName || matchesLocation;

    const roomTypeString = (property.roomType || property.propertyName || "").toLowerCase();
    const matchesRoom = selectedRoomType === "all" || roomTypeString.includes(selectedRoomType.toLowerCase());

    const numericPrice = typeof property.price === "number" 
      ? property.price 
      : parseInt(String(property.price || 0).replace(/[^0-9]/g, ""), 10) || 0;
    const matchesPrice = !maxPrice || numericPrice <= Number(maxPrice);

    const matchesVerified = !verifiedOnly || property.status === "verified";

    return matchesSearch && matchesRoom && matchesPrice && matchesVerified;
  });

  return (
    <div className="search-page-container">

      <div className="search-control-panel">
        <form onSubmit={handleSearch} className="search-input-wrapper">
          <IoSearch className="panel-icon" />
          <input 
            type="text" 
            placeholder="Search by property name or location near JKUAT..." 
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="panel-search-input" 
          />
          <button type="submit" className="panel-search-btn">Search</button>
        </form>
        
        <div className="filters-row-wrapper">
          <div className="filter-pills-group">
            <select 
              value={maxPrice} 
              onChange={(e) => setMaxPrice(e.target.value)}
              className="filter-pill dropdown"
              style={{ cursor: "pointer", border: "none", outline: "none", background: "transparent" }}
            >
              <option value="">Price: All KES</option>
              <option value="5000">Max: 5,000 KES</option>
              <option value="10000">Max: 10,000 KES</option>
              <option value="15000">Max: 15,000 KES</option>
              <option value="20000">Max: 20,000 KES</option>
            </select>

            <select 
              value={selectedRoomType} 
              onChange={(e) => setSelectedRoomType(e.target.value)}
              className="filter-pill dropdown"
              style={{ cursor: "pointer", border: "none", outline: "none", background: "transparent" }}
            >
              <option value="all">Room: All Types</option>
              <option value="bedsitter">Bed-sitter</option>
              <option value="single">Single Room</option>
              <option value="1 bedroom">1 Bedroom</option>
              <option value="2 bedroom">2 Bedroom</option>
            </select>

            <button 
              type="button"
              className={`filter-pill ${verifiedOnly ? "active" : ""}`}
              onClick={() => setVerifiedOnly(!verifiedOnly)}
            >
              <MdOutlineVerified className="filters-icons" />
              {verifiedOnly ? "Verified Only ✓" : "Verified Only"}
            </button>
          </div>

          <button className="map-toggle-btn">
            <RiMap2Line className="map-icon" />
            Show Map
          </button>
        </div>
      </div>

      <div className="search-results-layout">        
        <div className="listings-column-left">
          <div className="results-meta-header">
            <h3 className="results-count-title">{filteredListings.length} Results Found</h3>
            <button className="sort-dropdown-trigger">
              Sort by: Recommended 
              <HiMiniArrowsUpDown className="sort-icon" />
            </button>
          </div>

          {loading && <p>Loading housing choices...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && (
            <div className="search-listings-grid">
              {filteredListings.map((listing) => (
                <div key={listing._id} className="search-listing-card">
                  <div className="card-image-container">
                    <img 
                      src={listing.images && listing.images.length > 0 ? listing.images[0] : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=500&q=80"} 
                      alt={listing.propertyName} 
                      className="card-main-img" 
                    />
                    <span className="card-price-tag">{listing.price} KES/mo</span>
                    <span className="card-safety-badge">
                      <MdShield className="card-safety-badge-icon"/>{" "}
                      {typeof listing.safety === "object" && listing.safety !== null ? (
                        `${Object.values(listing.safety).filter(Boolean).length} Verified Specs`
                      ) : typeof listing.amenities === "object" && listing.amenities !== null ? (
                        `${Object.values(listing.amenities).filter(Boolean).length} Secure Specs`
                      ) : (
                        `${listing.safety || "4.5"} Safety`
                      )}
                    </span>
                    <div className="card-dots-indicator">
                      <span className="dot active"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </div>
                  </div>

                  <div className="card-body-content">
                    <div className="card-title-row">
                      <h4 className="card-main-title">{listing.propertyName}</h4>
                      {listing.status === "verified" && (
                        <span className="card-verified-lbl">
                          <MdVerified className="checkmark-icon" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="card-location-text">
                      <PiMapPinAreaBold className="card-location-text-icon"/> {listing.location} ({listing.distance || "0"} mins away)
                    </p>
                    
                    <hr className="card-inner-divider" />
                    
                    <div className="card-amenities-row">
                      {Array.isArray(listing.amenities) ? (
                        listing.amenities.map((amenity, i) => (
                          <span key={i} className="amenity-tag-pill">{amenity}</span>
                        ))
                      ) : typeof listing.amenities === "object" && listing.amenities !== null ? (
                        Object.entries(listing.amenities)
                          .filter(([_, value]) => value === true || value === "true")
                          .map(([key], i) => (
                            <span key={i} className="amenity-tag-pill">
                              {key === "cctv" ? "CCTV Camera" : key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                          ))
                      ) : (
                        <span className="amenity-tag-pill empty">Standard Amenities</span>
                      )}
                    </div>

                    <div className="card-actions-footer">
                      <button className="details-action-btn" onClick={() => navigate(`/property/${listing._id}`)}>View Details</button>
                      <button className="bookmark-action-btn">
                        <CiBookmark className="bookmark-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {!loading && filteredListings.length === 0 && (
            <p>No listings match your search criteria.</p>
          )}
        </div>
        
        <div className="sidebar-column-right">
          <div className="sidebar-widget-card">
            <h4 className="widget-header-title">Recently Viewed</h4>
            <div className="recently-viewed-list">
              {recentlyViewed.map((item) => (
                <div key={item.id} className="recent-item-row">
                  <img src={item.img} alt={item.title} className="recent-thumb-img" />
                  <div className="recent-item-info">
                    <h5 className="recent-item-title">{item.title}</h5>
                    <p className="recent-item-price">{item.price}</p>
                    <span className="recent-verified-badge"><MdVerified className="recent-verified-badge-icon"/> Verified</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-safety-banner">
            <h4 className="safety-banner-title">Safety First</h4>
            <p className="safety-banner-body">
              All listings near JKUAT are physically verified by our campus ambassadors.
            </p>
            <button className="safety-banner-btn">Learn about Safety</button>
          </div>

          <div className="sidebar-widget-card">
            <h4 className="widget-header-title">Student Favorites</h4>
            <div className="favorites-pills-list">
              {studentFavorites.map((fav, i) => (
                <div key={i} className="favorite-pill-row">
                  <span className="fav-label">{fav.label}</span>
                  <span className="fav-count-badge">{fav.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindHousing;