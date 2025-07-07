import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto  footer">
      <div className="container-fluid text-md-left ml-0 footer">
        <div className="row text-md-left">
          {/* About Section */}
          <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning" style={{textDecoration: "underline",
  textDecorationColor: "rgba(222, 155, 0, 0.8)"}}>MyBag</h5>
            <p>
              MyBag is your one-stop shop for the latest fashion trends, quality products, and unbeatable prices. Shop with confidence and style.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-2 col-lg-2 col-xl-2 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning" style={{textDecoration: "underline",
  textDecorationColor: "rgba(222, 155, 0, 0.8)"}}>Quick Links</h5>
            <p><a href="/shop/listing" className="text-light" style={{ textDecoration: 'none' }}>Shop</a></p>
            <p><a href="/Shopping-View/orders" className="text-light" style={{ textDecoration: 'none' }}>Orders</a></p>
            <p><a href="/Shopping-View/account" className="text-light" style={{ textDecoration: 'none' }}>Account</a></p>
            <p><a href="/Shopping-View/contactus" className="text-light" style={{ textDecoration: 'none' }}>Contact Us</a></p>
          </div>

          {/* Contact Info */}
          <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning" style={{textDecoration: "underline",
  textDecorationColor: "rgba(222, 155, 0, 0.8)"}}>Contact</h5>
            <p><span style={{marginRight: '10px'}}>🏠</span> 123 Fashion St, Style City, USA</p>
            <p><span style={{marginRight: '10px'}}>✉️</span> support@mybag.com</p>
            <p><span style={{marginRight: '10px'}}>📞</span> +1 234 567 890</p>
            <p><span style={{marginRight: '10px'}}>📠</span> +1 234 567 891</p>
          </div>

          {/* Social Media */}
          <div className="col-md-3 col-lg-4 col-xl-3 mx-auto mt-3">
            <h5 className="text-uppercase mb-4 font-weight-bold text-warning" style={{textDecoration: "underline",
  textDecorationColor: "rgba(222, 155, 0, 0.8)"}}>Follow Us</h5>
            <a href="https://facebook.com" className="text-light me-4" style={{fontSize: '1.5rem'}}>
              <span role="img" aria-label="Facebook">📘</span>
            </a>
            <br />
            <a href="https://twitter.com" className="text-light me-4" style={{fontSize: '1.5rem'}}>
              <span role="img" aria-label="Twitter">🐦</span>
            </a>
            <br />
            <a href="https://instagram.com" className="text-light me-4" style={{fontSize: '1.5rem'}}>
              <span role="img" aria-label="Instagram">📸</span>
            </a>
            <br />
            <a href="https://linkedin.com" className="text-light me-4" style={{fontSize: '1.5rem'}}>
              <span role="img" aria-label="LinkedIn">🔗</span>
            </a>
            <br />
          </div>
        </div>

        <hr className="mb-4 d-flex align-items-center" style={{width: "100%"}}/>
        <div className="row align-items-center">
          <div className="col-md-7 col-lg-8">
            <p>© {new Date().getFullYear()} MyBag. All rights reserved.</p>
          </div>
          <div className="col-md-5 col-lg-4">
            <p className="text-end">Designed by MyBag Team</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
