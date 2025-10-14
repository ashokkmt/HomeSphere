"use client";

import { useEffect, useState } from "react";
import "../styles/navbar.css"
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

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
              <i data-feather="bell" fill="none" stroke="currentColor"> </i>
            </button>
            <button className="iconButton">
              <i data-feather="heart" fill="none" stroke="currentColor">

              </i>
            </button>
            <button className="postButton">Post Property</button>
            <img className="avatar" src="http://static.photos/people/200x200/1" alt="User" />
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
