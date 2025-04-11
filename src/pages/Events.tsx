import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Calendar } from "lucide-react";
import { useTranslation } from "react-i18next";

const Events = () => {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Calendar className="h-12 w-12 text-ddd-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('events.hero.title')}</h1>
            <p className="text-xl text-gray-600">
              {t('events.comingSoon', { defaultValue: i18n.language === 'zh' ? '即将到来！' : 'Coming Soon!' })}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Events;
