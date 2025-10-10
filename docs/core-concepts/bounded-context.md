# 限界上下文 (Bounded Context)

## 什么是限界上下文

限界上下文是DDD战略设计的核心概念，它定义了一个明确的边界，在这个边界内：

- **统一语言是一致的**: 相同的术语有相同的含义
- **模型是内聚的**: 相关的概念组织在一起
- **规则是完整的**: 包含完整的业务规则

## 为什么需要限界上下文

在大型系统中，不同的团队和业务领域对相同概念可能有不同的理解：

```
订单上下文中的"订单":
- 订单号、客户、商品清单、总金额
- 可以提交、支付、发货

财务上下文中的"订单":
- 发票号、应收账款、收款状态
- 可以开票、收款、对账

物流上下文中的"订单":
- 运单号、收货地址、包裹重量
- 可以拣货、打包、配送
```

通过限界上下文，我们可以在不同的上下文中对"订单"有不同的模型和实现。

## 识别限界上下文

### 方法1: 通过业务能力

根据组织的业务能力划分：

- 销售上下文 (Sales Context)
- 库存上下文 (Inventory Context)
- 配送上下文 (Shipping Context)
- 财务上下文 (Finance Context)

### 方法2: 通过团队结构

按照康威定律，系统架构往往反映组织结构：

```
电商系统
├── 前台团队 → 购物上下文
├── 订单团队 → 订单上下文
├── 仓储团队 → 仓储上下文
└── 财务团队 → 财务上下文
```

### 方法3: 通过事件风暴

使用Event Storming识别限界上下文的边界：

1. 识别所有领域事件
2. 将相关事件聚类
3. 为每个聚类定义上下文边界

## 上下文映射 (Context Map)

上下文映射描述不同限界上下文之间的关系：

### 1. 共享内核 (Shared Kernel)

两个上下文共享部分领域模型。

```
订单上下文 ←→ 库存上下文
  共享: Product实体
```

**优点**: 减少重复  
**缺点**: 增加耦合，需要协调变更

### 2. 客户-供应商 (Customer-Supplier)

下游上下文依赖上游上下文。

```
订单上下文 (上游) → 配送上下文 (下游)
```

**特点**: 
- 下游是客户，提出需求
- 上游是供应商，提供服务
- 需要协商接口

### 3. 防腐层 (Anti-Corruption Layer, ACL)

使用适配器隔离外部系统。

```csharp
// 防腐层：将外部支付系统的模型转换为内部模型
public class PaymentGatewayAdapter
{
    private readonly ExternalPaymentClient _client;
    
    public async Task<PaymentResult> ProcessPayment(Payment payment)
    {
        // 转换内部模型到外部模型
        var externalRequest = MapToExternal(payment);
        
        // 调用外部系统
        var externalResponse = await _client.Pay(externalRequest);
        
        // 转换外部响应到内部模型
        return MapToInternal(externalResponse);
    }
}
```

### 4. 遵循者 (Conformist)

下游完全遵循上游的模型。

```
内部订单系统 → 第三方ERP系统 (遵循)
```

**适用场景**: 外部系统强大但无法修改

### 5. 开放主机服务 (Open Host Service)

定义标准协议供多个下游使用。

```csharp
// RESTful API作为开放主机服务
[ApiController]
[Route("api/orders")]
public class OrdersApiController
{
    [HttpGet("{id}")]
    public async Task<OrderDto> GetOrder(Guid id)
    {
        // 提供标准的Order表示
    }
}
```

### 6. 发布语言 (Published Language)

使用标准化的数据格式交换信息。

```json
// 使用标准的订单JSON格式
{
  "orderId": "ORD-2024-001",
  "orderDate": "2024-01-01T10:00:00Z",
  "items": [...]
}
```

### 7. 各行其道 (Separate Ways)

两个上下文完全独立，没有集成。

```
内部CRM系统    外部营销系统
    (独立)          (独立)
```

### 8. 大泥球 (Big Ball of Mud)

无边界的混乱系统（应该避免）。

## 限界上下文的实现

### 物理边界

可以通过以下方式实现物理边界：

#### 1. 微服务

```
订单服务 (Order Service)
  ├── OrderAPI
  ├── OrderDB
  └── 独立部署

库存服务 (Inventory Service)
  ├── InventoryAPI
  ├── InventoryDB
  └── 独立部署
```

#### 2. 模块

在单体应用中通过模块划分：

```
MyApp/
├── Modules/
│   ├── Sales/          # 销售上下文
│   ├── Inventory/      # 库存上下文
│   └── Shipping/       # 配送上下文
```

#### 3. 代码结构

```csharp
namespace MyCompany.ECommerce.Sales          // 销售上下文
namespace MyCompany.ECommerce.Inventory     // 库存上下文
namespace MyCompany.ECommerce.Shipping      // 配送上下文
```

### 集成模式

#### 1. REST API

```csharp
// 订单上下文调用库存上下文
public class InventoryClient
{
    private readonly HttpClient _httpClient;
    
    public async Task<bool> CheckStock(ProductId productId, int quantity)
    {
        var response = await _httpClient.GetAsync(
            $"api/inventory/products/{productId}/stock");
        
        var stock = await response.Content.ReadAsAsync<StockInfo>();
        return stock.Available >= quantity;
    }
}
```

#### 2. 消息队列

```csharp
// 订单上下文发布事件
public class OrderService
{
    private readonly IEventBus _eventBus;
    
    public async Task SubmitOrder(Order order)
    {
        order.Submit();
        
        // 发布集成事件
        await _eventBus.Publish(new OrderSubmittedIntegrationEvent
        {
            OrderId = order.Id,
            Items = order.Items.Select(i => new OrderItemDto(...))
        });
    }
}

// 库存上下文订阅事件
public class OrderSubmittedEventHandler : IIntegrationEventHandler<OrderSubmittedIntegrationEvent>
{
    public async Task Handle(OrderSubmittedIntegrationEvent @event)
    {
        // 扣减库存
        await _inventoryService.ReserveStock(@event.Items);
    }
}
```

## 实践建议

### 1. 从粗粒度开始

初期可以有较大的上下文，随着理解深入再拆分。

### 2. 根据变化速率划分

变化频繁的部分应该独立出来。

### 3. 考虑团队结构

上下文边界应该与团队边界对齐。

### 4. 明确集成方式

在上下文映射中明确集成模式和责任。

### 5. 持续演进

随着业务发展，定期审视和调整上下文边界。

## 案例：电商系统

```
电商系统的限界上下文划分：

┌──────────────┐       ┌──────────────┐
│   销售上下文   │──────→│   库存上下文   │
│   (Sales)    │       │  (Inventory) │
└──────────────┘       └──────────────┘
      ↓                       ↓
┌──────────────┐       ┌──────────────┐
│   订单上下文   │──────→│   配送上下文   │
│   (Order)    │       │  (Shipping)  │
└──────────────┘       └──────────────┘
      ↓
┌──────────────┐
│   支付上下文   │
│  (Payment)   │
└──────────────┘

关系说明：
- 销售 → 库存: 检查库存（客户-供应商）
- 订单 → 配送: 创建运单（客户-供应商）
- 订单 → 支付: 处理支付（开放主机服务）
```

## 下一步

- [聚合根](aggregate-root.md) - 上下文内的数据一致性边界
- [领域事件](domain-events.md) - 上下文间的解耦通信
- [事件驱动架构](../architecture/event-driven.md) - 跨上下文集成
