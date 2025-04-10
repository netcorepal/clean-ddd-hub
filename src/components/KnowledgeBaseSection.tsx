
import { Book, BookOpen, FileText, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const KnowledgeBaseSection = ({ limit = 0 }) => {
  const resources = [
    {
      title: "Strategic Domain-Driven Design",
      description: "Learn how to identify bounded contexts, create context maps, and implement domain models that represent business reality.",
      icon: <Book className="h-5 w-5 text-ddd-600" />,
      tag: "Guide",
      link: "/knowledge/strategic-ddd"
    },
    {
      title: "Tactical Patterns in DDD",
      description: "Explore entities, value objects, aggregates, and domain events for implementing robust domain models.",
      icon: <BookOpen className="h-5 w-5 text-ddd-600" />,
      tag: "Patterns",
      link: "/knowledge/tactical-patterns"
    },
    {
      title: "Clean Architecture Integration",
      description: "Combine DDD with Clean Architecture to create maintainable and testable systems with clear separation of concerns.",
      icon: <FileText className="h-5 w-5 text-ddd-600" />,
      tag: "Architecture",
      link: "/knowledge/clean-architecture"
    },
    {
      title: "Event Storming Workshops",
      description: "Collaborative modeling technique for mapping business processes and identifying domain events.",
      icon: <Users className="h-5 w-5 text-ddd-600" />,
      tag: "Practice",
      link: "/knowledge/event-storming"
    }
  ];

  const displayedResources = limit > 0 ? resources.slice(0, limit) : resources;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Knowledge Base</h2>
          <p className="text-gray-600 text-lg">
            Explore our collection of resources, guides, and best practices for implementing Domain-Driven Design.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
          {displayedResources.map((resource, index) => (
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
                <p className="text-gray-600">{resource.description}</p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="text-ddd-600 p-0 hover:text-ddd-800 hover:bg-transparent" asChild>
                  <Link to={resource.link}>
                    Read more
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {limit > 0 && (
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link to="/knowledge">View All Resources</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default KnowledgeBaseSection;
