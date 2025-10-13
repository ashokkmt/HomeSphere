"use client"

import { useEffect } from 'react';
import '../styles/propertycard.css'
import feather from 'feather-icons'
import { useRouter } from 'next/navigation';

export default function PropertyCard({ property, index }) {

  const router = useRouter();

  useEffect(() => {
    feather.replace();
  }, [])

  const NavigateToProperty = async (id) => {
    console.log("Go to Properties..");
    router.push(`/property/${id}`)
  }

  return (
    <div key={index} className="propertyCard">
      <div className="propertyImageWrapper">
        <img src={property.image} alt={property.title} className="propertyImage" />
        {property.featured && (
          <div className="featuredBadge">Featured</div>
        )}
        <button className="heartButton">
          <i data-feather="heart" fill="none" stroke="currentColor"> </i>
        </button>
      </div>
      <div className="propertyContent">
        <div className="propertyHeader">
          <div>
            <h3 className="propertyTitle">{property.title}</h3>
            <p className="propertyLocation">
              <i data-feather="map-pin" fill="none" stroke="currentColor"></i>
              {property.location}
            </p>
          </div>
          <div className="propertyPrice">
            <p className="price">{property.price}</p>
            <p className="pricePerSqFt">{property.pricePerSqFt}</p>
          </div>
        </div>
        <div className="propertyDetails">
          <span className="propertyDetail">
            <i data-feather="square" fill="none" stroke="currentColor"> </i>
            {property.area}
          </span>
          <span className="propertyDetail">
            <i data-feather="home" fill="none" stroke="currentColor"></i>
            {property.bhk}
          </span>
          <span className="propertyDetail">
            <i data-feather="layers" fill="none" stroke="currentColor"></i>
            {property.status}
          </span>
        </div>
        <div className="propertyFooter">
          <div className="agentInfo">
            <img src={property.agentImage} alt={property.agent} className="agentAvatar" />
            <span>By {property.agent}</span>
          </div>
          <button
            onClick={(e) => {
              NavigateToProperty(property.id);
            }}
            className="viewDetailsButton"
          >View Details</button>
        </div>
      </div>
    </div>
  );
}
