package com.einsights.service;

import com.einsights.dto.ref.CustomerRefDto;
import com.einsights.dto.ref.ProductRefDto;
import com.einsights.model.Customer;
import com.einsights.model.Product;
import com.einsights.repository.CustomerRepository;
import com.einsights.repository.ProductRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RefService {

    private final ProductRepository productRepo;
    private final CustomerRepository customerRepo;

    public RefService(ProductRepository productRepo, CustomerRepository customerRepo) {
        this.productRepo = productRepo;
        this.customerRepo = customerRepo;
    }

    public List<ProductRefDto> products(String q, int limit) {
        var page = PageRequest.of(0, Math.max(1, Math.min(limit, 100)));
        return productRepo.searchRef(q, page).stream()
                .map(RefService::toProductRef)
                .toList();
    }

    public List<CustomerRefDto> customers(String q, int limit) {
        var page = PageRequest.of(0, Math.max(1, Math.min(limit, 100)));
        return customerRepo.searchRef(q, page).stream()
                .map(RefService::toCustomerRef)
                .toList();
    }

    private static ProductRefDto toProductRef(Product p) {
        return new ProductRefDto(p.getId(), p.getName(), p.getSku());
    }

    private static CustomerRefDto toCustomerRef(Customer c) {
        return new CustomerRefDto(c.getId(), c.getName(), c.getEmail());
    }
}
