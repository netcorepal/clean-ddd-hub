import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";

const Knowledge = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('knowledge.hero.title')}</h1>
          <p className="text-xl text-gray-600">
            {t('knowledge.comingSoon', { defaultValue: '即将到来！' })}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Knowledge;
