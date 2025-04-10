
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KnowledgeBaseSection from "@/components/KnowledgeBaseSection";
import { BookOpen, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Knowledge = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-12 w-12 text-ddd-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Knowledge Base</h1>
            <p className="text-xl text-gray-600 mb-8">
              Comprehensive resources on Domain-Driven Design principles, patterns, and practices.
            </p>
            <div className="relative max-w-lg mx-auto">
              <div className="flex">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Search resources..." 
                    className="pl-10 pr-4 py-2 w-full rounded-l-md"
                  />
                </div>
                <Button className="rounded-l-none">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main>
        <KnowledgeBaseSection />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Popular Topics</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Domain Modeling</h3>
                  <p className="text-gray-600 mb-4">
                    Techniques for creating effective domain models that capture business complexity.
                  </p>
                  <ul className="space-y-2 text-ddd-600">
                    <li className="hover:underline cursor-pointer">• Entities vs Value Objects</li>
                    <li className="hover:underline cursor-pointer">• Aggregates and Boundaries</li>
                    <li className="hover:underline cursor-pointer">• Domain Events</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h3 className="text-xl font-semibold mb-3">Clean Architecture</h3>
                  <p className="text-gray-600 mb-4">
                    Building maintainable systems with clear separation of concerns.
                  </p>
                  <ul className="space-y-2 text-ddd-600">
                    <li className="hover:underline cursor-pointer">• Architectural Boundaries</li>
                    <li className="hover:underline cursor-pointer">• Use Cases and Application Services</li>
                    <li className="hover:underline cursor-pointer">• Dependency Rule</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Knowledge;
