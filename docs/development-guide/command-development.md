# 命令开发指南

## 什么是命令？

命令表示用户想要执行的操作，遵循 CQRS 模式。本模板使用 MediatR 库实现命令处理，所有命令处理器会被框架自动注册。

## 命令文件应该放在哪里？

类文件命名应遵循以下规则：

- 应放置在 `src/{ProjectName}.Web/Application/Commands/{Module}/` 目录下
- 命令文件名格式为 `{Action}{Entity}Command.cs`
- 同一个命令及其对应的验证器和处理器定义在同一文件中
- 不同的命令放在不同文件中

## 如何定义命令？

命令的定义应遵循以下规则：

- 无返回值命令实现 `ICommand` 接口
- 有返回值命令实现 `ICommand<TResponse>` 接口
- 必须为每个命令创建验证器，继承 `AbstractValidator<TCommand>`
- 命令处理器实现对应的 `ICommandHandler` 接口
- 使用 `record` 类型定义命令
- 框架自动注册命令处理器

## 命令处理器有哪些最佳实践？

### 如何管理事务？

- **不要手动调用SaveChanges**: 框架会自动在命令处理完成后调用SaveChanges
- **依赖UnitOfWork模式**: 让框架管理事务边界

### 如何使用仓储方法？

- **仅用于业务操作**: 仓储方法只在需要获取聚合根进行业务操作时使用
- **优先使用异步方法**: 所有仓储操作都应使用异步版本
- **正确的取消令牌传递**: 将CancellationToken传递给所有异步操作
- **体现业务意图**: 仓储方法名应该反映业务场景，而不是通用数据访问

### 数据访问有什么原则？

- 命令处理器使用仓储获取聚合根进行业务操作
- 如果只是为了检查数据存在性，考虑是否需要完整的聚合根
- 避免在命令处理器中进行复杂的查询操作

## 需要引用哪些命名空间？

命令文件中的必要引用已在GlobalUsings.cs中定义：

- `global using FluentValidation;` - 用于验证器
- `global using MediatR;` - 用于命令处理器接口
- `global using NetCorePal.Extensions.Primitives;` - 用于KnownException等

命令处理器中常需手动添加的引用：

- `using {ProjectName}.Domain.AggregatesModel.{Aggregate};` - 聚合根引用
- `using {ProjectName}.Infrastructure.Repositories;` - 仓储接口引用

因此在命令文件中无需重复添加GlobalUsings中已定义的using语句。

## 如何编写创建命令？

### 创建命令示例

**文件**: `src/MyProject.Web/Application/Commands/User/CreateUserCommand.cs`

```csharp
using MyProject.Domain.AggregatesModel.UserAggregate;
using MyProject.Infrastructure.Repositories;

namespace MyProject.Web.Application.Commands.User;

public record CreateUserCommand(string Name, string Email) : ICommand<UserId>;

public class CreateUserCommandValidator : AbstractValidator<CreateUserCommand>
{
    public CreateUserCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("用户名不能为空")
            .MaximumLength(50)
            .WithMessage("用户名不能超过50个字符");
            
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("邮箱不能为空")
            .EmailAddress()
            .WithMessage("邮箱格式不正确")
            .MaximumLength(100)
            .WithMessage("邮箱不能超过100个字符");
    }
}

public class CreateUserCommandHandler(IUserRepository userRepository)
    : ICommandHandler<CreateUserCommand, UserId>
{
    public async Task<UserId> Handle(CreateUserCommand command, CancellationToken cancellationToken)
    {
        if (await userRepository.EmailExistsAsync(command.Email, cancellationToken))
        {
            throw new KnownException("邮箱已存在");
        }
        
        var user = new User(command.Name, command.Email);
        await userRepository.AddAsync(user, cancellationToken);
        return user.Id;
    }
}
```

### 如何编写更新命令？

**文件**: `src/MyProject.Web/Application/Commands/User/UpdateUserEmailCommand.cs`

```csharp
using MyProject.Domain.AggregatesModel.UserAggregate;
using MyProject.Infrastructure.Repositories;

namespace MyProject.Web.Application.Commands.User;

public record UpdateUserEmailCommand(UserId UserId, string Email) : ICommand;

public class UpdateUserEmailCommandValidator : AbstractValidator<UpdateUserEmailCommand>
{
    public UpdateUserEmailCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("用户ID不能为空");
            
        RuleFor(x => x.Email)
            .NotEmpty()
            .WithMessage("邮箱不能为空")
            .EmailAddress()
            .WithMessage("邮箱格式不正确");
    }
}

public class UpdateUserEmailCommandHandler(IUserRepository userRepository)
    : ICommandHandler<UpdateUserEmailCommand>
{
    public async Task Handle(UpdateUserEmailCommand command, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetAsync(command.UserId, cancellationToken) ??
                   throw new KnownException($"未找到用户，UserId = {command.UserId}");
        
        if (await userRepository.EmailExistsAsync(command.Email, cancellationToken))
        {
            throw new KnownException("邮箱已被使用");
        }
        
        user.ChangeEmail(command.Email);
        // 框架会自动调用 SaveChanges
    }
}
```

### 如何编写删除命令？

**文件**: `src/MyProject.Web/Application/Commands/User/DeleteUserCommand.cs`

```csharp
using MyProject.Domain.AggregatesModel.UserAggregate;
using MyProject.Infrastructure.Repositories;

namespace MyProject.Web.Application.Commands.User;

public record DeleteUserCommand(UserId UserId) : ICommand;

public class DeleteUserCommandValidator : AbstractValidator<DeleteUserCommand>
{
    public DeleteUserCommandValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("用户ID不能为空");
    }
}

public class DeleteUserCommandHandler(IUserRepository userRepository)
    : ICommandHandler<DeleteUserCommand>
{
    public async Task Handle(DeleteUserCommand command, CancellationToken cancellationToken)
    {
        var user = await userRepository.GetAsync(command.UserId, cancellationToken) ??
                   throw new KnownException($"未找到用户，UserId = {command.UserId}");
        
        user.Delete();
        // 框架会自动调用 SaveChanges
    }
}
```

## 命令处理器的正确和错误写法是什么？

### ❌ 错误的做法

```csharp
public async Task<UserId> Handle(CreateUserCommand request, CancellationToken cancellationToken)
{
    var user = new User(request.Name, request.Email);
    
    userRepository.Add(user); // 应该使用异步方法
    await userRepository.UnitOfWork.SaveChangesAsync(cancellationToken); // 不应手动调用
    
    return user.Id;
}
```

### ✅ 正确的做法

```csharp
public async Task<UserId> Handle(CreateUserCommand request, CancellationToken cancellationToken)
{
    var user = new User(request.Name, request.Email);
    
    await userRepository.AddAsync(user, cancellationToken); // 使用异步方法
    // 框架会自动调用SaveChanges
    
    return user.Id;
}
```

## 验证器有哪些最佳实践？

### 如何编写基本验证规则？

```csharp
public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        // 必填验证
        RuleFor(x => x.CustomerName)
            .NotEmpty()
            .WithMessage("客户名称不能为空");
        
        // 长度验证
        RuleFor(x => x.CustomerName)
            .MaximumLength(100)
            .WithMessage("客户名称不能超过100个字符");
        
        // 范围验证
        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("数量必须大于0")
            .LessThanOrEqualTo(1000)
            .WithMessage("数量不能超过1000");
        
        // 正则表达式验证
        RuleFor(x => x.Phone)
            .Matches(@"^1[3-9]\d{9}$")
            .WithMessage("手机号格式不正确");
        
        // 自定义验证
        RuleFor(x => x.Email)
            .Must(BeUniqueEmail)
            .WithMessage("邮箱已存在");
    }
    
    private bool BeUniqueEmail(string email)
    {
        // 实现唯一性检查逻辑
        return true;
    }
}
```

### 如何验证复杂对象？

```csharp
public record CreateOrderCommand(
    string CustomerName,
    List<OrderItemDto> Items) : ICommand<OrderId>;

public record OrderItemDto(string ProductName, decimal Price, int Quantity);

public class CreateOrderCommandValidator : AbstractValidator<CreateOrderCommand>
{
    public CreateOrderCommandValidator()
    {
        RuleFor(x => x.CustomerName)
            .NotEmpty()
            .WithMessage("客户名称不能为空");
        
        // 验证集合
        RuleFor(x => x.Items)
            .NotEmpty()
            .WithMessage("订单项不能为空");
        
        // 验证集合中的每一项
        RuleForEach(x => x.Items)
            .SetValidator(new OrderItemDtoValidator());
    }
}

public class OrderItemDtoValidator : AbstractValidator<OrderItemDto>
{
    public OrderItemDtoValidator()
    {
        RuleFor(x => x.ProductName)
            .NotEmpty()
            .WithMessage("产品名称不能为空");
        
        RuleFor(x => x.Price)
            .GreaterThan(0)
            .WithMessage("价格必须大于0");
        
        RuleFor(x => x.Quantity)
            .GreaterThan(0)
            .WithMessage("数量必须大于0");
    }
}
```

## 如何处理异常？

### 如何使用KnownException？

在需要抛出业务异常的地方，必须使用 `KnownException` 而不是普通的 `Exception`：

**正确示例：**

```csharp
// 在聚合根中
public void OrderPaid()
{
    if (Paid)
    {
        throw new KnownException("订单已支付");
    }
    // 业务逻辑...
}

// 在命令处理器中
public async Task<OrderId> Handle(OrderPaidCommand request, CancellationToken cancellationToken)
{
    var order = await orderRepository.GetAsync(request.OrderId, cancellationToken) ??
                throw new KnownException($"未找到订单，OrderId = {request.OrderId}");
    order.OrderPaid();
    return order.Id;
}
```

**框架集成：**

- `KnownException` 会被框架自动转换为合适的HTTP状态码
- 异常消息会直接返回给客户端
- 支持本地化和错误码定制

## 遇到常见错误怎么办？

### 为什么验证器未生效？

**错误**: 验证器定义了但没有执行

**原因**: 验证器类名不符合约定或未继承正确的基类

**解决**: 
- 确保验证器继承 `AbstractValidator<TCommand>`
- 验证器类名应为 `{CommandName}Validator`

### 为什么会出现SaveChanges相关错误？

**错误**: 手动调用SaveChanges导致的问题

**原因**: 打破了框架的事务管理机制

**解决**: 移除所有手动的SaveChanges调用，让框架自动处理

### 为什么找不到仓储方法？

**错误**: 找不到仓储中定义的特定方法

**原因**: 仓储接口中未定义需要的方法

**解决**: 在仓储接口中添加需要的方法定义

## 命令开发有哪些最佳实践？

1. **单一职责**: 每个命令只做一件事情
2. **验证完整**: 为每个命令提供完整的验证规则
3. **异步优先**: 所有IO操作都使用异步方法
4. **异常处理**: 使用KnownException处理业务异常
5. **取消令牌**: 正确传递和使用CancellationToken
6. **命名清晰**: 命令名称应该清楚表达业务意图

## 在哪里可以找到相关文档？

- [聚合开发指南](aggregate-development.md)
- [仓储开发指南](repository-development.md)
- [领域事件处理器开发指南](domain-event-handler-development.md)
- [Endpoint开发指南](endpoint-development.md)
