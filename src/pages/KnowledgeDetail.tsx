
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Book, Calendar, FileText, Clock, ArrowRight, BookOpen, Tag } from "lucide-react";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

// Mock data for knowledge base articles
const articles = [
  {
    id: "strategic-ddd",
    title: "Strategic Domain-Driven Design",
    description: "Learn how to identify bounded contexts, create context maps, and implement domain models that represent business reality.",
    icon: <Book className="h-5 w-5 text-ddd-600" />,
    tag: "Guide",
    createdAt: "2025-01-15",
    readTime: "12 min read",
    author: "Eric Evans",
    content: `
      <h2>Introduction to Strategic Domain-Driven Design</h2>
      
      <p>Strategic Domain-Driven Design focuses on the large-scale structure of a system. It provides tools and practices for dealing with large models and teams, defining the relationships between different parts of the system, and ensuring that the design remains coherent as the system evolves.</p>
      
      <h3>Key Concepts in Strategic DDD</h3>
      
      <p>Strategic DDD introduces several important concepts that help software teams manage complexity in large systems:</p>
      
      <h4>Bounded Context</h4>
      
      <p>A Bounded Context is a conceptual boundary within which a particular domain model applies. It encapsulates and defines the specific responsibilities of a particular model. The same term may have different meanings in different bounded contexts.</p>
      
      <p>For example, in an e-commerce system, the concept of a "Product" might mean different things in the Catalog context, the Inventory context, and the Order Processing context. Each bounded context has its own understanding of what a "Product" is.</p>
      
      <h4>Context Map</h4>
      
      <p>A Context Map is a diagram or document that shows the relationships between different bounded contexts in a system. It helps teams understand how the different parts of the system relate to each other and how they should communicate.</p>
      
      <p>Context maps help identify communication paths, dependencies, and potential issues in the overall system design.</p>
      
      <h4>Ubiquitous Language</h4>
      
      <p>Ubiquitous Language is a shared language between domain experts and developers that evolves within a particular bounded context. This language should be used in all communication, both in discussions and in the code itself.</p>
      
      <p>The goal is to eliminate translation between domain experts and technical team members, reducing misunderstandings and improving communication.</p>
      
      <h3>Relationship Patterns between Bounded Contexts</h3>
      
      <p>Strategic DDD defines several patterns for how bounded contexts can relate to each other:</p>
      
      <h4>Partnership</h4>
      
      <p>Two or more teams agree to collaborate closely and align their goals. Success for one team means success for all partners.</p>
      
      <h4>Shared Kernel</h4>
      
      <p>Two or more bounded contexts share a subset of the domain model. Changes to the shared kernel require coordination between the teams responsible for the affected bounded contexts.</p>
      
      <h4>Customer-Supplier</h4>
      
      <p>One bounded context (the supplier) provides services to another (the customer). The supplier is upstream of the customer, and the success of the customer depends on the supplier.</p>
      
      <h4>Conformist</h4>
      
      <p>When there's a customer-supplier relationship where the supplier has no motivation to meet the customer's needs, the customer may choose to simply conform to the supplier's model.</p>
      
      <h4>Anti-Corruption Layer</h4>
      
      <p>A layer that translates between two bounded contexts with different models. It protects the integrity of one model from the other.</p>
      
      <h4>Open Host Service</h4>
      
      <p>A bounded context defines a protocol or interface that gives access to its functionality as a set of services. The protocol is "open" in the sense that it's available for use by any other bounded context.</p>
      
      <h4>Published Language</h4>
      
      <p>A well-documented shared language that multiple bounded contexts can use to communicate.</p>
      
      <h4>Separate Ways</h4>
      
      <p>Sometimes the best solution is for bounded contexts to have no connection at all. If there's little value in integration, the cost of maintaining the relationship might outweigh the benefits.</p>
      
      <h3>Applying Strategic DDD</h3>
      
      <p>To apply Strategic DDD effectively, follow these steps:</p>
      
      <ol>
        <li><strong>Identify bounded contexts</strong>: Look for areas in your domain with different languages, teams, or responsibilities.</li>
        <li><strong>Create a context map</strong>: Document the relationships between your bounded contexts.</li>
        <li><strong>Define integration strategies</strong>: Choose appropriate patterns for how your bounded contexts will relate to each other.</li>
        <li><strong>Establish team boundaries</strong>: Align team structures with bounded contexts to minimize cross-context communication overhead.</li>
        <li><strong>Evolve the design</strong>: As you learn more about your domain, be prepared to refine your bounded contexts and context map.</li>
      </ol>
      
      <h3>Conclusion</h3>
      
      <p>Strategic Domain-Driven Design provides valuable tools for managing complexity in large software systems. By identifying bounded contexts, mapping their relationships, and choosing appropriate integration strategies, you can create a more maintainable and coherent system design.</p>
    `,
    relatedArticles: ["tactical-patterns", "clean-architecture", "event-storming"]
  },
  {
    id: "tactical-patterns",
    title: "Tactical Patterns in DDD",
    description: "Explore entities, value objects, aggregates, and domain events for implementing robust domain models.",
    icon: <BookOpen className="h-5 w-5 text-ddd-600" />,
    tag: "Patterns",
    createdAt: "2025-02-10",
    readTime: "15 min read",
    author: "Vaughn Vernon",
    content: `
      <h2>Tactical Patterns in Domain-Driven Design</h2>
      
      <p>Tactical Domain-Driven Design provides a set of patterns and building blocks for implementing domain models. These patterns help translate the conceptual model into code while preserving the meaning and behaviors of the domain.</p>
      
      <h3>Building Blocks of Tactical DDD</h3>
      
      <p>Tactical DDD introduces several important building blocks that form the foundation of a rich domain model:</p>
      
      <h4>Entities</h4>
      
      <p>Entities are objects that have a distinct identity that runs through time and different states. They are defined by their identity, rather than their attributes.</p>
      
      <p>For example, a "Person" in a system might be an entity. Even if all of the person's attributes change (name, address, etc.), it's still the same person.</p>
      
      <p>In code, entities often have an ID field or property that represents their unique identity.</p>
      
      <h4>Value Objects</h4>
      
      <p>Value Objects are objects that have no conceptual identity. They are defined by their attributes and are immutable.</p>
      
      <p>For example, a "Money" value object might have amount and currency attributes. Two Money objects with the same amount and currency are considered equal, regardless of where they are in memory.</p>
      
      <p>In code, value objects are often implemented as immutable classes with equality based on all of their attributes.</p>
      
      <h4>Aggregates</h4>
      
      <p>Aggregates are clusters of entities and value objects with a clear boundary. Each aggregate has a root entity (the aggregate root) through which all access to the aggregate must occur.</p>
      
      <p>The aggregate root is responsible for enforcing the invariants (business rules) of the aggregate. External objects should only reference the aggregate root, not the internal entities or value objects of the aggregate.</p>
      
      <p>For example, an "Order" might be an aggregate root, with "OrderLine" entities as part of the aggregate.</p>
      
      <h4>Domain Events</h4>
      
      <p>Domain Events represent something significant that has happened in the domain. They are typically implemented as immutable objects that contain information about the event.</p>
      
      <p>Domain Events are often used to communicate between different parts of the system, especially between different bounded contexts.</p>
      
      <p>For example, when an order is placed, an "OrderPlaced" event might be raised, which could be handled by the inventory system to update stock levels.</p>
      
      <h4>Repositories</h4>
      
      <p>Repositories provide a way to obtain references to aggregates. They encapsulate the infrastructure needed to retrieve and store aggregates.</p>
      
      <p>Repositories operate on aggregate roots and provide methods to add, remove, and find aggregates.</p>
      
      <p>For example, an "OrderRepository" might provide methods like findById(), save(), and remove().</p>
      
      <h4>Services</h4>
      
      <p>Services are operations that don't naturally belong to any entity or value object. They are stateless operations that perform a specific task.</p>
      
      <p>Domain services encapsulate domain logic that doesn't naturally fit within an entity or value object, while application services orchestrate the execution of operations on domain objects.</p>
      
      <p>For example, a "PaymentService" might handle the logic for processing payments, which involves coordinating between a "Customer" entity, a "CreditCard" value object, and a payment gateway.</p>
      
      <h4>Factories</h4>
      
      <p>Factories encapsulate the logic for creating complex objects or aggregates. They ensure that the created objects are in a valid state.</p>
      
      <p>For example, an "OrderFactory" might create an Order aggregate, ensuring that all required fields are provided and that the order is in a valid initial state.</p>
      
      <h3>Implementing Tactical DDD Patterns</h3>
      
      <p>To implement Tactical DDD patterns effectively, follow these guidelines:</p>
      
      <ol>
        <li><strong>Identify entities and value objects</strong>: Determine which objects in your domain have identity and which are defined by their attributes.</li>
        <li><strong>Define aggregate boundaries</strong>: Group related entities and value objects into aggregates, and identify the aggregate roots.</li>
        <li><strong>Implement repositories</strong>: Create repositories for each aggregate type to handle persistence.</li>
        <li><strong>Use domain events</strong>: Identify significant events in your domain and implement them as domain events.</li>
        <li><strong>Apply services appropriately</strong>: Use services for operations that don't naturally belong to any entity or value object.</li>
        <li><strong>Create factories</strong>: Implement factories for complex object creation.</li>
      </ol>
      
      <h3>Conclusion</h3>
      
      <p>Tactical Domain-Driven Design provides a rich set of patterns for implementing domain models in code. By using entities, value objects, aggregates, domain events, repositories, services, and factories appropriately, you can create a domain model that accurately reflects the concepts and behaviors of your business domain.</p>
    `,
    relatedArticles: ["strategic-ddd", "clean-architecture", "event-storming"]
  },
  {
    id: "clean-architecture",
    title: "Clean Architecture Integration",
    description: "Combine DDD with Clean Architecture to create maintainable and testable systems with clear separation of concerns.",
    icon: <FileText className="h-5 w-5 text-ddd-600" />,
    tag: "Architecture",
    createdAt: "2025-03-05",
    readTime: "18 min read",
    author: "Robert C. Martin",
    content: `
      <h2>Integrating Domain-Driven Design with Clean Architecture</h2>
      
      <p>Domain-Driven Design (DDD) and Clean Architecture are complementary approaches that can be combined to create maintainable, testable systems with clear separation of concerns. This article explores how to integrate these two approaches effectively.</p>
      
      <h3>Understanding Clean Architecture</h3>
      
      <p>Clean Architecture, proposed by Robert C. Martin, emphasizes separation of concerns and dependency rules to create systems that are:</p>
      
      <ul>
        <li>Independent of frameworks</li>
        <li>Testable</li>
        <li>Independent of the UI</li>
        <li>Independent of the database</li>
        <li>Independent of any external agency</li>
      </ul>
      
      <p>The architecture consists of concentric circles representing different layers of the system:</p>
      
      <ol>
        <li><strong>Entities</strong>: The innermost circle contains enterprise business rules.</li>
        <li><strong>Use Cases</strong>: Application-specific business rules.</li>
        <li><strong>Interface Adapters</strong>: Adapters that convert data between the use cases and external agencies.</li>
        <li><strong>Frameworks and Drivers</strong>: The outermost circle contains frameworks and tools.</li>
      </ol>
      
      <p>The key rule in Clean Architecture is that dependencies can only point inward. Inner circles cannot know anything about outer circles.</p>
      
      <h3>Mapping DDD Concepts to Clean Architecture</h3>
      
      <p>When integrating DDD with Clean Architecture, you can map DDD concepts to Clean Architecture layers:</p>
      
      <h4>Entities Layer (Enterprise Business Rules)</h4>
      
      <p>The Entities layer in Clean Architecture corresponds to the Domain Model in DDD. This layer contains:</p>
      
      <ul>
        <li>Entities (DDD entities with identity)</li>
        <li>Value Objects (immutable objects defined by their attributes)</li>
        <li>Aggregates (clusters of entities and value objects)</li>
        <li>Domain Events (significant occurrences in the domain)</li>
        <li>Domain Services (operations that don't belong to specific entities)</li>
      </ul>
      
      <p>This layer encapsulates the core business rules and concepts of your domain.</p>
      
      <h4>Use Cases Layer (Application Business Rules)</h4>
      
      <p>The Use Cases layer in Clean Architecture corresponds to the Application Services in DDD. This layer contains:</p>
      
      <ul>
        <li>Application Services (orchestrate domain objects to fulfill use cases)</li>
        <li>Command and Query objects (represent intents and data requests)</li>
        <li>DTOs (Data Transfer Objects for passing data across boundaries)</li>
      </ul>
      
      <p>This layer defines the jobs that the system needs to do and orchestrates the flow of data to and from the domain entities.</p>
      
      <h4>Interface Adapters Layer</h4>
      
      <p>The Interface Adapters layer in Clean Architecture contains components that adapt between the use cases and external concerns. This includes:</p>
      
      <ul>
        <li>Repositories (provide persistence abstractions for domain objects)</li>
        <li>Controllers/Presenters (handle HTTP requests and format responses)</li>
        <li>Gateway implementations (adapt to external services)</li>
      </ul>
      
      <p>This layer converts data between the format most convenient for the use cases and entities, and the format most convenient for external agencies like databases or the web.</p>
      
      <h4>Frameworks and Drivers Layer</h4>
      
      <p>The outermost layer contains frameworks and tools such as:</p>
      
      <ul>
        <li>Web frameworks</li>
        <li>Database access libraries</li>
        <li>UI components</li>
        <li>External APIs</li>
      </ul>
      
      <p>This layer contains the details and should have minimal impact on the inner layers.</p>
      
      <h3>Implementing the Integration</h3>
      
      <p>To implement the integration of DDD and Clean Architecture effectively, follow these principles:</p>
      
      <h4>Use Dependency Inversion</h4>
      
      <p>The Dependency Inversion Principle is crucial for maintaining the dependency rule of Clean Architecture while implementing DDD concepts:</p>
      
      <ul>
        <li>Define repository interfaces in the domain layer</li>
        <li>Implement repositories in the infrastructure layer</li>
        <li>Use dependency injection to provide implementations at runtime</li>
      </ul>
      
      <h4>Keep the Domain Model Pure</h4>
      
      <p>The domain model should be free from infrastructure concerns:</p>
      
      <ul>
        <li>No persistence annotations in domain entities</li>
        <li>No framework dependencies in the domain layer</li>
        <li>Use adapters to translate between domain and infrastructure</li>
      </ul>
      
      <h4>Use Bounded Contexts to Define Module Boundaries</h4>
      
      <p>Bounded Contexts from Strategic DDD can help define module boundaries in a Clean Architecture:</p>
      
      <ul>
        <li>Each Bounded Context can be a separate module with its own layers</li>
        <li>Context Maps define how modules interact with each other</li>
        <li>Anti-Corruption Layers protect the integrity of each module</li>
      </ul>
      
      <h4>Apply CQRS When Appropriate</h4>
      
      <p>Command Query Responsibility Segregation (CQRS) can be a natural fit in a DDD and Clean Architecture integration:</p>
      
      <ul>
        <li>Commands represent intents to change the system</li>
        <li>Queries represent requests for information</li>
        <li>Different models can be used for commands and queries</li>
      </ul>
      
      <h3>Example Project Structure</h3>
      
      <p>A typical project structure for a DDD and Clean Architecture integration might look like:</p>
      
      <pre>
      src/
        domain/
          entities/
          valueobjects/
          aggregates/
          events/
          services/
          repositories/ (interfaces only)
        application/
          services/
          commands/
          queries/
          dtos/
        infrastructure/
          persistence/
            repositories/ (implementations)
          security/
          logging/
          messaging/
        interfaces/
          api/
          web/
          console/
      </pre>
      
      <h3>Conclusion</h3>
      
      <p>Integrating Domain-Driven Design with Clean Architecture creates a powerful approach to software development that combines the rich modeling techniques of DDD with the architectural principles of Clean Architecture. This integration helps create systems that are both focused on the business domain and architecturally sound, with clear separation of concerns and manageable dependencies.</p>
    `,
    relatedArticles: ["strategic-ddd", "tactical-patterns", "event-storming"]
  },
  {
    id: "event-storming",
    title: "Event Storming Workshops",
    description: "Collaborative modeling technique for mapping business processes and identifying domain events.",
    icon: <FileText className="h-5 w-5 text-ddd-600" />,
    tag: "Practice",
    createdAt: "2025-03-18",
    readTime: "10 min read",
    author: "Alberto Brandolini",
    content: `
      <h2>Event Storming: Collaborative Domain Modeling</h2>
      
      <p>Event Storming is a workshop-based method for collaborative exploration of complex business domains. Developed by Alberto Brandolini, it brings together domain experts and technical team members to quickly build a shared understanding of the business process and identify potential issues.</p>
      
      <h3>What is Event Storming?</h3>
      
      <p>Event Storming is a workshop format that uses a simple set of sticky notes on a timeline to explore a business domain. It focuses on domain events—things that happen in the business—as the basic building blocks for understanding the domain.</p>
      
      <p>Event Storming is particularly useful for:</p>
      
      <ul>
        <li>Exploring complex business domains</li>
        <li>Identifying bounded contexts</li>
        <li>Understanding the flow of events in a process</li>
        <li>Discovering edge cases and issues</li>
        <li>Building a shared language between domain experts and developers</li>
      </ul>
      
      <h3>The Event Storming Process</h3>
      
      <p>A typical Event Storming session follows these steps:</p>
      
      <h4>1. Setup</h4>
      
      <p>Prepare a large modeling space—typically a long paper roll on a wall—and gather sticky notes in different colors:</p>
      
      <ul>
        <li><strong>Orange</strong>: Domain Events</li>
        <li><strong>Blue</strong>: Commands</li>
        <li><strong>Yellow</strong>: Actors</li>
        <li><strong>Lilac</strong>: External Systems</li>
        <li><strong>Pink</strong>: Problems/Questions</li>
        <li><strong>Green</strong>: Opportunities</li>
        <li><strong>Purple</strong>: Policies</li>
      </ul>
      
      <h4>2. Domain Events (Chaotic Exploration)</h4>
      
      <p>Start by identifying domain events—things that happen in the business that domain experts care about—and write them on orange sticky notes in past tense (e.g., "Order Placed", "Payment Received").</p>
      
      <p>Place these events on the timeline (left to right) in roughly chronological order. This phase is deliberately chaotic to encourage exploration.</p>
      
      <h4>3. Timeline Reorganization</h4>
      
      <p>Once you have a good set of events, reorganize them into a coherent timeline. Identify clusters of events that seem to belong together.</p>
      
      <h4>4. Commands and Actors</h4>
      
      <p>For each event, identify what caused it to happen. This could be:</p>
      
      <ul>
        <li>A command issued by an actor (person or system)</li>
        <li>Another event (a reaction)</li>
        <li>A time-based trigger</li>
      </ul>
      
      <p>Add blue sticky notes for commands (e.g., "Place Order") and yellow notes for actors (e.g., "Customer").</p>
      
      <h4>5. Policies and Read Models</h4>
      
      <p>Identify policies (business rules) that determine how the system reacts to events, and read models (information views) that users need to make decisions.</p>
      
      <h4>6. Bounded Contexts</h4>
      
      <p>Look for natural boundaries in the event flow where the language seems to change. These are potential bounded contexts in your domain.</p>
      
      <h4>7. Refinement</h4>
      
      <p>Refine the model by adding more details, exploring edge cases, and addressing any pink notes (problems/questions) that were raised during the session.</p>
      
      <h3>Tips for Effective Event Storming</h3>
      
      <p>To get the most out of an Event Storming session:</p>
      
      <ul>
        <li><strong>Invite the right people</strong>: Include domain experts, developers, and other stakeholders.</li>
        <li><strong>Provide enough space</strong>: Use a long wall or multiple connected tables.</li>
        <li><strong>Keep it informal</strong>: Stand-up format, casual atmosphere, no presentations.</li>
        <li><strong>Focus on exploration</strong>: Don't worry about getting it "right" the first time.</li>
        <li><strong>Use a facilitator</strong>: Have someone guide the process and ensure everyone participates.</li>
        <li><strong>Document outcomes</strong>: Take photos, write summaries, or create digital versions of the model.</li>
      </ul>
      
      <h3>From Event Storming to Implementation</h3>
      
      <p>After an Event Storming session, you can use the results to inform your implementation:</p>
      
      <ul>
        <li><strong>Domain Model</strong>: Use the identified events, commands, and policies to build your domain model.</li>
        <li><strong>Bounded Contexts</strong>: Use the identified boundaries to define your bounded contexts and context map.</li>
        <li><strong>User Stories</strong>: Create user stories based on the commands and events.</li>
        <li><strong>Event Sourcing</strong>: If appropriate, use the events as the foundation for an event-sourced architecture.</li>
        <li><strong>CQRS</strong>: Use the read models and commands to implement a CQRS pattern.</li>
      </ul>
      
      <h3>Conclusion</h3>
      
      <p>Event Storming is a powerful technique for exploring complex domains and building a shared understanding between domain experts and technical team members. It's particularly effective when combined with Domain-Driven Design, as it helps identify the key building blocks of your domain model and the boundaries between different contexts.</p>
      
      <p>By focusing on domain events as the central concept, Event Storming provides a language-agnostic way to understand business processes and workflows, making it an excellent starting point for any complex software development project.</p>
    `,
    relatedArticles: ["strategic-ddd", "tactical-patterns", "clean-architecture"]
  }
];

const KnowledgeDetail = () => {
  const { id } = useParams();
  
  // Find the article with the matching ID
  const article = articles.find(article => article.id === id);
  
  if (!article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for could not be found.</p>
            <Button asChild>
              <Link to="/knowledge">Back to Knowledge Base</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Find related articles
  const relatedArticlesData = article.relatedArticles
    .map(id => articles.find(article => article.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Article Header */}
        <div className="bg-gradient-to-b from-blue-50 to-white py-12">
          <div className="container mx-auto px-4">
            <div className="mb-6">
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link to="/knowledge" className="flex items-center text-ddd-600">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Knowledge Base
                </Link>
              </Button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                <Tag className="h-4 w-4" />
                <span>{article.tag}</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
              
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-ddd-600" />
                  <span>{article.createdAt}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-ddd-600" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center">
                  <span>By {article.author}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Article Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3">
              <div className="prose prose-lg max-w-none mb-12" dangerouslySetInnerHTML={{ __html: article.content }}></div>
              
              <Separator className="my-8" />
              
              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-blue-50 text-ddd-700 px-3 py-1 rounded-full text-sm">
                    DDD
                  </div>
                  <div className="bg-blue-50 text-ddd-700 px-3 py-1 rounded-full text-sm">
                    Domain-Driven Design
                  </div>
                  <div className="bg-blue-50 text-ddd-700 px-3 py-1 rounded-full text-sm">
                    {article.tag}
                  </div>
                  <div className="bg-blue-50 text-ddd-700 px-3 py-1 rounded-full text-sm">
                    Software Design
                  </div>
                </div>
              </div>
              
              {/* Article Navigation */}
              <div className="mb-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="/knowledge" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="/knowledge">Knowledge Base</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
                    <nav className="space-y-2">
                      {/* This would ideally be generated from the article content */}
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800">Introduction</a>
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800">Key Concepts</a>
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800 pl-4">Bounded Context</a>
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800 pl-4">Context Map</a>
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800 pl-4">Ubiquitous Language</a>
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800">Relationship Patterns</a>
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800">Applying Strategic DDD</a>
                      <a href="#" className="block text-ddd-600 hover:text-ddd-800">Conclusion</a>
                    </nav>
                  </CardContent>
                </Card>
                
                {relatedArticlesData.length > 0 && (
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Related Articles</h3>
                      <div className="space-y-4">
                        {relatedArticlesData.map((relatedArticle, index) => (
                          <div key={index} className="flex items-start">
                            <div className="mt-1 mr-3">
                              {relatedArticle.icon}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                <Link to={`/knowledge/${relatedArticle.id}`} className="text-ddd-600 hover:text-ddd-800">
                                  {relatedArticle.title}
                                </Link>
                              </h4>
                              <p className="text-sm text-gray-500">{relatedArticle.readTime}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default KnowledgeDetail;
