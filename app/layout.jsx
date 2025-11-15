import "../styles/mainLayout.css"
import axios from "axios";
import PropertyProvider from "./propertyContext.jsx";
import AuthProvider from "./UserContext";
import { FavouriteProvider } from "./FavouriteContext";
import { getCurrentUser } from "@/lib/getCurrentUser";
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: "Homesphere",
  description: "Modern real-estate marketplace",
};


async function fetchProperties() {

  const query = `query GetAllProperties {
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
    }`

  const res = await axios.post("http://localhost:3000/api/graphql", { query });
  return res?.data?.data?.getAllProperties;
}

export default async function RootLayout({ children }) {

  const user = await getCurrentUser();
  const initialProperties = await fetchProperties();


  return (
    <html lang="en">
      <body>
        {/* {show && <Navbar />} */}
        <AuthProvider initialUser={user}>
          <PropertyProvider initialProperties={initialProperties}>
            <FavouriteProvider>
              <main>{children}</main>
            </FavouriteProvider>
          </PropertyProvider>
        </AuthProvider>
        <Toaster />
        {/* {show && <Footer />} */}
      </body>
    </html>
  );
}
