package com.einsights.controller;

import com.einsights.dto.ingest.IngestOrderRequest;
import com.einsights.service.IngestService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ingest")
public class IngestController {
    private final IngestService ingestService;
    public IngestController(IngestService ingestService){ this.ingestService = ingestService; }

    @PostMapping("/orders")
    public ResponseEntity<Void> ingestOrders(@Valid @RequestBody IngestOrderRequest payload){
        ingestService.ingestOrders(payload);
        return ResponseEntity.accepted().build();
    }
}
