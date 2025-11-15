'use client';

import axios from 'axios';
import React, { createContext, useState } from 'react';

const PropertyContext = createContext();

export default function PropertyProvider({ initialProperties = [], children }) {
    const [allProperties, setAllProperties] = useState(initialProperties);

    const refreshProperties = async () => {
        try {
            const query = `
            query GetAllProperties {
                getAllProperties {
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
                        url
                        sortOrder
                        altText
                    }
                    address {
                        city
                        state
                    }
                    user {
                        fullName
                    }
                }
            }`;
            const res = await axios.post("/api/graphql", { query });
            const data = res?.data?.data?.getAllProperties ?? [];
            setAllProperties(data);
        } catch (err) {
            console.error("Error refreshing properties:", err);
        }
    };

    return (
        <PropertyContext.Provider value={{ allProperties, setAllProperties, refreshProperties }}>
            {children}
        </PropertyContext.Provider>
    );
}

export { PropertyContext }