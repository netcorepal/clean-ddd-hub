
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileCode, Github } from "lucide-react";

interface Framework {
  name: string;
  description: string;
  language: string;
  repoUrl: string;
  introduction: string;
}

const Frameworks = () => {
  const { t } = useTranslation();
  const [frameworks, setFrameworks] = useState<Framework[]>([
    {
      name: "NetCorePal Cloud Framework",
      description: ".NET based Clean DDD framework",
      language: "dotnet",
      repoUrl: "https://github.com/netcorepal/netcorepal-cloud-framework",
      introduction: "Loading..."
    },
    {
      name: "CAP4J",
      description: "Java based Clean DDD framework",
      language: "java",
      repoUrl: "https://github.com/netcorepal/cap4j",
      introduction: "Loading..."
    }
  ]);

  useEffect(() => {
    // Fetch framework introductions
    const fetchFrameworkInfo = async () => {
      try {
        const updatedFrameworks = [...frameworks];
        
        // Fetch .NET framework info
        try {
          const dotnetResponse = await fetch("https://api.github.com/repos/netcorepal/netcorepal-cloud-framework");
          const dotnetData = await dotnetResponse.json();
          if (dotnetData.description) {
            updatedFrameworks[0].introduction = dotnetData.description;
          }
        } catch (error) {
          console.error("Error fetching .NET framework info:", error);
          updatedFrameworks[0].introduction = "A cloud-native development framework based on .NET Core that supports Clean DDD principles.";
        }
        
        // Fetch Java framework info
        try {
          const javaResponse = await fetch("https://api.github.com/repos/netcorepal/cap4j");
          const javaData = await javaResponse.json();
          if (javaData.description) {
            updatedFrameworks[1].introduction = javaData.description;
          }
        } catch (error) {
          console.error("Error fetching Java framework info:", error);
          updatedFrameworks[1].introduction = "A Java implementation of the CAP protocol that supports Clean DDD principles and practices.";
        }
        
        setFrameworks(updatedFrameworks);
      } catch (error) {
        console.error("Error fetching framework information:", error);
      }
    };
    
    fetchFrameworkInfo();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t('frameworks.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t('frameworks.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {frameworks.map((framework, index) => (
              <Card key={index} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="bg-gradient-to-r from-ddd-50 to-ddd-100 border-b">
                  <CardTitle className="flex items-center gap-2">
                    {framework.language === "dotnet" ? (
                      <>
                        <FileCode className="h-5 w-5 text-blue-600" />
                        {t('frameworks.dotnetTitle')}
                      </>
                    ) : (
                      <>
                        <FileCode className="h-5 w-5 text-orange-600" />
                        {t('frameworks.javaTitle')}
                      </>
                    )}
                  </CardTitle>
                  <CardDescription className="font-medium text-gray-700">
                    {framework.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-700 min-h-[100px]">
                    {framework.introduction}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <Github className="h-4 w-4 mr-1" />
                    {t('frameworks.githubRepo')}
                  </div>
                  <Button variant="outline" size="sm" className="gap-1" asChild>
                    <a href={framework.repoUrl} target="_blank" rel="noopener noreferrer">
                      {t('frameworks.visitRepo')}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Frameworks;
