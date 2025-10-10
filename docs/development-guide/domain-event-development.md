# 领域事件开发指南

## 什么是领域事件？

领域事件表示在业务领域中发生的重要事情，用于实现聚合之间的协作通信。当聚合根的状态发生变化时，应该发布相应的领域事件。

## 领域事件文件应该放在哪里？

类文件命名应遵循以下规则：

- 应放置在 `src/{ProjectName}.Domain/DomainEvents/` 目录下
- 为每个聚合添加一个领域事件文件
- 文件名格式为 `{Aggregate}DomainEvents.cs`
- 一个领域事件文件中可以包含多个领域事件

## 如何定义领域事件？

领域事件的定义应遵循以下规则：

- 必须使用 `record` 类型
- 必须标记接口`IDomainEvent`，无需额外实现
- 无额外信息传递需求时，将聚合作为构造函数参数
- 使用过去式动词描述已发生的事情
- 格式：`{Entity}{Action}DomainEvent`
- 例如：`UserCreatedDomainEvent`、`OrderPaidDomainEvent`、`ProductUpdatedDomainEvent`

## 什么时候应该发布领域事件？

领域事件应该在以下时机发布：

1. **创建聚合时**: 发布 `{Entity}CreatedDomainEvent`
2. **重要状态变更**: 如订单支付、订单发货等
3. **业务规则执行**: 如用户激活、产品上架等
4. **聚合删除**: 发布 `{Entity}DeletedDomainEvent`

## 如何编写基本领域事件？

**文件**: `src/MyProject.Domain/DomainEvents/UserDomainEvents.cs`

```csharp
using MyProject.Domain.AggregatesModel.UserAggregate;

namespace MyProject.Domain.DomainEvents;

public record UserCreatedDomainEvent(User User) : IDomainEvent;

public record UserEmailChangedDomainEvent(User User) : IDomainEvent;

public record UserDeletedDomainEvent(User User) : IDomainEvent;
```

### 如何编写带有额外信息的领域事件？

**文件**: `src/MyProject.Domain/DomainEvents/OrderDomainEvents.cs`

```csharp
using MyProject.Domain.AggregatesModel.OrderAggregate;

namespace MyProject.Domain.DomainEvents;

public record OrderCreatedDomainEvent(Order Order) : IDomainEvent;

public record OrderConfirmedDomainEvent(Order Order) : IDomainEvent;

public record OrderPaidDomainEvent(
    Order Order, 
    decimal Amount, 
    string PaymentMethod) : IDomainEvent;

public record OrderShippedDomainEvent(
    Order Order, 
    string TrackingNumber) : IDomainEvent;

public record OrderCancelledDomainEvent(
    Order Order, 
    string Reason) : IDomainEvent;

public record OrderItemAddedDomainEvent(
    Order Order, 
    OrderItem Item) : IDomainEvent;

public record OrderItemRemovedDomainEvent(
    Order Order, 
    OrderItemId ItemId) : IDomainEvent;
```

### 如何编写复杂场景的领域事件？

**文件**: `src/MyProject.Domain/DomainEvents/ProductDomainEvents.cs`

```csharp
using MyProject.Domain.AggregatesModel.ProductAggregate;

namespace MyProject.Domain.DomainEvents;

public record ProductCreatedDomainEvent(Product Product) : IDomainEvent;

public record ProductPriceChangedDomainEvent(
    Product Product, 
    decimal OldPrice, 
    decimal NewPrice) : IDomainEvent;

public record ProductStockChangedDomainEvent(
    Product Product, 
    int OldStock, 
    int NewStock, 
    string Reason) : IDomainEvent;

public record ProductPublishedDomainEvent(Product Product) : IDomainEvent;

public record ProductUnpublishedDomainEvent(Product Product) : IDomainEvent;
```

## 如何在聚合中发布领域事件？

### 基本发布方式

```csharp
public class User : Entity<UserId>, IAggregateRoot
{
    protected User() { }
    
    public User(string name, string email)
    {
        Name = name;
        Email = email;
        // 在构造函数中发布创建事件
        this.AddDomainEvent(new UserCreatedDomainEvent(this));
    }

    public void ChangeEmail(string email)
    {
        if (Email == email)
        {
            return; // 没有变化时不发布事件
        }
        
        Email = email;
        // 状态变更时发布事件
        this.AddDomainEvent(new UserEmailChangedDomainEvent(this));
    }

    public void Delete()
    {
        if (IsDeleted)
        {
            throw new KnownException("用户已被删除");
        }
        
        IsDeleted = true;
        // 删除时发布事件
        this.AddDomainEvent(new UserDeletedDomainEvent(this));
    }
}
```

### 如何发布带有额外信息的事件？

```csharp
public class Order : Entity<OrderId>, IAggregateRoot
{
    protected Order() { }
    
    public void Pay(decimal amount, string paymentMethod)
    {
        if (OrderStatus != OrderStatus.Confirmed)
        {
            throw new KnownException("只有已确认的订单才能支付");
        }
        
        if (amount != TotalAmount)
        {
            throw new KnownException("支付金额不正确");
        }
        
        OrderStatus = OrderStatus.Paid;
        PaidAt = DateTimeOffset.UtcNow;
        
        // 发布支付事件，包含支付金额和支付方式
        this.AddDomainEvent(new OrderPaidDomainEvent(this, amount, paymentMethod));
    }

    public void Ship(string trackingNumber)
    {
        if (OrderStatus != OrderStatus.Paid)
        {
            throw new KnownException("只有已支付的订单才能发货");
        }
        
        OrderStatus = OrderStatus.Shipped;
        ShippedAt = DateTimeOffset.UtcNow;
        TrackingNumber = trackingNumber;
        
        // 发布发货事件，包含物流单号
        this.AddDomainEvent(new OrderShippedDomainEvent(this, trackingNumber));
    }

    public void Cancel(string reason)
    {
        if (OrderStatus == OrderStatus.Completed)
        {
            throw new KnownException("已完成的订单不能取消");
        }
        
        OrderStatus = OrderStatus.Cancelled;
        CancelledAt = DateTimeOffset.UtcNow;
        CancelReason = reason;
        
        // 发布取消事件，包含取消原因
        this.AddDomainEvent(new OrderCancelledDomainEvent(this, reason));
    }
}
```

### 如何在复杂业务场景中发布事件？

```csharp
public class Product : Entity<ProductId>, IAggregateRoot
{
    protected Product() { }
    
    public void ChangePrice(decimal newPrice)
    {
        if (newPrice <= 0)
        {
            throw new KnownException("价格必须大于0");
        }
        
        if (Price == newPrice)
        {
            return; // 价格没有变化
        }
        
        var oldPrice = Price;
        Price = newPrice;
        
        // 发布价格变更事件，包含新旧价格
        this.AddDomainEvent(new ProductPriceChangedDomainEvent(this, oldPrice, newPrice));
    }

    public void IncreaseStock(int quantity, string reason)
    {
        if (quantity <= 0)
        {
            throw new KnownException("增加数量必须大于0");
        }
        
        var oldStock = Stock;
        Stock += quantity;
        
        // 发布库存变更事件
        this.AddDomainEvent(new ProductStockChangedDomainEvent(
            this, 
            oldStock, 
            Stock, 
            $"增加库存: {reason}"));
    }

    public void DecreaseStock(int quantity, string reason)
    {
        if (quantity <= 0)
        {
            throw new KnownException("减少数量必须大于0");
        }
        
        if (Stock < quantity)
        {
            throw new KnownException("库存不足");
        }
        
        var oldStock = Stock;
        Stock -= quantity;
        
        // 发布库存变更事件
        this.AddDomainEvent(new ProductStockChangedDomainEvent(
            this, 
            oldStock, 
            Stock, 
            $"减少库存: {reason}"));
    }

    public void Publish()
    {
        if (IsPublished)
        {
            return;
        }
        
        IsPublished = true;
        PublishedAt = DateTimeOffset.UtcNow;
        
        this.AddDomainEvent(new ProductPublishedDomainEvent(this));
    }

    public void Unpublish()
    {
        if (!IsPublished)
        {
            return;
        }
        
        IsPublished = false;
        
        this.AddDomainEvent(new ProductUnpublishedDomainEvent(this));
    }
}
```

## 如何命名领域事件？

### 标准命名格式

领域事件应该使用过去式动词，表示已经发生的事情：

- ✅ `UserCreatedDomainEvent` - 用户已创建
- ✅ `OrderPaidDomainEvent` - 订单已支付
- ✅ `ProductPublishedDomainEvent` - 产品已发布
- ❌ `CreateUserDomainEvent` - 不应使用动词原形
- ❌ `PayingOrderDomainEvent` - 不应使用进行时

### 常用动词有哪些？

- Created - 创建
- Updated - 更新
- Deleted - 删除
- Changed - 变更
- Confirmed - 确认
- Cancelled - 取消
- Paid - 支付
- Shipped - 发货
- Completed - 完成
- Published - 发布
- Activated - 激活
- Deactivated - 停用

## 领域事件如何被处理？

领域事件发布后，会被相应的领域事件处理器处理。关于如何编写领域事件处理器，请参考[领域事件处理器开发指南](domain-event-handler-development.md)。

## 领域事件有哪些最佳实践？

### 1. 事件粒度

- **适中粒度**: 事件应该代表有意义的业务行为
- **避免过细**: 不要为每个属性变更都创建事件
- **避免过粗**: 一个事件不应包含太多不相关的信息

### 2. 事件不变性

- **使用record类型**: 确保事件不可变
- **传递必要信息**: 包含处理事件所需的所有信息
- **避免懒加载**: 事件中不应包含需要延迟加载的导航属性

### 3. 事件时序

- **明确顺序**: 事件应该按照业务逻辑的顺序发布
- **因果关系**: 确保事件之间的因果关系正确
- **幂等处理**: 事件处理器应该能够处理重复的事件

### 4. 事件设计

```csharp
// ✅ 好的设计 - 包含必要信息
public record OrderPaidDomainEvent(
    Order Order, 
    decimal Amount, 
    string PaymentMethod, 
    DateTimeOffset PaidAt) : IDomainEvent;

// ❌ 不好的设计 - 信息不足
public record OrderPaidDomainEvent(Order Order) : IDomainEvent;

// ❌ 不好的设计 - 包含懒加载属性
public record OrderPaidDomainEvent(
    Order Order, // Order.Customer 可能未加载
    Customer Customer) : IDomainEvent;
```

## 遇到常见问题怎么办？

### 为什么事件未发布？

**问题**: 聚合状态变更了但事件未发布

**原因**: 忘记调用 `this.AddDomainEvent()`

**解决**: 在所有重要的状态变更方法中添加事件发布代码

### 为什么事件重复发布？

**问题**: 同一个事件被发布多次

**原因**: 在多个地方重复调用了 `AddDomainEvent`

**解决**: 确保每个业务操作只发布一次相应的事件

### 为什么事件处理出现异常？

**问题**: 事件处理器抛出异常导致事务回滚

**原因**: 领域事件处理器中的业务逻辑有误

**解决**: 参考[领域事件处理器开发指南](domain-event-handler-development.md)正确实现事件处理

## 在哪里可以找到相关文档？

- [聚合开发指南](aggregate-development.md)
- [领域事件处理器开发指南](domain-event-handler-development.md)
- [集成事件开发指南](integration-event-development.md)
