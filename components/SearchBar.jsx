import "../styles/searchbar.css"

export default function SearchBar() {

  return (
    <div className="searchForm">
      <div className="searchInputWrapper">
        <input
          type="text"
          className="searchInput"
          placeholder="Search by location, project, or landmark"
        />
        <i data-feather="map-pin" className="searchIcon" fill="none" stroke="currentColor"> </i>
        <select className="searchSelect">
          <option>Buy</option>
          <option>Rent</option>
          <option>Commercial</option>
        </select>
        <button className="searchButton">Search</button>
      </div>
      <div className="popularSearches">
        <span className="popularLabel">Popular searches:</span>
        Mumbai • Bangalore • Delhi • Pune • Hyderabad
      </div>
    </div>
  );
}
