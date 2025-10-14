"use client";

import Navbar from "../../components/Navbar.jsx"
import Footer from "../../components/Footer.jsx"
import { useState, useMemo } from "react";
import "../../styles/agents.css";
import {
    Search,
    Star,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Shield,
    Award,
    DollarSign,
} from "react-feather";

const SAMPLE_AGENTS = [
    {
        id: 1,
        name: "Rahul Sharma",
        company: "Elite Realtors, Bangalore",
        rating: 4.2,
        reviews: 24,
        bio:
            "Specializes in luxury properties and commercial real estate with over 8 years of experience in Bangalore market.",
        properties: 42,
        experience: "8 years",
        response: "1 hour",
        img: "http://static.photos/people/200x200/9",
        verified: true,
    },
    {
        id: 2,
        name: "Priya Patel",
        company: "Sunshine Properties, Mumbai",
        rating: 4.9,
        reviews: 38,
        bio:
            "Expert in residential properties with a focus on South Mumbai. Known for excellent client service and market knowledge.",
        properties: 67,
        experience: "12 years",
        response: "30 mins",
        img: "http://static.photos/people/200x200/10",
        verified: true,
    },
    {
        id: 3,
        name: "Amit Joshi",
        company: "Urban Spaces, Delhi",
        rating: 4.1,
        reviews: 15,
        bio:
            "Specializes in commercial properties and office spaces in Delhi NCR. Strong connections with corporate clients.",
        properties: 28,
        experience: "5 years",
        response: "2 hours",
        img: "http://static.photos/people/200x200/11",
        verified: true,
    },
    {
        id: 4,
        name: "Neha Gupta",
        company: "Dream Homes, Hyderabad",
        rating: 5.0,
        reviews: 42,
        bio:
            "Top-rated agent in Hyderabad with expertise in gated communities and luxury villas. Fluent in English, Hindi, and Telugu.",
        properties: 89,
        experience: "10 years",
        response: "15 mins",
        img: "http://static.photos/people/200x200/12",
        verified: true,
    },
];

export default function FindAgents() {
    const [query, setQuery] = useState("");
    const [propertyType, setPropertyType] = useState("All");
    const [sortBy, setSortBy] = useState("Recommended");
    const [filters, setFilters] = useState({
        locations: new Set(),
        specializations: new Set(),
        experience: new Set(),
        rating: new Set(),
    });

    function toggleSet(setName, value) {
        setFilters((prev) => {
            const copy = {
                locations: new Set(prev.locations),
                specializations: new Set(prev.specializations),
                experience: new Set(prev.experience),
                rating: new Set(prev.rating),
            };
            if (copy[setName].has(value)) copy[setName].delete(value);
            else copy[setName].add(value);
            return copy;
        });
    }

    const filteredAgents = useMemo(() => {
        let list = SAMPLE_AGENTS.slice();

        // search by name or company or location (not available in sample; just name/company)
        if (query.trim() !== "") {
            const q = query.toLowerCase();
            list = list.filter(
                (a) =>
                    a.name.toLowerCase().includes(q) ||
                    a.company.toLowerCase().includes(q) ||
                    a.bio.toLowerCase().includes(q)
            );
        }

        // propertyType filter: sample doesn't have property types per agent; skip for now

        // rating filter example (if user chose 4+ etc)
        if (filters.rating.size > 0) {
            // convert set like {"4"} -> filter rating >= 4
            let minRating = 0;
            if (filters.rating.has("4")) minRating = 4;
            if (filters.rating.has("3")) minRating = Math.min(minRating || 3, 3);
            if (minRating) {
                list = list.filter((a) => a.rating >= minRating);
            }
        }

        // simple sorting
        if (sortBy === "Highest Rated") {
            list.sort((x, y) => y.rating - x.rating);
        } else if (sortBy === "Most Experienced") {
            // crude numeric parse from "8 years"
            list.sort(
                (x, y) =>
                    parseInt(y.experience, 10) - parseInt(x.experience, 10)
            );
        } else if (sortBy === "Most Listings") {
            list.sort((x, y) => y.properties - x.properties);
        }

        return list;
    }, [query, propertyType, sortBy, filters]);

    return (

        <>
            <Navbar />
            <div className="faPage">
                {/* Header */}
                <header className="faHeader">
                    <div className="faHeaderInner">
                        <h1 className="faTitle">Find the Perfect Real Estate Agent</h1>
                        <p className="faSubtitle">
                            Connect with top-rated agents who specialize in your area and property type
                        </p>

                        <div className="faSearchCard">
                            <div className="faSearchRow">
                                <label className="faSearchBox">
                                    <Search className="faSearchIcon" />
                                    <input
                                        type="text"
                                        placeholder="Search by location or agent name"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        className="faInput"
                                    />
                                </label>

                                <select
                                    className="faSelect"
                                    value={propertyType}
                                    onChange={(e) => setPropertyType(e.target.value)}
                                >
                                    <option>All Property Types</option>
                                    <option>Residential</option>
                                    <option>Commercial</option>
                                    <option>Land</option>
                                </select>

                                <button className="faPrimaryBtn">Search Agents</button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main */}
                <main className="faContainer">
                    <div className="faLayout">
                        {/* Filters Sidebar */}
                        <aside className="faSidebar">
                            <div className="faFilterCard">
                                <h3 className="faFilterTitle">Filters</h3>

                                <div className="faFilterSection">
                                    <h4 className="faFilterHeading">Location</h4>
                                    <div className="faChkList">
                                        {["Bangalore", "Mumbai", "Delhi", "Hyderabad"].map((loc) => (
                                            <label key={loc} className="faChkItem">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.locations.has(loc)}
                                                    onChange={() => toggleSet("locations", loc)}
                                                />
                                                <span>{loc}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="faFilterSection">
                                    <h4 className="faFilterHeading">Specialization</h4>
                                    <div className="faChkList">
                                        {["Residential", "Commercial", "Luxury Homes", "Rental Properties"].map(
                                            (s) => (
                                                <label key={s} className="faChkItem">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.specializations.has(s)}
                                                        onChange={() => toggleSet("specializations", s)}
                                                    />
                                                    <span>{s}</span>
                                                </label>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div className="faFilterSection">
                                    <h4 className="faFilterHeading">Experience</h4>
                                    <div className="faChkList">
                                        {["1-5 years", "5-10 years", "10+ years"].map((exp) => (
                                            <label key={exp} className="faChkItem">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.experience.has(exp)}
                                                    onChange={() => toggleSet("experience", exp)}
                                                />
                                                <span>{exp}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="faFilterSection">
                                    <h4 className="faFilterHeading">Rating</h4>
                                    <div className="faChkList">
                                        {["4", "3"].map((r) => (
                                            <label key={r} className="faChkItem">
                                                <input
                                                    type="checkbox"
                                                    checked={filters.rating.has(r)}
                                                    onChange={() => toggleSet("rating", r)}
                                                />
                                                <span>{r}+ stars</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <button className="faApplyBtn">Apply Filters</button>
                            </div>
                        </aside>

                        {/* Agents List */}
                        <section className="faContent">
                            <div className="faListHeader">
                                <h2>{filteredAgents.length} Agents Found</h2>

                                <div className="faSortRow">
                                    <label className="faSortLabel">Sort by:</label>
                                    <select
                                        className="faSelect"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option>Recommended</option>
                                        <option>Highest Rated</option>
                                        <option>Most Experienced</option>
                                        <option>Most Listings</option>
                                    </select>
                                </div>
                            </div>

                            <div className="faGrid">
                                {filteredAgents.map((agent) => (
                                    <article key={agent.id} className="faCard">
                                        <div className="faCardInner">
                                            <img src={agent.img} alt={agent.name} className="faAvatar" />

                                            <div className="faCardBody">
                                                <div className="faCardHead">
                                                    <div>
                                                        <h3 className="faAgentName">{agent.name}</h3>
                                                        <p className="faCompany">{agent.company}</p>

                                                        <div className="faRatingRow">
                                                            <div className="faStars">
                                                                {Array.from({ length: 5 }).map((_, i) => (
                                                                    <Star
                                                                        key={i}
                                                                        size={14}
                                                                        className={i < Math.round(agent.rating) ? "faStarFilled" : "faStarEmpty"}
                                                                    />
                                                                ))}
                                                            </div>
                                                            <span className="faReviews">
                                                                {agent.rating} ({agent.reviews} reviews)
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="faBio">{agent.bio}</p>

                                                <div className="faStatsRow">
                                                    <div className="faStat">
                                                        <p className="faStatLabel">Properties</p>
                                                        <p className="faStatValue">{agent.properties}</p>
                                                    </div>
                                                    <div className="faStat">
                                                        <p className="faStatLabel">Experience</p>
                                                        <p className="faStatValue">{agent.experience}</p>
                                                    </div>
                                                    <div className="faStat">
                                                        <p className="faStatLabel">Response</p>
                                                        <p className="faStatValue">{agent.response}</p>
                                                    </div>
                                                </div>

                                                <div className="faCardFooter">
                                                    <div className="faVerified">
                                                        <CheckCircle size={16} />
                                                        <span>Verified Agent</span>
                                                    </div>

                                                    <button className="faLinkBtn">View Profile</button>
                                                </div>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination (static layout) */}
                            <div className="faPagination">
                                <div className="faPagerInfo">
                                    <p>
                                        Showing <strong>1</strong> to <strong>{filteredAgents.length}</strong> of{" "}
                                        <strong>456</strong> agents
                                    </p>

                                    <nav className="faPageNav" aria-label="Pagination">
                                        <a className="faIconBtn"><ChevronLeft /></a>
                                        <a className="faPageActive">1</a>
                                        <a className="faPageBtn">2</a>
                                        <a className="faPageBtn">3</a>
                                        <span className="faPageDots">…</span>
                                        <a className="faPageBtn">8</a>
                                        <a className="faIconBtn"><ChevronRight /></a>
                                    </nav>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>

                {/* Why Choose */}
                <section className="faWhy">
                    <div className="faWhyInner">
                        <h2>Why Choose HomeSphere Agents</h2>
                        <p>Our agents are carefully vetted professionals who provide exceptional service and local market expertise</p>

                        <div className="faWhyGrid">
                            <div className="faWhyCard">
                                <div className="faWhyIcon"><Shield size={20} /></div>
                                <h3>Verified Agents</h3>
                                <p>All our agents undergo strict verification and background checks to ensure reliability and professionalism.</p>
                            </div>

                            <div className="faWhyCard">
                                <div className="faWhyIcon"><Award size={20} /></div>
                                <h3>Local Experts</h3>
                                <p>Our agents have in-depth knowledge of their local markets to help you find the perfect property.</p>
                            </div>

                            <div className="faWhyCard">
                                <div className="faWhyIcon"><DollarSign size={20} /></div>
                                <h3>Best Deals</h3>
                                <p>Get access to exclusive listings and negotiate the best prices with our expert agents.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <footer className="faCta">
                    <div className="faCtaInner">
                        <h2>Ready to find your perfect agent?</h2>
                        <p>Connect with top-rated real estate professionals who understand your needs</p>
                        <button className="faCtaBtn">Browse All Agents</button>
                    </div>
                </footer>
            </div>
            <Footer />
        </>
    );
}
