package com.einsights.dto.analytics;

import lombok.*;
import java.math.BigDecimal;

@Builder @Data
public class TopCustomerRow {
    private Long customerId;
    private String nameOrEmail;
    private long orders;
    private BigDecimal revenue;
    private String lastOrderDate; // yyyy-MM-dd

    public TopCustomerRow(Long customerId, String nameOrEmail, long orders, BigDecimal revenue, String lastOrderDate) {
        this.customerId = customerId;
        this.nameOrEmail = nameOrEmail;
        this.orders = orders;
        this.revenue = revenue;
        this.lastOrderDate = lastOrderDate;
    }

    public TopCustomerRow() {
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getNameOrEmail() {
        return nameOrEmail;
    }

    public void setNameOrEmail(String nameOrEmail) {
        this.nameOrEmail = nameOrEmail;
    }

    public long getOrders() {
        return orders;
    }

    public void setOrders(long orders) {
        this.orders = orders;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public String getLastOrderDate() {
        return lastOrderDate;
    }

    public void setLastOrderDate(String lastOrderDate) {
        this.lastOrderDate = lastOrderDate;
    }

    @Override
    public String toString() {
        return "TopCustomerRow{" +
                "customerId=" + customerId +
                ", nameOrEmail='" + nameOrEmail + '\'' +
                ", orders=" + orders +
                ", revenue=" + revenue +
                ", lastOrderDate='" + lastOrderDate + '\'' +
                '}';
    }
}
