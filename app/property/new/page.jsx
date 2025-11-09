"use client";

import React, { useState, useRef, useEffect } from "react";
import "../../../styles/newproperty.css";
import { useRouter } from "next/navigation";
import axios from "axios";

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
  const [images, setImages] = useState([]);
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const nextId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  
  const handleFiles = (fileList) => {
    if (!fileList || fileList.length === 0) return;

    const newItems = Array.from(fileList).map((file) => {
      const previewUrl = URL.createObjectURL(file);
      return {
        id: nextId(),
        file,
        previewUrl,
        filename: file.name,
        altText: "",
        uploaded: false,
        url: null,
      };
    });

    setImages((prev) => [...prev, ...newItems]);
    if (propertyId && propertyId.trim() !== "") {
      newItems.forEach((item) => uploadSingleImage(item));
    }
  };

  const onFileChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = "";
  };

  const uploadSingleImage = async (item) => {
    if (item.uploaded) return item;
    if (!propertyId || propertyId.trim() === "") {
      return null;
    }
    const fd = new FormData();
    fd.append("file", item.file);
    fd.append("propertyId", propertyId.trim());
    try {
      setLoading(true);
      const res = await axios.post("/api/upload-image", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const json = res.data;

      setImages((prev) =>
        prev.map((img) =>
          img.id === item.id ? { ...img, uploaded: true, url: json.url, filename: json.filename || img.filename } : img
        )
      );
      return { ...item, uploaded: true, url: json.url, filename: json.filename || item.filename };
    } catch (err) {
      console.log(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };


  // remove single image
  const removeImage = (id) => {
    setImages((prev) => {
      const toRemove = prev.find((p) => p.id === id);
      if (toRemove && toRemove.previewUrl) URL.revokeObjectURL(toRemove.previewUrl);
      // delete from backend
      if (toRemove && toRemove.uploaded) {
        deleteImageOnServer(toRemove);
      }
      return prev.filter((p) => p.id !== id);
    });
  };


  const deleteImageOnServer = async (img) => {
    if (!img || !img.filename && !img.url) return;
    try {
      const fileURL = img.url;
      await axios.post("/api/delete-image", fileURL);
    } catch (err) {
      console.log("deleteImageOnServer failed", err?.message || err);
    }
  };


  // clear images
  const clearImages = async () => {
    const uploaded = images.filter((img) => img.uploaded);
    if (uploaded.length) {
      await Promise.all(uploaded.map((img) => deleteImageOnServer(img)));
    }
    images.forEach((img) => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  const handleAltChange = (id, value) => {
    setImages((prev) => prev.map((img) => (img.id === id ? { ...img, altText: value } : img)));
  };

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

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
      setPostlcode("")
      clearImages();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="show-post-property">
      <div className="property-form-container" role="dialog" aria-modal="true">
        <h2>Create New Property</h2>

        <form className="property-form" onSubmit={handleSubmit}>
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
              <label className="file-input-label" onClick={(e) => e.stopPropagation()}>
                <input
                  ref={fileInputRef}
                  className="file-input"
                  type="file"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={onFileChange}
                />
                <span className="btn-file">Choose Images</span>
              </label>

              <div className="uploader-actions">
                <button
                  type="button"
                  className="btn-small btn-ghost"
                  onClick={clearImages}>
                  Clear</button>
              </div>
            </div>

            <div className="images-grid">
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
                      <div className="meta-row">
                        <label>Alt Text</label>
                        <input
                          type="text"
                          value={img.altText}
                          placeholder="Describe this image (for accessibility)"
                          onChange={(e) => handleAltChange(img.id, e.target.value)}
                        />
                      </div>
                      <div className="meta-row small">
                        <label>Property</label>
                        <div className="muted small">{propertyId ? propertyId : "Will use Property ID from above"}</div>
                      </div>
                    </div>
                    <div className="image-actions">
                      <button type="button" className="btn-icon" onClick={() => removeImage(img.id)}>✕</button>
                    </div>
                  </div>
                ))}
            </div>
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
  );
}
