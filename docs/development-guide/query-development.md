# 查询开发指南

## 概述

查询负责数据检索，遵循CQRS模式。查询应该是无副作用的，只读取数据不修改状态。本模板使用 MediatR 库实现查询处理，所有查询处理器会被框架自动注册。

## 重要设计原则

**查询 vs 仓储的职责分离：**

- **查询处理器**：用于纯粹的数据读取，应该直接访问DbContext
- **仓储方法**：只用于命令处理器中需要获取聚合进行业务操作的场景

**查询设计指导：**

- 查询是为了展示数据，不涉及业务逻辑 → 直接使用DbContext
- 查询可以跨聚合、跨表进行复杂的数据组合
- 查询可以使用投影(Projection)和匿名类型优化性能
- 避免在查询中调用仓储方法

## 文件与目录

类文件命名应遵循以下规则：

- 应放置在 `src/{ProjectName}.Web/Application/Queries/{Module}/` 目录下
- 查询文件名格式为 `{Action}{Entity}Query.cs`
- 查询、验证器、处理器和DTO定义在同一文件中

## 开发规则

查询的定义应遵循以下规则：

- 查询实现 `IQuery<TResponse>` 接口
- 必须为每个查询创建验证器，继承 `AbstractValidator<TQuery>`
- 查询处理器实现 `IQueryHandler<TQuery, TResponse>` 接口
- 使用 `record` 类型定义查询和DTO
- 直接使用ApplicationDbContext进行数据访问

## 查询处理器最佳实践

### 数据访问

- **直接访问DbContext**: 查询处理器应直接注入和使用ApplicationDbContext
- **避免使用仓储**: 仓储方法仅用于命令处理器的业务操作
- **优化查询性能**: 使用投影(Select)、过滤(WhereIf)、排序(OrderByIf)、分页(ToPagedDataAsync)等优化性能
- **异步操作**: 所有数据库操作都应使用异步版本
- **正确的取消令牌传递**: 将CancellationToken传递给所有异步操作
- **只读操作**: 查询不应修改任何数据状态

### 条件查询最佳实践

- **使用WhereIf**: 根据条件动态添加过滤条件，避免繁琐的if-else判断
- **使用OrderByIf/ThenByIf**: 根据参数动态排序，支持多字段排序
- **使用ToPagedDataAsync**: 自动处理分页逻辑，返回完整的分页信息
- **确保默认排序**: 在动态排序时始终提供默认排序字段，确保结果稳定性

## 必要的using引用

查询文件中的必要引用已在GlobalUsings.cs中定义：

- `global using FluentValidation;` - 用于验证器
- `global using MediatR;` - 用于查询处理器接口
- `global using NetCorePal.Extensions.Primitives;` - 用于KnownException等
- `global using NetCorePal.Extensions.AspNetCore;` - 用于ToPagedDataAsync、WhereIf、OrderByIf等扩展方法

**分页查询额外需要的引用**：

```csharp
using Microsoft.EntityFrameworkCore; // 用于EF Core扩展方法(FirstOrDefaultAsync, ToListAsync等)
```

## 代码示例

### 单个对象查询示例

**文件**: `src/MyProject.Web/Application/Queries/User/GetUserQuery.cs`

```csharp
using MyProject.Domain.AggregatesModel.UserAggregate;
using MyProject.Infrastructure;
using Microsoft.EntityFrameworkCore; // 必需：用于EF Core扩展方法

namespace MyProject.Web.Application.Queries.User;

public record GetUserQuery(UserId UserId) : IQuery<UserDto>;

public class GetUserQueryValidator : AbstractValidator<GetUserQuery>
{
    public GetUserQueryValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty()
            .WithMessage("用户ID不能为空");
    }
}

public class GetUserQueryHandler(ApplicationDbContext context) 
    : IQueryHandler<GetUserQuery, UserDto>
{
    public async Task<UserDto> Handle(GetUserQuery request, CancellationToken cancellationToken)
    {
        var user = await context.Users
            .Where(x => x.Id == request.UserId)
            .Select(x => new UserDto(x.Id, x.Name, x.Email))
            .FirstOrDefaultAsync(cancellationToken) ??
            throw new KnownException($"未找到用户，UserId = {request.UserId}");

        return user;
    }
}

public record UserDto(UserId Id, string Name, string Email);
```

### 分页查询示例

**文件**: `src/MyProject.Web/Application/Queries/User/GetUserListQuery.cs`

```csharp
using MyProject.Domain.AggregatesModel.UserAggregate;
using MyProject.Infrastructure;
using Microsoft.EntityFrameworkCore; // 必需：用于EF Core扩展方法

namespace MyProject.Web.Application.Queries.User;

public record GetUserListQuery(
    int PageIndex = 1, 
    int PageSize = 20, 
    string? SearchName = null, 
    string? SortBy = null, 
    bool Desc = false) : IQuery<PagedData<UserListItemDto>>;

public class GetUserListQueryValidator : AbstractValidator<GetUserListQuery>
{
    public GetUserListQueryValidator()
    {
        RuleFor(x => x.PageIndex)
            .GreaterThan(0)
            .WithMessage("页码必须大于0");

        RuleFor(x => x.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(100)
            .WithMessage("每页大小必须在1-100之间");
    }
}

public class GetUserListQueryHandler(ApplicationDbContext context) 
    : IQueryHandler<GetUserListQuery, PagedData<UserListItemDto>>
{
    public async Task<PagedData<UserListItemDto>> Handle(
        GetUserListQuery request, 
        CancellationToken cancellationToken)
    {
        var query = context.Users.AsQueryable();
        
        // 使用 WhereIf 进行条件过滤
        query = query.WhereIf(
            !string.IsNullOrWhiteSpace(request.SearchName), 
            x => x.Name.Contains(request.SearchName!));

        // 使用 OrderByIf 进行条件排序
        var orderedQuery = query
            .OrderByIf(request.SortBy == "name", x => x.Name, request.Desc)
            .ThenByIf(request.SortBy == "email", x => x.Email, request.Desc)
            .ThenByIf(string.IsNullOrEmpty(request.SortBy), x => x.Id); // 默认排序

        // 使用 ToPagedDataAsync 进行分页
        return await orderedQuery
            .Select(u => new UserListItemDto(u.Id, u.Name, u.Email))
            .ToPagedDataAsync(
                request.PageIndex, 
                request.PageSize, 
                cancellationToken: cancellationToken);
    }
}

public record UserListItemDto(UserId Id, string Name, string Email);
```

### 跨聚合查询示例

**文件**: `src/MyProject.Web/Application/Queries/Order/GetOrderDetailQuery.cs`

```csharp
using MyProject.Domain.AggregatesModel.OrderAggregate;
using MyProject.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace MyProject.Web.Application.Queries.Order;

public record GetOrderDetailQuery(OrderId OrderId) : IQuery<OrderDetailDto>;

public class GetOrderDetailQueryValidator : AbstractValidator<GetOrderDetailQuery>
{
    public GetOrderDetailQueryValidator()
    {
        RuleFor(x => x.OrderId)
            .NotEmpty()
            .WithMessage("订单ID不能为空");
    }
}

public class GetOrderDetailQueryHandler(ApplicationDbContext context) 
    : IQueryHandler<GetOrderDetailQuery, OrderDetailDto>
{
    public async Task<OrderDetailDto> Handle(
        GetOrderDetailQuery request, 
        CancellationToken cancellationToken)
    {
        // 跨聚合查询，包含订单和订单项
        var order = await context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.Id == request.OrderId)
            .Select(o => new OrderDetailDto(
                o.Id,
                o.CustomerName,
                o.OrderStatus.ToString(),
                o.OrderItems.Select(i => new OrderItemDto(
                    i.Id,
                    i.ProductName,
                    i.Price,
                    i.Quantity
                )).ToList()
            ))
            .FirstOrDefaultAsync(cancellationToken) ??
            throw new KnownException($"未找到订单，OrderId = {request.OrderId}");

        return order;
    }
}

public record OrderDetailDto(
    OrderId Id,
    string CustomerName,
    string Status,
    List<OrderItemDto> Items);

public record OrderItemDto(
    OrderItemId Id,
    string ProductName,
    decimal Price,
    int Quantity);
```

## 框架扩展方法

### WhereIf - 条件过滤

使用 `WhereIf` 方法可以根据条件动态添加 Where 子句，避免编写冗长的条件判断代码：

```csharp
// 传统写法
var query = context.Users.AsQueryable();
if (!string.IsNullOrWhiteSpace(searchName))
{
    query = query.Where(x => x.Name.Contains(searchName));
}
if (isActive.HasValue)
{
    query = query.Where(x => x.IsActive == isActive.Value);
}

// 使用 WhereIf 的简化写法
var query = context.Users
    .WhereIf(!string.IsNullOrWhiteSpace(searchName), x => x.Name.Contains(searchName!))
    .WhereIf(isActive.HasValue, x => x.IsActive == isActive!.Value);
```

### OrderByIf / ThenByIf - 条件排序

使用 `OrderByIf` 和 `ThenByIf` 方法可以根据条件动态添加排序：

```csharp
// 复杂的动态排序示例
var orderedQuery = context.Users
    .OrderByIf(sortBy == "name", x => x.Name, desc)
    .ThenByIf(sortBy == "email", x => x.Email, desc)
    .ThenByIf(sortBy == "createTime", x => x.CreateTime, desc)
    .ThenByIf(string.IsNullOrEmpty(sortBy), x => x.Id); // 默认排序

// 参数说明：
// - condition: 条件表达式，为 true 时才应用排序
// - predicate: 排序字段表达式
// - desc: 可选参数，是否降序排序，默认为 false（升序）
```

### ToPagedDataAsync - 分页数据

使用 `ToPagedDataAsync` 方法可以自动处理分页逻辑，返回 `PagedData<T>` 类型：

```csharp
// 基本分页用法 - 默认会查询总数
var pagedResult = await query
    .Select(u => new UserListItemDto(u.Id, u.Name, u.Email))
    .ToPagedDataAsync(pageIndex, pageSize, cancellationToken: cancellationToken);

// 性能优化版本 - 不查询总数（适用于不需要显示总页数的场景）
var pagedResult = await query
    .Select(u => new UserListItemDto(u.Id, u.Name, u.Email))
    .ToPagedDataAsync(pageIndex, pageSize, countTotal: false, cancellationToken);

// PagedData<T> 包含以下属性：
// - Items: IEnumerable<T> - 当前页数据
// - Total: int - 总记录数
// - PageIndex: int - 当前页码
// - PageSize: int - 每页大小
```

## 完整的分页查询示例

```csharp
public class GetProductListQueryHandler(ApplicationDbContext context) 
    : IQueryHandler<GetProductListQuery, PagedData<ProductListItemDto>>
{
    public async Task<PagedData<ProductListItemDto>> Handle(
        GetProductListQuery request, 
        CancellationToken cancellationToken)
    {
        return await context.Products
            // 条件过滤
            .WhereIf(!string.IsNullOrWhiteSpace(request.Name), x => x.Name.Contains(request.Name!))
            .WhereIf(request.CategoryId.HasValue, x => x.CategoryId == request.CategoryId!.Value)
            .WhereIf(request.MinPrice.HasValue, x => x.Price >= request.MinPrice!.Value)
            .WhereIf(request.MaxPrice.HasValue, x => x.Price <= request.MaxPrice!.Value)
            .WhereIf(request.IsActive.HasValue, x => x.IsActive == request.IsActive!.Value)
            // 动态排序
            .OrderByIf(request.SortBy == "name", x => x.Name, request.Desc)
            .ThenByIf(request.SortBy == "price", x => x.Price, request.Desc)
            .ThenByIf(request.SortBy == "createTime", x => x.CreateTime, request.Desc)
            .ThenByIf(string.IsNullOrEmpty(request.SortBy), x => x.Id) // 默认排序确保结果稳定
            // 数据投影
            .Select(p => new ProductListItemDto(
                p.Id, 
                p.Name, 
                p.Price, 
                p.CategoryName, 
                p.IsActive,
                p.CreateTime))
            // 分页处理
            .ToPagedDataAsync(
                request.PageIndex, 
                request.PageSize, 
                cancellationToken: cancellationToken);
    }
}
```

## 强类型ID处理

- 在查询和DTO中直接使用强类型ID类型，如 `UserId`、`OrderId`
- 避免使用 `.Value` 属性访问内部值
- 依赖框架的隐式转换处理类型转换

## 常见错误排查

### Entity Framework 扩展方法错误

**错误**: `IQueryable<T>"未包含"CountAsync"的定义`  
**错误**: `IQueryable<T>"未包含"ToListAsync"的定义`  
**错误**: `IQueryable<T>"未包含"FirstOrDefaultAsync"的定义`

**原因**: 缺少 Entity Framework Core 的 using 引用

**解决**: 在查询文件中添加 `using Microsoft.EntityFrameworkCore;`

### DbContext 访问错误

**错误**: 在查询处理器中使用仓储方法

**原因**: 职责混淆，查询应直接使用 DbContext

**解决**: 
- 查询处理器直接注入 `ApplicationDbContext`
- 使用 `context.EntitySetName` 直接访问数据
- 避免调用仓储方法

### 框架扩展方法错误

**错误**: `IQueryable<T>"未包含"WhereIf"的定义`  
**错误**: `IQueryable<T>"未包含"OrderByIf"的定义`  
**错误**: `IQueryable<T>"未包含"ToPagedDataAsync"的定义`

**原因**: NetCorePal.Extensions.AspNetCore 的 using 引用问题

**解决**: 确保 `global using NetCorePal.Extensions.AspNetCore;` 已在GlobalUsings.cs中定义

## 最佳实践

1. **投影优化**: 使用 `Select()` 投影避免查询不需要的字段
2. **条件过滤**: 合理使用 `WhereIf()` 进行条件过滤
3. **动态排序**: 使用 `OrderByIf()` 和 `ThenByIf()` 实现灵活排序
4. **分页处理**: 使用 `ToPagedDataAsync()` 简化分页逻辑
5. **默认排序**: 在动态排序时，始终提供默认排序字段确保结果稳定性
6. **只读查询**: 查询不应修改数据状态
7. **直接访问**: 直接使用DbContext，不通过仓储

## 相关文档

- [命令开发指南](command-development.md)
- [DTO设计最佳实践](../best-practices/dto-design.md)
- [性能优化指南](../best-practices/performance-optimization.md)
