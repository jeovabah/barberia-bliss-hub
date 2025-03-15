
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white" id="about">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-16 px-4">
          <div>
            <h3 className="text-xl font-bold mb-6">BARBER<span className="font-light">BLISS</span></h3>
            <p className="text-gray-400 text-sm mb-6">
              Premium barbershop experience dedicated to craftsmanship and personal style. Elevating grooming standards since 2015.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Services</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Classic Haircut</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Beard Trim & Shaping</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Premium Shave</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Complete Grooming</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Hair Styling</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Home</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Services</a></li>
              <li><a href="#barbers" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Our Barbers</a></li>
              <li><a href="#book-now" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Book Appointment</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">About Us</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-medium uppercase tracking-wider mb-6">Contact Us</h4>
            <address className="not-italic text-gray-400 text-sm">
              <p>123 Main Street</p>
              <p>New York, NY 10001</p>
              <p className="mt-4">+1 (234) 567-890</p>
              <p>info@barberbliss.com</p>
            </address>
            
            <div className="mt-6">
              <h5 className="text-sm font-medium mb-2">Hours</h5>
              <p className="text-gray-400 text-sm">Mon-Fri: 9AM - 6PM</p>
              <p className="text-gray-400 text-sm">Sat: 10AM - 5PM</p>
              <p className="text-gray-400 text-sm">Sun: Closed</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2023 BarberBliss. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-xs transition-colors duration-300">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white text-xs transition-colors duration-300">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white text-xs transition-colors duration-300">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
