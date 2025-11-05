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


  function formatIndianNumber(num) {
    if (num >= 10000000) {
      // 1 Crore = 1,00,00,000
      return (num / 10000000).toFixed(2).replace(/\.00$/, '') + 'Cr';
    } else if (num >= 100000) {
      // 1 Lakh = 1,00,000
      return (num / 100000).toFixed(2).replace(/\.00$/, '') + 'L';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2).replace(/\.00$/, '') + 'K';
    } else {
      return num.toString();
    }
  }


  return (
    <div key={index} className="propertyCard">
      <div className="propertyImageWrapper">
        <img src={property.images[0].url} alt={property.images[0].altText} className="propertyImage" />
        {/* {property.featured && (
          <div className="featuredBadge">Featured</div>
        )} */}
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
              {property.address.city}, {property.address.state}
              {/* {property.location} */}
            </p>
          </div>
          <div className="propertyPrice">
            <p className="price">{formatIndianNumber(property.price)}</p>
            {/* <p className="pricePerSqFt">{property.pricePerSqFt}</p> */}
          </div>
        </div>
        <div className="propertyDetails">
          <span className="propertyDetail">
            <i data-feather="square" fill="none" stroke="currentColor"> </i>
            {property.areaSqft}
          </span>
          <span className="propertyDetail">
            <i data-feather="home" fill="none" stroke="currentColor"></i>
            {property.bedrooms} BHK
            {/* {property.bhk} BHK */} {/* iss jaghe aad kr dena bhk wala */}
          </span>
          <span className="propertyDetail">
            <i data-feather="layers" fill="none" stroke="currentColor"></i>
            {property.listingStatus}
          </span>
        </div>
        <div className="propertyFooter">
          <div className="agentInfo">
            {/* Ye agent image ayega yaha pe  */}
            <img src={property.images[0].url} alt={property.images[0].altText} className="agentAvatar" />
            <span>By {property.agentId}</span>
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
