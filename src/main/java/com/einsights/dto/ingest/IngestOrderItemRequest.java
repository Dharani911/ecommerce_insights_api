package com.einsights.dto.ingest;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;

@Data @Builder
public class IngestOrderItemRequest {
    @NotNull private Long productId;       // or provide sku/name in a later variant
    @NotNull @Positive private Integer quantity;
    @NotNull @DecimalMin("0.00") private BigDecimal unitPrice;
    @NotBlank private String currency;     // "USD", "EUR", ...

    public IngestOrderItemRequest(Long productId, Integer quantity, BigDecimal unitPrice, String currency) {
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.currency = currency;
    }

    public IngestOrderItemRequest() {
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
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

    @Override
    public String toString() {
        return "IngestOrderItemRequest{" +
                "productId=" + productId +
                ", quantity=" + quantity +
                ", unitPrice=" + unitPrice +
                ", currency='" + currency + '\'' +
                '}';
    }
}
