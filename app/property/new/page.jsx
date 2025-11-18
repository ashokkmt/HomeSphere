"use client";

import React, { useContext, useEffect, useState } from "react";
import "../../../styles/newproperty.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Check, X } from "react-feather";
import { useAuth } from "@/app/UserContext";
import { PropertyContext } from "@/app/propertyContext";
import { FailedToast, SuccessToast } from "@/components/utils/toast";

export default function NewProperty() {

  const { user } = useAuth();
  const { refreshProperties } = useContext(PropertyContext);

  // form fields
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
  const router = useRouter();

  // images ke cheej
  const [showImageSec, setShowImageSec] = useState(false);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imgloading, setImgLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  // const [payloadPreview, setPayloadPreview] = useState(null);


  // Aminities
  const [allAmenities, setAllAmenities] = useState([]);
  const [amenities, setAmenities] = useState([]);



  useEffect(() => {
    async function fetchALlAminites() {
      const query = `query GetAllAmenities {
        getAllAmenities {
          id
          name
        }
      }`

      const res = await axios.post("http://localhost:3000/api/graphql", { query });
      console.log(res.data?.data?.getAllAmenities)
      setAllAmenities(res.data?.data?.getAllAmenities);
    }

    fetchALlAminites();
  }, [])


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => {
      // prevent duplicates based on file name
      const existingNames = new Set(prev.map((p) => p.file.name));

      const newFileData = files
        .filter((file) => !existingNames.has(file.name))
        .map((file) => ({
          file,                  // actual File object for upload
          fileName: file.name,   // for display purposes
          altText: "",           // user can edit this later
          previewUrl: URL.createObjectURL(file), // local preview
        }));

      return [...prev, ...newFileData];
    });

    // reset input to allow re-selecting the same file if needed
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

    if (selectedFiles.length === 0) {
      console.log("❌ Please select at least one file");
      setImgLoading(false);
      return;
    }

    // Build FormData for multipart upload
    const formData = new FormData();

    selectedFiles.forEach((item, index) => {
      formData.append("images", item.file); // actual File object
      formData.append("altTexts", item.altText || "");
      formData.append("sortOrders", (index + 1).toString());
    });

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData, // no need for Content-Type header
      });

      const data = await res.json();

      if (data.success) {
        console.log("✅ Uploaded images:", data.images);
        setImages(data.images); // [{url, altText, sortOrder}]
        setSelectedFiles([]);
        setShowImageSec(false);
      } else {
        console.log(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
    } finally {
      setImgLoading(false);
    }
  };



  const handleSubmitform = async (e) => {
    e.preventDefault();

    // ✅ Step 1: Frontend validation
    const errors = {};
    if (images.length === 0) alert("At least one image is required.");

    setLoading(true);

    try {
      // ✅ Step 2: Prepare images metadata
      const imagesMeta = images.map((img, i) => ({
        url: img.url,
        altText: img.altText || "",
        sortOrder: img.sortOrder || i + 1,
      }));

      // ✅ Step 3: Build input dynamically
      const input = {
        userId: user?.id,
        title: title.trim(),
        description: description?.trim() || "",
        price: parseFloat(price.trim()),
        propertyType: propertyType || "",
        listingStatus: listingStatus || "",
        address: {
          street: street.trim(),
          state: stateVal.trim(),
          city: city.trim(),
          postalCode: postlcode?.trim() || "",
          country: country.trim(),
        },
        images: imagesMeta,
        amenityIds: amenities || []
      };

      // ✅ Step 4: Include optional fields only if they have values
      if (bedrooms) input.bedrooms = Number(bedrooms);
      if (bathrooms) input.bathrooms = Number(bathrooms);
      if (areaSqft) input.areaSqft = Number(areaSqft);

      // ✅ Step 5: Clean payload (remove empty/null/undefined values)
      const cleanInput = JSON.parse(
        JSON.stringify(input, (key, value) => {
          if (
            value === "" ||
            value === null ||
            value === undefined ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return undefined;
          }
          return value;
        })
      );

      // ✅ Step 6: GraphQL Mutation using variables
      const mutation = `
      mutation CreateProperty($input: CreatePropertyInput!) {
        createProperty(input: $input) {
          id
        }
      }`;

      // ✅ Step 7: Execute GraphQL Request
      const res = await axios.post("/api/graphql", {
        query: mutation,
        variables: { input: cleanInput },
      });

      if (res.data.errors) {
        console.log(res.data.errors);
        FailedToast("Something Wrong !");
        return;
      }

      SuccessToast("Property Added Successfully");
      refreshProperties();

      //  Reset form fields
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
      setAmenities([]);
      setPostlcode("");
      setImages([]);
    } catch (err) {
      console.error("❌ Error during property creation:", err);
      alert("⚠️ Something went wrong while creating the property.");
    } finally {
      setLoading(false);
    }
  };


  function toggleAmenity(id) {
    setAmenities(prev => {
      const exists = prev.some(aid => aid === id);
      return exists
        ? prev.filter(aid => aid !== id)
        : [...prev, id];
    });
  }


  useEffect(() => {
    console.log(stateVal, street, city, country);
  }, [stateVal, street, city, country])


  return (
    <>
      {

        showImageSec &&
        <div className={`add-image-main-sec `}>
          <div className={`add-image-div ${showImageSec ? "active" : ""}`}>
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

                    {/* <div className="pid">
                      <label >Property ID:</label>
                      <input
                        type="number"
                        value={propertyId}
                        onChange={(e) => setPropertyId(e.target.value)}
                        placeholder="Enter property ID"
                      />
                    </div> */}

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
              {/* <div className="form-group">
                <label htmlFor="propertyId">Property ID (applies to all images)</label>
                <input
                  id="propertyId"
                  name="propertyId"
                  type="text"
                  placeholder="Enter property id (ex: PROP-001)"
                  value={propertyId}
                  onChange={(e) => setPropertyId(e.target.value)}
                />
              </div> */}

              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter property title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
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
                required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
              <div className="allAmenities">
                {
                  allAmenities?.map((amenity) => {
                    return (
                      <p
                        key={amenity?.id}
                        tabIndex={0}
                        role="button"
                        onClick={(e) => toggleAmenity(amenity?.id)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleAmenity(amenity.id); }}
                        className={`amenity-p ${amenities.some(aid => aid === amenity.id) ? "active" : ""}`}
                      >
                        {amenity.name}
                      </p>
                    )
                  })
                }
                <p className="amenity-p-other">other</p>
              </div>

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
