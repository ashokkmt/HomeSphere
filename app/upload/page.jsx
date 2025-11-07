"use client";

import { useState } from "react";

export default function UploadPage() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  const [message, setMessage] = useState("");
  const [payloadPreview, setPayloadPreview] = useState(null);

  // When user selects multiple files
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const fileData = files.map((file) => ({
      fileName: file.name,
      altText: "",
    }));
    setSelectedFiles(fileData);
  };

  // Handle alt text changes
  const handleAltTextChange = (index, value) => {
    const updated = [...selectedFiles];
    updated[index].altText = value;
    setSelectedFiles(updated);
  };

  // Submit payload to API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!propertyId || selectedFiles.length === 0)
      return setMessage("❌ Please select files and enter propertyId");

    // Build JSON payload
    const payload = selectedFiles.map((item, index) => ({
      propertyId: Number(propertyId),
      fileName: item.fileName,
      altText: item.altText || null,
      sortOrder: index + 1,
    }));

    setPayloadPreview(payload);

    try {
      const res = await fetch("/api/uploads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Uploaded ${data.images.length} images successfully!`);
        setSelectedFiles([]);
        setPropertyId("");
      } else {
        setMessage(`❌ Failed: ${data.message}`);
      }
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  return (
    <div style={{ padding: "40px", maxWidth: "650px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
        🏠 Property Image Upload
      </h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontWeight: "bold" }}>Select Images:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "block", marginTop: "10px" }}
          />
        </div>

        {selectedFiles.length > 0 && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <h4>Selected Files:</h4>
              {selectedFiles.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                  }}
                >
                  <span style={{ flex: 1 }}>{item.fileName}</span>
                  <input
                    type="text"
                    placeholder="Enter alt text"
                    value={item.altText}
                    onChange={(e) => handleAltTextChange(idx, e.target.value)}
                    style={{
                      flex: 2,
                      padding: "4px 8px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ fontWeight: "bold" }}>Property ID:</label>
              <input
                type="number"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                placeholder="Enter property ID"
                style={{
                  display: "block",
                  marginTop: "10px",
                  width: "100%",
                  padding: "6px 8px",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Upload
            </button>
          </>
        )}
      </form>

      {message && (
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
            color: message.startsWith("✅") ? "green" : "red",
          }}
        >
          {message}
        </p>
      )}

      {payloadPreview && (
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "6px",
            marginTop: "20px",
            fontSize: "12px",
          }}
        >
          {JSON.stringify(payloadPreview, null, 2)}
        </pre>
      )}
    </div>
  );
}
