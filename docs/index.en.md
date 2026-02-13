# What Is CleanDDD?

## Definition

CleanDDD, short for Clean Domain-Driven Design, distills the core ideas of DDD into a practical software engineering guide. It consists of four key parts:

- A value orientation
- A set of concept definitions
- A modeling approach
- A code discipline

## Goal

With clear concepts and rules that are easy to follow, CleanDDD helps prevent codebases from decaying into chaos. It enables teams to manage complex systems, retain control over architecture and code, and sustain fast, reliable delivery.

## Value Orientation

Keeping boundaries clear is the most important thing.

## Concept Definitions

- Aggregate: A set of objects responsible for core business data and behavior, with a clear boundary and consistency rules.
- Domain Event: An object produced by aggregate behavior that represents a business event, usually named in the past tense.
- Domain Event Handler: Creates and emits commands based on domain events.
- Command: A request to change aggregate state, triggered by user actions or system events.
- Command Handler: Operates on an aggregate to satisfy a business requirement.
- Query and Query Handler: Read aggregate data to satisfy user needs.
- Scheduled Task: Runs at a specific time or interval, usually emitting commands to change aggregate state.
- Integration Event: Transfers information across systems, usually derived from domain events and sent via MQ or other middleware.
- Integration Event Handler: Processes integration events and emits commands, typically in the receiving system.

## Modeling Approach

- Identify aggregates
  - When you see a requirement like “create x,” x is likely an aggregate.
  - If x cannot exist independently and must belong to another entity, define x as a child entity of that aggregate.
- Identify commands and command handlers
  - If an operation changes aggregate state, define it as a command.
  - Commands are typically triggered by:
    - User actions (for example, submitting a UI form)
    - Domain event handlers
    - Scheduled tasks
- Identify domain events
  - Domain events are usually named in past tense, indicating something important already happened.
  - Names should reflect business meaning, such as `OrderCreated` or `CustomerAddressUpdated`.
- Identify domain event handlers
  - If a requirement says “after doing x, do y,” then y should be triggered by a domain event handler.
  - Each handler should focus on a single domain event to keep responsibilities clear.
- Identify queries
  - If users need to view aggregate data, define a query.
  - If business rules depend on aggregate data, define a query as well.

## Code Discipline

- Aggregates
  - Aggregates must not reference each other directly.
  - Aggregates do not share entities; a child entity must not reference another aggregate.
  - Objects inside an aggregate can only be modified through the aggregate root or its child entity methods.
  - Aggregate state changes must be done through aggregate behavior (methods).
- Domain events
  - Domain events must be produced by aggregate behavior.
- Command handlers
  - A command handler can only modify a single aggregate.
- Event handlers
  - An event handler can only handle a single domain event.
- Queries
  - Cross-aggregate join queries are not allowed.

## Q&A

### How does CleanDDD relate to Clean Architecture?

CleanDDD is not the same as Clean Architecture. They are similar in code organization, but their focus and goals are different, and the layering concepts do not fully overlap. In CleanDDD, “Clean” emphasizes simplifying complex ideas and making practice easier, not a specific architecture style.

### Will performance be poor in CleanDDD systems?

No. Most business systems are I/O bound and read-heavy. CleanDDD enforces clear aggregate boundaries and disallows cross-aggregate operations, which introduces some data duplication. This reduces cross-aggregate access and can improve overall performance.
