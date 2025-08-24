package com.einsights.dto.analytics;

import lombok.*;
import java.math.BigDecimal;

@Builder @Data
public class TopCategoryRow {
    private Long categoryId;
    private String name;
    private long units;
    private BigDecimal revenue;

    public TopCategoryRow() {
    }

    public TopCategoryRow(Long categoryId, String name, long units, BigDecimal revenue) {
        this.categoryId = categoryId;
        this.name = name;
        this.units = units;
        this.revenue = revenue;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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
        return "TopCategoryRow{" +
                "categoryId=" + categoryId +
                ", name='" + name + '\'' +
                ", units=" + units +
                ", revenue=" + revenue +
                '}';
    }
}
