package com.einsights.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="customer_id", nullable=false)
    private Customer customer;

    @Column(name="order_date", nullable=false)
    private LocalDate orderDate;

    @Column(length=30)
    private String status;

    private BigDecimal subtotal = BigDecimal.ZERO;
    private BigDecimal tax = BigDecimal.ZERO;
    private BigDecimal shipping = BigDecimal.ZERO;
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name="grand_total")
    private BigDecimal grandTotal = BigDecimal.ZERO;

    @Column(name = "currency", length = 3, nullable = false)
    private String currency = "EUR";

    @Column(name="created_at", nullable=false, updatable=false)
    private Instant createdAt = Instant.now();

    @OneToMany(mappedBy="order", cascade=CascadeType.ALL, orphanRemoval=true)
    private List<OrderItem> items;

    public Order() {
    }

    public Order(Long id, Customer customer, LocalDate orderDate, String status, BigDecimal subtotal, BigDecimal tax, BigDecimal shipping, BigDecimal discount, BigDecimal grandTotal, String currency, Instant createdAt, List<OrderItem> items) {
        this.id = id;
        this.customer = customer;
        this.orderDate = orderDate;
        this.status = status;
        this.subtotal = subtotal;
        this.tax = tax;
        this.shipping = shipping;
        this.discount = discount;
        this.grandTotal = grandTotal;
        this.currency = currency;
        this.createdAt = createdAt;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(BigDecimal subtotal) {
        this.subtotal = subtotal;
    }

    public BigDecimal getTax() {
        return tax;
    }

    public void setTax(BigDecimal tax) {
        this.tax = tax;
    }

    public BigDecimal getShipping() {
        return shipping;
    }

    public void setShipping(BigDecimal shipping) {
        this.shipping = shipping;
    }

    public BigDecimal getDiscount() {
        return discount;
    }

    public void setDiscount(BigDecimal discount) {
        this.discount = discount;
    }

    public BigDecimal getGrandTotal() {
        return grandTotal;
    }

    public void setGrandTotal(BigDecimal grandTotal) {
        this.grandTotal = grandTotal;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Order order)) return false;
        return Objects.equals(getId(), order.getId()) && Objects.equals(getCustomer(), order.getCustomer()) && Objects.equals(getOrderDate(), order.getOrderDate()) && Objects.equals(getStatus(), order.getStatus()) && Objects.equals(getSubtotal(), order.getSubtotal()) && Objects.equals(getTax(), order.getTax()) && Objects.equals(getShipping(), order.getShipping()) && Objects.equals(getDiscount(), order.getDiscount()) && Objects.equals(getGrandTotal(), order.getGrandTotal()) && Objects.equals(getCurrency(), order.getCurrency()) && Objects.equals(getCreatedAt(), order.getCreatedAt()) && Objects.equals(getItems(), order.getItems());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getCustomer(), getOrderDate(), getStatus(), getSubtotal(), getTax(), getShipping(), getDiscount(), getGrandTotal(), getCurrency(), getCreatedAt(), getItems());
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", customer=" + customer +
                ", orderDate=" + orderDate +
                ", status='" + status + '\'' +
                ", subtotal=" + subtotal +
                ", tax=" + tax +
                ", shipping=" + shipping +
                ", discount=" + discount +
                ", grandTotal=" + grandTotal +
                ", currency='" + currency + '\'' +
                ", createdAt=" + createdAt +
                ", items=" + items +
                '}';
    }
}
