package com.einsights.dto.analytics;


import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Builder @Data
public class TopProductRow {
    private Long productId;
    private String name;
    private long units;
    private BigDecimal revenue;

    public TopProductRow(Long productId, String name, long units, BigDecimal revenue) {
        this.productId = productId;
        this.name = name;
        this.units = units;
        this.revenue = revenue;
    }

    public TopProductRow() {
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getUnits() {
        return units;
    }

    public void setUnits(long units) {
        this.units = units;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    @Override
    public String toString() {
        return "TopProductRow{" +
                "productId=" + productId +
                ", name='" + name + '\'' +
                ", units=" + units +
                ", revenue=" + revenue +
                '}';
    }
}
