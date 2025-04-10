
import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const IntroSection = () => {
  const benefits = [
    "Strategic focus on domain complexity",
    "Clear boundaries between system components",
    "Improved collaboration between tech and domain experts",
    "More maintainable and adaptable codebases",
    "Better alignment with business goals and needs"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">What is Clean DDD?</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            Clean Domain-Driven Design (DDD) combines the strategic design principles of DDD with clean 
            architecture patterns to create software systems that are both aligned with business needs 
            and technically sound.
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mt-4">
            Our community is dedicated to exploring and evolving these practices, providing resources 
            and knowledge sharing for practitioners at all levels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Benefits of Clean DDD</h3>
            <ul className="space-y-3">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-ddd-600 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Card className="overflow-hidden border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h4 className="text-xl font-medium mb-3">Core Concepts</h4>
                <div className="code-block">
                  <pre>
{`// Strategic design patterns
domain.core.entities
domain.core.valueObjects
domain.core.aggregates

// Tactical patterns
application.services
application.useCases
infrastructure.repositories
infrastructure.adapters

// Clean architecture layers
presentation.controllers
presentation.viewModels`}
                  </pre>
                </div>
                <p className="text-gray-600 mt-4">
                  The Clean DDD approach organizes code around business domains while maintaining 
                  separation of concerns through architectural boundaries.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
