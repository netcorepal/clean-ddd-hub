
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, MapPin, Users, ArrowLeft, Clock, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";

// Mock data for events
const events = [
  {
    id: "ddd-europe-2025",
    title: "DDD Europe Conference",
    date: "June 15-17, 2025",
    time: "9:00 AM - 6:00 PM CEST",
    location: "Amsterdam, Netherlands",
    description: "The premier conference for Domain-Driven Design practitioners and enthusiasts in Europe. Join us for three days of workshops, talks, and networking with the leading experts in DDD.",
    longDescription: "DDD Europe is the leading Domain-Driven Design conference bringing together practitioners from around the world. The 2025 edition will feature workshops on strategic design, tactical patterns, and the integration of DDD with modern architectural styles.\n\nDay 1 will focus on introductory workshops for those new to DDD. Days 2 and 3 will include keynotes, breakout sessions, and deep-dive workshops on advanced topics. Networking events will be held each evening, providing opportunities to connect with peers and experts in the field.",
    speakers: ["Eric Evans", "Vaughn Vernon", "Alberto Brandolini", "Julie Lerman"],
    venue: "RAI Amsterdam Convention Center",
    venueAddress: "Europaplein 24, 1078 GZ Amsterdam, Netherlands",
    attendees: 800,
    link: "https://dddeurope.com",
    registration: {
      open: true,
      deadline: "May 30, 2025",
      price: "€899 - €1299",
      options: [
        { type: "Early Bird", price: "€899", available: false },
        { type: "Regular", price: "€1099", available: true },
        { type: "Late Registration", price: "€1299", available: true }
      ]
    },
    schedule: [
      { day: "Day 1", date: "June 15", events: [
        { time: "09:00 - 10:00", title: "Registration & Coffee" },
        { time: "10:00 - 12:00", title: "Opening Keynote: The Future of DDD", speaker: "Eric Evans" },
        { time: "12:00 - 13:00", title: "Lunch" },
        { time: "13:00 - 15:00", title: "Workshop: Strategic Design in Practice", speaker: "Vaughn Vernon" },
        { time: "15:00 - 15:30", title: "Coffee Break" },
        { time: "15:30 - 17:30", title: "Panel Discussion: DDD in Different Domains" },
        { time: "18:00 - 20:00", title: "Welcome Reception" }
      ]},
      { day: "Day 2", date: "June 16", events: [
        { time: "09:00 - 09:30", title: "Coffee & Networking" },
        { time: "09:30 - 11:30", title: "Workshop: Event Storming Masterclass", speaker: "Alberto Brandolini" },
        { time: "11:30 - 12:30", title: "Talk: DDD and Microservices" },
        { time: "12:30 - 13:30", title: "Lunch" },
        { time: "13:30 - 15:30", title: "Parallel Sessions (Multiple Tracks)" },
        { time: "15:30 - 16:00", title: "Coffee Break" },
        { time: "16:00 - 18:00", title: "Hands-on Labs" },
        { time: "19:00 - 22:00", title: "Conference Dinner" }
      ]},
      { day: "Day 3", date: "June 17", events: [
        { time: "09:00 - 09:30", title: "Coffee & Networking" },
        { time: "09:30 - 11:30", title: "Workshop: DDD and Legacy Systems", speaker: "Julie Lerman" },
        { time: "11:30 - 12:30", title: "Case Studies: DDD Success Stories" },
        { time: "12:30 - 13:30", title: "Lunch" },
        { time: "13:30 - 15:30", title: "Open Space Sessions" },
        { time: "15:30 - 16:00", title: "Coffee Break" },
        { time: "16:00 - 17:30", title: "Closing Keynote and Q&A" },
        { time: "17:30 - 18:00", title: "Conference Closing" }
      ]}
    ],
    pastEvents: [
      { year: "2024", location: "Amsterdam", attendees: 750, resources: "#" },
      { year: "2023", location: "Amsterdam", attendees: 680, resources: "#" },
      { year: "2022", location: "Online", attendees: 1200, resources: "#" }
    ]
  },
  {
    id: "clean-architecture-workshop",
    title: "Clean Architecture Workshop",
    date: "July 23, 2025",
    time: "10:00 AM - 5:00 PM EST",
    location: "Online (Zoom)",
    description: "Hands-on workshop exploring the integration of Clean Architecture with Domain-Driven Design principles.",
    longDescription: "This intensive one-day workshop will teach you how to implement Clean Architecture principles in your DDD-based applications. We'll cover the theoretical foundations and then dive into hands-on exercises where you'll build a sample application using Clean Architecture and DDD patterns.\n\nTopics covered will include architectural boundaries, dependency inversion, use cases, adapters, and how to organize your domain model within a Clean Architecture structure. You'll learn how to keep your domain logic pure and free from infrastructure concerns while still building a practical, maintainable application.",
    speakers: ["Robert C. Martin", "Jane Doe"],
    venue: "Zoom Webinar",
    venueAddress: "Online",
    attendees: 150,
    link: "#",
    registration: {
      open: true,
      deadline: "July 20, 2025",
      price: "$299",
      options: [
        { type: "Early Bird", price: "$249", available: false },
        { type: "Regular", price: "$299", available: true },
        { type: "Team (5+ attendees)", price: "$249 per person", available: true }
      ]
    },
    schedule: [
      { day: "Workshop Day", date: "July 23", events: [
        { time: "10:00 - 10:30", title: "Introduction and Overview" },
        { time: "10:30 - 12:00", title: "Clean Architecture Principles", speaker: "Robert C. Martin" },
        { time: "12:00 - 12:45", title: "Break" },
        { time: "12:45 - 14:15", title: "DDD and Clean Architecture Integration", speaker: "Jane Doe" },
        { time: "14:15 - 14:30", title: "Short Break" },
        { time: "14:30 - 16:30", title: "Hands-on Exercise: Building a Clean DDD Application" },
        { time: "16:30 - 17:00", title: "Q&A and Closing" }
      ]}
    ],
    pastEvents: [
      { year: "January 2025", location: "Online", attendees: 130, resources: "#" },
      { year: "October 2024", location: "Online", attendees: 125, resources: "#" }
    ]
  },
  {
    id: "domain-modeling-meetup",
    title: "Domain Modeling Meetup",
    date: "August 5, 2025",
    time: "6:30 PM - 9:00 PM CET",
    location: "Berlin, Germany",
    description: "Monthly meetup for discussing domain modeling challenges and solutions in complex business domains.",
    longDescription: "Our monthly Domain Modeling Meetup brings together practitioners to discuss real-world modeling challenges and solutions. This session will focus on domain modeling in financial services, with presentations from industry experts followed by an open discussion and networking.\n\nThis is a community-driven event where participants are encouraged to share their experiences, challenges, and solutions. Whether you're new to domain modeling or an experienced practitioner, you'll find value in the discussions and connections formed during the meetup.",
    speakers: ["Alice Wagner", "Thomas Schmidt"],
    venue: "TechHub Berlin",
    venueAddress: "Markgrafenstraße 5, 10969 Berlin, Germany",
    attendees: 50,
    link: "#",
    registration: {
      open: true,
      deadline: "August 4, 2025",
      price: "Free",
      options: [
        { type: "Standard", price: "Free", available: true }
      ]
    },
    schedule: [
      { day: "Meetup", date: "August 5", events: [
        { time: "18:30 - 19:00", title: "Arrival and Networking" },
        { time: "19:00 - 19:15", title: "Welcome and Introduction" },
        { time: "19:15 - 20:00", title: "Talk: Domain Modeling in Financial Services", speaker: "Alice Wagner" },
        { time: "20:00 - 20:15", title: "Break" },
        { time: "20:15 - 20:45", title: "Lightning Talk: Modeling Money Transfers", speaker: "Thomas Schmidt" },
        { time: "20:45 - 21:30", title: "Open Discussion and Networking" }
      ]}
    ],
    pastEvents: [
      { year: "July 2025", location: "Berlin", attendees: 45, topic: "Healthcare Domains", resources: "#" },
      { year: "June 2025", location: "Berlin", attendees: 50, topic: "E-commerce Modeling", resources: "#" },
      { year: "May 2025", location: "Berlin", attendees: 40, topic: "Event Sourcing", resources: "#" },
      { year: "April 2025", location: "Berlin", attendees: 48, topic: "Bounded Contexts", resources: "#" }
    ]
  }
];

const EventDetail = () => {
  const { id } = useParams();
  const [registrationType, setRegistrationType] = useState("");
  const { toast } = useToast();
  
  // Find the event with the matching ID
  const event = events.find(event => event.id === id);
  
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
            <p className="text-gray-600 mb-8">The event you're looking for could not be found.</p>
            <Button asChild>
              <Link to="/events">Back to Events</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleRegistration = () => {
    if (!registrationType) {
      toast({
        title: "Please select a registration type",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Registration successful!",
      description: `You have registered for ${event.title} (${registrationType})`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Event Header */}
        <div className="bg-gradient-to-b from-blue-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link to="/events" className="flex items-center text-ddd-600">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Events
                </Link>
              </Button>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-ddd-600" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-ddd-600" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-ddd-600" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-ddd-600" />
                  <span>{event.attendees} expected attendees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Event Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="prose max-w-none mb-12">
                <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                <p className="text-gray-700 whitespace-pre-line">{event.longDescription}</p>
              </div>
              
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Event Schedule</h2>
                {event.schedule.map((day, index) => (
                  <div key={index} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">{day.day} - {day.date}</h3>
                    <div className="space-y-4">
                      {day.events.map((session, sessionIndex) => (
                        <div key={sessionIndex} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex flex-col md:flex-row md:justify-between">
                            <div className="mb-2 md:mb-0">
                              <span className="font-medium">{session.time}</span>
                            </div>
                            <div className="flex-grow md:ml-6">
                              <h4 className="font-medium">{session.title}</h4>
                              {session.speaker && <p className="text-ddd-600 text-sm">Speaker: {session.speaker}</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              
              {event.pastEvents && event.pastEvents.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Past Events</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year/Date</th>
                          <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendees</th>
                          <th className="px-6 py-3 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resources</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {event.pastEvents.map((pastEvent, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{pastEvent.year}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{pastEvent.location}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">{pastEvent.attendees}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <Button variant="ghost" size="sm" className="text-ddd-600 p-0 hover:text-ddd-800 hover:bg-transparent" asChild>
                                <a href={pastEvent.resources}>View Resources</a>
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">Speakers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {event.speakers.map((speaker, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <h3 className="text-xl font-semibold mb-2">{speaker}</h3>
                      <p className="text-gray-600">Speaker information will be provided soon.</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-8 sticky top-4">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Registration</h3>
                  
                  {event.registration.open ? (
                    <>
                      <p className="text-gray-600 mb-4">
                        Registration is open until {event.registration.deadline}
                      </p>
                      
                      <div className="space-y-4 mb-6">
                        {event.registration.options.map((option, index) => (
                          <div key={index} className={`p-4 border rounded-lg ${!option.available ? 'bg-gray-100 opacity-75' : 'bg-white'}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-medium">{option.type}</h4>
                                <p className="text-ddd-600">{option.price}</p>
                              </div>
                              {option.available ? (
                                <input
                                  type="radio"
                                  name="registrationType"
                                  value={option.type}
                                  onChange={() => setRegistrationType(option.type)}
                                  className="h-4 w-4 text-ddd-600 focus:ring-ddd-500 border-gray-300 rounded"
                                />
                              ) : (
                                <span className="text-sm text-gray-500 italic">Sold Out</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <Button className="w-full" onClick={handleRegistration}>
                        Register Now
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-gray-600 mb-4">Registration is currently closed</p>
                      <Button variant="outline" disabled>Registration Closed</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mb-8">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Venue Information</h3>
                  <div className="mb-4">
                    <h4 className="font-medium">{event.venue}</h4>
                    <p className="text-gray-600">{event.venueAddress}</p>
                  </div>
                  {event.location !== "Online (Zoom)" && (
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-gray-500">Map will be available soon</span>
                    </div>
                  )}
                  {event.location === "Online (Zoom)" && (
                    <p className="text-gray-600 mb-4">
                      Connection details will be sent after registration.
                    </p>
                  )}
                  {event.link && event.link !== "#" && (
                    <Button variant="outline" className="w-full" asChild>
                      <a href={event.link} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        Visit Event Website
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        {/* Related Events */}
        <div className="bg-gray-50 py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Other Events You Might Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events
                .filter(e => e.id !== id)
                .slice(0, 2)
                .map((relatedEvent, index) => (
                  <Card key={index} className="bg-white h-full transition-all duration-200 hover:shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span>{relatedEvent.date}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{relatedEvent.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
                        <MapPin className="h-4 w-4" />
                        <span>{relatedEvent.location}</span>
                      </div>
                      <p className="text-gray-600 mb-6 line-clamp-3">{relatedEvent.description}</p>
                      <Button asChild>
                        <Link to={`/events/${relatedEvent.id}`}>View Details</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
        
        {/* Event Navigation */}
        <div className="container mx-auto px-4 py-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="/events" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="/events">Events</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default EventDetail;
