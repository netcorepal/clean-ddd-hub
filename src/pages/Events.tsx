
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EventsSection from "@/components/EventsSection";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

const Events = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Calendar className="h-12 w-12 text-ddd-600" />
            </div>
            <h1 className="text-4xl font-bold mb-4">DDD Community Events</h1>
            <p className="text-xl text-gray-600 mb-8">
              Join us at conferences, workshops, and meetups to learn and connect with the DDD community.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button>All Events</Button>
              <Button variant="outline">Conferences</Button>
              <Button variant="outline">Workshops</Button>
              <Button variant="outline">Meetups</Button>
              <Button variant="outline">Online</Button>
            </div>
          </div>
        </div>
      </div>
      
      <main>
        <EventsSection />
        
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Host or Speak at an Event</h2>
              <p className="text-lg text-gray-600 mb-8">
                We're always looking for speakers and hosts for our community events. Share your knowledge 
                and experience with the DDD community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Submit a Talk</h3>
                    <p className="text-gray-600 mb-4">
                      Have insights or experiences to share? Submit a talk proposal for one of our upcoming events.
                    </p>
                    <Button>Submit Proposal</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-3">Host a Meetup</h3>
                    <p className="text-gray-600 mb-4">
                      Interested in hosting a DDD meetup in your city? We can help you get started.
                    </p>
                    <Button>Become a Host</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Past Events</h2>
              <p className="text-lg text-gray-600 mb-8">
                Explore recordings and materials from our past events.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">DDD Conference 2024</h3>
                      <p className="text-gray-600 mt-1">March 10-12, 2024 • New York, NY</p>
                    </div>
                    <Button variant="outline" size="sm">View Resources</Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">Clean Architecture Workshop</h3>
                      <p className="text-gray-600 mt-1">February 15, 2024 • Online</p>
                    </div>
                    <Button variant="outline" size="sm">View Recording</Button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-left">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">DDD & Microservices Symposium</h3>
                      <p className="text-gray-600 mt-1">January 20, 2024 • London, UK</p>
                    </div>
                    <Button variant="outline" size="sm">View Resources</Button>
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
