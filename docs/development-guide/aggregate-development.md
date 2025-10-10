# 聚合与强类型ID开发指南

## 概述

聚合根是 DDD 中的核心概念，代表一组相关对象的根实体，负责维护业务规则和数据一致性。在本模板中，所有聚合根都继承自 `Entity<TId>` 并实现 `IAggregateRoot` 接口。同时，本模板使用强类型ID提供类型安全，避免了不同实体ID之间的混淆。

## 文件与目录

类文件命名应遵循以下规则：

- 应放置在 `src/{ProjectName}.Domain/AggregatesModel/{AggregateName}Aggregate/` 目录下
- 例如 `src/MyProject.Domain/AggregatesModel/UserAggregate/User.cs`
- 每个聚合在独立文件夹中
- 聚合根类名与文件名一致
- 强类型ID与聚合根定义在同一文件中

## 强类型ID开发规则

强类型ID的定义应遵循以下规则：

- 使用 `IInt64StronglyTypedId` 或 `IGuidStronglyTypedId` 接口
- 使用 `partial record` 声明，让框架生成具体实现
- 必须是public类型
- 与聚合/实体在同一个文件中定义
- 命名格式为 `{EntityName}Id`

## 聚合根开发规则

聚合根的定义应遵循以下规则：

- 聚合内必须有一个且只有一个聚合根
- 命名不需要带后缀Aggregate
- 必须继承 `Entity<TId>` 并实现 `IAggregateRoot` 接口
- 必须使用强类型ID，推荐使用 `IGuidStronglyTypedId`
- 必须有 protected 无参构造器供 EF Core 使用
- 状态改变时发布领域事件，使用 `this.AddDomainEvent()`
- 所有属性使用 `private set`,并显示设置默认值
- 无需手动设置ID的值
- RowVersion 属性用于乐观并发控制

## 子实体的定义应遵循以下规则

- 必须是 `public` 类
- 必须有一个无参构造器
- 必须有一个强类型ID，推荐使用 `IGuidStronglyTypedId`
- 必须继承自 `Entity<TId>`，并实现 `IEntity` 接口
- 聚合内允许多个子实体

## 代码示例

### 聚合根示例

文件: `src/MyProject.Domain/AggregatesModel/UserAggregate/User.cs`

```csharp
using MyProject.Domain.DomainEvents; // 必需：引用领域事件

namespace MyProject.Domain.AggregatesModel.UserAggregate;

// 强类型ID定义 - 与聚合根在同一文件中
public partial record UserId : IGuidStronglyTypedId;

public class User : Entity<UserId>, IAggregateRoot
{
    protected User() { }
    
    public User(string name, string email)
    {
        // 不手动设置ID，由EF Core值生成器自动生成
        Name = name;
        Email = email;
        this.AddDomainEvent(new UserCreatedDomainEvent(this));
    }

    #region Properties

    public string Name { get; private set; } = string.Empty;
    public string Email { get; private set; } = string.Empty;
    public RowVersion RowVersion { get; private set; } = new RowVersion(0);

    #endregion

    #region Methods

    public void ChangeEmail(string email)
    {
        Email = email;
        this.AddDomainEvent(new UserEmailChangedDomainEvent(this));
    }

    #endregion
}
```

### 带有子实体的聚合示例

文件: `src/MyProject.Domain/AggregatesModel/OrderAggregate/Order.cs`

```csharp
using MyProject.Domain.DomainEvents;

namespace MyProject.Domain.AggregatesModel.OrderAggregate;

// 订单ID
public partial record OrderId : IGuidStronglyTypedId;

// 订单项ID
public partial record OrderItemId : IGuidStronglyTypedId;

// 订单聚合根
public class Order : Entity<OrderId>, IAggregateRoot
{
    protected Order() { }
    
    private readonly List<OrderItem> _orderItems = new();
    
    public Order(string customerName)
    {
        CustomerName = customerName;
        OrderStatus = OrderStatus.Pending;
        this.AddDomainEvent(new OrderCreatedDomainEvent(this));
    }

    #region Properties

    public string CustomerName { get; private set; } = string.Empty;
    public OrderStatus OrderStatus { get; private set; }
    public IReadOnlyCollection<OrderItem> OrderItems => _orderItems.AsReadOnly();
    public RowVersion RowVersion { get; private set; } = new RowVersion(0);

    #endregion

    #region Methods

    public void AddItem(string productName, decimal price, int quantity)
    {
        var orderItem = new OrderItem(productName, price, quantity);
        _orderItems.Add(orderItem);
        this.AddDomainEvent(new OrderItemAddedDomainEvent(this, orderItem));
    }

    public void Confirm()
    {
        if (OrderStatus != OrderStatus.Pending)
        {
            throw new KnownException("只有待确认的订单才能被确认");
        }
        
        OrderStatus = OrderStatus.Confirmed;
        this.AddDomainEvent(new OrderConfirmedDomainEvent(this));
    }

    #endregion
}

// 订单项 - 子实体
public class OrderItem : Entity<OrderItemId>, IEntity
{
    protected OrderItem() { }
    
    public OrderItem(string productName, decimal price, int quantity)
    {
        ProductName = productName;
        Price = price;
        Quantity = quantity;
    }

    public string ProductName { get; private set; } = string.Empty;
    public decimal Price { get; private set; }
    public int Quantity { get; private set; }
}

// 订单状态枚举
public enum OrderStatus
{
    Pending,
    Confirmed,
    Shipped,
    Completed,
    Cancelled
}
```

## 常见错误排查

### 领域事件引用错误

**错误**: `未能找到类型或命名空间名"UserCreatedDomainEvent"`

**原因**: 缺少对领域事件命名空间的引用

**解决**: 在聚合根文件顶部添加 `using {ProjectName}.Domain.DomainEvents;`

### ID手动赋值错误

**错误**: 手动在构造函数中设置ID值

**原因**: 违反了框架设计原则

**解决**: 移除ID赋值代码，让EF Core值生成器自动生成

### 缺少无参构造器

**错误**: EF Core无法实例化实体

**原因**: 缺少protected无参构造器

**解决**: 添加 `protected EntityName() { }` 构造器

## 最佳实践

1. **业务逻辑封装**: 将所有业务逻辑放在聚合根的方法中，而不是在外部操作属性
2. **不变性保护**: 使用 `private set` 确保只能通过业务方法修改状态
3. **领域事件发布**: 在每个重要的状态变更时发布领域事件
4. **强类型ID**: 始终使用强类型ID，避免ID类型混淆
5. **边界明确**: 每个聚合应该有明确的业务边界，避免过大的聚合
6. **子实体管理**: 子实体应该通过聚合根的方法来添加、修改和删除

## 相关文档

- [领域事件开发指南](domain-event-development.md)
- [实体配置指南](entity-configuration.md)
- [仓储开发指南](repository-development.md)
