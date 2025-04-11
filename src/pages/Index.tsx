
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import KnowledgeBaseSection from "@/components/KnowledgeBaseSection";
import EventsSection from "@/components/EventsSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <IntroSection />
        {/* <KnowledgeBaseSection limit={4} />
        <EventsSection limit={3} /> */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
