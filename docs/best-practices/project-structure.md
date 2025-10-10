# 项目结构最佳实践

## 为什么项目结构很重要？

良好的项目结构是DDD和Clean Architecture成功实施的基础。本文档描述了推荐的项目组织方式，遵循分层架构和关注点分离原则。

## 标准项目结构是什么样的？

### 整体结构

```
MyProject.sln
├── src/
│   ├── MyProject.Domain/           # 领域层 - 核心业务逻辑
│   ├── MyProject.Infrastructure/   # 基础设施层 - 数据访问和外部服务
│   └── MyProject.Web/             # 表现层 - API和应用服务
└── test/                          # 测试项目
    ├── MyProject.Domain.UnitTests/
    ├── MyProject.Infrastructure.UnitTests/
    └── MyProject.Web.UnitTests/
```

### 分层依赖关系是怎样的？

**严格单向依赖：** Web → Infrastructure → Domain

- Domain 层不依赖任何其他层
- Infrastructure 层依赖 Domain 层
- Web 层依赖 Infrastructure 和 Domain 层
- 测试项目可以依赖对应的被测项目

## Domain层（领域层）如何组织？

### 目录结构

```
MyProject.Domain/
├── AggregatesModel/                    # 聚合模型
│   ├── UserAggregate/                  # 用户聚合
│   │   ├── User.cs                     # 聚合根 + 强类型ID
│   │   └── UserRole.cs                 # 子实体（如果有）
│   ├── OrderAggregate/                 # 订单聚合
│   │   ├── Order.cs                    # 聚合根 + 强类型ID
│   │   ├── OrderItem.cs                # 订单项子实体
│   │   └── OrderStatus.cs              # 订单状态枚举
│   └── ProductAggregate/               # 产品聚合
│       ├── Product.cs                  # 聚合根
│       └── ProductReview.cs            # 产品评论子实体
├── DomainEvents/                       # 领域事件
│   ├── UserDomainEvents.cs             # 用户相关领域事件
│   ├── OrderDomainEvents.cs            # 订单相关领域事件
│   └── ProductDomainEvents.cs          # 产品相关领域事件
├── DomainServices/                     # 领域服务（可选）
│   └── PricingService.cs               # 定价服务
├── Exceptions/                         # 领域异常（可选）
│   └── DomainException.cs
└── GlobalUsings.cs                     # 全局using引用
```

### 职责说明

**AggregatesModel（聚合模型）**:
- 包含所有聚合根、实体、值对象
- 每个聚合独立文件夹
- 聚合根包含强类型ID定义
- 包含业务规则和不变性

**DomainEvents（领域事件）**:
- 定义领域中发生的重要事件
- 按聚合分组组织
- 使用过去式命名

**DomainServices（领域服务）**:
- 不属于任何特定实体的业务逻辑
- 跨聚合的复杂业务规则

## Infrastructure层（基础设施层）如何组织？

### 目录结构

```
MyProject.Infrastructure/
├── Repositories/                       # 仓储实现
│   ├── UserRepository.cs               # 用户仓储接口+实现
│   ├── OrderRepository.cs              # 订单仓储接口+实现
│   └── ProductRepository.cs            # 产品仓储接口+实现
├── EntityConfigurations/               # EF Core实体配置
│   ├── UserEntityConfiguration.cs      # 用户实体配置
│   ├── OrderEntityConfiguration.cs     # 订单实体配置
│   └── ProductEntityConfiguration.cs   # 产品实体配置
├── Migrations/                         # 数据库迁移
│   └── 20240101000000_InitialCreate.cs
├── ApplicationDbContext.cs             # 数据库上下文
├── DesignTimeDbContextFactory.cs       # 设计时工厂
└── GlobalUsings.cs                     # 全局using引用
```

### 职责说明

**Repositories（仓储）**:
- 封装数据访问逻辑
- 接口和实现在同一文件
- 提供业务导向的查询方法

**EntityConfigurations（实体配置）**:
- EF Core的实体映射配置
- 表名、字段、关系配置
- 索引和约束定义

**ApplicationDbContext**:
- 管理所有DbSet
- 配置实体映射
- 处理领域事件发布

## Web层（表现层）如何组织？

### 目录结构

```
MyProject.Web/
├── Application/                        # 应用服务层
│   ├── Commands/                       # 命令
│   │   ├── User/
│   │   │   ├── CreateUserCommand.cs
│   │   │   ├── UpdateUserCommand.cs
│   │   │   └── DeleteUserCommand.cs
│   │   ├── Order/
│   │   │   ├── CreateOrderCommand.cs
│   │   │   └── PayOrderCommand.cs
│   │   └── Product/
│   │       └── CreateProductCommand.cs
│   ├── Queries/                        # 查询
│   │   ├── User/
│   │   │   ├── GetUserQuery.cs
│   │   │   └── GetUserListQuery.cs
│   │   ├── Order/
│   │   │   ├── GetOrderQuery.cs
│   │   │   └── GetOrderListQuery.cs
│   │   └── Product/
│   │       └── GetProductListQuery.cs
│   ├── DomainEventHandlers/            # 领域事件处理器
│   │   ├── UserCreatedDomainEventHandlerForNotification.cs
│   │   └── OrderPaidDomainEventHandlerForDelivery.cs
│   ├── IntegrationEvents/              # 集成事件
│   │   ├── UserCreatedIntegrationEvent.cs
│   │   └── OrderCreatedIntegrationEvent.cs
│   ├── IntegrationEventHandlers/       # 集成事件处理器
│   │   └── PaymentCompletedIntegrationEventHandler.cs
│   └── Dtos/                           # 数据传输对象（可选）
│       └── UserDto.cs
├── Endpoints/                          # FastEndpoints端点
│   ├── User/
│   │   ├── CreateUserEndpoint.cs
│   │   ├── UpdateUserEndpoint.cs
│   │   └── GetUserEndpoint.cs
│   └── Order/
│       ├── CreateOrderEndpoint.cs
│       └── GetOrderEndpoint.cs
├── Middlewares/                        # 中间件
│   └── ExceptionHandlingMiddleware.cs
├── Program.cs                          # 应用程序入口
├── appsettings.json                    # 配置文件
└── GlobalUsings.cs                     # 全局using引用
```

### 职责说明

**Commands（命令）**:
- 表示修改系统状态的操作
- 包含命令、验证器和处理器
- 按功能模块组织

**Queries（查询）**:
- 表示读取数据的操作
- 直接访问DbContext
- 返回DTO而非实体

**DomainEventHandlers（领域事件处理器）**:
- 处理领域事件
- 实现跨聚合协作
- 可以有多个处理器处理同一事件

**IntegrationEvents（集成事件）**:
- 跨服务通信的事件
- 不包含领域对象引用

**Endpoints（端点）**:
- RESTful API端点
- 使用FastEndpoints框架
- 负责HTTP请求/响应处理

## Test层（测试项目）如何组织？

### 目录结构

```
test/
├── MyProject.Domain.UnitTests/         # 领域层单元测试
│   ├── UserTests.cs                    # 用户聚合测试
│   ├── OrderTests.cs                   # 订单聚合测试
│   └── ProductTests.cs                 # 产品聚合测试
├── MyProject.Infrastructure.UnitTests/ # 基础设施层测试
│   ├── UserRepositoryTests.cs
│   └── OrderRepositoryTests.cs
└── MyProject.Web.UnitTests/           # Web层单元测试
    ├── Commands/
    │   └── CreateUserCommandHandlerTests.cs
    ├── Queries/
    │   └── GetUserQueryHandlerTests.cs
    └── Endpoints/
        └── CreateUserEndpointTests.cs
```

## 如何命名文件和命名空间？

### 文件命名

- **聚合根**: `{EntityName}.cs`（如 `User.cs`, `Order.cs`）
- **强类型ID**: 与聚合根在同一文件中
- **领域事件**: `{Entity}{Action}DomainEvent.cs`（如 `UserCreatedDomainEvent`）
- **命令**: `{Action}{Entity}Command.cs`（如 `CreateUserCommand.cs`）
- **查询**: `{Action}{Entity}Query.cs`（如 `GetUserListQuery.cs`）
- **仓储**: `{Entity}Repository.cs`（如 `UserRepository.cs`）
- **实体配置**: `{Entity}EntityConfiguration.cs`

### 命名空间应该怎么组织？

```csharp
// Domain层
MyProject.Domain.AggregatesModel.UserAggregate
MyProject.Domain.DomainEvents

// Infrastructure层
MyProject.Infrastructure.Repositories
MyProject.Infrastructure.EntityConfigurations

// Web层
MyProject.Web.Application.Commands.User
MyProject.Web.Application.Queries.User
MyProject.Web.Application.DomainEventHandlers
MyProject.Web.Endpoints.User
```

## 如何进行模块化组织？

对于大型项目，可以按业务模块组织：

```
MyProject.Web/
├── Application/
│   ├── User/                          # 用户模块
│   │   ├── Commands/
│   │   ├── Queries/
│   │   └── DomainEventHandlers/
│   ├── Order/                         # 订单模块
│   │   ├── Commands/
│   │   ├── Queries/
│   │   └── DomainEventHandlers/
│   └── Product/                       # 产品模块
│       ├── Commands/
│       └── Queries/
```

## 项目结构有哪些最佳实践？

### 1. 保持层次清晰

- 严格遵守依赖方向
- 避免循环依赖
- Domain层保持纯净，不依赖外部框架

### 2. 按功能组织

- 相关的代码放在一起
- 按业务模块而非技术层次组织
- 降低认知负担

### 3. 保持一致性

- 统一的命名约定
- 统一的文件组织方式
- 团队成员易于理解和导航

### 4. 适度分离

- 不要过度细分
- 避免一个文件一个类（除非必要）
- 相关的小类可以放在一个文件中

### 5. 使用GlobalUsings

- 减少重复的using语句
- 提高代码可读性
- 在每个项目中定义GlobalUsings.cs

## 项目结构常见问题有哪些？

### Q: 为什么仓储放在Infrastructure而不是Domain？

A: 虽然仓储接口在概念上属于Domain，但在实践中，将接口和实现都放在Infrastructure层可以简化依赖关系，因为仓储的实现总是依赖具体的持久化技术（如EF Core）。

### Q: 什么时候应该创建新的聚合？

A: 当一组实体：
1. 有明确的业务边界
2. 需要保证事务一致性
3. 可以独立存在和演化

### Q: 如何处理跨聚合的查询？

A: 在查询处理器中直接使用DbContext进行跨聚合查询，这是读模型，不需要经过聚合根。

### Q: 应该在哪里放置DTO？

A: DTO可以和查询或命令放在一起，也可以放在独立的Dtos文件夹中。推荐与查询放在一起，因为它们通常是为查询服务的。

## 在哪里可以找到相关文档？

- [聚合开发指南](../development-guide/aggregate-development.md)
- [命令开发指南](../development-guide/command-development.md)
- [查询开发指南](../development-guide/query-development.md)
- [仓储开发指南](../development-guide/repository-development.md)
- [命名规范](naming-conventions.md)
