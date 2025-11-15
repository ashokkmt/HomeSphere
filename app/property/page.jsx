"use client"

import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/propertypage.css"
import PropertyCard from "../../components/PropertyCard.jsx";
import { Search } from "react-feather";
import { useContext, useMemo, useState } from "react";
import { PropertyContext } from "../propertyContext.jsx";
import { FavouriteContext } from "../FavouriteContext.jsx";

function PropertyList() {

    const { favorites, setfavorites, refreshFav } = useContext(FavouriteContext);
    const { allProperties } = useContext(PropertyContext);
    const [query, setQuery] = useState("");
    const [startsearch, setStartSearch] = useState(false);
    const [confirmedModel, setConfirmedModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);


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

            {
                confirmedModel &&
                <ConfirmCard
                    setConfirmDelete={setConfirmDelete}
                    setConfirmedModal={setConfirmedModal}
                />
            }

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
                        filteredProperties?.length === 0 ? (
                            <p style={{ padding: 20, color: "#6b7280" }}>No properties match your search.</p>
                        ) : (
                            filteredProperties?.map((property, index) => (
                                <PropertyCard
                                    index={index}
                                    property={property}
                                    favorites={favorites}
                                    setfavorites={setfavorites}
                                    refreshFav={refreshFav}
                                    confirmDelete={confirmDelete}
                                    setConfirmDelete={setConfirmDelete}
                                    confirmedModel={confirmedModel}
                                    setConfirmedModal={setConfirmedModal}
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