# 领域模型

## 什么是领域模型

领域模型(Domain Model)是对业务领域的抽象表达，它将现实世界的业务概念、规则和流程用代码的形式表达出来。领域模型是DDD的核心，它应该：

- **反映业务概念**: 使用业务领域的语言和概念
- **包含业务规则**: 封装业务逻辑和约束
- **独立于技术**: 不依赖特定的技术实现
- **易于理解**: 代码即文档，清晰表达业务意图

## 领域模型的组成

一个完整的领域模型通常包含以下元素：

### 1. 实体 (Entity)

具有唯一标识的对象，即使属性相同，不同的实体也是不同的对象。

```csharp
public class Customer : Entity<CustomerId>
{
    public string Name { get; private set; }
    public Email Email { get; private set; }
    public CustomerStatus Status { get; private set; }
    
    public void Activate()
    {
        if (Status == CustomerStatus.Active)
            throw new DomainException("Customer is already active");
        
        Status = CustomerStatus.Active;
    }
}
```

### 2. 值对象 (Value Object)

没有唯一标识，只关注属性值的对象。值对象是不可变的。

```csharp
public record Email
{
    public string Value { get; }
    
    public Email(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            throw new ArgumentException("Email cannot be empty");
        
        if (!IsValidEmail(value))
            throw new ArgumentException("Invalid email format");
        
        Value = value;
    }
    
    private static bool IsValidEmail(string email)
    {
        // 邮箱验证逻辑
        return Regex.IsMatch(email, @"^[^@\s]+@[^@\s]+\.[^@\s]+$");
    }
}
```

### 3. 聚合 (Aggregate)

一组相关对象的集合，作为数据修改的单元。聚合确保了业务不变式(Invariant)。

```csharp
public class Order : AggregateRoot<OrderId>
{
    private readonly List<OrderLine> _lines = new();
    public IReadOnlyCollection<OrderLine> Lines => _lines.AsReadOnly();
    
    public Money TotalAmount => Money.Sum(_lines.Select(l => l.Amount));
    
    public void AddLine(ProductId productId, Quantity quantity, Money unitPrice)
    {
        // 业务规则：不能添加重复产品
        if (_lines.Any(l => l.ProductId == productId))
            throw new DomainException("Product already exists in order");
        
        var line = new OrderLine(productId, quantity, unitPrice);
        _lines.Add(line);
    }
}
```

### 4. 领域服务 (Domain Service)

不属于任何实体或值对象的业务逻辑。

```csharp
public class PriceCalculationService
{
    public Money CalculateOrderTotal(Order order, Customer customer)
    {
        var subtotal = order.TotalAmount;
        var discount = customer.VipLevel.GetDiscount();
        
        return subtotal * (1 - discount);
    }
}
```

## 设计原则

### 1. 充血模型 vs 贫血模型

**❌ 贫血模型** (Anemic Model) - 应该避免

```csharp
// 错误示例：只有数据，没有行为
public class Order
{
    public Guid Id { get; set; }
    public string Status { get; set; }
    public List<OrderLine> Lines { get; set; }
}

// 业务逻辑分散在服务中
public class OrderService
{
    public void Submit(Order order)
    {
        if (order.Status != "Draft")
            throw new Exception("Invalid status");
        order.Status = "Submitted";
    }
}
```

**✅ 充血模型** (Rich Model) - 推荐

```csharp
// 正确示例：封装数据和行为
public class Order : AggregateRoot<OrderId>
{
    public OrderStatus Status { get; private set; }
    private readonly List<OrderLine> _lines = new();
    
    public void Submit()
    {
        if (Status != OrderStatus.Draft)
            throw new DomainException("Only draft orders can be submitted");
        
        Status = OrderStatus.Submitted;
        RaiseDomainEvent(new OrderSubmittedEvent(Id));
    }
}
```

### 2. 统一语言

使用业务领域的术语命名类、方法和属性。

```csharp
// ✅ 好的命名
public class Invoice
{
    public void Issue() { }
    public void Cancel() { }
    public void MarkAsPaid() { }
}

// ❌ 差的命名
public class Invoice
{
    public void Process() { }  // 太模糊
    public void Delete() { }   // 不是业务术语
    public void SetStatus(int status) { }  // 暴露实现细节
}
```

### 3. 封装

隐藏内部状态，只暴露必要的行为。

```csharp
public class BankAccount
{
    public Money Balance { get; private set; }
    
    // ✅ 提供业务方法
    public void Deposit(Money amount)
    {
        if (amount.Value <= 0)
            throw new DomainException("Deposit amount must be positive");
        
        Balance = Balance.Add(amount);
    }
    
    // ❌ 不要暴露setter
    // public void SetBalance(Money balance) { }
}
```

### 4. 不变式 (Invariant)

确保领域对象始终处于有效状态。

```csharp
public class ShoppingCart
{
    private readonly List<CartItem> _items = new();
    public IReadOnlyCollection<CartItem> Items => _items.AsReadOnly();
    
    // 不变式：购物车最多10个商品
    private const int MaxItems = 10;
    
    public void AddItem(ProductId productId, int quantity)
    {
        if (_items.Count >= MaxItems)
            throw new DomainException($"Cart cannot have more than {MaxItems} items");
        
        // 其他业务逻辑...
    }
}
```

## 领域模型的生命周期

### 1. 创建

使用工厂方法或构造函数创建对象，确保对象创建时就是有效的。

```csharp
public class Order
{
    // 私有构造函数
    private Order(CustomerId customerId)
    {
        Id = OrderId.New();
        CustomerId = customerId;
        Status = OrderStatus.Draft;
        CreatedAt = DateTime.UtcNow;
    }
    
    // 工厂方法
    public static Order CreateFor(Customer customer)
    {
        if (!customer.IsActive)
            throw new DomainException("Cannot create order for inactive customer");
        
        return new Order(customer.Id);
    }
}
```

### 2. 修改

通过领域方法修改状态，而不是直接修改属性。

```csharp
// ✅ 通过方法修改
order.Submit();
order.AddItem(productId, quantity);
order.ApplyDiscount(discountCode);

// ❌ 不要直接修改
// order.Status = OrderStatus.Submitted;
```

### 3. 删除

根据业务需求决定是物理删除还是逻辑删除。

```csharp
public class Customer
{
    public bool IsDeleted { get; private set; }
    
    public void Delete()
    {
        if (HasActiveOrders())
            throw new DomainException("Cannot delete customer with active orders");
        
        IsDeleted = true;
        RaiseDomainEvent(new CustomerDeletedEvent(Id));
    }
}
```

## 实践建议

### 1. 从业务出发

与领域专家沟通，理解业务概念和规则，然后再编写代码。

### 2. 迭代演进

领域模型不是一次性设计完成的，要根据对业务的理解不断迭代改进。

### 3. 单元测试

为领域模型编写充分的单元测试，确保业务规则正确实现。

```csharp
[Test]
public void Submit_DraftOrder_ShouldChangeStatusToSubmitted()
{
    // Arrange
    var order = Order.CreateFor(customer);
    
    // Act
    order.Submit();
    
    // Assert
    Assert.Equal(OrderStatus.Submitted, order.Status);
}

[Test]
public void Submit_AlreadySubmittedOrder_ShouldThrowException()
{
    // Arrange
    var order = Order.CreateFor(customer);
    order.Submit();
    
    // Act & Assert
    Assert.Throws<DomainException>(() => order.Submit());
}
```

### 4. 保持简单

不要过度设计，从简单开始，根据需要逐步增加复杂度。

## 常见错误

### ❌ 1. 贫血模型

领域对象只有getter/setter，没有业务行为。

### ❌ 2. 技术泄露

在领域模型中引用基础设施细节（如数据库、HTTP等）。

### ❌ 3. 过度抽象

为了"灵活性"而引入不必要的抽象层。

### ❌ 4. 忽视不变式

允许对象进入无效状态。

## 下一步

- [限界上下文](bounded-context.md) - 了解如何划分领域边界
- [聚合](aggregate.md) - 深入理解聚合设计
- [实体与值对象](entity-value-object.md) - 区分两种领域对象
- [领域事件](domain-events.md) - 使用事件解耦业务流程
