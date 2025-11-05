import "../styles/mainLayout.css"
import axios from "axios";
import PropertyProvider from "./propertyContext.jsx";

export const metadata = {
  title: "Homesphere",
  description: "Modern real-estate marketplace",
};

export default async function RootLayout({ children }) {

  const query = `query GetAllProperties {
    getAllProperties {
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
          url
          sortOrder
          altText
        }
        address {
          city
          state
        }
      }
  }`
  const res = await axios.post("http://localhost:3000/api/graphql", { query });
  const initialProperties = res?.data?.data?.getAllProperties;

  return (
    <html lang="en">
      <body>
        {/* {show && <Navbar />} */}

        <PropertyProvider initialProperties={initialProperties}>
          <main>{children}</main>
        </PropertyProvider>

        {/* {show && <Footer />} */}
      </body>
    </html>
  );
}
