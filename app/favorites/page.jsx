"use client"

// app/favorites/page.jsx
import PropertyCard from "../../components/PropertyCard";
import { useContext, useEffect, useState } from "react";
import { PropertyContext } from '../propertyContext'
import '../../styles/favorites.css'
import { ArrowLeft } from "react-feather";
import { useRouter } from "next/navigation";
import { useAuth } from "../UserContext";
import axios from "axios";
import { FavouriteContext } from "../FavouriteContext";


export default function Favorites() {

  const { allProperties } = useContext(PropertyContext)
  const { user } = useAuth();
  const router = useRouter();
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [favItems, setFavItems] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { favorites, setfavorites, refreshFav } = useContext(FavouriteContext);
  const [confirmedModel, setConfirmedModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);



  useEffect(() => {
    if (user === null) {
      router.push("/auth/login");
      return;
    }

    const fetchFav = async (id) => {

      setIsLoaded(true);

      const query = `
        query GetUserById($id: Int!) {
          getUserById(id: $id) {
          favorites {
            propertyId
          }
        }
      }`;

      try {
        const res = await axios.post("http://localhost:3000/api/graphql", {
          query,
          variables: { id: Number(id) },
        });

        if (res.data.errors) {
          console.error("error here :", res.data.errors);
          setIsLoaded(false);
          return;
        }

        const favorites = res?.data?.data?.getUserById?.favorites ?? [];
        setFavItems(favorites);

        const filtered = allProperties.filter((property) =>
          favorites.some(
            (f) => Number(f.propertyId) === Number(property.id)
          )
        );
        setFavoriteProperties(filtered);
      } catch (err) {
        console.error("Error : ", err);
      } finally {
        setIsLoaded(false);
      }

    };

    fetchFav(user.id);

  }, [user, allProperties, router, favorites]);

  return (
    <>

      {
        confirmedModel &&
        <ConfirmCard
          setConfirmDelete={setConfirmDelete}
          setConfirmedModal={setConfirmedModal}
        />
      }

      <div className="favorites">

        {
          isLoaded &&
          <div className="loading-overlay">
            <div className="loadingCircle"></div>
            <div>Loading</div>
          </div>
        }

        <ArrowLeft onClick={() => router.back()} className="back-arrow" />
        <div className="fav-header">
          <h1>Favorites</h1>
          <div >Saved places</div>
        </div>

        {
          favoriteProperties?.length === 0 ? (
            <div className="empty-state">No favorites yet</div>
          ) : (
            <div className="propertyGridFav">
              {
                favoriteProperties?.map((p) => {
                  return (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      favorites={favorites}
                      setfavorites={setfavorites}
                      refreshFav={refreshFav}
                      confirmDelete={confirmDelete}
                      setConfirmDelete={setConfirmDelete}
                      confirmedModel={confirmedModel}
                      setConfirmedModal={setConfirmedModal}
                    />
                  )
                })
              }
            </div>
          )
        }
      </div>
    </>
  );
}
