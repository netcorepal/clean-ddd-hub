# NetCorePal Cloud Framework

## 概述

NetCorePal Cloud Framework 是一个基于 .NET 8 的企业级微服务开发框架，深度集成了领域驱动设计（DDD）和整洁架构（Clean Architecture）的最佳实践。该框架提供了完整的开发模板和工具库，帮助开发团队快速构建高质量的微服务应用。

## 核心特性

### 1. DDD 核心概念支持

- **聚合根与实体**: 提供基础Entity类和IAggregateRoot接口
- **强类型ID**: 支持IGuidStronglyTypedId和IInt64StronglyTypedId，避免ID类型混淆
- **领域事件**: 内置IDomainEvent接口和事件发布机制
- **值对象**: 支持值对象的定义和使用
- **仓储模式**: 提供IRepository接口和RepositoryBase基类

### 2. CQRS 模式实现

- **命令处理**: 基于MediatR的ICommand和ICommandHandler接口
- **查询处理**: IQuery和IQueryHandler接口，支持读写分离
- **验证集成**: FluentValidation自动验证支持
- **事务管理**: 自动事务边界管理

### 3. 事件驱动架构

- **领域事件**: 聚合内事件，事务边界内处理
- **集成事件**: 跨服务事件，异步消息传递
- **事件处理器**: 自动注册和调用机制
- **事件溯源**: 可选的事件存储支持

### 4. 微服务基础设施

- **服务注册与发现**: 支持Consul、Nacos等注册中心
- **配置管理**: 集中式配置和动态刷新
- **链路追踪**: OpenTelemetry集成
- **健康检查**: 内置健康检查端点
- **熔断降级**: Polly集成

### 5. 数据访问

- **EF Core集成**: 深度集成Entity Framework Core
- **多数据库支持**: SQL Server、MySQL、PostgreSQL
- **自动审计**: 创建时间、更新时间、操作人自动记录
- **软删除**: 内置软删除支持
- **乐观并发**: RowVersion自动管理

### 6. API开发

- **FastEndpoints集成**: 高性能端点路由
- **自动API文档**: Swagger/OpenAPI支持
- **版本控制**: API版本管理
- **响应包装**: 统一响应格式
- **异常处理**: 统一异常处理中间件

## 快速开始

### 1. 安装模板

```bash
# 安装 NetCorePal 项目模板
dotnet new install NetCorePal.Template

# 查看已安装的模板
dotnet new list
```

### 2. 创建项目

```bash
# 创建新的微服务项目
dotnet new netcorepal-webapi -n MyProject
cd MyProject

# 恢复依赖
dotnet restore

# 运行项目
dotnet run --project src/MyProject.Web
```

### 3. 项目结构

```
MyProject/
├── src/
│   ├── MyProject.Domain/           # 领域层
│   │   ├── AggregatesModel/        # 聚合根
│   │   ├── DomainEvents/           # 领域事件
│   │   └── DomainServices/         # 领域服务
│   ├── MyProject.Infrastructure/   # 基础设施层
│   │   ├── Repositories/           # 仓储实现
│   │   ├── EntityConfigurations/   # 实体配置
│   │   ├── Migrations/             # 数据库迁移
│   │   └── ApplicationDbContext.cs
│   └── MyProject.Web/             # 表现层
│       ├── Application/            # 应用服务
│       │   ├── Commands/          # 命令
│       │   ├── Queries/           # 查询
│       │   ├── DomainEventHandlers/
│       │   └── IntegrationEvents/
│       ├── Endpoints/             # API端点
│       └── Program.cs
└── test/                          # 测试项目
    ├── MyProject.Domain.UnitTests/
    ├── MyProject.Infrastructure.UnitTests/
    └── MyProject.Web.UnitTests/
```

## 核心组件详解

### 强类型ID

框架提供了强类型ID支持，避免不同实体ID之间的混淆：

```csharp
// 定义强类型ID
public partial record UserId : IGuidStronglyTypedId;
public partial record OrderId : IGuidStronglyTypedId;

// 使用强类型ID
public class User : Entity<UserId>, IAggregateRoot
{
    protected User() { }
    
    public User(string name)
    {
        Name = name;
        // ID会由EF Core值生成器自动生成
    }
    
    public string Name { get; private set; } = string.Empty;
}
```

### 聚合根基类

```csharp
public abstract class Entity<TId> where TId : notnull
{
    public TId Id { get; protected set; } = default!;
    
    private readonly List<IDomainEvent> _domainEvents = new();
    
    protected void AddDomainEvent(IDomainEvent domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }
    
    public IReadOnlyCollection<IDomainEvent> GetDomainEvents() 
        => _domainEvents.AsReadOnly();
    
    public void ClearDomainEvents() 
        => _domainEvents.Clear();
}

public interface IAggregateRoot { }
```

### 仓储基类

```csharp
public abstract class RepositoryBase<TEntity, TKey, TDbContext> 
    : IRepository<TEntity, TKey>
    where TEntity : Entity<TKey>, IAggregateRoot
    where TKey : notnull
    where TDbContext : DbContext
{
    protected readonly TDbContext Context;
    
    protected RepositoryBase(TDbContext context)
    {
        Context = context;
    }
    
    public virtual async Task<TEntity?> GetAsync(
        TKey id, 
        CancellationToken cancellationToken = default)
    {
        return await Context.Set<TEntity>()
            .FindAsync(new object[] { id }, cancellationToken);
    }
    
    public virtual async Task<TEntity> AddAsync(
        TEntity entity, 
        CancellationToken cancellationToken = default)
    {
        await Context.Set<TEntity>().AddAsync(entity, cancellationToken);
        return entity;
    }
    
    // ... 更多默认方法
}
```

### 命令和查询接口

```csharp
// 命令接口
public interface ICommand : IRequest { }
public interface ICommand<TResponse> : IRequest<TResponse> { }

// 命令处理器接口
public interface ICommandHandler<in TCommand> : IRequestHandler<TCommand>
    where TCommand : ICommand { }
    
public interface ICommandHandler<in TCommand, TResponse> 
    : IRequestHandler<TCommand, TResponse>
    where TCommand : ICommand<TResponse> { }

// 查询接口
public interface IQuery<TResponse> : IRequest<TResponse> { }

// 查询处理器接口
public interface IQueryHandler<in TQuery, TResponse> 
    : IRequestHandler<TQuery, TResponse>
    where TQuery : IQuery<TResponse> { }
```

### 领域事件处理

```csharp
// 领域事件接口
public interface IDomainEvent
{
    DateTimeOffset OccurredOn { get; }
}

// 领域事件处理器接口
public interface IDomainEventHandler<in TDomainEvent> 
    where TDomainEvent : IDomainEvent
{
    Task Handle(TDomainEvent domainEvent, CancellationToken cancellationToken);
}
```

## 配置与使用

### Program.cs 配置

```csharp
var builder = WebApplication.CreateBuilder(args);

// 添加服务
builder.Services
    .AddFastEndpoints()
    .AddMediatR(cfg => cfg.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly()))
    .AddValidatorsFromAssembly(Assembly.GetExecutingAssembly())
    .AddDbContext<ApplicationDbContext>(options =>
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")))
    .AddRepositories()
    .AddDomainEventHandlers();

var app = builder.Build();

// 配置中间件
app.UseHttpsRedirection();
app.UseFastEndpoints();
app.Run();
```

### 数据库迁移

```bash
# 添加迁移
dotnet ef migrations add InitialCreate -p src/MyProject.Infrastructure -s src/MyProject.Web

# 更新数据库
dotnet ef database update -p src/MyProject.Infrastructure -s src/MyProject.Web

# 删除最后一次迁移
dotnet ef migrations remove -p src/MyProject.Infrastructure -s src/MyProject.Web
```

## 扩展方法

### 查询扩展

```csharp
// WhereIf - 条件过滤
query.WhereIf(condition, x => x.Name == name)

// OrderByIf - 条件排序
query.OrderByIf(condition, x => x.CreateTime, descending)

// ToPagedDataAsync - 分页
await query.ToPagedDataAsync(pageIndex, pageSize, cancellationToken)
```

### 响应包装

```csharp
// ResponseData<T> - 统一响应格式
public record ResponseData<T>
{
    public bool Success { get; init; }
    public T? Data { get; init; }
    public string? Message { get; init; }
    public int? ErrorCode { get; init; }
}

// 使用示例
return new ResponseData<UserId>
{
    Success = true,
    Data = userId,
    Message = "用户创建成功"
};
```

## 最佳实践

### 1. 分层架构

- 严格遵守依赖方向：Web → Infrastructure → Domain
- Domain层保持纯净，不依赖外部框架
- 使用接口进行依赖倒置

### 2. 聚合设计

- 保持聚合边界小而清晰
- 通过聚合根访问和修改聚合内实体
- 使用强类型ID避免ID混淆

### 3. 命令和查询分离

- 命令用于修改状态，使用仓储
- 查询用于读取数据，直接用DbContext
- 避免在查询中修改状态

### 4. 事件驱动

- 在聚合内发布领域事件
- 使用领域事件处理器实现跨聚合协作
- 使用集成事件实现跨服务通信

### 5. 异常处理

- 使用KnownException处理业务异常
- 框架自动转换为合适的HTTP状态码
- 提供清晰的错误消息

## 性能优化

### 1. 查询优化

```csharp
// 使用投影减少数据传输
var users = await context.Users
    .Select(u => new UserDto(u.Id, u.Name, u.Email))
    .ToListAsync();

// 避免N+1查询
var orders = await context.Orders
    .Include(o => o.OrderItems)
    .ToListAsync();
```

### 2. 缓存策略

```csharp
// 使用IMemoryCache进行本地缓存
services.AddMemoryCache();

// 使用IDistributedCache进行分布式缓存
services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
});
```

### 3. 异步编程

- 所有IO操作使用异步方法
- 正确传递CancellationToken
- 避免async void方法

## 常见问题

### Q: 如何处理并发冲突？

A: 使用RowVersion属性实现乐观并发控制：

```csharp
public class User : Entity<UserId>, IAggregateRoot
{
    public RowVersion RowVersion { get; private set; } = new RowVersion(0);
    // ...
}

// EF Core会自动检测并发冲突
```

### Q: 如何实现软删除？

A: 添加IsDeleted属性并配置全局查询过滤器：

```csharp
public class User : Entity<UserId>, IAggregateRoot
{
    public bool IsDeleted { get; private set; }
    
    public void Delete()
    {
        IsDeleted = true;
        this.AddDomainEvent(new UserDeletedDomainEvent(this));
    }
}

// 在DbContext中配置
modelBuilder.Entity<User>()
    .HasQueryFilter(u => !u.IsDeleted);
```

### Q: 如何处理长时间运行的操作？

A: 使用后台作业或消息队列：

```csharp
// 使用Hangfire处理后台作业
services.AddHangfire(configuration => ...);

// 在命令处理器中触发后台作业
BackgroundJob.Enqueue(() => ProcessLongRunningTask(orderId));
```

## 相关资源

### 文档

- [聚合开发指南](../development-guide/aggregate-development.md)
- [命令开发指南](../development-guide/command-development.md)
- [查询开发指南](../development-guide/query-development.md)
- [仓储开发指南](../development-guide/repository-development.md)

### 示例项目

- [NetCorePal Cloud Framework 示例](https://github.com/netcorepal/netcorepal-cloud-framework/tree/main/samples)

### GitHub仓库

- [NetCorePal Cloud Framework](https://github.com/netcorepal/netcorepal-cloud-framework)
- [项目模板](https://github.com/netcorepal/netcorepal-cloud-template)

### 社区支持

- GitHub Issues: 报告问题和建议
- 讨论区: 技术交流和问题讨论

## 版本历史

### v2.0.0 (2024-01)
- 升级到 .NET 8
- 改进强类型ID实现
- 增强事件处理机制
- 优化性能和内存使用

### v1.5.0 (2023-11)
- 添加FastEndpoints集成
- 改进验证器自动注册
- 增强分页查询支持

### v1.0.0 (2023-06)
- 初始版本发布
- 基础DDD支持
- CQRS模式实现
- 事件驱动架构

## 许可证

MIT License - 详见 [LICENSE](https://github.com/netcorepal/netcorepal-cloud-framework/blob/main/LICENSE)
