import "../styles/mainLayout.css"
import axios from "axios";
import PropertyProvider from "./propertyContext.jsx";
import AuthProvider from "./UserContext";
import { FavouriteProvider } from "./FavouriteContext";
import { getCurrentUser } from "@/lib/getCurrentUser";

export const metadata = {
  title: "Homesphere",
  description: "Modern real-estate marketplace",
};

export default async function RootLayout({ children }) {

  const user = await getCurrentUser();

  // let user = null;
  // try {
  //   const cookieStore = cookies(); // call before any await
  //   const token = cookieStore.get("access_token")?.value;
  //   if (token) {
  //     const payload = verifyAccessToken(token); // sync verify
  //     // DB call is awaited below (OK) but cookie reading happened first
  //     user = await prisma.user.findUnique({
  //       where: { id: parseInt(payload.sub, 10) },
  //       select: { id: true, email: true, fullName: true, role: true },
  //     });
  //   }
  // } catch (err) {
  //   console.warn("Could not verify token in layout:", err?.message);
  //   user = null;
  // }

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
      }
  }`
  const res = await axios.post("http://localhost:3000/api/graphql", { query });
  const initialProperties = res?.data?.data?.getAllProperties;


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
        {/* {show && <Footer />} */}
      </body>
    </html>
  );
}
