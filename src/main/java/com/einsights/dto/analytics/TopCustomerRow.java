package com.einsights.dto.analytics;

import lombok.*;
import java.math.BigDecimal;

@Builder @Data
public class TopCustomerRow {
    private Long customerId;
    private String nameOrEmail;
    private long orders;
    private BigDecimal revenue;


    public TopCustomerRow(Long customerId, String nameOrEmail, long orders, BigDecimal revenue) {
        this.customerId = customerId;
        this.nameOrEmail = nameOrEmail;
        this.orders = orders;
        this.revenue = revenue;

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


    @Override
    public String toString() {
        return "TopCustomerRow{" +
                "customerId=" + customerId +
                ", nameOrEmail='" + nameOrEmail + '\'' +
                ", orders=" + orders +
                ", revenue=" + revenue +
                '}';
    }
}
