"use client"

import { createContext, useEffect, useState } from "react"
import { useAuth } from "./UserContext";
import axios from "axios";


const FavouriteContext = createContext({ favorites: null, setfavorites: () => { }, refreshFav: () => { } });


export const FavouriteProvider = ({ children, userFavorites = null }) => {
    const [favorites, setfavorites] = useState(Array.isArray(userFavorites) ? userFavorites : []);
    const { user } = useAuth();


    const fetchFavorites = async (userID) => {
        if (!userID) {
            setfavorites([]);
            return;
        }

        try {
            const query = `
                query GetUserFavorites($id: Int!) {
                    getUserFavorites(userId: $id) { 
                        propertyId 
                    }
                }
            `;
            const res = await axios.post("http://localhost:3000/api/graphql", {
                query,
                variables: { id: Number(userID) },
            });

            if (res.data.errors) {
                console.log(res.data.errors + " this error come");
            }

            const favs = res?.data?.data?.getUserFavorites ?? [];
            setfavorites(favs);

        } catch (error) {
            setfavorites([]);
            console.log(error.message + " This Error comes")
        }
    }

    useEffect(() => {
        if (user) {
            fetchFavorites(user?.id);
        }
        else {
            setfavorites([]);
        }
    }, [user])

    return <FavouriteContext.Provider value={{ favorites, setfavorites, refreshFav: (uid = user?.id) => fetchFavorites(uid) }}>{children}</FavouriteContext.Provider>
}


export { FavouriteContext };