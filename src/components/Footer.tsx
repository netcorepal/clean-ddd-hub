
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Footer = () => {
  const { t } = useTranslation();
  const [logoError, setLogoError] = useState(false);
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-6">
              {logoError ? (
                <div className="w-8 h-8 bg-gradient-to-br from-ddd-500 to-ddd-700 rounded-md flex items-center justify-center">
                  <span className="text-white font-bold text-xs">DDD</span>
                </div>
              ) : (
                <img 
                  src="/lovable-uploads/logo.png" 
                  alt="Clean DDD Logo" 
                  className="h-8 w-auto"
                  onError={() => setLogoError(true)}
                />
              )}
              <span className="text-lg font-bold text-white">Clean DDD</span>
            </Link>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{t('footer.about')}</h3>
              <p className="text-gray-400">{t('footer.mission')}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/knowledge" className="text-gray-400 hover:text-ddd-400 transition-colors">
                  {t('header.knowledge')}
                </Link>
              </li>
              <li>
                <Link to="/events" className="text-gray-400 hover:text-ddd-400 transition-colors">
                  {t('header.events')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-3">
              <li className="text-gray-400">
                <a href="mailto:contact@cleanddd.com" className="hover:text-ddd-400 transition-colors">
                  contact@cleanddd.com
                </a>
              </li>
              <li className="text-gray-400">
                <a href="tel:+1-123-456-7890" className="hover:text-ddd-400 transition-colors">
                  +1-123-456-7890
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Social</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-ddd-400 transition-colors">
                Twitter
              </a>
              <a href="#" className="text-gray-400 hover:text-ddd-400 transition-colors">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-ddd-400 transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
