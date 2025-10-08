# 🏡 HomeSphere

**HomeSphere** is a Real Estate Property Listing Platform built as a **DBMS project**.  
It allows users to list, search, and manage properties efficiently using a structured database and GraphQL for data querying.

---

## 📘 Project Overview
HomeSphere provides an easy way to:
- Add and manage property listings  
- Search properties by filters like price, location, and type  
- Manage user and owner information  
- Demonstrate key **DBMS concepts** such as normalization, relationships, and queries

---

## 🗄️ Database Details
**Main Entities:**
- `Users` – stores information about buyers, sellers, and agents  
- `Properties` – contains property details  
- `Addresses` – linked to each property  
- `Favorites` – saves user’s liked properties  

**Relationships:**
- One user can list multiple properties  
- Each property has one address  
- Users can save multiple favorite properties  

---

## 🧩 Technologies Used
- **Frontend:** Next.js / React  
- **Backend:** Node.js with Express  
- **Database:** PostgreSQL / MySQL  
- **Query Language:** GraphQL  

---

## ⚙️ Features
- Add, update, delete property listings  
- View all properties with filters  
- GraphQL API for efficient data fetching  
- Relational database schema for structured storage  

---

## 🚀 Setup Instructions
1. Clone the repository  
   ```bash
   git clone https://github.com/yourusername/homesphere.git

2. Install dependencies
    ```bash
    npm install
3. Start the server
    ```bash
    npm run dev