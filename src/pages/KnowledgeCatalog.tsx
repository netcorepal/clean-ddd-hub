
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Search, FileText, Book, Users } from "lucide-react";
import { Link } from "react-router-dom";

const KnowledgeCatalog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const categories = [
    { id: "all", name: "All Articles" },
    { id: "guides", name: "Guides" },
    { id: "patterns", name: "Patterns" },
    { id: "architecture", name: "Architecture" },
    { id: "practices", name: "Practices" }
  ];
  
  const resources = [
    {
      id: "strategic-ddd",
      title: "Strategic Domain-Driven Design",
      description: "Learn how to identify bounded contexts, create context maps, and implement domain models that represent business reality.",
      icon: <Book className="h-5 w-5 text-ddd-600" />,
      tag: "Guide",
      category: "guides",
      readTime: "12 min read"
    },
    {
      id: "tactical-patterns",
      title: "Tactical Patterns in DDD",
      description: "Explore entities, value objects, aggregates, and domain events for implementing robust domain models.",
      icon: <BookOpen className="h-5 w-5 text-ddd-600" />,
      tag: "Patterns",
      category: "patterns",
      readTime: "15 min read"
    },
    {
      id: "clean-architecture",
      title: "Clean Architecture Integration",
      description: "Combine DDD with Clean Architecture to create maintainable and testable systems with clear separation of concerns.",
      icon: <FileText className="h-5 w-5 text-ddd-600" />,
      tag: "Architecture",
      category: "architecture",
      readTime: "18 min read"
    },
    {
      id: "event-storming",
      title: "Event Storming Workshops",
      description: "Collaborative modeling technique for mapping business processes and identifying domain events.",
      icon: <Users className="h-5 w-5 text-ddd-600" />,
      tag: "Practice",
      category: "practices",
      readTime: "10 min read"
    },
    {
      id: "bounded-contexts",
      title: "Bounded Contexts in Practice",
      description: "Real-world examples of identifying and implementing bounded contexts in different domains.",
      icon: <FileText className="h-5 w-5 text-ddd-600" />,
      tag: "Guide",
      category: "guides",
      readTime: "14 min read"
    },
    {
      id: "domain-events",
      title: "Working with Domain Events",
      description: "How to define, implement, and use domain events effectively in your applications.",
      icon: <BookOpen className="h-5 w-5 text-ddd-600" />,
      tag: "Patterns",
      category: "patterns",
      readTime: "11 min read"
    },
    {
      id: "microservices-ddd",
      title: "DDD and Microservices",
      description: "Strategies for applying Domain-Driven Design principles in a microservices architecture.",
      icon: <FileText className="h-5 w-5 text-ddd-600" />,
      tag: "Architecture",
      category: "architecture",
      readTime: "16 min read"
    },
    {
      id: "example-driven-design",
      title: "Example-Driven Design",
      description: "Using concrete examples to drive the design process and create more robust domain models.",
      icon: <Users className="h-5 w-5 text-ddd-600" />,
      tag: "Practice",
      category: "practices",
      readTime: "9 min read"
    }
  ];
  
  const filterResources = (resources, category, query) => {
    return resources.filter(resource => {
      const categoryMatch = category === "all" || resource.category === category;
      const queryMatch = query === "" || 
        resource.title.toLowerCase().includes(query.toLowerCase()) || 
        resource.description.toLowerCase().includes(query.toLowerCase());
      return categoryMatch && queryMatch;
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <BookOpen className="h-12 w-12 text-ddd-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">Knowledge Catalog</h1>
            <p className="text-xl text-gray-600 mb-8">
              Browse our comprehensive collection of articles, guides, and resources on Domain-Driven Design.
            </p>
            <div className="relative max-w-lg mx-auto">
              <div className="flex">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <Input 
                    placeholder="Search resources..." 
                    className="pl-10 pr-4 py-2 w-full rounded-l-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="rounded-l-none">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Tabs defaultValue="all" className="w-full">
            <div className="mb-8">
              <TabsList className="w-full max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-5 h-auto gap-2">
                {categories.map((category) => (
                  <TabsTrigger 
                    key={category.id} 
                    value={category.id}
                    className="py-2"
                  >
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="pt-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filterResources(resources, category.id, searchQuery).map((resource, index) => (
                    <Card key={index} className="bg-white h-full transition-all duration-200 hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          {resource.icon}
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-ddd-700">
                            {resource.tag}
                          </span>
                        </div>
                        <CardTitle className="text-xl mt-4">{resource.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-2">{resource.description}</p>
                        <p className="text-sm text-gray-500">{resource.readTime}</p>
                      </CardContent>
                      <CardFooter>
                        <Button variant="ghost" className="text-ddd-600 p-0 hover:text-ddd-800 hover:bg-transparent" asChild>
                          <Link to={`/knowledge/${resource.id}`}>
                            Read article
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {filterResources(resources, category.id, searchQuery).length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-600 mb-4">No articles found for your search criteria.</p>
                    <Button onClick={() => setSearchQuery("")}>Clear Search</Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KnowledgeCatalog;
