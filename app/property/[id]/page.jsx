"use client"

import Navbar from "../../../components/Navbar.jsx";
import Footer from "../../../components/Footer";
import Head from 'next/head';
import { ArrowLeft, ArrowRight, Calendar, Camera, ChevronLeft, ChevronRight, Compass, Droplet, Heart, Home, Layers, MapPin, MessageSquare, Share2, Square, X } from 'react-feather';
import '../../../styles/property.id.css';
import feather from 'feather-icons'
import { useContext, useEffect, useRef, useState } from 'react';
import PropertyCard from '../../../components/PropertyCard.jsx';
import { PropertyContext } from "@/app/propertyContext.jsx";
import { useParams, useRouter } from "next/navigation.js";
import axios from "axios";
import { MapIcons } from "@/components/utils/iconMap.js";
import { useAuth } from "@/app/UserContext.jsx";
import { FavouriteContext } from "@/app/FavouriteContext.jsx";
import { FailedToast, SuccessToast } from "@/components/utils/toast.js";


function PropertyDetail() {

  const [currproperty, setCurrproperty] = useState({})
  const [seller, setSeller] = useState({})
  const { user } = useAuth();
  const { allProperties } = useContext(PropertyContext);
  const { favorites, refreshFav } = useContext(FavouriteContext);
  const { id } = useParams();
  const slideImage = useRef(null);
  const router = useRouter();
  const [showChat, setShowChat] = useState(false);



  useEffect(() => {
    async function fetchcurrpropertydetail() {

      const query = `query GetPropertyById {
          getPropertyById(id: ${id}) {
              id
              userId
              title
              description
              price
              propertyType
              bedrooms
              bathrooms
              areaSqft
              listingStatus
              createdAt
              updatedAt
              images {
                  propertyId
                  url
                  altText
                  sortOrder
              }
              address {
                  city
                  state
                  street
                  postalCode
              }
              amenities {
                  amenity {
                      id
                      name
                  }
              }
          }
        }`

      const res = await axios.post("http://localhost:3000/api/graphql", { query });
      setCurrproperty(res.data.data.getPropertyById);


      if (res?.data?.data?.getPropertyById?.userId) {
        const userId = Number(res?.data?.data?.getPropertyById?.userId);

        const UerQuery = `
          query GetUserById($id: Int!) {
            getUserById(id: $id) {
              email
              fullName
              phone
            }
          }
        `;

        try {
          const agentDetail = await axios.post("http://localhost:3000/api/graphql",
            {
              query: UerQuery,
              variables: { id: userId },
            }
          );


          if (agentDetail.data?.errors) {
            console.error(agentDetail.data.errors);
            return;
          }

          setSeller(agentDetail.data?.data?.getUserById);
        } catch (err) {
          console.error("Error fetching agent:", err);
        }
      }

    }

    fetchcurrpropertydetail();
  }, [])


  useEffect(() => {
    feather.replace();
  }, []);


  function formatIndianNumber(num) {
    if (num >= 10000000) {
      // 1 Crore = 1,00,00,000
      return "₹" + (num / 10000000).toFixed(2).replace(/\.00$/, '') + 'Cr';
    } else if (num >= 100000) {
      // 1 Lakh = 1,00,000
      return "₹" + (num / 100000).toFixed(2).replace(/\.00$/, '') + 'L';
    } else if (num >= 1000) {
      return "₹" + (num / 1000).toFixed(2).replace(/\.00$/, '') + 'K';
    } else {
      return "₹" + num;
    }
  }


  const scrollLeft = () => {
    if (slideImage.current) {
      slideImage.current.scrollBy({
        left: -slideImage.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollRight = () => {
    if (slideImage.current) {
      slideImage.current.scrollBy({
        left: slideImage.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };



  const isFav = Boolean(favorites?.some(fav => Number(fav.propertyId) === Number(id)));
  const toggleFav = async (userID, propID) => {
    console.log(isFav, userID, propID)
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


  const closeChat = () => {
    document.querySelector('.pq-chat-overlay').classList.add('closing');

    setTimeout(() => {
      setShowChat(false);
    }, 500); // match animation duration
  };


  function gotToSearchProperties(city) {
    console.log(city)
    router.push(`/property?city=${city}`);
  }

  return (
    <>
      <Head>
        <title>Property Details | NestQuest</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      <div className="pq-page">
        {/* Header */}
        <header className="pq-header-container">
          <div className="pq-header-inner">
            <div>
              <div className="pq-breadcrumb">
                <a onClick={() => router.push('/')} className="searchCity">Home</a>
                <ChevronRight className="pq-chev" />
                <a
                  className="searchCity"
                  onClick={() => {
                    gotToSearchProperties(currproperty?.address?.city)
                  }} >{currproperty.address?.city}</a>
                <ChevronRight className="pq-chev" />
                <span className="pq-current">{currproperty?.propertyType}</span>
              </div>

              <h1 className="pq-title">{currproperty?.title}</h1>
              <p className="pq-location"><MapPin className="pq-icon-small" /> {currproperty.address?.city}, {currproperty.address?.state}</p>
            </div>

            <div className="pq-header-actions">
              <button className="pq-btn-ghost"><Share2 className="pq-btn-icon" /> Share</button>
              <button
                onClick={() => {
                  if (!user) {
                    router.push('/auth/login');
                  }
                  else {
                    toggleFav(user?.id, id);
                  }
                }}
                className="pq-btn-ghost"
              ><Heart className={`pq-btn-icon ${isFav ? "active" : ""}`}
                /> Save</button>
              <button
                onClick={() => setShowChat(true)}
                className="pq-btn-primary CSBTN"
              >Contact Seller</button>
            </div>
          </div>
        </header>

        {/* Gallery */}
        <main className="pq-container">
          <section className="pq-gallery-row">
            <div className="pq-main-gallery">
              <div className="pq-property-gallery" ref={slideImage}>

                {
                  currproperty?.images?.map((img, index) => {
                    return (
                      <img src={img?.url} alt={img?.altText} />
                    )
                  })
                }
                <div className="pq-photo-count"><Camera /> {currproperty?.images?.length} Photos</div>
                <button onClick={() => scrollLeft()} className="pq-gallery-nav-left"><ChevronLeft /></button>
                <button onClick={() => scrollRight()} className="pq-gallery-nav-right"><ChevronRight /></button>
              </div>
            </div>
          </section>

          {/* Details + Sidebar */}
          <section className="pq-content-row">
            <div className="pq-main-col">
              <div className="pq-card">
                <div className="pq-card-header">
                  <div>
                    <h2 className="pq-price">{formatIndianNumber(currproperty?.price)}</h2>
                    <p className="pq-price-sub">₹{currproperty?.areaSqft}/sq.ft</p>
                  </div>

                  <div className="pq-rating">
                    <div className="pq-stars">
                      {
                        currproperty?.listingStatus
                        // [...Array(5)].map((_, i) => (
                        //   <i key={i} data-feather="star" fill={i < 3 ? 'currentColor' : 'none'} stroke="currentColor">
                        //   </i>
                        // ))
                      }
                    </div>
                    {/* <span className="pq-review-text">4.2 (12 Reviews)</span> */}
                  </div>
                </div>

                <div className="pq-section">
                  <h3>Key Features</h3>
                  <div className="pq-features-grid">
                    <div className="pq-feature"><Home /> {currproperty?.bedrooms} Bedrooms</div>
                    <div className="pq-feature"><Droplet /> {currproperty?.bathrooms} Bathrooms</div>
                    <div className="pq-feature"><Square /> {parseInt(currproperty?.price / currproperty?.areaSqft)} sq.ft Built-up</div>
                    <div className="pq-feature"><Calendar /> {currproperty?.listingStatus}</div>

                    {/* Yaha Compass aur Layers wale mai kya dalna hai dekh lena ye DB mai nhi hai ok */}
                    <div className="pq-feature"><Compass /> North-East Facing</div>
                    <div className="pq-feature"><Layers /> 3rd Floor (of 4)</div>
                  </div>
                </div>

                <div className="pq-section">
                  <h3>Amenities</h3>
                  <div className="pq-amenities-grid">
                    {
                      currproperty?.amenities?.map((amenity) => {
                        const name = amenity?.amenity?.name || "";
                        const key = name.replace(/[\s_-]/g, '').toLowerCase();
                        const MapValue = MapIcons[key] || MapIcons.default;
                        return (
                          <>
                            <div className="pq-amenity"><MapValue.icon size={MapValue.size} /> <span>{amenity?.amenity?.name}</span></div>
                          </>
                        )
                      })
                    }
                  </div>
                </div>


                <div className="pq-section">
                  <h3>Location</h3>
                  <p className="pq-text"><strong>Address:</strong> {currproperty?.address?.street}, {currproperty?.address?.city}, {currproperty?.address?.state}, {currproperty?.address?.postalCode} </p>
                  <p className="pq-text"><strong>Landmarks:</strong> {currproperty?.address?.street}</p>
                </div>

              </div>
            </div>


            {/* Sidebar */}
            <aside className="pq-side-col">
              <div className="pq-card-agent">
                <div className="pq-agent-head">
                  <img src="http://static.photos/people/200x200/8" alt="Agent" />
                  <div>
                    <h4>{seller?.fullName}</h4>
                    <p className="pq-small">{seller?.email}</p>
                  </div>
                </div>

                <div className="pq-agent-actions">
                  <button
                    onClick={() => setShowChat(true)}
                    className="pq-btn-primary"
                  ><MessageSquare /> Contact Seller</button>
                </div>
              </div>
              <div className="pq-card-agent">
                <h3>Detailed Description</h3>
                <div className="pq-text-block">
                  <p>{currproperty?.description} Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti alias perferendis ipsum aut commodi tempore quasi nisi odio! Soluta earum vitae ea atque reiciendis quibusdam adipisci? Incidunt aliquam quas doloremque.</p>
                </div>
              </div>
            </aside>

          </section>

          {/* Similar Properties */}
          <section className="pq-similar-section">
            <h2>Similar Properties</h2>
            <div className="pq-similar-grid">
              {
                allProperties.filter(property => property.id != id).map((property, index) => {
                  if (index >= 3) return;
                  return (
                    <PropertyCard
                      index={index}
                      property={property}
                    />
                  )
                })
              }
            </div>
          </section>
        </main>

        {
          showChat && (
            <div className={`pq-chat-overlay ${showChat ? "active" : ""}`}>
              <div className="pq-chat-box">
                <div className="pq-chat-header">
                  <div>
                    <h4>Chat with {seller?.fullName || "Seller"}</h4>
                    <p className="pq-small">
                      Ask anything about this property.
                    </p>
                  </div>
                  <ArrowRight
                    size={35}
                    onClick={() => closeChat()}
                    className="pq-chat-close"
                  />
                </div>

                <div className="chats">
                  <div className="pq-chat-body">
                    <p className="pq-text left">
                      Hi! 👋
                    </p>
                    <p className="pq-text right">
                      Hey! 👋
                    </p>

                  </div>

                  <div className="pq-chat-footer">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="pq-chat-input"
                    />
                    <button className="pq-btn-primary pq-chat-send">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        }

      </div>

      <Footer />
    </>
  );
}


export default PropertyDetail;
