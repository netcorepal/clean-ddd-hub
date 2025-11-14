# 值对象（Value Object）

值对象用来表达一个“概念的取值”，关注属性组合及其业务含义，而非同一性；它应当是不可变的，等价性基于“值相等”。

## 关键特性

- 不可变：创建后属性不可修改；修改以“新建替换”方式进行
- 等价性基于值：两个值对象的所有关键属性相等则视为相等
- 无独立身份标识：通常不需要单独主键

## 何时建模为值对象

- 侧重表达规则与计算的“值”，例如：金额、区间、地址、邮箱、坐标等
- 希望在聚合内部安全复用且易于测试

## 示例（伪代码）

```csharp
public readonly struct Money
{
    public decimal Amount { get; }
    public string Currency { get; }

    public Money(decimal amount, string currency)
    {
        if (amount < 0) throw new DomainException("Amount cannot be negative");
        Amount = amount;
        Currency = currency;
    }

    public static Money operator +(Money a, Money b)
        => a.Currency == b.Currency
            ? new Money(a.Amount + b.Amount, a.Currency)
            : throw new DomainException("Currency mismatch");
}
```

## 相关阅读

- [实体（Entity）](./entity.md)
- [实体与值对象（概览）](./entity-value-object.md)
