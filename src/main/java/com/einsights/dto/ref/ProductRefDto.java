package com.einsights.dto.ref;

public class ProductRefDto {
    private Long id;
    private String name;
    private String sku;

    public ProductRefDto() {}
    public ProductRefDto(Long id, String name, String sku) {
        this.id = id; this.name = name; this.sku = sku;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
}
