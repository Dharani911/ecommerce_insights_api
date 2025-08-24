package com.einsights.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "products")
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length=64)
    private String sku;

    @Column(nullable=false, length=200)
    private String name;

    @Column(name="unit_price", precision=12, scale=2)
    private BigDecimal unitPrice;

    @Column(name = "currency", length = 3, nullable = false)
    private String currency = "EUR";

    @Column(nullable=false)
    private boolean active = true;

    @Column(name="created_at", nullable=false, updatable=false)
    private Instant createdAt = Instant.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSku() {
        return sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(BigDecimal unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Product(Long id, String sku, String name, BigDecimal unitPrice, String currency, boolean active, Instant createdAt) {
        this.id = id;
        this.sku = sku;
        this.name = name;
        this.unitPrice = unitPrice;
        this.currency = currency;
        this.active = active;
        this.createdAt = createdAt;
    }

    public Product() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Product product)) return false;
        return isActive() == product.isActive() && Objects.equals(getId(), product.getId()) && Objects.equals(getSku(), product.getSku()) && Objects.equals(getName(), product.getName()) && Objects.equals(getUnitPrice(), product.getUnitPrice()) && Objects.equals(getCurrency(), product.getCurrency()) && Objects.equals(getCreatedAt(), product.getCreatedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getSku(), getName(), getUnitPrice(), getCurrency(), isActive(), getCreatedAt());
    }

    @Override
    public String toString() {
        return "Product{" +
                "id=" + id +
                ", sku='" + sku + '\'' +
                ", name='" + name + '\'' +
                ", unitPrice=" + unitPrice +
                ", currency='" + currency + '\'' +
                ", active=" + active +
                ", createdAt=" + createdAt +
                '}';
    }
}
