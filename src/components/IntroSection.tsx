import { CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const IntroSection = () => {
  const { t } = useTranslation();
  
  const benefits = [
    t('home.intro.benefits.0'),
    t('home.intro.benefits.1'),
    t('home.intro.benefits.2'),
    t('home.intro.benefits.3'),
    t('home.intro.benefits.4'),
    t('home.intro.benefits.5')
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">{t('home.intro.title')}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {t('home.intro.paragraph1')}
          </p>
          <p className="text-gray-600 text-lg leading-relaxed mt-4">
            {t('home.intro.paragraph2')}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-semibold mb-4">{t('home.intro.benefitsTitle')}</h3>
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
                <h4 className="text-xl font-medium mb-3">{t('home.intro.coreConceptsTitle')}</h4>
                <div className="code-block">
                  <pre>
{`// Strategic design patterns
CQRS
EventSourcing

// Key Concepts

Aggregate and AggregateRoot
Entity and ValueObject
Command and CommandHanlder
DomainEvent and DomainEventHandler

// Application
Controller
Jobs`}
                  </pre>
                </div>
                <p className="text-gray-600 mt-4">
                  {t('home.intro.coreConceptsDescription')}
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
