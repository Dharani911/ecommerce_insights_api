package com.einsights.dto.analytics;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data @Builder
public class SummaryResponse {
    private BigDecimal revenue;
    private long orders;
    private long units;
    private BigDecimal aov;
    private long newCustomers;
    private long returningCustomers;
    private double returningRate;

    public SummaryResponse() {
    }

    public SummaryResponse(BigDecimal revenue, long orders, long units, BigDecimal aov, long newCustomers, long returningCustomers, double returningRate) {
        this.revenue = revenue;
        this.orders = orders;
        this.units = units;
        this.aov = aov;
        this.newCustomers = newCustomers;
        this.returningCustomers = returningCustomers;
        this.returningRate = returningRate;
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

    public BigDecimal getAov() {
        return aov;
    }

    public void setAov(BigDecimal aov) {
        this.aov = aov;
    }

    public long getNewCustomers() {
        return newCustomers;
    }

    public void setNewCustomers(long newCustomers) {
        this.newCustomers = newCustomers;
    }

    public long getReturningCustomers() {
        return returningCustomers;
    }

    public void setReturningCustomers(long returningCustomers) {
        this.returningCustomers = returningCustomers;
    }

    public double getReturningRate() {
        return returningRate;
    }

    public void setReturningRate(double returningRate) {
        this.returningRate = returningRate;
    }

    @Override
    public String toString() {
        return "SummaryResponse{" +
                "revenue=" + revenue +
                ", orders=" + orders +
                ", units=" + units +
                ", aov=" + aov +
                ", newCustomers=" + newCustomers +
                ", returningCustomers=" + returningCustomers +
                ", returningRate=" + returningRate +
                '}';
    }
}
