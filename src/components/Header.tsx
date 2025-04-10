
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-ddd-600 to-ddd-800 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">DDD</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Clean DDD</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-ddd-600 transition-all-200">
              Home
            </Link>
            <Link to="/knowledge" className="text-gray-700 hover:text-ddd-600 transition-all-200">
              Knowledge Base
            </Link>
            <Link to="/events" className="text-gray-700 hover:text-ddd-600 transition-all-200">
              Events
            </Link>
            <Button variant="outline" className="ml-4">
              Join Community
            </Button>
          </nav>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link 
              to="/" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/knowledge" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Knowledge Base
            </Link>
            <Link 
              to="/events" 
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Events
            </Link>
            <div className="px-4 py-2">
              <Button className="w-full">Join Community</Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
