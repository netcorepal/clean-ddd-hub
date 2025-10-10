# 命名规范

## 为什么需要命名规范？

统一的命名规范可以提高代码的可读性和可维护性，使团队成员更容易理解代码意图。本文档定义了在DDD和Clean Architecture项目中的命名约定。

## 通用命名有哪些原则？

### 1. 如何使用有意义的名称？

- 名称应该清楚地表达其用途
- 避免使用缩写（除非是广为人知的）
- 避免使用单字母变量名（除了循环计数器）

```csharp
// ✅ 好的命名
public class UserService { }
public string GetUserFullName() { }
private decimal CalculateTotalPrice() { }

// ❌ 不好的命名
public class UsrSrv { }
public string GetName() { }
private decimal Calc() { }
```

### 2. 如何保持词汇一致性？

在整个项目中使用相同的词汇表达相同的概念：

- 如果使用"Customer"，就不要在其他地方使用"Client"
- 如果使用"Order"，就不要在其他地方使用"Purchase"
- 遵循Ubiquitous Language（统一语言）

### 3. 为什么要避免噪音词？

避免使用没有实际意义的词汇：

```csharp
// ❌ 避免使用
UserData, UserInfo, UserManager, UserHelper

// ✅ 更好的选择
User, UserService, UserValidator
```

## C#中如何命名？

### 什么时候使用Pascal命名法？

用于：
- 类名
- 接口名
- 枚举名
- 方法名
- 属性名
- 事件名
- 命名空间

```csharp
public class UserService { }
public interface IUserRepository { }
public enum OrderStatus { }
public void CalculateTotalPrice() { }
public string UserName { get; set; }
public event EventHandler UserCreated;
namespace MyProject.Domain.AggregatesModel { }
```

### 什么时候使用Camel命名法？

用于：
- 局部变量
- 方法参数
- 私有字段（带下划线前缀）

```csharp
public void ProcessOrder(string customerName, decimal totalAmount)
{
    var orderDate = DateTime.Now;
    var isValid = ValidateOrder(customerName);
}

private readonly IUserRepository _userRepository;
```

## 如何命名项目和命名空间？

### 项目如何命名？

格式：`{CompanyName}.{ProjectName}.{Layer}`

```
MyCompany.OrderSystem.Domain
MyCompany.OrderSystem.Infrastructure
MyCompany.OrderSystem.Web
```

### 命名空间如何命名？

遵循项目结构：

```csharp
namespace MyProject.Domain.AggregatesModel.UserAggregate;
namespace MyProject.Domain.DomainEvents;
namespace MyProject.Infrastructure.Repositories;
namespace MyProject.Web.Application.Commands.User;
namespace MyProject.Web.Application.Queries.Order;
namespace MyProject.Web.Endpoints.User;
```

## DDD中如何命名？

### 聚合根如何命名？

- 使用领域中的名词
- 不需要添加"Aggregate"后缀
- 与文件名一致

```csharp
// ✅ 好的命名
public class User : Entity<UserId>, IAggregateRoot { }
public class Order : Entity<OrderId>, IAggregateRoot { }
public class Product : Entity<ProductId>, IAggregateRoot { }

// ❌ 不好的命名
public class UserAggregate : Entity<UserId>, IAggregateRoot { }
public class OrderRoot : Entity<OrderId>, IAggregateRoot { }
```

### 强类型ID如何命名？

格式：`{EntityName}Id`

```csharp
public partial record UserId : IGuidStronglyTypedId;
public partial record OrderId : IGuidStronglyTypedId;
public partial record ProductId : IGuidStronglyTypedId;
```

### 实体

- 使用领域中的名词
- 子实体应该反映其在聚合中的角色

```csharp
public class OrderItem : Entity<OrderItemId>, IEntity { }
public class Address : Entity<AddressId>, IEntity { }
public class ContactInfo : Entity<ContactInfoId>, IEntity { }
```

### 值对象如何命名？

- 使用描述性名词
- 通常不需要"ValueObject"后缀

```csharp
public record Money(decimal Amount, string Currency);
public record Address(string Street, string City, string Country);
public record DateRange(DateTimeOffset Start, DateTimeOffset End);
```

### 领域事件

格式：`{Entity}{Action}DomainEvent`

使用过去式动词：

```csharp
// ✅ 好的命名
public record UserCreatedDomainEvent(User User) : IDomainEvent;
public record OrderPaidDomainEvent(Order Order) : IDomainEvent;
public record ProductPublishedDomainEvent(Product Product) : IDomainEvent;

// ❌ 不好的命名
public record CreateUserEvent(User User) : IDomainEvent;
public record PayingOrderEvent(Order Order) : IDomainEvent;
```

### 领域服务如何命名？

格式：`{Domain}{Action}Service` 或 `{Domain}Service`

```csharp
public class PricingService { }
public class ShippingCalculationService { }
public class InventoryService { }
```

## CQRS中如何命名？

### 命令如何命名？

格式：`{Action}{Entity}Command`

使用动词原形：

```csharp
// ✅ 好的命名
public record CreateUserCommand(string Name, string Email) : ICommand<UserId>;
public record UpdateUserEmailCommand(UserId UserId, string Email) : ICommand;
public record DeleteUserCommand(UserId UserId) : ICommand;
public record PayOrderCommand(OrderId OrderId, decimal Amount) : ICommand;

// ❌ 不好的命名
public record UserCreateCommand(...) : ICommand<UserId>;
public record CreatingUserCommand(...) : ICommand<UserId>;
```

### 命令处理器如何命名？

格式：`{CommandName}Handler`

```csharp
public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, UserId> { }
public class UpdateUserEmailCommandHandler : ICommandHandler<UpdateUserEmailCommand> { }
```

### 命令验证器如何命名？

格式：`{CommandName}Validator`

```csharp
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand> { }
public class UpdateUserEmailCommandValidator : AbstractValidator<UpdateUserEmailCommand> { }
```

### 查询

格式：`Get{Entity}Query` 或 `Get{Entity}ListQuery`

```csharp
public record GetUserQuery(UserId UserId) : IQuery<UserDto>;
public record GetUserListQuery(int PageIndex, int PageSize) : IQuery<PagedData<UserListItemDto>>;
public record GetOrderDetailQuery(OrderId OrderId) : IQuery<OrderDetailDto>;
```

### 查询处理器如何命名？

格式：`{QueryName}Handler`

```csharp
public class GetUserQueryHandler : IQueryHandler<GetUserQuery, UserDto> { }
public class GetUserListQueryHandler : IQueryHandler<GetUserListQuery, PagedData<UserListItemDto>> { }
```

### DTO如何命名？

格式：`{Entity}Dto` 或 `{Entity}{Purpose}Dto`

```csharp
public record UserDto(UserId Id, string Name, string Email);
public record UserListItemDto(UserId Id, string Name, string Email);
public record OrderDetailDto(OrderId Id, string CustomerName, List<OrderItemDto> Items);
```

## 仓储如何命名？

### 仓储接口如何命名？

格式：`I{Entity}Repository`

```csharp
public interface IUserRepository : IRepository<User, UserId> { }
public interface IOrderRepository : IRepository<Order, OrderId> { }
```

### 仓储实现如何命名？

格式：`{Entity}Repository`

```csharp
public class UserRepository : RepositoryBase<User, UserId, ApplicationDbContext>, IUserRepository { }
public class OrderRepository : RepositoryBase<Order, OrderId, ApplicationDbContext>, IOrderRepository { }
```

### 仓储方法如何命名？

使用业务语言，体现业务意图：

```csharp
Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken);
Task<List<Order>> GetPendingOrdersAsync(CancellationToken cancellationToken);
Task<List<Product>> GetPublishedProductsAsync(CancellationToken cancellationToken);
```

## 事件处理器如何命名？

### 领域事件处理器如何命名？

格式：`{DomainEvent}HandlerFor{Purpose}`

```csharp
public class UserCreatedDomainEventHandlerForNotification 
    : IDomainEventHandler<UserCreatedDomainEvent> { }

public class OrderPaidDomainEventHandlerForDelivery 
    : IDomainEventHandler<OrderPaidDomainEvent> { }
```

### 集成事件

格式：`{Entity}{Action}IntegrationEvent`

```csharp
public record UserCreatedIntegrationEvent(
    UserId UserId, 
    string Name, 
    string Email, 
    DateTime CreatedTime);
```

### 集成事件处理器如何命名？

格式：`{IntegrationEvent}Handler`

```csharp
public class PaymentCompletedIntegrationEventHandler 
    : IIntegrationEventHandler<PaymentCompletedIntegrationEvent> { }
```

## API端点如何命名？

### Endpoint类如何命名？

格式：`{Action}{Entity}Endpoint`

```csharp
public class CreateUserEndpoint : EndpointWithoutRequest<UserId> { }
public class GetUserEndpoint : Endpoint<GetUserRequest, UserDto> { }
public class UpdateUserEmailEndpoint : EndpointWithoutResponse<UpdateUserEmailRequest> { }
```

### 路由如何命名？

使用RESTful约定：

```csharp
// ✅ 好的路由
/api/users
/api/users/{id}
/api/orders
/api/orders/{id}/items

// ❌ 不好的路由
/api/GetUsers
/api/user/create
/api/OrderList
```

## 配置类如何命名？

### 实体配置如何命名？

格式：`{Entity}EntityConfiguration`

```csharp
public class UserEntityConfiguration : IEntityTypeConfiguration<User> { }
public class OrderEntityConfiguration : IEntityTypeConfiguration<Order> { }
```

## 测试类如何命名？

### 测试类命名规则是什么？

格式：`{ClassUnderTest}Tests`

```csharp
public class UserTests { }
public class CreateUserCommandHandlerTests { }
public class GetUserQueryHandlerTests { }
```

### 测试方法如何命名？

格式：`{MethodName}_{Scenario}_{ExpectedBehavior}`

```csharp
[Fact]
public void User_Constructor_ShouldCreateValidUser() { }

[Fact]
public void ChangeEmail_WithValidEmail_ShouldUpdateEmail() { }

[Fact]
public void ChangeEmail_WithInvalidEmail_ShouldThrowException() { }
```

## 文件如何命名？

### 一般规则是什么？

- 文件名与主要类名一致
- 使用PascalCase
- 一个文件一个主要类（除了相关的小类）

```
User.cs                              # 聚合根 + 强类型ID
CreateUserCommand.cs                 # 命令 + 验证器 + 处理器
GetUserQuery.cs                      # 查询 + DTO + 验证器 + 处理器
UserDomainEvents.cs                  # 多个相关领域事件
UserRepository.cs                    # 仓储接口 + 实现
UserEntityConfiguration.cs           # 实体配置
UserTests.cs                         # 测试类
```

## 常量和枚举如何命名？

### 常量如何命名？

使用UPPER_CASE（C#传统）或PascalCase（.NET约定）：

```csharp
// 两种方式都可以
public const int MAX_PAGE_SIZE = 100;
public const int MaxPageSize = 100;
```

### 枚举如何命名？

使用PascalCase，枚举值也使用PascalCase：

```csharp
public enum OrderStatus
{
    Pending,
    Confirmed,
    Paid,
    Shipped,
    Completed,
    Cancelled
}
```

## 异常如何命名？

格式：`{Description}Exception`

```csharp
public class KnownException : Exception { }
public class InvalidOrderStateException : Exception { }
public class UserNotFoundException : Exception { }
```

## 缩写如何使用？

### 哪些是常见缩写？

可以使用的常见缩写：

- **Id** - Identity/Identifier
- **Dto** - Data Transfer Object
- **API** - Application Programming Interface
- **HTTP** - Hypertext Transfer Protocol
- **SQL** - Structured Query Language
- **EF** - Entity Framework
- **DB** - Database

### 缩写大小写规则是什么？

- 2个字母的缩写：全大写（如 `ID`, `IO`）
- 3个或更多字母：只首字母大写（如 `Api`, `Http`, `Sql`）

```csharp
// ✅ 正确
public UserId Id { get; set; }
public string ApiKey { get; set; }
public HttpClient HttpClient { get; set; }

// ❌ 不正确
public UserId ID { get; set; }
public string APIKey { get; set; }
public HttpClient HTTPClient { get; set; }
```

## 布尔值如何命名？

使用明确的前缀：

```csharp
// ✅ 好的命名
public bool IsActive { get; set; }
public bool HasPermission { get; set; }
public bool CanEdit { get; set; }
public bool ShouldNotify { get; set; }

// ❌ 不好的命名
public bool Active { get; set; }
public bool Permission { get; set; }
public bool Editable { get; set; }
```

## 集合如何命名？

使用复数形式：

```csharp
// ✅ 好的命名
public List<User> Users { get; set; }
public IEnumerable<Order> Orders { get; set; }
public IReadOnlyCollection<OrderItem> OrderItems { get; set; }

// ❌ 不好的命名
public List<User> UserList { get; set; }
public IEnumerable<Order> OrderCollection { get; set; }
```

## 异步方法如何命名？

添加"Async"后缀：

```csharp
public async Task<User> GetUserAsync(UserId userId) { }
public async Task<bool> EmailExistsAsync(string email) { }
public async Task CreateUserAsync(User user) { }
```

## 如何检查命名是否合格？

在命名时，问自己：

1. ✅ 名称是否清楚地表达了意图？
2. ✅ 是否使用了领域语言？
3. ✅ 是否遵循了项目的命名约定？
4. ✅ 是否与现有代码保持一致？
5. ✅ 是否避免了缩写和噪音词？
6. ✅ 是否容易被团队成员理解？

## 在哪里可以找到相关文档？

- [项目结构最佳实践](project-structure.md)
- [代码规范](code-standards.md)
- [聚合开发指南](../development-guide/aggregate-development.md)
- [命令开发指南](../development-guide/command-development.md)
