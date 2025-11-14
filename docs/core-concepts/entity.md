# 实体（Entity）

实体是具有“稳定身份标识”的领域对象，其业务上的“同一性”随时间持久存在，即使属性发生改变也仍是同一个实体。

## 关键特性

- 唯一标识（ID）定义同一性，等价性基于 ID，而非全部属性
- 拥有状态与行为，状态可变，行为受不变式约束
- 生命周期清晰：创建 → 演进（状态变更）→ 归档/删除

## 何时建模为实体

- 需要跨用例长期追踪同一对象（例如用户、订单、账户）
- 需要在并发/事务中维护不变式与一致性
- 需要独立的持久化主键

## 示例（伪代码）

```csharp
public class Order
{
    public Guid Id { get; }
    private readonly List<OrderLine> _lines = new();

    public Money Total => _lines.Aggregate(Money.Zero, (sum, l) => sum + l.Subtotal);

    public void AddLine(ProductId productId, int quantity, Money unitPrice)
    {
        // 领域不变式：数量>0
        if (quantity <= 0) throw new DomainException("Quantity must be positive");
        _lines.Add(new OrderLine(productId, quantity, unitPrice));
    }
}
```

上例中 `Order` 的同一性由 `Id` 决定；即使订单行改变，`Order` 仍是同一个实体。

## 相关阅读

- [值对象（Value Object）](./value-object.md)
- [实体与值对象（概览）](./entity-value-object.md)

