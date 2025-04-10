
import { Calendar, ExternalLink, MapPin, Users } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

const EventsSection = ({ limit = 0 }) => {
  const events = [
    {
      title: "DDD Europe Conference",
      date: "June 15-17, 2025",
      location: "Amsterdam, Netherlands",
      description: "The premier conference for Domain-Driven Design practitioners and enthusiasts in Europe.",
      attendees: 800,
      link: "https://dddeurope.com"
    },
    {
      title: "Clean Architecture Workshop",
      date: "July 23, 2025",
      location: "Online (Zoom)",
      description: "Hands-on workshop exploring the integration of Clean Architecture with Domain-Driven Design principles.",
      attendees: 150,
      link: "#"
    },
    {
      title: "Domain Modeling Meetup",
      date: "August 5, 2025",
      location: "Berlin, Germany",
      description: "Monthly meetup for discussing domain modeling challenges and solutions in complex business domains.",
      attendees: 50,
      link: "#"
    }
  ];

  const displayedEvents = limit > 0 ? events.slice(0, limit) : events;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Upcoming Events</h2>
          <p className="text-gray-600 text-lg">
            Join us at these events to learn, share, and connect with the Clean DDD community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedEvents.map((event, index) => (
            <Card key={index} className="bg-white h-full transition-all duration-200 hover:shadow-md">
              <CardHeader>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{event.date}</span>
                </div>
                <CardTitle className="text-xl">{event.title}</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{event.description}</p>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{event.attendees} expected attendees</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" asChild>
                  <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex items-center">
                    Details <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </Button>
                <Button size="sm">Register</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {limit > 0 && (
          <div className="text-center mt-10">
            <Button variant="outline" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
