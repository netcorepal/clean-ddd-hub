import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { t } = useTranslation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleQrModal = () => {
    setIsQrModalOpen(!isQrModalOpen);
  };

  return (
    <>
      <header className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                {logoError ? (
                  <div className="w-8 h-8 bg-gradient-to-br from-ddd-600 to-ddd-800 rounded-md flex items-center justify-center">
                    <span className="text-white font-bold text-xs">DDD</span>
                  </div>
                ) : (
                  <img 
                    src="/logo.svg" 
                    alt="Clean DDD Logo" 
                    className="h-8 w-auto"
                    onError={() => setLogoError(true)}
                  />
                )}
                <span className="text-xl font-bold text-gray-900">Clean DDD</span>
              </Link>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-ddd-600 transition-all-200">
                {t('header.home')}
              </Link>
              <Link to="/knowledge" className="text-gray-700 hover:text-ddd-600 transition-all-200">
                {t('header.knowledge')}
              </Link>
              <Link to="/frameworks" className="text-gray-700 hover:text-ddd-600 transition-all-200">
                {t('header.frameworks')}
              </Link>
              {/* <Link to="/events" className="text-gray-700 hover:text-ddd-600 transition-all-200">
                {t('header.events')}
              </Link> */}
              <LanguageSwitcher />
              <Button variant="outline" className="ml-4" onClick={toggleQrModal}>
                {t('header.joinCommunity')}
              </Button>
            </nav>
            
            <div className="md:hidden flex items-center space-x-2">
              <LanguageSwitcher />
              <Button variant="ghost" size="sm" onClick={toggleMenu}>
                {isMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
          
          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-4">
              <Link 
                to="/" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.home')}
              </Link>
              <Link 
                to="/knowledge" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.knowledge')}
              </Link>
              <Link 
                to="/frameworks" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.frameworks')}
              </Link>
              <Link 
                to="/events" 
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('header.events')}
              </Link>
              <div className="px-4 py-2">
                <Button className="w-full" onClick={toggleQrModal}>
                  {t('header.joinCommunity')}
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {isQrModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-bold mb-4">{t('header.qrCodeTitle')}</h2>
            <img src="/gzh_qrcode.jpg" alt="QR Code" className="w-48 h-48 mx-auto" />
            <button
              className="mt-4 px-4 py-2 bg-ddd-600 text-white rounded-md"
              onClick={toggleQrModal}
            >
              {t('header.close')}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
