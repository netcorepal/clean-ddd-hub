
import { ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();

  const highlights = [
    t("home.hero.highlights.0"),
    t("home.hero.highlights.1"),
    t("home.hero.highlights.2"),
    t("home.hero.highlights.3"),
  ];

  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_55%)]"></div>
      <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-0 left-[-10%] h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden="true"></div>

      <div className="relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/80">
                <Layers className="h-4 w-4 text-cyan-300" />
                <span>{t("home.hero.subtitle")}</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-tight">
                {t("home.hero.title")}
                <span className="block text-amber-300">{t("home.hero.titleHighlight")}</span>
              </h1>
              <p className="text-lg text-white/80 max-w-2xl">
                {t("home.hero.summary")}
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-amber-400 text-slate-900 hover:bg-amber-300">
                  <a href="/docs/">
                    {t("home.hero.primaryButton")}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white/40 text-white hover:bg-white/10">
                  <a href="#modeling">{t("home.hero.secondaryButton")}</a>
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8 backdrop-blur">
              <div className="flex items-center justify-between">
                <h2 className="font-display text-xl sm:text-2xl text-white">
                  {t("home.hero.cardTitle")}
                </h2>
                <span className="text-sm text-white/60">01</span>
              </div>
              <div className="mt-6 space-y-4">
                {highlights.map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white">
                      0{index + 1}
                    </span>
                    <p className="text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
