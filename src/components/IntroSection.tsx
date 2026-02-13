import { CheckCircle, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

type ConceptItem = {
  title: string;
  description: string;
};

type StepItem = {
  title: string;
  points: string[];
};

type StandardItem = {
  title: string;
  points: string[];
};

type QaItem = {
  question: string;
  answer: string;
};

const IntroSection = () => {
  const { t } = useTranslation();

  const concepts = t("home.sections.concepts.items", { returnObjects: true }) as ConceptItem[];
  const steps = t("home.sections.modeling.steps", { returnObjects: true }) as StepItem[];
  const standards = t("home.sections.standards.items", { returnObjects: true }) as StandardItem[];
  const qaItems = t("home.sections.qa.items", { returnObjects: true }) as QaItem[];

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-16">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] items-start">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="font-display text-3xl sm:text-4xl text-slate-900">
                  {t("home.sections.definition.title")}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {t("home.sections.definition.description")}
                </p>
              </div>
              <Card className="border-slate-200 shadow-none">
                <CardContent className="p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
                    {t("home.sections.goal.title")}
                  </p>
                  <p className="mt-3 text-slate-700 leading-relaxed">
                    {t("home.sections.goal.description")}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-slate-700">
                <Sparkles className="h-5 w-5 text-amber-500" />
                <p className="text-sm uppercase tracking-[0.2em]">
                  {t("home.sections.value.title")}
                </p>
              </div>
              <p className="mt-4 font-display text-2xl text-slate-900">
                {t("home.sections.value.highlight")}
              </p>
              <p className="mt-4 text-slate-600 leading-relaxed">
                {t("home.sections.value.description")}
              </p>
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-slate-900 mb-8">
              {t("home.sections.concepts.title")}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {concepts.map((concept) => (
                <Card key={concept.title} className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <h4 className="text-xl font-semibold text-slate-900 mb-2">{concept.title}</h4>
                    <p className="text-slate-600 leading-relaxed">{concept.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div id="modeling" className="scroll-mt-24">
            <h3 className="font-display text-2xl sm:text-3xl text-slate-900 mb-8">
              {t("home.sections.modeling.title")}
            </h3>
            <ol className="relative border-l border-slate-200">
              {steps.map((step, index) => (
                <li key={step.title} className="mb-10 ml-6">
                  <span className="absolute -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                    {index + 1}
                  </span>
                  <h4 className="text-lg font-semibold text-slate-900">{step.title}</h4>
                  <ul className="mt-3 space-y-2">
                    {step.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-slate-600">
                        <CheckCircle className="mt-1 h-4 w-4 text-emerald-500" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-slate-900 mb-8">
              {t("home.sections.standards.title")}
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {standards.map((rule) => (
                <Card key={rule.title} className="border-slate-200 shadow-sm">
                  <CardContent className="p-6">
                    <h4 className="text-lg font-semibold text-slate-900 mb-3">{rule.title}</h4>
                    <ul className="space-y-2">
                      {rule.points.map((point) => (
                        <li key={point} className="flex items-start gap-2 text-slate-600">
                          <CheckCircle className="mt-1 h-4 w-4 text-slate-900" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-2xl sm:text-3xl text-slate-900 mb-6">
              {t("home.sections.qa.title")}
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {qaItems.map((item, index) => (
                <AccordionItem key={item.question} value={`qa-${index}`}>
                  <AccordionTrigger className="text-left text-slate-900">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-slate-600 leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
