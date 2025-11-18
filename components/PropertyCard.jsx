"use client"

import { useContext, useEffect, useState } from 'react';
import '../styles/propertycard.css'
import feather from 'feather-icons'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/UserContext';
import axios from 'axios';
import { Edit, Trash2 } from 'react-feather';
import { PropertyContext } from '@/app/propertyContext';
import { FailedToast, SuccessToast } from './utils/toast';


export default function PropertyCard({
  key,
  property,
  favorites,
  refreshFav,
  confirmDelete,
  setConfirmDelete,
  confirmedModel,
  setConfirmedModal
}) {

  const { user } = useAuth();
  const { refreshProperties } = useContext(PropertyContext);
  const router = useRouter();

  const isFav = Boolean(favorites?.some(fav => Number(fav.propertyId) === Number(property.id)));

  useEffect(() => {
    feather.replace();
  }, [isFav])

  const NavigateToProperty = async (id) => {
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


  const toggleFav = async (userID, propID) => {
    if (isFav) {
      removeFavouties(userID, propID);
    } else {
      addTofavorites(userID, propID);
    }
  }

  const addTofavorites = async (userID = null, propId) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    console.log(userID, propId)

    try {
      const query = `
        mutation AddFavorite($userId: Int!, $propertyId: Int!) {
          addFavorite(input: { userId: $userId, propertyId: $propertyId }) {
            propertyId
          }
        }
      `;

      const res = await axios.post("http://localhost:3000/api/graphql", { query, variables: { userId: Number(userID), propertyId: Number(propId) } });
      if (res.data.errors) {
        FailedToast("Some Error Occurs");
        console.error("GraphQL errors:", JSON.stringify(res.data.errors, null, 2));
      } else {
        console.log("GraphQL data:", res.data.data);
        SuccessToast("Added To Favorites");
      }

      refreshFav();

    } catch (error) {
      console.error("Request error:", error.response?.data || error.message || error);
    }
  };

  const removeFavouties = async (userId, propId) => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    try {
      const query = `
        mutation RemoveFavorite {
          removeFavorite(input: { userId: ${userId}, propertyId: ${propId} })
        }
      `;

      const res = await axios.post("http://localhost:3000/api/graphql", { query });

      if (res.data.errors) {
        console.error(res.data.errors);
        FailedToast("Some Error Occurs");
      }

      SuccessToast("Remove From Favorites")
      refreshFav();
    } catch (error) {
      console.log(error.message + " This is in removing fav...")
    }
  }


  const DeleteProperty = async (pid) => {

    if (!confirmDelete) return;

    try {
      const query = `mutation DeleteProperty($id: Int!) {
        deleteProperty(id: $id)
      }`;

      const res = await axios.post("http://localhost:3000/api/graphql", {
        query,
        variables: { id: pid },
      });

      if (res?.data?.errors) {
        FailedToast("Remove Property from Favorites !!");
        return;
      }

      SuccessToast("Property Deleted Successfully");
      console.log(res?.data?.data);
      refreshProperties()
    } catch (error) {
      console.log(error);
    } finally {
      setConfirmDelete(false);
    }
  }

  useEffect(() => {
    if (confirmDelete) {
      DeleteProperty(property?.id);
    }
  }, [confirmDelete, confirmedModel])



  // Update yha hoga.....
  const EditPropertyDetails = async (pid) => {
    console.log("Property : " + pid + " has to be Updated");
  }

  return (

    <>
      <div key={key} className="propertyCard">
        <div className="propertyImageWrapper">
          <img src={property.images[0].url} alt={property.images[0].altText} className="propertyImage" />
          {/* {property.featured && (
          <div className="featuredBadge">Featured</div>
        )} */}
          <button onClick={() => toggleFav(user?.id, property.id)} className={`heartButton ${isFav ? "favourited" : ""}`}>
            <i className='heart-icon' data-feather="heart" fill="none" stroke="currentColor"> </i>
          </button>
        </div>
        <div className="propertyContent">
          <div className="propertyHeader">
            <div>
              <h3 className="propertyTitle">{property.title}</h3>
              <p className="propertyLocation">
                <i data-feather="map-pin" fill="none" stroke="currentColor"></i>
                {property?.address?.city}, {property?.address?.state}
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
              <span>By {property?.user?.fullName}</span>
            </div>
            <div className='actions'>
              {
                property?.userId === user?.id &&
                <>
                  <Trash2
                    onClick={() => setConfirmedModal(true)}
                    size={20}
                    className="Delete"
                  />
                  <Edit
                    onClick={() => {
                      EditPropertyDetails(property?.id)
                    }}
                    size={18}
                    className="Update"
                  />
                </>
              }
              <button
                onClick={(e) => {
                  NavigateToProperty(property.id);
                }}
                className="viewDetailsButton"
              >View Details</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
