package com.einsights.dto.ingest;

import jakarta.validation.constraints.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data @Builder
public class IngestOrderRequest {
    @NotNull private Long customerId;          // simple MVP variant
    @NotNull private LocalDate orderDate;
    @NotBlank private String status;           // "PAID","PENDING","CANCELLED","REFUNDED"
    @NotBlank private String currency;

    @NotNull @DecimalMin("0.00") private BigDecimal subtotal;
    @NotNull @DecimalMin("0.00") private BigDecimal tax;
    @NotNull @DecimalMin("0.00") private BigDecimal shipping;
    @NotNull @DecimalMin("0.00") private BigDecimal discount;
    @NotNull @DecimalMin("0.00") private BigDecimal grandTotal;

    @NotEmpty private List<IngestOrderItemRequest> items;

    public IngestOrderRequest() {
    }

    public IngestOrderRequest(Long customerId, LocalDate orderDate, String status, String currency, BigDecimal subtotal, BigDecimal tax, BigDecimal shipping, BigDecimal discount, BigDecimal grandTotal, List<IngestOrderItemRequest> items) {
        this.customerId = customerId;
        this.orderDate = orderDate;
        this.status = status;
        this.currency = currency;
        this.subtotal = subtotal;
        this.tax = tax;
        this.shipping = shipping;
        this.discount = discount;
        this.grandTotal = grandTotal;
        this.items = items;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
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

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
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

    public List<IngestOrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<IngestOrderItemRequest> items) {
        this.items = items;
    }

    @Override
    public String toString() {
        return "IngestOrderRequest{" +
                "customerId=" + customerId +
                ", orderDate=" + orderDate +
                ", status='" + status + '\'' +
                ", currency='" + currency + '\'' +
                ", subtotal=" + subtotal +
                ", tax=" + tax +
                ", shipping=" + shipping +
                ", discount=" + discount +
                ", grandTotal=" + grandTotal +
                ", items=" + items +
                '}';
    }
}
