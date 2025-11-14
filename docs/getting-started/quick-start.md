# 快速开始

本指南将帮助你快速开始使用NetCorePal提供的框架构建基于DDD和Clean Architecture的应用程序。

## 选择框架

我们提供了两个主流平台的框架：

### .NET 平台 - NetCorePal Cloud Framework

适用于C#/.NET开发者

- GitHub: [netcorepal-cloud-framework](https://github.com/netcorepal/netcorepal-cloud-framework)
- 基于.NET 8+
- 支持微服务架构
- 集成领域事件、CQRS等模式

### Java 平台 - CAP4J

适用于Java开发者

- GitHub: [cap4j](https://github.com/netcorepal/cap4j)
- 基于Spring Boot
- 完整的DDD战术模式支持
- 灵活的架构设计

## 使用 NetCorePal Cloud Framework (.NET)

### 1. 环境准备

确保已安装以下工具：

- [.NET 8 SDK](https://dotnet.microsoft.com/download) 或更高版本
- IDE: Visual Studio 2022 或 JetBrains Rider
- Docker (可选，用于本地开发环境)

### 2. 创建项目

```bash
# 安装项目模板
dotnet new install NetCorePal.Template

# 创建新项目
dotnet new netcorepal-webapi -n MyProject
cd MyProject
```

### 3. 项目结构

```
MyProject/
├── src/
│   ├── MyProject.Domain/          # 领域层
│   │   ├── Aggregates/            # 聚合根
│   │   ├── DomainEvents/          # 领域事件
│   │   └── DomainServices/        # 领域服务
│   ├── MyProject.Application/     # 应用层
│   │   ├── Commands/              # 命令
│   │   ├── Queries/               # 查询
│   │   └── IntegrationEvents/     # 集成事件
│   ├── MyProject.Infrastructure/  # 基础设施层
│   │   ├── Repositories/          # 仓储实现
│   │   └── EntityConfigurations/  # 实体配置
│   └── MyProject.Api/             # API层
│       └── Controllers/           # 控制器
└── tests/
    ├── MyProject.Domain.Tests/
    └── MyProject.Application.Tests/
```

### 4. 定义领域模型

```csharp
// Domain/Aggregates/Order.cs
public class Order : AggregateRoot<OrderId>
{
    public OrderNumber OrderNumber { get; private set; }
    public OrderStatus Status { get; private set; }
    
    private readonly List<OrderItem> _items = new();
    public IReadOnlyCollection<OrderItem> Items => _items.AsReadOnly();
    
    public void AddItem(ProductId productId, int quantity, decimal price)
    {
        var item = new OrderItem(productId, quantity, price);
        _items.Add(item);
        
        // 发布领域事件
        RaiseDomainEvent(new OrderItemAddedEvent(Id, productId, quantity));
    }
    
    public void Submit()
    {
        if (Status != OrderStatus.Draft)
            throw new DomainException("Only draft orders can be submitted");
        
        Status = OrderStatus.Submitted;
        RaiseDomainEvent(new OrderSubmittedEvent(Id));
    }
}
```

### 5. 创建应用服务

```csharp
// Application/Commands/SubmitOrderCommand.cs
public record SubmitOrderCommand(OrderId OrderId) : ICommand<Result>;

// Application/Commands/SubmitOrderCommandHandler.cs
public class SubmitOrderCommandHandler : ICommandHandler<SubmitOrderCommand, Result>
{
    private readonly IOrderRepository _repository;
    private readonly IUnitOfWork _unitOfWork;
    
    public async Task<Result> Handle(SubmitOrderCommand command, CancellationToken ct)
    {
        var order = await _repository.GetByIdAsync(command.OrderId, ct);
        
        order.Submit();
        
        await _unitOfWork.SaveChangesAsync(ct);
        
        return Result.Success();
    }
}
```

### 6. 创建API端点

```csharp
// Api/Controllers/OrdersController.cs
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;
    
    [HttpPost("{id}/submit")]
    public async Task<IActionResult> Submit(Guid id)
    {
        var result = await _mediator.Send(new SubmitOrderCommand(new OrderId(id)));
        return result.IsSuccess ? Ok() : BadRequest(result.Error);
    }
}
```

### 7. 运行应用

```bash
# 恢复依赖
dotnet restore

# 运行数据库迁移
dotnet ef database update -p src/MyProject.Infrastructure -s src/MyProject.Api

# 启动应用
dotnet run --project src/MyProject.Api
```

访问 `https://localhost:5001/swagger` 查看API文档。

## 使用 CAP4J (Java)

### 1. 环境准备

- JDK 17 或更高版本
- Maven 3.6+ 或 Gradle 7+
- IDE: IntelliJ IDEA

### 2. 创建项目

```bash
# 克隆模板项目
git clone https://github.com/netcorepal/cap4j-template.git my-project
cd my-project
```

### 3. 项目结构

```
my-project/
├── domain/                  # 领域层
│   ├── model/              # 领域模型
│   └── event/              # 领域事件
├── application/            # 应用层
│   ├── command/            # 命令
│   └── query/              # 查询
├── infrastructure/         # 基础设施层
│   └── repository/         # 仓储实现
└── adapter/                # 适配器层
    └── rest/               # REST API
```

### 4. 定义领域模型

```java
// domain/model/Order.java
@Getter
public class Order extends AggregateRoot<OrderId> {
    private OrderNumber orderNumber;
    private OrderStatus status;
    private List<OrderItem> items = new ArrayList<>();
    
    public void addItem(ProductId productId, int quantity, BigDecimal price) {
        var item = new OrderItem(productId, quantity, price);
        items.add(item);
        
        registerEvent(new OrderItemAddedEvent(getId(), productId, quantity));
    }
    
    public void submit() {
        if (status != OrderStatus.DRAFT) {
            throw new DomainException("Only draft orders can be submitted");
        }
        
        status = OrderStatus.SUBMITTED;
        registerEvent(new OrderSubmittedEvent(getId()));
    }
}
```

### 5. 创建应用服务

```java
// application/command/SubmitOrderCommand.java
@Data
public class SubmitOrderCommand {
    private OrderId orderId;
}

// application/command/SubmitOrderCommandHandler.java
@Service
public class SubmitOrderCommandHandler {
    private final OrderRepository repository;
    
    @Transactional
    public void handle(SubmitOrderCommand command) {
        Order order = repository.findById(command.getOrderId())
            .orElseThrow(() -> new OrderNotFoundException());
        
        order.submit();
        repository.save(order);
    }
}
```

### 6. 运行应用

```bash
# 编译项目
mvn clean package

# 运行应用
java -jar target/my-project.jar
```

## 下一步学习

### 深入核心概念

- [领域模型](../core-concepts/domain-model.md)
- [聚合](../core-concepts/aggregate.md)
- [领域事件](../core-concepts/domain-events.md)
- [仓储模式](../core-concepts/repository-pattern.md)

### 学习架构设计

- [整洁架构详解](../architecture/clean-architecture.md)
- [CQRS模式](../architecture/cqrs.md)
- [事件驱动架构](../architecture/event-driven.md)

### 查看最佳实践

- [项目结构](../best-practices/project-structure.md)
- [命名规范](../best-practices/naming-conventions.md)
- [测试策略](../best-practices/testing-strategy.md)

## 获取帮助

遇到问题？

- 查看框架文档: [.NET](../tools/netcorepal-framework.md) | [Java](../tools/cap4j-framework.md)
- 在GitHub上提Issue
- 加入我们的社区讨论

## 示例项目

我们提供了完整的示例项目供参考：

- [.NET示例](https://github.com/netcorepal/netcorepal-cloud-framework/tree/main/samples)
- [Java示例](https://github.com/netcorepal/cap4j/tree/main/samples)

祝你构建成功！🚀
