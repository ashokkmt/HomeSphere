"use client";

import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
// import { isAuthenticated } from "./utils/isAuthenticated";
import { ChevronDown } from "react-feather";
// import { isAuthenticated } from "./utils/isAuthenticated";
// import { useAuth } from "../app/UserContext";
import feather from 'feather-icons';
import { useAuth } from "@/app/UserContext";

export default function Navbar() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [showUserDrop, setshowUserDrop] = useState(false);
  const { user, setUser } = useAuth();
  const dropdownRef = useRef();


  useEffect(() => {
    feather.replace();

    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setshowUserDrop(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [])

  useEffect(() => {
    if (user) {
      setIsAuth(true);
    }
  }, [user])

  useEffect(() => {
    if (!pathname) return;

    let tabName = "";

    switch (pathname) {
      case "/": tabName = "Buy"; break;
      case "/rent": tabName = "Rent"; break;
      case "/property": tabName = "Properties"; break;
      case "/agents": tabName = "Agents"; break;
    }
    if (tabName) changeTab(tabName, "navLink", "navLinkActive");

    if (mobileMenuOpen) {
      changeTab("Mob" + tabName, "mobileMenuLink", "mobileMenuLinkActive");
    }
  }, [pathname, mobileMenuOpen]);



  const changeTab = (tab, view, which) => {
    document.querySelectorAll(`.${view}`).forEach((link) => link.classList.remove(which));
    const el = document.querySelector(`.${view}.${tab}`);
    if (el) el.classList.add(which);
  };


  const logoutuser = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/auth/logout",
        { method: "POST", credentials: "include" }
      )
      if (res.ok) {
        console.log(res);
        setUser(null);
        window.location.href = "/";
        // refreshUser();
        // router.push("/");
      }
    } catch (error) {
      console.log(error + " this error is here")
    }
  }


  const favourates = () => {
    console.log("Here")
    if (isAuth) {
      router.push("/favorites")
    }
    else {
      router.push('/auth/login')
    }
  }


  return (
    <nav className="nav">
      <div className="navContainer">
        <div className="navContent">
          <div className="navLeft">
            <div className="logo">
              <i data-feather="home" className="logoIcon" ></i>
              <span className="logoText">HomeSphere</span>
            </div>
            <div className="navLinks">
              <Link onClick={(e) => {
                changeTab("Buy", "navLink", "navLinkActive");
              }}
                href="/"
                className="navLink Buy navLinkActive"
              >Buy</Link>
              <Link onClick={(e) => {
                changeTab("Rent", "navLink", "navLinkActive");
              }}
                href="#"
                className="navLink Rent"
              >Rent</Link>
              <Link onClick={(e) => {
                changeTab("Properties", "navLink", "navLinkActive")
              }}
                href="/property"
                className="navLink Properties"
              >Properties</Link>
              <Link onClick={(e) => {
                changeTab("Agents", "navLink", "navLinkActive")
              }}
                href="/agents"
                className="navLink Agents"
              >Agents</Link>
            </div>
          </div>
          <div className="navRight">
            <button className="iconButton">
              <i data-feather="bell" stroke="currentColor"> </i>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                favourates();
              }}
              className="iconButton">
              <i data-feather="heart" fill="none" stroke="currentColor" ></i>
            </button>
            <button
              onClick={() => {
                if (isAuth) {
                  router.push('/property/new')
                }
                else {
                  router.push('/auth/login');
                }
              }}
              className="postButton"
            >Post Property</button>
            {
              isAuth ?
                <>
                  <div ref={dropdownRef} className="login-icon-box">
                    <img
                      className="avatar"
                      src="http://static.photos/people/200x200/1"
                      alt="User"
                    />
                    <span>{user?.fullName.split(" ")[0]}</span>

                    <ChevronDown
                      onClick={() => setshowUserDrop(!showUserDrop)}
                      className={`login-dropdown-icon ${showUserDrop ? "active" : ""}`}
                    />

                    <div className={`showDropContent ${showUserDrop ? "open" : ""}`}>
                      <div>
                        <Link href={"/dashboard"}>Dashboard</Link>
                        <Link href={"/property"}>Properties</Link>
                        <button onClick={() => logoutuser()} >Logout</button>
                      </div>
                    </div>
                  </div>

                </>
                :
                <button onClick={() => router.push("/auth/login")} className="loginBTN">Login</button>
            }

          </div>
          <button className="mobileMenuButton" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <i data-feather="menu" fill="none" stroke="currentColor">
            </i>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobileMenu">
          <Link
            onClick={(e) => {
              changeTab("MobBuy", "mobileMenuLink", "mobileMenuLinkActive")
              setMobileMenuOpen(false)
            }}
            href="/"
            className="MobBuy mobileMenuLink mobileMenuLinkActive"
          >Buy</Link>
          <Link
            onClick={(e) => {
              changeTab("MobRent", "mobileMenuLink", "mobileMenuLinkActive")
              setMobileMenuOpen(false)
            }}
            href="#"
            className="MobRent mobileMenuLink"
          >Rent</Link>
          <Link
            onClick={(e) => {
              changeTab("MobProperties", "mobileMenuLink", "mobileMenuLinkActive")
              setMobileMenuOpen(false)
            }}
            href="/property"
            className="MobProperties mobileMenuLink"
          >Properties</Link>
          <Link
            onClick={(e) => {
              changeTab("MobAgents", "mobileMenuLink", "mobileMenuLinkActive")
              setMobileMenuOpen(false)
            }}
            href="/agents"
            className="MobAgents mobileMenuLink"
          >Agents</Link>
        </div>
      )}
    </nav>
  );
}
