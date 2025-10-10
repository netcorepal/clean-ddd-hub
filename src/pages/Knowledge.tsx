import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const Knowledge = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    // Redirect to MkDocs knowledge base
    // When deployed, this will be available at /clean-ddd-hub/ (GitHub Pages)
    const docsUrl = import.meta.env.PROD 
      ? "https://netcorepal.github.io/clean-ddd-hub/"
      : "/docs";
    
    // Small delay to show loading message
    const timer = setTimeout(() => {
      window.location.href = docsUrl;
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('knowledge.hero.title')}</h1>
          <p className="text-xl text-gray-600">
            {t('knowledge.loading', { defaultValue: '正在跳转到知识库...' })}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            如果没有自动跳转，请点击{" "}
            <a 
              href="https://netcorepal.github.io/clean-ddd-hub/" 
              className="text-ddd-600 hover:text-ddd-800 underline"
            >
              这里
            </a>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Knowledge;
