"use client";

import React, { useState, useContext, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "../UserContext";
import feather from "feather-icons";
import { FavouriteContext } from "../FavouriteContext";
import { PropertyContext } from "../propertyContext";
import '../../styles/dashboard.css'
import PropertyCard from "@/components/PropertyCard";
import axios from "axios";
import ConfirmCard from "@/components/ConfirmCard";
import { FailedToast, SuccessToast } from "@/components/utils/toast";

export default function DashboardPage() {
    const router = useRouter();
    const { user, refreshUser } = useAuth();
    const { favorites = [], refreshFav } = useContext(FavouriteContext);
    const { allProperties = [] } = useContext(PropertyContext);
    const [confirmedModel, setConfirmedModal] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);


    useEffect(() => {
        if (!user) {
            router.push("/auth/login");
            return;
        }
    }, [])

    // favourite properties
    const favouriteProperties = useMemo(() => {
        return allProperties.filter((property) =>
            favorites.some(
                (f) => Number(f.propertyId) === Number(property.id)
            )
        );
    }, [favorites, allProperties]);


    const userPosted = useMemo(() => {
        if (!user) return [];
        return allProperties?.filter((p) => Number(p?.userId) === Number(user?.id));
    }, [allProperties, user]);

    // Enquiry
    const [enquiries] = useState([]);

    // profile edit modal simple state
    const [editingProfile, setEditingProfile] = useState(false);
    const [profileName, setProfileName] = useState(user?.fullName ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [phone, setPhone] = useState(user?.phone ?? "");
    const [role, setRole] = useState(user?.role ?? "");
    const [savingProfile, setSavingProfile] = useState(false);

    useEffect(() => {
        feather.replace();
    }, [favouriteProperties.length, userPosted.length, editingProfile]);

    const handleSaveProfile = async () => {

        setSavingProfile(true);

        console.log(profileName, email, role)
        try {
            const query = `
                mutation UpdateUser($id: Int!, $input: UpdateUserInput!) {
                    updateUser(id: $id, input: $input) {
                        id
                    }      
                }
            `;

            const variables = {
                id: user?.id,
                input: {
                    fullName: profileName,
                    phone,
                    role,
                },
            };

            const res = await axios.post("http://localhost:3000/api/graphql", {
                query,
                variables,
            });

            
            if (res?.data?.errors) {
                FailedToast("Error in Changing !");
            }

            SuccessToast("Profile Updated Successfully");
            await refreshUser();
            setEditingProfile(false);
            setEditingProfile(false);

        } catch (err) {
            console.error(err);
        } finally {
            setSavingProfile(false);
        }
    };

    return (
        <>
            {
                confirmedModel &&
                <ConfirmCard
                    setConfirmDelete={setConfirmDelete}
                    setConfirmedModal={setConfirmedModal}
                />
            }

            <Navbar />
            <div className="dashboard">
                <div className="dashboard-inner">
                    <header className="dash-header">
                        <h1>Welcome back{user?.fullName ? `, ${user.fullName.split(" ")[0]}` : ""} 👋</h1>
                        <p className="dash-sub">Manage your profile, favorites, listings and enquiries from one place.</p>
                    </header>

                    <section className="dash-grid">
                        {/* Profile */}
                        <div className="panel profile-panel">
                            <div className="panel-head">
                                <h2>Profile</h2>
                                <button className="btn-link" onClick={() => setEditingProfile(true)}>Edit</button>
                            </div>

                            <div className="profile-body">
                                <img className="avatar-dash" src="	http://static.photos/people/200x200/3" alt="userIMG" />
                                <div className="profile-info">
                                    <div className="profile-name">{user?.fullName ?? "No name set"}</div>
                                    <div className="profile-email">{user?.email ?? "No email"}</div>
                                    <div className="profile-role">{user?.role ?? "User"}</div>
                                </div>
                            </div>
                        </div>

                        {/* Favorites preview */}
                        <div className="panel fav-panel">
                            <div className="panel-head">
                                <h2>Favorites</h2>
                                <span className="muted-sm">{favouriteProperties.length} saved</span>
                            </div>

                            <div className="cards-row">
                                {favouriteProperties.length === 0 ? (
                                    <div className="empty-card">
                                        <p>No favorites yet</p>
                                        <button className="btn-link" onClick={() => router.push("/favorites")}>View favorites</button>
                                    </div>
                                ) : favouriteProperties.slice(0, 3).map((p) => (
                                    <PropertyCard
                                        key={p.id}
                                        property={p}
                                        favorites={favorites}
                                        refreshFav={refreshFav}
                                        confirmDelete={confirmDelete}
                                        setConfirmDelete={setConfirmDelete}
                                        confirmedModel={confirmedModel}
                                        setConfirmedModal={setConfirmedModal}
                                    />
                                ))}
                            </div>

                            <div className="panel-actions">
                                <button className="btn" onClick={() => router.push("/favorites")}>View all favorites</button>
                            </div>
                        </div>

                        {/* Posted properties */}
                        <div className="panel posts-panel">
                            <div className="panel-head">
                                <h2>Posted Properties</h2>
                                <span className="muted-sm">{userPosted.length} active</span>
                            </div>

                            <div className="cards-row">
                                {userPosted.length === 0 ? (
                                    <div className="empty-card">
                                        <p>You haven't posted any properties yet</p>
                                    </div>
                                ) : userPosted.slice(0, 3).map((p) => (
                                    <PropertyCard
                                        key={p.id}
                                        property={p}
                                        favorites={favorites}
                                        refreshFav={refreshFav}
                                        confirmDelete={confirmDelete}
                                        setConfirmDelete={setConfirmDelete}
                                        confirmedModel={confirmedModel}
                                        setConfirmedModal={setConfirmedModal}
                                    />
                                ))}
                            </div>

                            <div className="panel-actions">
                                {userPosted.length > 3 && (
                                    <button className="btn" onClick={() => router.push("/user/properties")}>View all your listings</button>
                                )}
                                <button className="btn" onClick={() => router.push("/property/new")}>Create new</button>
                            </div>
                        </div>

                        {/* Enquiries */}
                        <div className="panel enquires-panel">
                            <div className="panel-head">
                                <h2>Enquiries</h2>
                                <span className="muted-sm">{enquiries.length}</span>
                            </div>

                            <div className="enquiries-list">
                                {enquiries.length === 0 ? (
                                    <div className="empty-card small">
                                        <p>No enquiries yet</p>
                                        <p className="muted-sm">Leads will appear here when someone contacts you about a property.</p>
                                    </div>
                                ) : enquiries.map(e => (
                                    <div key={e.id} className="enquiry">
                                        <div className="enq-left">
                                            <div className="enq-sender">{e.name}</div>
                                            <div className="muted-sm">{e.message}</div>
                                        </div>
                                        <div className="enq-actions">
                                            <button className="btn small" onClick={() => router.push(`/property/${e.propertyId}`)}>View</button>
                                            <button className="btn small ghost">Reply</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                </div>

                {/* profile edit  */}
                {editingProfile && (
                    <div className="modal-backdrop" onClick={() => setEditingProfile(false)}>
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <h3>Edit profile</h3>
                            <div className="dash-formGroup">
                                <label>Full name </label>
                                <input value={profileName} onChange={(e) => setProfileName(e.target.value)} />
                            </div>
                            <div className="dash-formGroup">
                                <label>Email </label>
                                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="dash-formGroup">
                                <label>Phone </label>
                                <input type="number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </div>
                            <div className="dash-formGroup">
                                <label>Role</label>
                                <input type="text" value={role} onChange={(e) => setRole(e.target.value)} />
                            </div>
                            <div className="modal-actions">
                                <button className="btn" onClick={() => setEditingProfile(false)}>Cancel</button>
                                <button className="btn primary" onClick={handleSaveProfile} disabled={savingProfile}>{savingProfile ? "Saving..." : "Save"}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
}

