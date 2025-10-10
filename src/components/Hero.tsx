
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
  
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-blue-50 to-white opacity-70"></div>
      <div 
        className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-70 blur-3xl"
        aria-hidden="true"
      ></div>
      <div 
        className="absolute top-40 left-10 w-72 h-72 bg-ddd-200 rounded-full opacity-60 blur-3xl"
        aria-hidden="true"
      ></div>
      
      <div className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              {t('home.hero.title')} <span className="gradient-text">{t('home.hero.titleHighlight')}</span>
            </h1>
            <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
            <div className="mt-10 flex justify-center space-x-4">
              <Button asChild size="lg">
                <a href="https://docs.cleanddd.com/" target="_blank" rel="noopener noreferrer">
                  {t('home.hero.exploreButton')} <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/events">
                  {t('home.hero.eventsButton')}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
