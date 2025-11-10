"use client";

import React, { useState } from "react";
import "../../../styles/newproperty.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Check, X } from "react-feather";

export default function NewProperty() {
  // form fields
  const [propertyId, setPropertyId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [postlcode, setPostlcode] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [areaSqft, setAreaSqft] = useState("");
  const [listingStatus, setListingStatus] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [country, setCountry] = useState("");
  const [amenities, setAmenities] = useState("");
  const router = useRouter();

  // images ke cheej
  const [showImageSec, setShowImageSec] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgloading, setImgLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [payloadPreview, setPayloadPreview] = useState(null);



  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => {
      const existingNames = new Set(prev.map((p) => p.fileName));
      const newFileData = files
        .filter((file) => !existingNames.has(file.name))
        .map((file) => ({
          fileName: file.name,
          altText: "",
        }));

      return [...prev, ...newFileData];
    });

    e.target.value = "";
  };


  // Handle alt text changes
  const handleAltTextChange = (index, value) => {
    const updated = [...selectedFiles];
    updated[index].altText = value;
    setSelectedFiles(updated);
  };


  function removeImage(fileName) {
    const updatedFiles = selectedFiles.filter(file => file.fileName !== fileName);
    console.log(updatedFiles);
    setSelectedFiles(updatedFiles || []);
  }

  // Submit payload to API
  const handleSubmitImages = async (e) => {
    e.preventDefault();
    setImgLoading(true);


    if (!propertyId || selectedFiles.length === 0) {
      console.log("❌ Please select files and enter propertyId");
    }

    // Build JSON payload
    const payload = selectedFiles.map((item, index) => ({
      propertyId: Number(propertyId),
      fileName: item.fileName,
      altText: item.altText || null,
      sortOrder: index + 1,
    }));

    // setPayloadPreview(payload);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSelectedFiles([]);

        // Isme images ka response dalna jo array ayega
        setImages(data.data);

        setImgLoading(false);
        setShowImageSec(false);
      } else {
        console.log(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    }
  };


  const handleSubmitform = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const imagesMeta = [];
      images.forEach((img, idx) => {
        imagesMeta.push({
          url: img.url,
          altText: img.altText || "",
          propertyId: propertyId || null
        });
      });

      const propertyQuery = `mutation CreateProperty {
          createProperty(
              input: {
                  agentId: ${1}
                  title: ${title}
                  description: ${description}
                  price: ${price}
                  propertyType: ${propertyType}
                  bedrooms: ${bathrooms}
                  bathrooms: ${bathrooms}
                  areaSqft: ${areaSqft}
                  listingStatus: ${listingStatus}
                  address: {
                      street: ${street}
                      state: ${stateVal}
                      city: ${city}
                      postalCode: ${postlcode}
                      country: ${country}
                  }
                  images: ${imagesMeta}
                  amenities: ${amenities}
              }
          ) {
              id
          }
      }`

      const res = await axios.post("/api/properties", { query: propertyQuery });

      console.log(res);

      setPropertyId("");
      setTitle("");
      setDescription("");
      setPrice("");
      setPropertyType("");
      setBedrooms("");
      setBathrooms("");
      setAreaSqft("");
      setListingStatus("");
      setStreet("");
      setCity("");
      setStateVal("");
      setCountry("");
      setAmenities("");
      setPostlcode("");
      setImages([]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {

        showImageSec &&
        <div className={`add-image-main-sec ${showImageSec ? "active" : ""}`}>
          <div className={`add-image-div`}>
            <X className="close-img-sec" onClick={() => setShowImageSec(false)} />
            <h2 >
              🏠 Property Image Upload
            </h2>

            <form onSubmit={handleSubmitImages}>
              <div>
                <label>Select Images:</label>
                <div>
                  <div className="taking-image">
                    <label htmlFor="fileInput" className="custom-file-label">
                      📂 Choose Images
                    </label>
                    <input
                      id="fileInput"
                      className="image-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <span id="file-name" className="file-name">{selectedFiles.length === 0 ? "No files chosen" : selectedFiles.length + " files chosen"}</span>
                  </div>
                </div>

              </div>

              {
                selectedFiles.length > 0 && (
                  <>
                    <div className="selected-file-main">
                      <h4>Selected Files:</h4>
                      {
                        selectedFiles.map((item, idx) => (
                          <div className="selected-files" key={idx}>
                            <span >{item.fileName}</span>
                            <input
                              type="text"
                              placeholder="Enter alt text"
                              value={item.altText}
                              onChange={(e) => handleAltTextChange(idx, e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                removeImage(item.fileName)
                              }}
                            >remove</button>
                          </div>
                        ))
                      }
                    </div>

                    <div className="pid">
                      <label >Property ID:</label>
                      <input
                        type="number"
                        value={propertyId}
                        onChange={(e) => setPropertyId(e.target.value)}
                        placeholder="Enter property ID"
                      />
                    </div>

                    <button
                      type="submit"
                      className="submit-btn"
                      style={{ marginTop: "1rem", float: "right", width: '100px', height: '38px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                      disabled={imgloading}
                    >
                      {imgloading ? <p className="load-img-send"></p> : "Upload"}
                    </button>
                  </>
                )
              }
            </form>

            {/* {
              payloadPreview && (
                <pre>
                  {JSON.stringify(payloadPreview, null, 2)}
                </pre>
              )
            } */}
          </div>
        </div>
      }

      <div className="show-post-property">
        <div className="property-form-container" role="dialog" aria-modal="true">
          <h2>Create New Property</h2>

          <form className="property-form" onSubmit={handleSubmitform}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="propertyId">Property ID (applies to all images)</label>
                <input
                  id="propertyId"
                  name="propertyId"
                  type="text"
                  placeholder="Enter property id (ex: PROP-001)"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter property title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter property description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  placeholder="Price in ₹"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="propertyType">Property Type</label>
                <input
                  id="propertyType"
                  name="propertyType"
                  type="text"
                  placeholder="e.g. Apartment"
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  placeholder="e.g. 3"
                  value={bedrooms}
                  onChange={(e) => setBedrooms(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  placeholder="e.g. 2"
                  value={bathrooms}
                  onChange={(e) => setBathrooms(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="areaSqft">Area (sqft)</label>
                <input
                  id="areaSqft"
                  name="areaSqft"
                  type="number"
                  placeholder="e.g. 1200"
                  value={areaSqft}
                  onChange={(e) => setAreaSqft(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="listingStatus">Listing Status</label>
                <input
                  id="listingStatus"
                  name="listingStatus"
                  type="text"
                  placeholder="e.g. For Sale"
                  value={listingStatus}
                  onChange={(e) => setListingStatus(e.target.value)}
                />
              </div>
            </div>

            <h3>Address</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="street">Street</label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  placeholder="Street name"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="State"
                  value={stateVal}
                  onChange={(e) => setStateVal(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="postalcode">Postal Code</label>
                <input
                  id="postalcode"
                  name="postalcode"
                  type="number"
                  placeholder="Postal Code"
                  value={postlcode}
                  onChange={(e) => setPostlcode(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>

            {/* Image  area */}
            <div className="images-section">
              <div className="images-header">
                <h3>Images</h3>
                <p className="muted">Upload one or more images. Provide alt text for each image. Property ID above applies to all images.</p>
              </div>

              <div className="image-uploader">
                <label className="file-input-label">
                  <button
                    type="button"
                    className="btn-file"
                    onClick={() => setShowImageSec(true)}
                  >Upload Images</button>
                </label>
                {images.length !== 0 && <><Check style={{ borderRadius: '50%', background: 'green', color: 'white' }} /> Images Added Successfully</>}
              </div>

              {/* <div className="images-grid">
                {
                  images.length === 0 && <div className="muted">No images selected.</div>
                }
                {
                  images.map((img) => (
                    <div className="image-item" key={img.id}>
                      <div className="thumb">
                        <img src={img.previewUrl} alt={img.altText || "preview"} />
                      </div>
                      <div className="image-meta">
                        <div className="meta-row small">
                          <label>Property</label>
                          <div className="muted small">{propertyId ? propertyId : "Will use Property ID from above"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div> */}
            </div>

            <div className="form-group full-width">
              <label htmlFor="amenities">Amenities</label>
              <input id="amenities" name="amenities" type="text" placeholder="e.g. Pool, Gym, Parking" value={amenities} onChange={(e) => setAmenities(e.target.value)} />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Submitting..." : "Create Property"}
              </button>
              <button type="button" className="btn-cancel" onClick={() => router.push('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
