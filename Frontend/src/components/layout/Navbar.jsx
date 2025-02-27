import { useState } from "react";
import { Link } from "react-router-dom";
import { Book, Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Courses", path: "/courses" }
];

const Navbar = ({isAuth}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-md">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between py-4">
          
          {/* Left Side - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <Book className="w-6 h-6 mr-2 text-black" />
              <span className="text-xl font-bold text-black">E-Learning</span>
            </Link>

            {/* Navigation Links (Left-aligned) */}
            <div className="hidden md:flex space-x-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className="text-black font-medium hover:text-gray-600"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side - Account Link */}
          <div className="hidden md:flex mr-48">
          {
              isAuth?(<Link to="/account" className="block text-black font-medium hover:text-gray-600">
              Account
            </Link>) : (
              <Link to="/login" className="block text-black font-medium hover:text-gray-600">
              Login
            </Link>
            )
            }
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-black focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden space-y-2 pb-4">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className="block text-black font-medium hover:text-gray-600"
              >
                {link.name}
              </Link>
            ))}
            {
              isAuth?(<Link to="/account" className="block text-black font-medium hover:text-gray-600">
              Account
            </Link>) : (
              <Link to="/login" className="block text-black font-medium hover:text-gray-600">
              Login
            </Link>
            )
            }
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
