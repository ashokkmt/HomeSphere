"use client"

import Navbar from "../../../components/Navbar.jsx";
import Footer from "../../../components/Footer";
import Head from 'next/head';
import { Activity, Tool, Briefcase, Calendar, Camera, CheckCircle, ChevronLeft, ChevronRight, Clock, Compass, Droplet, Heart, Home, Layers, Mail, MapPin, MessageSquare, Phone, Share2, Shield, Sidebar, Square, Sun, Tv, Wifi, Wind } from 'react-feather';
import '../../../styles/property.id.css';
import feather from 'feather-icons'
import { useEffect } from 'react';
import PropertyCard from '../../../components/PropertyCard';


function PropertyDetail() {

  useEffect(() => {
    feather.replace();
  }, []);


  const properties = [
    {
      id: 1,
      title: 'Luxury Villa in Bangalore',
      location: 'Whitefield, Bangalore',
      price: '₹1.2 Cr',
      pricePerSqFt: '₹8,500/sq.ft',
      area: '1,400 sq.ft',
      bhk: '3 BHK',
      status: 'Ready to Move',
      featured: true,
      agent: 'John Properties',
      image: 'http://static.photos/real-estate/640x360/1',
      agentImage: 'http://static.photos/people/200x200/2'
    },
    {
      id: 2,
      title: 'Modern Apartment in Mumbai',
      location: 'Bandra West, Mumbai',
      price: '₹2.5 Cr',
      pricePerSqFt: '₹15,000/sq.ft',
      area: '1,650 sq.ft',
      bhk: '2 BHK',
      status: 'Under Construction',
      featured: false,
      agent: 'Elite Realtors',
      image: 'http://static.photos/real-estate/640x360/2',
      agentImage: 'http://static.photos/people/200x200/3'
    },
    {
      id: 3,
      title: 'Premium Villa in Goa',
      location: 'Candolim, Goa',
      price: '₹3.8 Cr',
      pricePerSqFt: '₹6,500/sq.ft',
      area: '5,800 sq.ft',
      bhk: '4 BHK',
      status: 'Ready to Move',
      featured: false,
      agent: 'Sunshine Properties',
      image: 'http://static.photos/real-estate/640x360/3',
      agentImage: 'http://static.photos/people/200x200/4'
    }
  ];



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
                <a>Bangalore</a>
                <ChevronRight className="pq-chev" />
                <span className="pq-current">Luxury Villa in Whitefield</span>
              </div>

              <h1 className="pq-title">Luxury 3 BHK Villa in Prestige Lakeside Habitat</h1>
              <p className="pq-location"><MapPin className="pq-icon-small" /> Whitefield, Bangalore</p>
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
              <div className="pq-property-gallery">
                <img src="http://static.photos/real-estate/1200x630/1" alt="Property main" />
                <div className="pq-photo-count"><Camera /> 24 Photos</div>
                <button className="pq-gallery-nav-left"><ChevronLeft /></button>
                <button className="pq-gallery-nav-right"><ChevronRight /></button>
              </div>
            </div>

            <aside className="pq-thumb-grid">
              <div className="pq-thumb"><img src="http://static.photos/real-estate/640x360/2" alt="thumb" /></div>
              <div className="pq-thumb"><img src="http://static.photos/real-estate/640x360/3" alt="thumb" /></div>
              <div className="pq-thumb"><img src="http://static.photos/real-estate/640x360/4" alt="thumb" /></div>
              <div className={`pq-thumb pq-more-thumb`}>
                <img height={"100%"} src="http://static.photos/real-estate/640x360/5" alt="thumb" />
                <div className="pq-more-overlay">+20 more</div>
              </div>
            </aside>
          </section>

          {/* Details + Sidebar */}
          <section className="pq-content-row">
            <div className="pq-main-col">
              <div className="pq-card">
                <div className="pq-card-header">
                  <div>
                    <h2 className="pq-price">₹1.2 Crore</h2>
                    <p className="pq-price-sub">₹8,500/sq.ft</p>
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
                  <p className="pq-text">This luxurious 3 BHK villa is located in the prestigious Prestige Lakeside Habitat community in Whitefield, Bangalore. The property boasts of elegant interiors, premium finishes, and breathtaking views of the central lake. Spread over 1,400 sq.ft of built-up area, this villa offers spacious living with modern amenities.</p>
                </div>

                <div className="pq-section">
                  <h3>Key Features</h3>
                  <div className="pq-features-grid">
                    <div className="pq-feature"><Home /> 3 Bedrooms</div>
                    <div className="pq-feature"><Droplet /> 3 Bathrooms</div>
                    <div className="pq-feature"><Square /> 1,400 sq.ft Built-up</div>
                    <div className="pq-feature"><Calendar /> Ready to Move</div>
                    <div className="pq-feature"><Compass /> North-East Facing</div>
                    <div className="pq-feature"><Layers /> 3rd Floor (of 4)</div>
                  </div>
                </div>

                <div className="pq-section">
                  <h3>Amenities</h3>
                  <div className="pq-amenities-grid">
                    <div className="pq-amenity"><Wifi /> <span>Wi-Fi</span></div>
                    <div className="pq-amenity"><Sun /> <span>Swimming Pool</span></div>
                    <div className="pq-amenity"><Shield /> <span>Security</span></div>
                    <div className="pq-amenity"><Activity /> <span>Gym</span></div>
                    <div className="pq-amenity"><Tool /> <span>Garden</span></div>
                    <div className="pq-amenity"><Tv /> <span>Cable TV</span></div>
                    <div className="pq-amenity"><Sidebar /> <span>Parking</span></div>
                    <div className="pq-amenity"><Wind /> <span>AC</span></div>
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
                    <p>This exquisite 3 BHK villa is part of the prestigious Prestige Lakeside Habitat, a gated community in the heart of Whitefield, Bangalore. The property offers a perfect blend of luxury and comfort with its elegant interiors and premium finishes.</p>
                    <p>The villa features a spacious living room with large windows that allow ample natural light, a modern kitchen with modular fittings, three well-appointed bedrooms with attached bathrooms, and a utility area. The master bedroom comes with a walk-in closet.</p>
                    <p>Residents of Prestige Lakeside Habitat enjoy access to world-class amenities including a swimming pool, gymnasium, clubhouse, children's play area, landscaped gardens, and 24/7 security. The community also has a convenience store and ample visitor parking.</p>
                    <p>The location offers excellent connectivity to major IT parks, schools, hospitals, and shopping centers. The Whitefield metro station is just 1.5 km away, and the ITPL Tech Park is within 3 km.</p>
                  </div>
                </div>

                <div className="pq-section">
                  <h3>Location</h3>
                  <div className="pq-map-container"><img src="http://static.photos/technology/640x360/6" alt="map" /></div>
                  <p className="pq-text"><strong>Address:</strong> Prestige Lakeside Habitat, Whitefield Main Road, Bangalore - 560066</p>
                  <p className="pq-text"><strong>Landmarks:</strong> 1.2 km from Phoenix Marketcity, 2 km from ITPL, 1.5 km from Whitefield Metro Station</p>
                </div>

              </div>
            </div>

            {/* Sidebar */}
            <aside className="pq-side-col">
              <div className="pq-card-agent">
                <div className="pq-agent-head">
                  <img src="http://static.photos/people/200x200/8" alt="Agent" />
                  <div>
                    <h4>Rahul Sharma</h4>
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
                  <div><Briefcase /> Elite Realtors</div>
                  <div><Clock /> Available 9AM - 7PM</div>
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
                <h4>Price Trends in Whitefield</h4>
                <div className="pq-price-box">
                  <div><span>Avg. Price/sq.ft</span><strong>₹8,500</strong></div>
                  <div><span>Price Change (1Y)</span><strong className="pq-positive">+8.2%</strong></div>
                  <div><span>Properties Available</span><strong>142</strong></div>
                </div>
                <p className="pq-small">Property prices in Whitefield have increased by 8.2% over the last year. The average price per square foot for apartments in this locality is ₹8,500.</p>
              </div>
            </aside>
          </section>

          {/* Similar Properties */}
          <section className="pq-similar-section">
            <h2>Similar Properties</h2>
            <div className="pq-similar-grid">
              {
                properties.map((property, index) => (
                  <PropertyCard
                    index={index}
                    property={property}
                  />
                ))
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
