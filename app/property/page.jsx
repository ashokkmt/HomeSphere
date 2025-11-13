"use client"

import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/propertypage.css"
import PropertyCard from "../../components/PropertyCard.jsx";
import { Search } from "react-feather";
import { useContext, useMemo, useState } from "react";
import { PropertyContext } from "../propertyContext.jsx";

function PropertyList() {

    // const properties = [
    //     {
    //         id: 1,
    //         title: 'Luxury Villa in Bangalore',
    //         location: 'Whitefield, Bangalore',
    //         price: '₹1.2 Cr',
    //         pricePerSqFt: '₹8,500/sq.ft',
    //         area: '1,400 sq.ft',
    //         bhk: '3 BHK',
    //         status: 'Ready to Move',
    //         featured: true,
    //         agent: 'John Properties',
    //         image: 'http://static.photos/real-estate/640x360/1',
    //         agentImage: 'http://static.photos/people/200x200/2'
    //     },
    //     {
    //         id: 2,
    //         title: 'Modern Apartment in Mumbai',
    //         location: 'Bandra West, Mumbai',
    //         price: '₹2.5 Cr',
    //         pricePerSqFt: '₹15,000/sq.ft',
    //         area: '1,650 sq.ft',
    //         bhk: '2 BHK',
    //         status: 'Under Construction',
    //         featured: false,
    //         agent: 'Elite Realtors',
    //         image: 'http://static.photos/real-estate/640x360/2',
    //         agentImage: 'http://static.photos/people/200x200/3'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in Goa',
    //         location: 'Candolim, Goa',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in Goa',
    //         location: 'Candolim, Goa',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in Chennai',
    //         location: 'Chennai',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in Port Bular',
    //         location: 'Port Bular',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in kashipur',
    //         location: 'kashipur',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in Ramnagar',
    //         location: 'Ramnagar',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in Anjali',
    //         location: 'Anajli',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     },
    //     {
    //         id: 3,
    //         title: 'Premium Villa in Himanshu',
    //         location: 'Himanshu',
    //         price: '₹3.8 Cr',
    //         pricePerSqFt: '₹6,500/sq.ft',
    //         area: '5,800 sq.ft',
    //         bhk: '4 BHK',
    //         status: 'Ready to Move',
    //         featured: false,
    //         agent: 'Sunshine Properties',
    //         image: 'http://static.photos/real-estate/640x360/3',
    //         agentImage: 'http://static.photos/people/200x200/4'
    //     }
    // ];

    const { allProperties } = useContext(PropertyContext);

    const [query, setQuery] = useState("");
    const [startsearch, setStartSearch] = useState(false);

    const filteredProperties = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return allProperties;
        return allProperties.filter((p) => {
            const location = p.address.city + ", " + p.address.state;
            return (
                (p.title && p.title.toLowerCase().includes(q)) ||
                (p.location && location.toLowerCase().includes(q)) ||
                (p.agent && p.agentId.toLowerCase().includes(q))  // agent ka name ayega yaha pe ok.... p.agentName.tolowerCase().includes(q) krke ok
            );
        });
    }, [startsearch, query === ""]);

    return (
        <>
            <Navbar />
            <div className="prop-section">
                <div className="prop-sectionHeader">
                    <h2 className="prop-sectionTitle">Featured Properties</h2>
                </div>

                <div className="prop-faSearchCard">
                    <div className="prop-faSearchRow">
                        <label className="prop-faSearchBox">
                            <Search className="prop-faSearchIcon" />
                            <input
                                type="text"
                                placeholder="Search by Location"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="prop-faInput"
                            />
                        </label>

                        <button
                            onClick={(e) => {
                                setStartSearch(!startsearch);
                            }}
                            className="prop-faPrimaryBtn"
                        >Search Property</button>
                    </div>
                </div>

                <div className="prop-propertyGrid">
                    {
                        filteredProperties.length === 0 ? (
                            <p style={{ padding: 20, color: "#6b7280" }}>No properties match your search.</p>
                        ) : (
                            filteredProperties.map((property, index) => (
                                <PropertyCard
                                    index={index}
                                    property={property}
                                />
                            ))
                        )
                    }
                </div>
            </div >
            <Footer />
        </>
    );
}


export default PropertyList;