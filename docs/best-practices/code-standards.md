# 代码规范

## 概述

统一的代码规范可以提高代码质量、可读性和可维护性。本文档定义了在DDD和Clean Architecture项目中应遵循的代码标准和最佳实践。

## 代码组织

### 1. 文件结构

每个文件应遵循以下结构顺序：

```csharp
// 1. Using指令（按字母顺序）
using System;
using System.Collections.Generic;
using System.Linq;
using MyProject.Domain.AggregatesModel.UserAggregate;

// 2. 命名空间
namespace MyProject.Web.Application.Commands.User;

// 3. 类型定义
public record CreateUserCommand(string Name, string Email) : ICommand<UserId>;

// 4. 嵌套类型或相关类型
public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    // 实现
}
```

### 2. 类成员顺序

类成员应按以下顺序组织：

```csharp
public class User : Entity<UserId>, IAggregateRoot
{
    // 1. 常量
    private const int MaxNameLength = 100;
    
    // 2. 字段
    private readonly List<UserRole> _roles = new();
    
    // 3. 构造函数
    protected User() { }
    
    public User(string name, string email)
    {
        // 实现
    }
    
    // 4. 属性
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    
    // 5. 公共方法
    public void ChangeEmail(string email)
    {
        // 实现
    }
    
    // 6. 私有方法
    private void ValidateEmail(string email)
    {
        // 实现
    }
}
```

## 代码格式

### 1. 缩进和空格

- 使用4个空格缩进（不使用Tab）
- 大括号独占一行（Allman风格）
- 运算符两侧添加空格

```csharp
// ✅ 正确
public void ProcessOrder(Order order)
{
    if (order.Status == OrderStatus.Pending)
    {
        order.Confirm();
    }
}

// ❌ 错误
public void ProcessOrder(Order order){
    if(order.Status==OrderStatus.Pending){
        order.Confirm();
    }
}
```

### 2. 行长度

- 建议每行不超过120个字符
- 长语句应该合理换行

```csharp
// ✅ 好的换行
var user = await userRepository.GetByEmailAsync(
    email, 
    cancellationToken) 
    ?? throw new KnownException("用户不存在");

// 方法参数换行
public void CreateOrder(
    string customerName,
    string shippingAddress,
    List<OrderItem> items)
{
    // 实现
}
```

### 3. 空行使用

- 方法之间添加一个空行
- 逻辑块之间添加一个空行
- 类成员组之间添加一个空行

```csharp
public class User : Entity<UserId>, IAggregateRoot
{
    // 属性组
    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    
    // 构造函数组
    protected User() { }
    
    public User(string name, string email)
    {
        Name = name;
        Email = email;
    }
    
    // 方法组
    public void ChangeEmail(string email)
    {
        // 验证逻辑
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new KnownException("邮箱不能为空");
        }
        
        // 业务逻辑
        Email = email;
        this.AddDomainEvent(new UserEmailChangedDomainEvent(this));
    }
}
```

## 注释规范

### 1. XML文档注释

公共API应该添加XML文档注释：

```csharp
/// <summary>
/// 根据邮箱获取用户
/// </summary>
/// <param name="email">邮箱地址</param>
/// <param name="cancellationToken">取消令牌</param>
/// <returns>用户实体，如果不存在则返回null</returns>
/// <exception cref="ArgumentNullException">当邮箱为null时抛出</exception>
public async Task<User?> GetByEmailAsync(
    string email, 
    CancellationToken cancellationToken = default)
{
    // 实现
}
```

### 2. 代码注释

- 注释应该解释"为什么"而不是"是什么"
- 避免冗余注释
- 复杂逻辑需要添加注释

```csharp
// ✅ 好的注释
// 需要延迟1ms确保时间戳不同
Thread.Sleep(1);

// 使用乐观并发控制防止并发冲突
public RowVersion RowVersion { get; private set; }

// ❌ 不好的注释
// 设置用户名
user.Name = name;

// 调用保存方法
await repository.SaveAsync(user);
```

### 3. TODO注释

使用标准格式的TODO注释：

```csharp
// TODO: 实现邮件发送功能
// TODO(张三): 需要优化查询性能
// FIXME: 修复并发问题
// HACK: 临时解决方案，需要重构
```

## 命名规范简要

详细命名规范请参考[命名规范文档](naming-conventions.md)。

### 关键要点

- 类、方法、属性使用PascalCase
- 局部变量、参数使用camelCase
- 私有字段使用_camelCase
- 接口使用I前缀
- 异步方法使用Async后缀

## SOLID原则

### 1. 单一职责原则 (SRP)

每个类应该只有一个职责：

```csharp
// ✅ 好的设计 - 职责单一
public class User : Entity<UserId>, IAggregateRoot
{
    // 只负责用户相关的业务逻辑
}

public class UserRepository : IUserRepository
{
    // 只负责用户的数据访问
}

public class CreateUserCommandHandler : ICommandHandler<CreateUserCommand, UserId>
{
    // 只负责处理创建用户命令
}

// ❌ 不好的设计 - 职责混乱
public class UserService
{
    // 既处理业务逻辑，又处理数据访问，还发送邮件
}
```

### 2. 开闭原则 (OCP)

对扩展开放，对修改关闭：

```csharp
// ✅ 好的设计 - 通过扩展添加新功能
public interface INotificationService
{
    Task SendAsync(string message);
}

public class EmailNotificationService : INotificationService { }
public class SmsNotificationService : INotificationService { }
public class WeChatNotificationService : INotificationService { }
```

### 3. 里氏替换原则 (LSP)

子类应该能够替换父类：

```csharp
// ✅ 正确实现
public abstract class Entity<TId>
{
    public TId Id { get; protected set; }
}

public class User : Entity<UserId>
{
    // 可以安全地替换Entity<UserId>
}
```

### 4. 接口隔离原则 (ISP)

不应该强迫客户端依赖它不使用的方法：

```csharp
// ✅ 好的设计 - 接口细分
public interface IRepository<TEntity, TKey>
{
    Task<TEntity?> GetAsync(TKey id);
    Task<TEntity> AddAsync(TEntity entity);
}

public interface IUserRepository : IRepository<User, UserId>
{
    Task<User?> GetByEmailAsync(string email);
}

// ❌ 不好的设计 - 臃肿的接口
public interface IRepository
{
    Task<T?> GetAsync<T>(int id);
    Task<T?> GetByEmailAsync<T>(string email);
    Task<List<T>> GetAllAsync<T>();
    // ... 更多不是所有仓储都需要的方法
}
```

### 5. 依赖倒置原则 (DIP)

高层模块不应该依赖低层模块，都应该依赖抽象：

```csharp
// ✅ 好的设计 - 依赖抽象
public class CreateUserCommandHandler(IUserRepository userRepository)
    : ICommandHandler<CreateUserCommand, UserId>
{
    // 依赖IUserRepository接口，而不是具体实现
}

// ❌ 不好的设计 - 依赖具体实现
public class CreateUserCommandHandler(UserRepository userRepository)
{
    // 直接依赖具体实现
}
```

## DDD最佳实践

### 1. 聚合边界

保持聚合边界小而清晰：

```csharp
// ✅ 好的聚合 - 边界清晰
public class Order : Entity<OrderId>, IAggregateRoot
{
    private readonly List<OrderItem> _orderItems = new();
    
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();
    
    public void AddItem(string productName, decimal price, int quantity)
    {
        var item = new OrderItem(productName, price, quantity);
        _orderItems.Add(item);
    }
}

// ❌ 不好的聚合 - 边界模糊
public class Order : Entity<OrderId>, IAggregateRoot
{
    public Customer Customer { get; set; } // 不应该包含其他聚合根
    public List<Product> Products { get; set; } // 不应该包含其他聚合根
}
```

### 2. 不变性保护

使用private set保护不变性：

```csharp
// ✅ 正确
public class User : Entity<UserId>, IAggregateRoot
{
    public string Name { get; private set; } = string.Empty;
    
    public void ChangeName(string name)
    {
        if (string.IsNullOrWhiteSpace(name))
        {
            throw new KnownException("名称不能为空");
        }
        
        Name = name;
        this.AddDomainEvent(new UserNameChangedDomainEvent(this));
    }
}

// ❌ 错误 - 允许直接修改
public class User : Entity<UserId>, IAggregateRoot
{
    public string Name { get; set; } = string.Empty;
}
```

### 3. 领域事件发布

在状态变更时发布领域事件：

```csharp
public void ChangeEmail(string email)
{
    // 1. 验证
    if (string.IsNullOrWhiteSpace(email))
    {
        throw new KnownException("邮箱不能为空");
    }
    
    // 2. 状态变更
    Email = email;
    
    // 3. 发布事件
    this.AddDomainEvent(new UserEmailChangedDomainEvent(this));
}
```

## 异常处理

### 1. 使用KnownException处理业务异常

```csharp
// ✅ 正确
if (order.Status != OrderStatus.Pending)
{
    throw new KnownException("只有待处理的订单可以被确认");
}

// ❌ 错误
if (order.Status != OrderStatus.Pending)
{
    throw new Exception("只有待处理的订单可以被确认");
}
```

### 2. 提供清晰的异常消息

```csharp
// ✅ 好的异常消息
throw new KnownException($"未找到用户，UserId = {userId}");
throw new KnownException("邮箱已被使用");
throw new KnownException("订单金额不能为负数");

// ❌ 不好的异常消息
throw new KnownException("错误");
throw new KnownException("失败");
```

### 3. 不要捕获并忽略异常

```csharp
// ❌ 错误 - 吞掉异常
try
{
    await SendEmailAsync(email);
}
catch
{
    // 什么都不做
}

// ✅ 正确 - 记录异常或重新抛出
try
{
    await SendEmailAsync(email);
}
catch (Exception ex)
{
    _logger.LogError(ex, "发送邮件失败");
    throw;
}
```

## 异步编程

### 1. 始终使用异步方法

```csharp
// ✅ 正确
public async Task<User?> GetUserAsync(UserId userId)
{
    return await _context.Users.FindAsync(userId);
}

// ❌ 错误 - 阻塞调用
public User? GetUser(UserId userId)
{
    return _context.Users.Find(userId);
}
```

### 2. 传递CancellationToken

```csharp
// ✅ 正确
public async Task<User?> GetAsync(
    UserId userId, 
    CancellationToken cancellationToken = default)
{
    return await _context.Users
        .FindAsync(new object[] { userId }, cancellationToken);
}

// ❌ 错误 - 没有传递取消令牌
public async Task<User?> GetAsync(UserId userId)
{
    return await _context.Users.FindAsync(userId);
}
```

### 3. 避免async void

```csharp
// ✅ 正确
public async Task ProcessAsync()
{
    await DoSomethingAsync();
}

// ❌ 错误 - 除了事件处理器
public async void ProcessAsync()
{
    await DoSomethingAsync();
}
```

## LINQ使用

### 1. 使用方法语法

```csharp
// ✅ 推荐 - 方法语法
var users = await _context.Users
    .Where(u => u.IsActive)
    .OrderBy(u => u.Name)
    .ToListAsync();

// 也可以 - 查询语法（复杂查询时）
var users = await (
    from u in _context.Users
    where u.IsActive
    orderby u.Name
    select u
).ToListAsync();
```

### 2. 使用投影优化性能

```csharp
// ✅ 好 - 使用投影
var userDtos = await _context.Users
    .Select(u => new UserDto(u.Id, u.Name, u.Email))
    .ToListAsync();

// ❌ 不好 - 查询完整实体然后映射
var users = await _context.Users.ToListAsync();
var userDtos = users.Select(u => new UserDto(u.Id, u.Name, u.Email));
```

## 资源管理

### 1. 使用using语句

```csharp
// ✅ 正确
using var connection = new SqlConnection(connectionString);
await connection.OpenAsync();

// ✅ 也正确
using (var connection = new SqlConnection(connectionString))
{
    await connection.OpenAsync();
}
```

### 2. 依赖注入生命周期

正确选择服务生命周期：

- **Singleton**: 无状态服务
- **Scoped**: DbContext、仓储
- **Transient**: 轻量级无状态服务

```csharp
// Program.cs
builder.Services.AddSingleton<ICacheService, CacheService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddTransient<IEmailService, EmailService>();
```

## 性能最佳实践

### 1. 避免N+1查询

```csharp
// ✅ 好 - 使用Include
var orders = await _context.Orders
    .Include(o => o.OrderItems)
    .ToListAsync();

// ❌ 不好 - N+1查询
var orders = await _context.Orders.ToListAsync();
foreach (var order in orders)
{
    var items = await _context.OrderItems
        .Where(i => i.OrderId == order.Id)
        .ToListAsync();
}
```

### 2. 使用AsNoTracking

```csharp
// ✅ 查询不需要跟踪
var users = await _context.Users
    .AsNoTracking()
    .ToListAsync();
```

### 3. 批量操作

```csharp
// ✅ 好 - 批量添加
await _context.Users.AddRangeAsync(users);
await _context.SaveChangesAsync();

// ❌ 不好 - 逐个添加
foreach (var user in users)
{
    await _context.Users.AddAsync(user);
    await _context.SaveChangesAsync();
}
```

## 测试编写

### 1. 遵循AAA模式

```csharp
[Fact]
public void User_Constructor_ShouldCreateValidUser()
{
    // Arrange - 准备
    var name = "张三";
    var email = "test@example.com";
    
    // Act - 执行
    var user = new User(name, email);
    
    // Assert - 断言
    Assert.Equal(name, user.Name);
    Assert.Equal(email, user.Email);
}
```

### 2. 清晰的测试命名

```csharp
// ✅ 好的命名
[Fact]
public void ChangeEmail_WithValidEmail_ShouldUpdateEmail() { }

[Fact]
public void ChangeEmail_WithInvalidEmail_ShouldThrowException() { }

// ❌ 不好的命名
[Fact]
public void Test1() { }

[Fact]
public void TestChangeEmail() { }
```

## 安全最佳实践

### 1. 验证输入

```csharp
public void ChangeEmail(string email)
{
    if (string.IsNullOrWhiteSpace(email))
    {
        throw new KnownException("邮箱不能为空");
    }
    
    if (!IsValidEmail(email))
    {
        throw new KnownException("邮箱格式不正确");
    }
    
    Email = email;
}
```

### 2. 不要在代码中硬编码敏感信息

```csharp
// ❌ 错误
var connectionString = "Server=localhost;Database=MyDb;User=sa;Password=123456;";

// ✅ 正确
var connectionString = configuration.GetConnectionString("DefaultConnection");
```

### 3. 使用参数化查询

EF Core默认使用参数化查询，避免SQL注入。

## EditorConfig配置

项目应该包含`.editorconfig`文件：

```ini
# 顶级EditorConfig文件
root = true

# 所有文件
[*]
charset = utf-8
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

# C#文件
[*.cs]
indent_size = 4

# .NET代码风格规则
dotnet_sort_system_directives_first = true
dotnet_separate_import_directive_groups = false

# C#代码风格规则
csharp_new_line_before_open_brace = all
csharp_new_line_before_else = true
csharp_new_line_before_catch = true
csharp_new_line_before_finally = true
```

## 代码审查检查清单

在提交代码前，检查：

- [ ] 是否遵循命名规范？
- [ ] 是否遵循代码格式规范？
- [ ] 是否有适当的注释？
- [ ] 是否有单元测试？
- [ ] 是否处理了异常情况？
- [ ] 是否有性能问题？
- [ ] 是否有安全问题？
- [ ] 是否遵循SOLID原则？
- [ ] 是否符合DDD设计原则？

## 工具推荐

- **StyleCop**: 代码风格检查
- **SonarLint**: 代码质量检查
- **ReSharper**: 代码分析和重构
- **CodeMaid**: 代码清理

## 相关文档

- [命名规范](naming-conventions.md)
- [项目结构](project-structure.md)
- [测试策略](testing-strategy.md)
- [开发工具推荐](../tools/development-tools.md)
