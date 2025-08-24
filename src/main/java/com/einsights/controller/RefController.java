package com.einsights.controller;

import com.einsights.dto.ref.CustomerRefDto;
import com.einsights.dto.ref.ProductRefDto;
import com.einsights.service.RefService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/ref")
public class RefController {

    private final RefService refService;
    public RefController(RefService refService) { this.refService = refService; }

    @GetMapping("/products")
    public ResponseEntity<List<ProductRefDto>> products(
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(refService.products(q, limit));
    }

    @GetMapping("/customers")
    public ResponseEntity<List<CustomerRefDto>> customers(
            @RequestParam(required = false) String q,
            @RequestParam(required = false, defaultValue = "20") int limit
    ) {
        return ResponseEntity.ok(refService.customers(q, limit));
    }
}
