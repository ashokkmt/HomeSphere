"use client"

import Navbar from "../../../components/Navbar.jsx";
import Footer from "../../../components/Footer";
import Head from 'next/head';
import { Briefcase, Calendar, Camera, CheckCircle, ChevronLeft, ChevronRight, Clock, Compass, Droplet, Heart, Home, Layers, Mail, MapPin, MessageSquare, Phone, Share2, Square } from 'react-feather';
import '../../../styles/property.id.css';
import feather from 'feather-icons'
import { useContext, useEffect, useRef, useState } from 'react';
import PropertyCard from '../../../components/PropertyCard.jsx';
import { PropertyContext } from "@/app/propertyContext.jsx";
import { useParams } from "next/navigation.js";
import axios from "axios";
import { MapIcons } from "@/components/utils/iconMap.js";


function PropertyDetail() {

  const [currproperty, setCurrproperty] = useState({})
  const [currAgent, setCurrAgent] = useState({})
  const { allProperties } = useContext(PropertyContext);
  const { id } = useParams();
  const slideImage = useRef(null);


  useEffect(() => {
    async function fetchcurrpropertydetail() {

      const query = `query GetPropertyById {
          getPropertyById(id: ${id}) {
              id
              agentId
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


      if (res?.data?.data?.getPropertyById?.agentId) {
        const agentQuery = `query GetAgentById {
          getAgentById(id: 1) {
            id
            userId
            agency
            licenseNo
            user {
              id
              email
              fullName
              phone
              role
            }
          }
        }`
        const agentDetail = await axios.post("http://localhost:3000/api/graphql", { query: agentQuery });
        setCurrAgent(agentDetail?.data?.data?.getAgentById)
      }
    }

    fetchcurrpropertydetail();
  }, [])


  useEffect(() => {
    feather.replace();
  }, []);



  function CountNumberofAvialable(city) {
    let count = 0;
    allProperties.forEach((property) => {
      const propCity = property?.address?.city;
      if (propCity && city && propCity.toLowerCase() === city.toLowerCase()) {
        count++;
      }
    });
    return count;
  }



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
                <a>Home</a>
                <ChevronRight className="pq-chev" />
                <a>{currproperty.address?.city}</a>
                <ChevronRight className="pq-chev" />
                <span className="pq-current">{currproperty?.propertyType}</span>
              </div>

              <h1 className="pq-title">{currproperty?.title}</h1>
              <p className="pq-location"><MapPin className="pq-icon-small" /> {currproperty.address?.city}, {currproperty.address?.state}</p>
            </div>

            <div className="pq-header-actions">
              <button className="pq-btn-ghost"><Share2 className="pq-btn-icon" /> Share</button>
              <button className="pq-btn-ghost"><Heart className="pq-btn-icon" /> Save</button>
              <button className="pq-btn-primary">Contact Agent</button>
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

            {/* <aside className="pq-thumb-grid">
              <div className="pq-thumb"> <img src={currproperty?.images?.[0]?.url} alt={currproperty?.images?.[1]?.altText} /></div>
              <div className="pq-thumb"> <img src={currproperty?.images?.[0]?.url} alt={currproperty?.images?.[1]?.altText} /></div>
              <div className="pq-thumb"> <img src={currproperty?.images?.[0]?.url} alt={currproperty?.images?.[1]?.altText} /></div>
              <div className={`pq-thumb pq-more-thumb`}>
                <img height={"100%"} src="http://static.photos/real-estate/640x360/5" alt="thumb" />
                <div className="pq-more-overlay">+20 more</div>
              </div>
            </aside> */}
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
                        [...Array(5)].map((_, i) => (
                          <i key={i} data-feather="star" fill={i < 3 ? 'currentColor' : 'none'} stroke="currentColor">
                          </i>
                        ))
                      }
                    </div>
                    <span className="pq-review-text">4.2 (12 Reviews)</span>
                  </div>
                </div>

                <div className="pq-section">
                  <h3>Overview</h3>
                  {/* yaha pe normal chota sa description ayega OK */}
                  <p className="pq-text">{currproperty?.description}</p>
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

                <div className="pq-tabs-wrap">
                  <nav className="pq-tabs">
                    <button className={`pq-tab pq-tab-active`}>Description</button>
                    <button className="pq-tab">Floor Plans</button>
                    <button className="pq-tab">Neighborhood</button>
                    <button className="pq-tab">Reviews</button>
                  </nav>
                </div>

                <div className="pq-section">
                  <h3>Detailed Description</h3>
                  <div className="pq-text-block">
                    {/* yaha pe detailed description ayega OK */}
                    <p>{currproperty?.description}</p>
                    <p>{currproperty?.description}</p>
                  </div>
                </div>

                <div className="pq-section">
                  <h3>Location</h3>
                  <div className="pq-map-container"><img src="http://static.photos/technology/640x360/6" alt="map" /></div>
                  <p className="pq-text"><strong>Address:</strong> {currproperty?.address?.street}, {currproperty?.address?.city}, {currproperty?.address?.state}, {currproperty?.address?.postalCode} </p>
                  {/* Yaha neehce wale me landmark ayega jo abhi DB mai nhi hai OK */}
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
                    <h4>{currAgent?.user?.fullName}</h4>
                    <p className="pq-small">Property Agent</p>
                    <div className="pq-stars-small">
                      {
                        [...Array(5)].map((_, i) => (
                          <i key={i} data-feather="star" fill={i < 3 ? 'currentColor' : 'none'} stroke="currentColor">
                          </i>
                        ))
                      }
                    </div>
                  </div>
                </div>

                <div className="pq-agent-info">
                  <div><Briefcase /> {currAgent?.agency}</div>
                  <div><Clock /> Licence No. {currAgent?.licenseNo}</div>
                  <div><CheckCircle /> Verified Agent</div>
                </div>

                <div className="pq-agent-actions">
                  <button className="pq-btn-primary"><Phone /> Call Agent</button>
                  <button className="pq-btn-ghost"><Mail /> Email Agent</button>
                  <button className="pq-btn-ghost"><MessageSquare /> WhatsApp</button>
                </div>
              </div>

              <div className="pq-card">
                <h4>Schedule a Visit</h4>
                <div>
                  <label>Date</label>
                  <input type="date" className="pq-input" />
                </div>
                <div>
                  <label>Time</label>
                  <select className="pq-input">
                    <option>9:00 AM - 10:00 AM</option>
                    <option>10:00 AM - 11:00 AM</option>
                    <option>11:00 AM - 12:00 PM</option>
                    <option>12:00 PM - 1:00 PM</option>
                  </select>
                </div>
                <button className="pq-btn-primary">Schedule Visit</button>
              </div>

              <div className="pq-card">
                <h4>Price Trends in {currproperty?.address?.city}</h4>
                <div className="pq-price-box">
                  <div><span>Avg. Price/sq.ft</span><strong>₹{parseInt(currproperty?.price / currproperty?.areaSqft)}</strong></div>
                  <div><span>Price Change (1Y)</span><strong className="pq-positive">+8.2%</strong></div>
                  <div><span>Properties Available</span><strong>{CountNumberofAvialable(currproperty?.address?.city)}</strong></div>
                </div>
                <p className="pq-small">Property prices in {currproperty?.address?.city} have increased by 8.2% over the last year. The average price per square foot for apartments in this locality is ₹{parseInt(currproperty?.price / currproperty?.areaSqft)}.</p>
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
      </div>

      <Footer />
    </>
  );
}


export default PropertyDetail;
