
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsSection from "@/components/EventsSection";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

const Events = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Calendar className="h-12 w-12 text-ddd-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">{t('events.hero.title')}</h1>
            <p className="text-xl text-gray-600 mb-8">
              {t('events.hero.subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button>{t('events.filters.all')}</Button>
              <Button variant="outline">{t('events.filters.conferences')}</Button>
              <Button variant="outline">{t('events.filters.workshops')}</Button>
              <Button variant="outline">{t('events.filters.meetups')}</Button>
              <Button variant="outline">{t('events.filters.online')}</Button>
            </div>
          </div>
        </div>
      </div>
      
      <main>
        <EventsSection />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">{t('events.hostSection.title')}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('events.hostSection.description')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{t('events.hostSection.submitTalk.title')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('events.hostSection.submitTalk.description')}
                    </p>
                    <Button>{t('events.hostSection.submitTalk.button')}</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">{t('events.hostSection.hostMeetup.title')}</h3>
                    <p className="text-gray-600 mb-4">
                      {t('events.hostSection.hostMeetup.description')}
                    </p>
                    <Button>{t('events.hostSection.hostMeetup.button')}</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{t('events.pastEvents.title')}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {t('events.pastEvents.description')}
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">DDD Conference 2024</h3>
                      <p className="text-gray-600 mt-1">March 10-12, 2024 • New York, NY</p>
                    </div>
                    <Button variant="outline" size="sm">{t('events.pastEvents.viewResources')}</Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">Clean Architecture Workshop</h3>
                      <p className="text-gray-600 mt-1">February 15, 2024 • Online</p>
                    </div>
                    <Button variant="outline" size="sm">{t('events.pastEvents.viewRecording')}</Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">DDD & Microservices Symposium</h3>
                      <p className="text-gray-600 mt-1">January 20, 2024 • London, UK</p>
                    </div>
                    <Button variant="outline" size="sm">{t('events.pastEvents.viewResources')}</Button>
                  </div>
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

export default Events;
