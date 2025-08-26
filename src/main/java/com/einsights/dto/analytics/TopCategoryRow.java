package com.einsights.dto.analytics;

import lombok.*;
import java.math.BigDecimal;

@Builder @Data
public class TopCategoryRow {

    private String name;
    private long units;
    private BigDecimal revenue;

    public TopCategoryRow() {
    }

    public TopCategoryRow( String name, long units, BigDecimal revenue) {

        this.name = name;
        this.units = units;
        this.revenue = revenue;
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
                ", name='" + name + '\'' +
                ", units=" + units +
                ", revenue=" + revenue +
                '}';
    }
}
