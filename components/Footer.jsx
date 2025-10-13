import "../styles/footer.css"


export default function Footer() {
  return (

    <footer className="footer">
      <div className="footerContent">
        <div className="footerGrid">
          <div className="footerColumn">
            <h3 className="footerTitle">Buy</h3>
            <ul className="footerList">
              <li><a href="#">Homes for Sale</a></li>
              <li><a href="#">New Projects</a></li>
              <li><a href="#">Open Houses</a></li>
              <li><a href="#">Foreclosures</a></li>
            </ul>
          </div>
          <div className="footerColumn">
            <h3 className="footerTitle">Rent</h3>
            <ul className="footerList">
              <li><a href="#">Apartments for Rent</a></li>
              <li><a href="#">Houses for Rent</a></li>
              <li><a href="#">Short Term Rentals</a></li>
              <li><a href="#">Pet Friendly</a></li>
            </ul>
          </div>
          <div className="footerColumn">
            <h3 className="footerTitle">Resources</h3>
            <ul className="footerList">
              <li><a href="#">Real Estate News</a></li>
              <li><a href="#">Mortgage Calculator</a></li>
              <li><a href="#">Moving Checklist</a></li>
              <li><a href="#">Property Tax Info</a></li>
            </ul>
          </div>
          <div className="footerColumn">
            <h3 className="footerTitle">Company</h3>
            <ul className="footerList">
              <li><a href="#">About Us</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footerBottom">
          <div className="socialLinks">
            <a href="#"><i data-feather="facebook" ></i></a>
            <a href="#"><i data-feather="instagram" fill="none" stroke="currentColor"></i></a>
            <a href="#"><i data-feather="twitter" ></i></a>
            <a href="#"><i data-feather="linkedin" fill="none"></i></a>
          </div>
          <p className="copyright">© 2023 NestQuest, Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
