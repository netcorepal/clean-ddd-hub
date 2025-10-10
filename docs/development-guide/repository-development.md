# 仓储开发指南

## 概述

仓储模式封装了聚合根的持久化逻辑，提供类似集合的访问接口。本模板中仓储接口定义在基础设施层，实现也在基础设施层，遵循依赖倒置原则。

## 重要设计原则

- 每个聚合根对应一个仓储
- 仓储接口和实现应放置在 `src/{ProjectName}.Infrastructure/Repositories/` 目录下
- 接口和实现定义在同一个文件中，文件名格式为 `{AggregateName}Repository.cs`
- 接口必须继承 `IRepository<TEntity, TKey>`
- 实现必须继承 `RepositoryBase<TEntity, TKey, TDbContext>`
- 仓储类会被自动注册到依赖注入容器中，无需手动注册
- 默认基类已经实现了一组常用方法，如无必要，尽量不要定义新的仓储方法

## 文件与目录

类文件命名应遵循以下规则：

- 应放置在 `src/{ProjectName}.Infrastructure/Repositories/` 目录下
- 文件名格式为 `{AggregateName}Repository.cs`
- 接口和实现在同一文件中

## 开发规则

仓储的定义应遵循以下规则：

- 接口继承 `IRepository<TEntity, TKey>`
- 实现继承 `RepositoryBase<TEntity, TKey, TDbContext>`
- 仓储方法应该反映业务意图
- 所有操作必须是异步的
- 通过构造函数参数访问 `ApplicationDbContext`
- 仓储会被自动注册到 DI 容器

## 必要的using引用

仓储文件中的必要引用已在GlobalUsings.cs中定义：

- `global using Microsoft.EntityFrameworkCore;` - 用于EF Core扩展方法

因此在仓储文件中无需重复添加这些using语句。

## DbContext访问说明

- 通过构造函数参数访问 `ApplicationDbContext`
- 使用 `context.EntitySetName` 访问具体的DbSet
- 基类没有提供公开的 `DbSet` 或 `Context` 属性

## 代码示例

### 基本仓储实现

**文件**: `src/MyProject.Infrastructure/Repositories/UserRepository.cs`

```csharp
using MyProject.Domain.AggregatesModel.UserAggregate;

namespace MyProject.Infrastructure.Repositories;

// 接口和实现定义在同一文件中
public interface IUserRepository : IRepository<User, UserId>
{
    /// <summary>
    /// 根据邮箱获取用户
    /// </summary>
    /// <param name="email">邮箱地址</param>
    /// <param name="cancellationToken">取消令牌</param>
    /// <returns>用户实体，如果不存在则返回null</returns>
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    
    /// <summary>
    /// 检查邮箱是否已存在
    /// </summary>
    /// <param name="email">邮箱地址</param>
    /// <param name="cancellationToken">取消令牌</param>
    /// <returns>如果存在返回true，否则返回false</returns>
    Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default);
}

public class UserRepository(ApplicationDbContext context) 
    : RepositoryBase<User, UserId, ApplicationDbContext>(context), IUserRepository
{
    public async Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default)
    {
        return await context.Users
            .FirstOrDefaultAsync(x => x.Email == email, cancellationToken);
    }
    
    public async Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken = default)
    {
        return await context.Users
            .AnyAsync(x => x.Email == email, cancellationToken);
    }
}
```

### 带有复杂查询的仓储

**文件**: `src/MyProject.Infrastructure/Repositories/OrderRepository.cs`

```csharp
using MyProject.Domain.AggregatesModel.OrderAggregate;

namespace MyProject.Infrastructure.Repositories;

public interface IOrderRepository : IRepository<Order, OrderId>
{
    /// <summary>
    /// 根据客户名称获取订单列表
    /// </summary>
    Task<List<Order>> GetByCustomerNameAsync(
        string customerName, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// 根据状态获取订单列表
    /// </summary>
    Task<List<Order>> GetByStatusAsync(
        OrderStatus status, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// 获取待支付的超时订单
    /// </summary>
    Task<List<Order>> GetPendingTimeoutOrdersAsync(
        DateTimeOffset before, 
        CancellationToken cancellationToken = default);
}

public class OrderRepository(ApplicationDbContext context) 
    : RepositoryBase<Order, OrderId, ApplicationDbContext>(context), IOrderRepository
{
    public async Task<List<Order>> GetByCustomerNameAsync(
        string customerName, 
        CancellationToken cancellationToken = default)
    {
        return await context.Orders
            .Include(o => o.OrderItems)
            .Where(o => o.CustomerName == customerName)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<List<Order>> GetByStatusAsync(
        OrderStatus status, 
        CancellationToken cancellationToken = default)
    {
        return await context.Orders
            .Where(o => o.OrderStatus == status)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<List<Order>> GetPendingTimeoutOrdersAsync(
        DateTimeOffset before, 
        CancellationToken cancellationToken = default)
    {
        return await context.Orders
            .Where(o => o.OrderStatus == OrderStatus.Pending && o.CreateTime < before)
            .ToListAsync(cancellationToken);
    }
}
```

### 带有关联实体加载的仓储

**文件**: `src/MyProject.Infrastructure/Repositories/ProductRepository.cs`

```csharp
using MyProject.Domain.AggregatesModel.ProductAggregate;

namespace MyProject.Infrastructure.Repositories;

public interface IProductRepository : IRepository<Product, ProductId>
{
    /// <summary>
    /// 根据分类ID获取产品列表（包含评论）
    /// </summary>
    Task<List<Product>> GetByCategoryIdWithReviewsAsync(
        CategoryId categoryId, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// 检查产品编码是否存在
    /// </summary>
    Task<bool> CodeExistsAsync(
        string code, 
        CancellationToken cancellationToken = default);
    
    /// <summary>
    /// 批量获取产品（用于订单处理）
    /// </summary>
    Task<List<Product>> GetByIdsAsync(
        List<ProductId> productIds, 
        CancellationToken cancellationToken = default);
}

public class ProductRepository(ApplicationDbContext context) 
    : RepositoryBase<Product, ProductId, ApplicationDbContext>(context), IProductRepository
{
    public async Task<List<Product>> GetByCategoryIdWithReviewsAsync(
        CategoryId categoryId, 
        CancellationToken cancellationToken = default)
    {
        return await context.Products
            .Include(p => p.Reviews)
            .Where(p => p.CategoryId == categoryId)
            .ToListAsync(cancellationToken);
    }
    
    public async Task<bool> CodeExistsAsync(
        string code, 
        CancellationToken cancellationToken = default)
    {
        return await context.Products
            .AnyAsync(p => p.Code == code, cancellationToken);
    }
    
    public async Task<List<Product>> GetByIdsAsync(
        List<ProductId> productIds, 
        CancellationToken cancellationToken = default)
    {
        return await context.Products
            .Where(p => productIds.Contains(p.Id))
            .ToListAsync(cancellationToken);
    }
}
```

## 框架默认实现的方法

框架已经实现了以下常用方法，无需额外实现：

```csharp
public interface IRepository<TEntity, TKey> : IRepository<TEntity>
    where TEntity : notnull, Entity<TKey>, IAggregateRoot
    where TKey : notnull
{
    // 获取工作单元对象
    IUnitOfWork UnitOfWork { get; }
    
    // 添加方法
    TEntity Add(TEntity entity);
    Task<TEntity> AddAsync(TEntity entity, CancellationToken cancellationToken = default);
    void AddRange(IEnumerable<TEntity> entities);
    Task AddRangeAsync(IEnumerable<TEntity> entities, CancellationToken cancellationToken = default);
    
    // 附加方法
    void Attach(TEntity entity);
    void AttachRange(IEnumerable<TEntity> entities);
    
    // 更新方法
    TEntity Update(TEntity entity);
    Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
    
    // 删除方法
    bool Remove(Entity entity);
    Task<bool> RemoveAsync(Entity entity);
    int DeleteById(TKey id);
    Task<int> DeleteByIdAsync(TKey id, CancellationToken cancellationToken = default);
    
    // 获取方法
    TEntity? Get(TKey id);
    Task<TEntity?> GetAsync(TKey id, CancellationToken cancellationToken = default);
}
```

## 仓储方法命名约定

### 业务意图优先

仓储方法名应该反映业务意图，而不是数据库操作：

✅ **好的命名**:
```csharp
Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken);
Task<List<Order>> GetPendingOrdersAsync(CancellationToken cancellationToken);
Task<List<Product>> GetPublishedProductsAsync(CancellationToken cancellationToken);
```

❌ **不好的命名**:
```csharp
Task<User?> FindByEmail(string email); // 不够明确，不是异步
Task<bool> CheckEmail(string email); // 不清楚返回值含义
Task<List<Order>> Query(Expression<Func<Order, bool>> predicate); // 过于通用
```

### 查询vs存在性检查

```csharp
// 查询方法 - 返回实体或实体列表
Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken);
Task<List<Order>> GetByCustomerNameAsync(string customerName, CancellationToken cancellationToken);

// 存在性检查 - 返回bool
Task<bool> EmailExistsAsync(string email, CancellationToken cancellationToken);
Task<bool> CodeExistsAsync(string code, CancellationToken cancellationToken);
```

## 仓储使用场景

### ✅ 应该使用仓储的场景

1. **命令处理器中获取聚合进行业务操作**
```csharp
public async Task Handle(UpdateUserEmailCommand command, CancellationToken cancellationToken)
{
    var user = await userRepository.GetAsync(command.UserId, cancellationToken);
    user.ChangeEmail(command.Email);
}
```

2. **检查业务规则**
```csharp
if (await userRepository.EmailExistsAsync(command.Email, cancellationToken))
{
    throw new KnownException("邮箱已存在");
}
```

3. **批量获取聚合进行业务操作**
```csharp
var products = await productRepository.GetByIdsAsync(productIds, cancellationToken);
foreach (var product in products)
{
    product.DecreaseStock(quantity);
}
```

### ❌ 不应该使用仓储的场景

1. **查询处理器中的数据读取** - 应该直接使用DbContext
```csharp
// ❌ 错误
public class GetUserListQueryHandler(IUserRepository userRepository)
{
    public async Task<List<UserDto>> Handle(...)
    {
        var users = await userRepository.GetAllAsync(); // 不要这样
    }
}

// ✅ 正确
public class GetUserListQueryHandler(ApplicationDbContext context)
{
    public async Task<List<UserDto>> Handle(...)
    {
        return await context.Users.Select(...).ToListAsync(); // 直接使用DbContext
    }
}
```

2. **复杂的统计和报表查询** - 应该直接使用DbContext
```csharp
// ❌ 错误 - 在仓储中定义复杂统计方法
Task<OrderStatisticsDto> GetOrderStatisticsAsync(...);

// ✅ 正确 - 在查询处理器中直接查询
public class GetOrderStatisticsQueryHandler(ApplicationDbContext context)
{
    // 直接使用DbContext进行复杂查询
}
```

## 常见错误排查

### 依赖注入错误

**错误**: `未能找到类型或命名空间名"IUserRepository"`

**原因**: 在其他层（如Domain层）试图使用仓储接口

**解决**: 
- 确保仓储接口定义在 Infrastructure 层
- 在使用仓储的地方添加 `using {ProjectName}.Infrastructure.Repositories;`

### 自动注册相关

**错误**: 仓储未注册到 DI 容器

**原因**: 期望手动注册仓储

**解决**: 
- Infrastructure 层的 `AddRepositories()` 已自动注册所有仓储
- 无需在 Program.cs 中手动注册仓储

### 主构造函数警告

**警告**: `参数"ApplicationDbContext context"捕获到封闭类型状态，其值也传递给基构造函数`

**原因**: 使用主构造函数时编译器的保守警告

**解决**: 这是正常的警告，不影响功能，可以忽略。如需消除警告，可使用传统构造函数：

```csharp
// 会产生警告但功能正常的写法
public class UserRepository(ApplicationDbContext context) 
    : RepositoryBase<User, UserId, ApplicationDbContext>(context), IUserRepository
{
    // 实现
}

// 不产生警告的传统写法
public class UserRepository 
    : RepositoryBase<User, UserId, ApplicationDbContext>, IUserRepository
{
    public UserRepository(ApplicationDbContext context) : base(context)
    {
    }
    // 实现
}
```

## 最佳实践

1. **单一职责**: 每个仓储只负责一个聚合根
2. **业务语言**: 使用业务领域的语言命名方法
3. **异步优先**: 所有数据库操作都应该是异步的
4. **职责分离**: 仓储用于命令，查询处理器直接用DbContext
5. **最小化方法**: 只定义真正需要的方法，利用基类提供的默认方法
6. **包含关联**: 需要关联实体时使用Include显式加载

## 相关文档

- [聚合开发指南](aggregate-development.md)
- [命令开发指南](command-development.md)
- [查询开发指南](query-development.md)
- [实体配置指南](entity-configuration.md)
