import "../styles/mainLayout.css"

export const metadata = {
  title: "Homesphere",
  description: "Modern real-estate marketplace",
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body>
        {/* {show && <Navbar />} */}
        <main>{children}</main>
        {/* {show && <Footer />} */}
      </body>
    </html>
  );
}
