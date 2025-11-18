"use client"

import { useEffect, useState } from "react";
import "../styles/searchbar.css"
import { useRouter } from "next/navigation";

export default function SearchBar({ allProperties }) {

  const router = useRouter();
  const [searched, setSearched] = useState("")
  const [listingType, setListingType] = useState("All");
  const [filterProperty, setFilterProperty] = useState([])

  useEffect(() => {
    const q = searched.trim().toLowerCase();

    if (!q) {
      setFilterProperty([]);
      return;
    }

    const qNoSpace = q.replace(/[,\s]/g, "");

    const fp = allProperties.filter((property) => {
      const city = property?.address?.city?.toLowerCase() || "";
      const state = property?.address?.state?.toLowerCase() || "";

      const fullLocation = `${city} ${state}`;
      const fullNoSpace = fullLocation.replace(/[,\s]/g, "");

      const styleStatus = property?.listingStatus?.toLowerCase() || "";

      const matchesNormal =
        city.includes(q) ||
        state.includes(q) ||
        fullLocation.includes(q);

      const matchesNoSpace = fullNoSpace.includes(qNoSpace);

      if (listingType !== "All") {
        const selectedStatus = listingType.toLowerCase();
        return (matchesNormal || matchesNoSpace) && styleStatus.includes(selectedStatus)
      }

      return matchesNormal || matchesNoSpace;
    })

    setFilterProperty(fp);

  }, [searched, allProperties, listingType])

  return (
    <div className="searchForm">
      <div className="searchInputWrapper">
        <div className="search-input-box">
          <input
            type="text"
            className="searchInput"
            placeholder="Search by location, project, or landmark"
            value={searched}
            onChange={(e) => setSearched(e.target.value)}
          />
          {
            filterProperty.length > 0 &&
            <div className="searched-data">
              {
                filterProperty?.map((property) => {
                  return (
                    <li key={property?.id} onClick={(e) => setSearched(e.target.innerText)} > {property?.address?.city}, {property?.address?.state} </li>
                  )
                })
              }
            </div>
          }
        </div>
        <i data-feather="map-pin" className="searchIcon" fill="none" stroke="currentColor"> </i>
        <select onChange={(e) => { setListingType(e.target.value) }} className="searchSelect">
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Ready To Move">Ready To Move</option>
        </select>
        <button onClick={() => router.push(`/property?city=${searched}`)} className="searchButton">Search</button>
      </div>
      <div className="popularSearches">
        <span className="popularLabel">Popular searches:</span>
        Mumbai • Bangalore • Delhi • Pune • Hyderabad
      </div>
    </div>
  );
}
