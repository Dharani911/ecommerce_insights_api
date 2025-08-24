package com.einsights.dto.analytics;

import lombok.*;
import java.math.BigDecimal;

@Builder @Data
public class SalesByDayRow {
    /** ISO date string yyyy-MM-dd for simplicity on the wire */
    private String date;
    private BigDecimal revenue;
    private long orders;
    private long units;

    public SalesByDayRow(String date, BigDecimal revenue, long orders, long units) {
        this.date = date;
        this.revenue = revenue;
        this.orders = orders;
        this.units = units;
    }

    public SalesByDayRow() {
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public long getOrders() {
        return orders;
    }

    public void setOrders(long orders) {
        this.orders = orders;
    }

    public long getUnits() {
        return units;
    }

    public void setUnits(long units) {
        this.units = units;
    }

    @Override
    public String toString() {
        return "SalesByDayRow{" +
                "date='" + date + '\'' +
                ", revenue=" + revenue +
                ", orders=" + orders +
                ", units=" + units +
                '}';
    }
}
