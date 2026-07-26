import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Search, Users } from "lucide-react";
import "./Findroommates.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Avatar({ photoUrl, name, size = 64 }) {
  return (
    <div className="fr-avatar" style={{ width: size, height: size }}>
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name || "profile"}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        <span style={{ fontSize: size * 0.4, color: "#9ca3af" }}>
          {name ? name.charAt(0).toUpperCase() : "?"}
        </span>
      )}
    </div>
  );
}

function TagPill({ children }) {
  return <span className="fr-tag">{children}</span>;
}

function FilterChip({ label, active, onClick }) {
  return (
    <button
      type="button"
      className={`fr-chip ${active ? "fr-chip-active" : ""}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function MatchPercent({ percent }) {
  return <span className="fr-match-percent">{percent}%</span>;
}

function SmallCard({ roommate }) {
  return (
    <div className="fr-small-card">
      <div className="fr-small-card-top">
        <div className="fr-small-card-user">
          <Avatar photoUrl={roommate.photoUrl} name={roommate.name} size={40} />
          <div>
            <p className="fr-small-name">{roommate.name}</p>
            <p className="fr-small-sub">{roommate.subtitle}</p>
          </div>
        </div>
        <MatchPercent percent={roommate.matchPercent} />
      </div>
    </div>
  );
}

export default function RoommateMatching() {
  const [roommates, setRoommates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState({
    nearCampus: false,
    under15k: false,
    femaleOnly: false,
    engineering: false,
  });

  const toggleFilter = (key) => {
    setActiveFilters((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filterSectionRef = useRef(null);

  const scrollToFilters = () => {
    filterSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  useEffect(() => {
    let cancelled = false;

    async function fetchRoommates() {
      try {
       console.log("API_BASE:", API_BASE);

const res = await axios.get(`${API_BASE}/api/roommates`);

console.log("Response:", res.data);

        if (!cancelled) {
          setRoommates(res.data.data); // backend wraps results as { success, count, data }
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Couldn't load roommates. Is the server running?");
          setLoading(false);
        }
      }
    }

    fetchRoommates();
    return () => {
      cancelled = true;
    };
  }, []);

  // Filter by name, school, or subtitle — case-insensitive, matches the search bar's placeholder
  const filteredRoommates = roommates.filter((r) => {
    const term = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !term ||
      r.name?.toLowerCase().includes(term) ||
      r.school?.toLowerCase().includes(term) ||
      r.subtitle?.toLowerCase().includes(term);

    if (!matchesSearch) return false;

    if (activeFilters.nearCampus && !r.nearCampus) return false;
    if (activeFilters.under15k && !(typeof r.budget === "number" && r.budget <= 15000)) return false;
    if (activeFilters.femaleOnly && r.gender !== "female") return false;
    if (activeFilters.engineering) {
      const text = `${r.subtitle || ""} ${(r.tags || []).join(" ")}`.toLowerCase();
      if (!text.includes("engineering")) return false;
    }

    return true;
  });

  const featured = filteredRoommates.find((r) => r.featured) || filteredRoommates[0];
  const sideMatch = filteredRoommates.find((r) => r._id !== featured?._id);
  const rest = filteredRoommates.filter(
    (r) => r._id !== featured?._id && r._id !== sideMatch?._id
  );

  return (
    <div className="fr-page">
 

      <main className="fr-main">
        <div className="fr-hero-row">
          <div>
            <h1 className="fr-hero-title">Find Your Perfect Co-Living Match</h1>
            <p className="fr-hero-sub">
              Connect with students who share your lifestyle, study habits, and values.
              Reliable roommate matching for a stress-free campus life.
            </p>
          </div>

          <div className="fr-quiz-card">
            <div className="fr-quiz-top">
              <span className="fr-quiz-label">Compatibility Quiz</span>
              <span className="fr-quiz-percent">
                {/* Placeholder: no auth yet, so this shows the featured profile's
                    completion as a stand-in for "your" progress. Swap `featured?._id`
                    for the logged-in user's own roommate ID once auth is added. */}
                {featured ? `${featured.quizCompletion || 0}% Complete` : "0% Complete"}
              </span>
            </div>
            <div className="fr-progress-track">
              <div
                className="fr-progress-fill"
                style={{ width: `${featured?.quizCompletion || 0}%` }}
              />
            </div>
            {featured ? (
              <Link to={`/quiz/${featured._id}`} className="fr-link-btn fr-quiz-link">
                Complete your profile to reach 100%
              </Link>
            ) : (
              <span className="fr-quiz-link">Complete your profile to reach 100%</span>
            )}
          </div>
        </div>

        <div className="fr-search-row" ref={filterSectionRef}>
          <div className="fr-search-wrap">
            <Search className="fr-search-icon" />
            <input
              type="text"
              placeholder="Search by University or Area..."
              className="fr-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="fr-filters">
            <FilterChip
              label="Near Campus"
              active={activeFilters.nearCampus}
              onClick={() => toggleFilter("nearCampus")}
            />
            <FilterChip
              label="Under 15k KES"
              active={activeFilters.under15k}
              onClick={() => toggleFilter("under15k")}
            />
            <FilterChip
              label="Female Only"
              active={activeFilters.femaleOnly}
              onClick={() => toggleFilter("femaleOnly")}
            />
            <FilterChip
              label="Engineering Students"
              active={activeFilters.engineering}
              onClick={() => toggleFilter("engineering")}
            />
          </div>
        </div>

        {loading && <p>Loading roommates...</p>}
        {error && <p style={{ color: "#dc2626" }}>{error}</p>}

        {!loading && !error && filteredRoommates.length === 0 && (
          <p>
            {searchTerm
              ? `No roommates match "${searchTerm}".`
              : "No roommate profiles yet — add some via the API."}
          </p>
        )}

        {!loading && !error && filteredRoommates.length > 0 && (
          <>
            <div className="fr-featured-grid">
              {featured && (
                <div className="fr-card fr-featured-card">
                  <div className="fr-photo-wrap">
                    <div className="fr-photo">
                      <Avatar photoUrl={featured.photoUrl} name={featured.name} size={112} />
                    </div>
                    {featured.verified && (
                      <span className="fr-verified-badge">✓ Verified</span>
                    )}
                  </div>

                  <div className="fr-featured-body">
                    <div className="fr-featured-head">
                      <div>
                        <h3 className="fr-name">{featured.name}</h3>
                        <p className="fr-school">{featured.school}</p>
                      </div>
                      <span className="fr-match-badge">
                        {featured.matchPercent}% MATCH
                      </span>
                    </div>

                    <div className="fr-tags">
                      {(featured.tags || []).map((tag, i) => (
                        <TagPill key={i}>{tag}</TagPill>
                      ))}
                    </div>

                    {featured.quote && <p className="fr-quote">"{featured.quote}"</p>}
                  </div>
                </div>
              )}

              {sideMatch && (
                <div className="fr-card">
                  <div className="fr-side-card-head">
                    <Avatar photoUrl={sideMatch.photoUrl} name={sideMatch.name} size={44} />
                    <div>
                      <p className="fr-side-name">{sideMatch.name}</p>
                      <p className="fr-side-sub">{sideMatch.matchPercent}% Compatibility</p>
                    </div>
                  </div>
                  <ul className="fr-check-list">
                    {(sideMatch.highlights || []).map((h, i) => (
                      <li className="fr-check-item" key={i}>
                        <span className="fr-check-mark">✓</span> {h}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="fr-small-grid">
              {rest.map((r) => (
                <SmallCard key={r._id} roommate={r} />
              ))}

              <div className="fr-cta-card">
                <Users size={24} />
                <p className="fr-cta-title">More Matches?</p>
                <p className="fr-cta-sub">
                  Refine your preferences to see students near you.
                </p>
                <button type="button" className="fr-btn-gold" onClick={scrollToFilters}>
                  Filter Results
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}