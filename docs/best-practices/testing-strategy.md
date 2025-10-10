# 测试策略最佳实践

## 概述

单元测试确保领域模型的正确性和业务规则的有效性。本文档描述了在DDD和Clean Architecture项目中的测试策略和最佳实践。

## 测试金字塔

```
       /\
      /  \  E2E Tests (少量)
     /____\
    /      \  Integration Tests (适量)
   /________\
  /          \  Unit Tests (大量)
 /____________\
```

- **单元测试（70%）**: 测试聚合、实体、值对象、领域服务
- **集成测试（20%）**: 测试仓储、数据库交互、外部服务
- **端到端测试（10%）**: 测试完整的用户场景

## 测试项目结构

### 推荐结构

```
test/
├── MyProject.Domain.UnitTests/         # 领域层单元测试
│   ├── AggregatesModel/
│   │   ├── UserAggregate/
│   │   │   └── UserTests.cs
│   │   └── OrderAggregate/
│   │       └── OrderTests.cs
│   ├── DomainServices/
│   │   └── PricingServiceTests.cs
│   └── TestHelpers/
│       └── TestDataFactory.cs
├── MyProject.Infrastructure.UnitTests/ # 基础设施层测试
│   ├── Repositories/
│   │   └── UserRepositoryTests.cs
│   └── TestHelpers/
│       └── DbContextFactory.cs
└── MyProject.Web.UnitTests/           # Web层测试
    ├── Commands/
    │   └── CreateUserCommandHandlerTests.cs
    ├── Queries/
    │   └── GetUserQueryHandlerTests.cs
    └── Endpoints/
        └── UserEndpointsTests.cs
```

## 单元测试最佳实践

### AAA模式

所有测试应遵循 Arrange-Act-Assert 模式：

```csharp
[Fact]
public void User_Constructor_ShouldCreateValidUser()
{
    // Arrange - 准备测试数据
    var name = "张三";
    var email = "zhangsan@example.com";

    // Act - 执行被测试的操作
    var user = new User(name, email);

    // Assert - 验证结果
    Assert.Equal(name, user.Name);
    Assert.Equal(email, user.Email);
    Assert.False(user.IsDeleted);
}
```

### 测试命名约定

测试方法名应该清晰表达测试意图：

**格式**: `{MethodName}_{Scenario}_{ExpectedBehavior}`

```csharp
// ✅ 好的命名
[Fact]
public void ChangeEmail_WithValidEmail_ShouldUpdateEmail()

[Fact]
public void ChangeEmail_WithSameEmail_ShouldNotPublishEvent()

[Fact]
public void ChangeEmail_WithInvalidEmail_ShouldThrowException()

// ❌ 不好的命名
[Fact]
public void TestChangeEmail()

[Fact]
public void Test1()
```

### 一个测试一个断言

每个测试应该专注于验证一个行为：

```csharp
// ✅ 好的做法
[Fact]
public void User_Constructor_ShouldSetName()
{
    var user = new User("张三", "test@example.com");
    Assert.Equal("张三", user.Name);
}

[Fact]
public void User_Constructor_ShouldSetEmail()
{
    var user = new User("张三", "test@example.com");
    Assert.Equal("test@example.com", user.Email);
}

// ❌ 不好的做法 - 测试太多东西
[Fact]
public void User_Constructor_ShouldSetAllProperties()
{
    var user = new User("张三", "test@example.com");
    Assert.Equal("张三", user.Name);
    Assert.Equal("test@example.com", user.Email);
    Assert.False(user.IsDeleted);
    Assert.NotNull(user.CreateTime);
    Assert.True(user.IsActive);
}
```

## 测试聚合根

### 测试创建

```csharp
public class UserTests
{
    [Fact]
    public void User_Constructor_ShouldCreateValidUser()
    {
        // Arrange
        var name = "张三";
        var email = "zhangsan@example.com";

        // Act
        var user = new User(name, email);

        // Assert
        Assert.Equal(name, user.Name);
        Assert.Equal(email, user.Email);
        Assert.False(user.IsDeleted);
        Assert.True(user.CreateTime <= DateTimeOffset.UtcNow);
        
        // 验证领域事件
        var domainEvents = user.GetDomainEvents();
        Assert.Single(domainEvents);
        Assert.IsType<UserCreatedDomainEvent>(domainEvents.First());
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    [InlineData(null)]
    public void User_Constructor_WithInvalidName_ShouldThrowException(string? name)
    {
        // Arrange
        var email = "test@example.com";

        // Act & Assert
        Assert.Throws<KnownException>(() => new User(name!, email));
    }
}
```

### 测试业务规则

```csharp
[Fact]
public void ChangeEmail_WithValidEmail_ShouldUpdateEmail()
{
    // Arrange
    var user = new User("张三", "old@example.com");
    var newEmail = "new@example.com";

    // Act
    user.ChangeEmail(newEmail);

    // Assert
    Assert.Equal(newEmail, user.Email);
}

[Fact]
public void ChangeEmail_WithSameEmail_ShouldNotPublishEvent()
{
    // Arrange
    var email = "test@example.com";
    var user = new User("张三", email);
    user.ClearDomainEvents(); // 清除构造事件

    // Act
    user.ChangeEmail(email); // 使用相同邮箱

    // Assert
    Assert.Empty(user.GetDomainEvents()); // 不应发布事件
}

[Fact]
public void Delete_OnDeletedUser_ShouldThrowException()
{
    // Arrange
    var user = new User("张三", "test@example.com");
    user.Delete();

    // Act & Assert
    Assert.Throws<KnownException>(() => user.Delete());
}
```

### 测试领域事件

```csharp
[Fact]
public void User_BusinessOperations_ShouldPublishCorrectEvents()
{
    // Arrange
    var user = new User("张三", "old@example.com");
    user.ClearDomainEvents(); // 清除构造函数事件
    
    // Act
    user.ChangeEmail("new@example.com");
    user.ChangeName("李四");

    // Assert
    var events = user.GetDomainEvents();
    Assert.Equal(2, events.Count);
    
    var emailEvent = events.OfType<UserEmailChangedDomainEvent>().Single();
    Assert.Equal(user, emailEvent.User);
    
    var nameEvent = events.OfType<UserNameChangedDomainEvent>().Single();
    Assert.Equal(user, nameEvent.User);
}
```

## 测试命令处理器

### 使用Mock进行测试

```csharp
public class CreateUserCommandHandlerTests
{
    private readonly Mock<IUserRepository> _mockUserRepository;
    private readonly CreateUserCommandHandler _handler;

    public CreateUserCommandHandlerTests()
    {
        _mockUserRepository = new Mock<IUserRepository>();
        _handler = new CreateUserCommandHandler(_mockUserRepository.Object);
    }

    [Fact]
    public async Task Handle_WithValidCommand_ShouldCreateUser()
    {
        // Arrange
        var command = new CreateUserCommand("张三", "test@example.com");
        _mockUserRepository
            .Setup(r => r.EmailExistsAsync(command.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        // Act
        var userId = await _handler.Handle(command, CancellationToken.None);

        // Assert
        Assert.NotNull(userId);
        _mockUserRepository.Verify(
            r => r.AddAsync(It.IsAny<User>(), It.IsAny<CancellationToken>()), 
            Times.Once);
    }

    [Fact]
    public async Task Handle_WithExistingEmail_ShouldThrowException()
    {
        // Arrange
        var command = new CreateUserCommand("张三", "existing@example.com");
        _mockUserRepository
            .Setup(r => r.EmailExistsAsync(command.Email, It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        // Act & Assert
        await Assert.ThrowsAsync<KnownException>(
            () => _handler.Handle(command, CancellationToken.None));
    }
}
```

## 测试查询处理器

### 使用内存数据库

```csharp
public class GetUserQueryHandlerTests : IDisposable
{
    private readonly ApplicationDbContext _context;
    private readonly GetUserQueryHandler _handler;

    public GetUserQueryHandlerTests()
    {
        var options = new DbContextOptionsBuilder<ApplicationDbContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;
        _context = new ApplicationDbContext(options, Mock.Of<IMediator>());
        _handler = new GetUserQueryHandler(_context);
    }

    [Fact]
    public async Task Handle_WithExistingUser_ShouldReturnUser()
    {
        // Arrange
        var user = new User("张三", "test@example.com");
        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var query = new GetUserQuery(user.Id);

        // Act
        var result = await _handler.Handle(query, CancellationToken.None);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(user.Id, result.Id);
        Assert.Equal(user.Name, result.Name);
    }

    [Fact]
    public async Task Handle_WithNonExistingUser_ShouldThrowException()
    {
        // Arrange
        var query = new GetUserQuery(new UserId(999));

        // Act & Assert
        await Assert.ThrowsAsync<KnownException>(
            () => _handler.Handle(query, CancellationToken.None));
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
```

## 测试数据准备

### 使用工厂方法

```csharp
public static class TestDataFactory
{
    public static User CreateValidUser(
        string name = "测试用户", 
        string email = "test@example.com")
    {
        return new User(name, email);
    }
    
    public static Order CreateValidOrder(
        string customerName = "测试客户")
    {
        var order = new Order(customerName);
        order.AddItem("产品1", 100m, 1);
        return order;
    }
    
    public static UserId CreateUserId(long value = 123)
    {
        return new UserId(value);
    }
}

// 在测试中使用
[Fact]
public void Test_WithUser()
{
    var user = TestDataFactory.CreateValidUser();
    // 使用 user 进行测试
}
```

### 使用Builder模式

```csharp
public class UserBuilder
{
    private string _name = "默认用户";
    private string _email = "default@example.com";

    public UserBuilder WithName(string name)
    {
        _name = name;
        return this;
    }

    public UserBuilder WithEmail(string email)
    {
        _email = email;
        return this;
    }

    public User Build()
    {
        return new User(_name, _email);
    }
}

// 在测试中使用
[Fact]
public void Test_WithCustomUser()
{
    var user = new UserBuilder()
        .WithName("张三")
        .WithEmail("zhangsan@example.com")
        .Build();
    // 使用 user 进行测试
}
```

## 时间相关测试

处理时间敏感的测试时：

```csharp
[Fact]
public void UpdateEmail_ShouldUpdateTimestamp()
{
    // Arrange
    var user = new User("张三", "old@example.com");
    var originalUpdateTime = user.UpdateTime;
    
    // 确保时间差异
    Thread.Sleep(1);

    // Act
    user.UpdateEmail("new@example.com");

    // Assert
    Assert.Equal("new@example.com", user.Email);
    Assert.True(user.UpdateTime >= originalUpdateTime); // 使用 >= 而不是 >
}
```

## 测试覆盖率目标

- **Domain层**: 90%+ 覆盖率（核心业务逻辑）
- **Application层**: 70%+ 覆盖率（命令、查询处理器）
- **Infrastructure层**: 50%+ 覆盖率（仓储实现）
- **Endpoints层**: 60%+ 覆盖率（API端点）

## 常见测试模式

### 1. 测试不变量

确保聚合根的业务规则始终满足：

```csharp
[Fact]
public void Order_TotalAmount_ShouldEqualSumOfItems()
{
    var order = new Order("客户");
    order.AddItem("产品1", 100m, 2); // 200
    order.AddItem("产品2", 50m, 3);  // 150
    
    Assert.Equal(350m, order.TotalAmount);
}
```

### 2. 测试状态转换

验证状态变化的正确性：

```csharp
[Fact]
public void Order_Confirm_ShouldChangeStatusToPending()
{
    var order = new Order("客户");
    Assert.Equal(OrderStatus.Draft, order.Status);
    
    order.Confirm();
    Assert.Equal(OrderStatus.Pending, order.Status);
}
```

### 3. 测试边界条件

测试输入的边界值：

```csharp
[Theory]
[InlineData(0)]
[InlineData(-1)]
[InlineData(-100)]
public void Product_SetPrice_WithNegativeOrZero_ShouldThrowException(decimal price)
{
    var product = new Product("产品", 100m);
    Assert.Throws<KnownException>(() => product.SetPrice(price));
}
```

### 4. 测试异常场景

确保异常情况得到正确处理：

```csharp
[Fact]
public void Order_Pay_WithUnconfirmedOrder_ShouldThrowException()
{
    var order = new Order("客户");
    Assert.Throws<KnownException>(() => order.Pay(100m, "支付宝"));
}
```

### 5. 测试事件发布

验证领域事件在正确时机发布：

```csharp
[Fact]
public void Order_Confirm_ShouldPublishOrderConfirmedEvent()
{
    var order = new Order("客户");
    order.ClearDomainEvents();
    
    order.Confirm();
    
    var events = order.GetDomainEvents();
    Assert.Single(events);
    Assert.IsType<OrderConfirmedDomainEvent>(events.First());
}
```

## 测试工具推荐

### 单元测试框架
- **xUnit**: 推荐的.NET测试框架
- **NUnit**: 另一个流行选择

### Mock框架
- **Moq**: 轻量级mock框架
- **NSubstitute**: 更简洁的语法

### 断言库
- **FluentAssertions**: 流畅的断言语法
- **Shouldly**: 更自然的断言表达

### 代码覆盖率
- **Coverlet**: .NET Core覆盖率工具
- **ReportGenerator**: 生成覆盖率报告

## 最佳实践总结

1. **测试金字塔**: 大量单元测试，适量集成测试，少量E2E测试
2. **AAA模式**: 所有测试遵循Arrange-Act-Assert模式
3. **清晰命名**: 测试名称应该表达测试意图
4. **单一职责**: 每个测试只测试一个行为
5. **独立性**: 测试之间应该相互独立
6. **可重复**: 测试结果应该是确定的和可重复的
7. **快速执行**: 单元测试应该快速运行
8. **有意义**: 测试应该验证真实的业务场景

## 相关文档

- [单元测试开发指南](../development-guide/unit-testing.md)
- [聚合开发指南](../development-guide/aggregate-development.md)
- [命令开发指南](../development-guide/command-development.md)
- [查询开发指南](../development-guide/query-development.md)
