import '../styles/locality.css'

function LocalityCard({ locality, key }) {
    return (
        <div key={key} className="localityCard">
            <div className="localityImageWrapper">
                <img src={locality.image} alt={locality.name} className="localityImage" />
                <div className="localityOverlay"></div>
                <h3 className="localityName">{locality.name}</h3>
            </div>
            <div className="localityContent">
                <div className="localityInfo">
                    <span>Avg. Price</span>
                    <span className="localityValue">{locality.avgPrice}</span>
                </div>
                <div className="localityInfo">
                    <span>Properties</span>
                    <span className="localityValue">{locality.properties}</span>
                </div>
                <button className="localityButton">View Properties</button>
            </div>
        </div>
    )
}

export default LocalityCard
