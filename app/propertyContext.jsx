'use client';

import React, { createContext, useState } from 'react';

const PropertyContext = createContext();

export default function PropertyProvider({ initialProperties = [], children }) {
    const [allProperties, setAllProperties] = useState(initialProperties);

    return (
        <PropertyContext.Provider value={{ allProperties, setAllProperties }}>
            {children}
        </PropertyContext.Provider>
    );
}

export { PropertyContext }