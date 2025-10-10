# 什么是整洁架构 (Clean Architecture)

## 简介

整洁架构(Clean Architecture)是由Robert C. Martin (Uncle Bob)提出的一种软件架构模式。它强调将业务逻辑与技术实现细节分离，使系统更易于理解、开发、测试和维护。

## 核心原则

### 1. 依赖规则 (Dependency Rule)

**依赖只能由外向内指向**，内层不能依赖外层。这是整洁架构最核心的规则：

```
外层（框架、数据库、UI）
    ↓
中间层（接口适配器、用例）
    ↓
内层（实体、领域模型）
```

### 2. 独立性原则

系统应该独立于：

- **框架**: 框架作为工具，而非约束
- **数据库**: 业务逻辑不关心数据存储方式
- **UI**: 界面可以轻松更换
- **外部系统**: 业务规则不依赖外部服务
- **测试**: 业务逻辑可以独立测试

## 架构层次

整洁架构通常包含以下几层：

### 1. 实体层 (Entities)

- 最内层，包含企业级业务规则
- 封装最通用和高层的业务规则
- 最稳定，变化最少

```csharp
// 示例：实体
public class Order
{
    public Guid Id { get; private set; }
    public DateTime CreatedAt { get; private set; }
    public OrderStatus Status { get; private set; }
    
    public void Submit()
    {
        if (Status != OrderStatus.Draft)
            throw new InvalidOperationException("Only draft orders can be submitted");
        
        Status = OrderStatus.Submitted;
    }
}
```

### 2. 用例层 (Use Cases)

- 包含应用特定的业务规则
- 协调实体之间的交互
- 定义输入输出接口

```csharp
// 示例：用例
public class SubmitOrderUseCase
{
    private readonly IOrderRepository _repository;
    
    public async Task<OrderDto> Execute(SubmitOrderCommand command)
    {
        var order = await _repository.GetById(command.OrderId);
        order.Submit();
        await _repository.Save(order);
        return OrderDto.From(order);
    }
}
```

### 3. 接口适配器层 (Interface Adapters)

- 将用例和实体的数据转换为外部系统需要的格式
- 包含控制器、展示器、网关等
- 处理数据格式转换

```csharp
// 示例：控制器
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    private readonly SubmitOrderUseCase _useCase;
    
    [HttpPost("{id}/submit")]
    public async Task<IActionResult> Submit(Guid id)
    {
        var result = await _useCase.Execute(new SubmitOrderCommand { OrderId = id });
        return Ok(result);
    }
}
```

### 4. 框架和驱动层 (Frameworks and Drivers)

- 最外层，包含框架和工具
- 数据库、Web框架、设备等
- 变化最频繁的层

## 与DDD的关系

整洁架构和DDD可以完美结合：

| 整洁架构层次 | DDD概念 |
|------------|---------|
| 实体层 | 领域模型（实体、值对象、聚合） |
| 用例层 | 应用服务、领域服务 |
| 接口适配器层 | 仓储实现、API控制器 |
| 框架层 | 基础设施、数据库、Web框架 |

## 关键模式

### 依赖倒置 (Dependency Inversion)

通过接口和抽象，内层定义接口，外层实现接口：

```csharp
// 内层定义接口
public interface IOrderRepository
{
    Task<Order> GetById(Guid id);
    Task Save(Order order);
}

// 外层实现接口
public class SqlOrderRepository : IOrderRepository
{
    public async Task<Order> GetById(Guid id)
    {
        // 数据库实现
    }
}
```

### 端口和适配器 (Ports and Adapters)

- **端口**: 内层定义的接口
- **适配器**: 外层对接口的实现

### 测试策略

整洁架构使测试变得容易：

```csharp
[Test]
public async Task SubmitOrder_ShouldChangeStatus()
{
    // Arrange
    var mockRepo = new Mock<IOrderRepository>();
    var order = new Order();
    mockRepo.Setup(r => r.GetById(It.IsAny<Guid>()))
            .ReturnsAsync(order);
    
    var useCase = new SubmitOrderUseCase(mockRepo.Object);
    
    // Act
    await useCase.Execute(new SubmitOrderCommand { OrderId = order.Id });
    
    // Assert
    Assert.Equal(OrderStatus.Submitted, order.Status);
}
```

## 优势

### 1. 可测试性

业务逻辑独立于技术细节，可以轻松进行单元测试。

### 2. 可维护性

清晰的层次结构和依赖规则，使代码易于理解和修改。

### 3. 灵活性

可以轻松替换技术栈，如数据库、Web框架等。

### 4. 独立开发

各层可以相对独立开发，提高团队协作效率。

### 5. 业务为中心

业务逻辑是系统的核心，不受技术细节影响。

## 实施步骤

1. **识别业务规则**: 确定核心业务逻辑
2. **设计用例**: 定义应用场景和交互流程
3. **定义接口**: 在内层定义需要的接口
4. **实现适配器**: 在外层实现接口
5. **配置依赖注入**: 连接各层组件

## 常见误区

### ❌ 过度设计

不是所有项目都需要完整的整洁架构，要根据复杂度选择。

### ❌ 层次混淆

严格遵守依赖规则，不要让外层的概念泄漏到内层。

### ❌ 贫血模型

实体层应该包含业务逻辑，而不仅仅是数据容器。

### ❌ 忽视性能

在大多数情况下，清晰的架构比性能优化更重要，但不能完全忽视性能。

## 相关架构

整洁架构与以下架构有相似之处：

- **六边形架构** (Hexagonal Architecture)
- **洋葱架构** (Onion Architecture)
- **端口适配器架构** (Ports and Adapters)

它们的核心思想都是依赖倒置和关注点分离。

## 下一步

- [快速开始](quick-start.md) - 使用我们的框架开始实践
- [分层架构详解](../architecture/layered-architecture.md)
- [六边形架构](../architecture/hexagonal-architecture.md)
- [项目结构最佳实践](../best-practices/project-structure.md)
