package com.einsights.service;

import com.einsights.dto.ingest.IngestOrderItemRequest;
import com.einsights.dto.ingest.IngestOrderRequest;
import com.einsights.exception.BadRequestException;
import com.einsights.exception.NotFoundException;
import com.einsights.model.*;
import com.einsights.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Service
public class IngestService {

    private final CustomerRepository customerRepo;
    private final ProductRepository productRepo;
    private final OrderRepository orderRepo;
    private final OrderItemRepository orderItemRepo;

    public IngestService(CustomerRepository customerRepo,
                         ProductRepository productRepo,
                         OrderRepository orderRepo,
                         OrderItemRepository orderItemRepo) {
        this.customerRepo = customerRepo;
        this.productRepo = productRepo;
        this.orderRepo = orderRepo;
        this.orderItemRepo = orderItemRepo;
    }

    /**
     * Creates a single order (and its items) for an existing customer and products by ID.
     * Uses order-level currency for items; computes line_total = quantity * unit_price.
     */
    @Transactional
    public void ingestOrders(IngestOrderRequest req) {
        if (req == null) throw new BadRequestException("Payload is required.");
        if (req.getCustomerId() == null) throw new BadRequestException("customerId is required.");
        if (req.getOrderDate() == null) throw new BadRequestException("orderDate is required.");
        if (req.getStatus() == null || req.getStatus().isBlank()) throw new BadRequestException("status is required.");
        if (req.getCurrency() == null || req.getCurrency().isBlank()) throw new BadRequestException("currency is required.");
        if (req.getItems() == null || req.getItems().isEmpty()) throw new BadRequestException("items are required.");

        // 1) Resolve customer
        Customer customer = customerRepo.findById(req.getCustomerId())
                .orElseThrow(() -> new NotFoundException("Customer not found: " + req.getCustomerId()));

        // 2) Parse status to enum
        OrderStatus status = parseStatus(req.getStatus());

        // 3) Create order
        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderDate(req.getOrderDate());
        order.setStatus(String.valueOf(status));
        order.setSubtotal(nz(req.getSubtotal()));
        order.setTax(nz(req.getTax()));
        order.setShipping(nz(req.getShipping()));
        order.setDiscount(nz(req.getDiscount()));
        order.setGrandTotal(nz(req.getGrandTotal()));
        order.setCurrency(req.getCurrency().toUpperCase());
        order.setCreatedAt(OffsetDateTime.now().toInstant());
        order = orderRepo.save(order);

        // 4) Create items
        for (IngestOrderItemRequest it : req.getItems()) {
            if (it.getProductId() == null) throw new BadRequestException("Each item must have productId.");
            if (it.getQuantity() == null || it.getQuantity() <= 0) throw new BadRequestException("Item quantity must be > 0.");
            if (it.getUnitPrice() == null) throw new BadRequestException("Item unitPrice is required.");

            Product product = productRepo.findById(it.getProductId())
                    .orElseThrow(() -> new NotFoundException("Product not found: " + it.getProductId()));

            BigDecimal lineTotal = it.getUnitPrice().multiply(BigDecimal.valueOf(it.getQuantity()));

            OrderItem oi = new OrderItem();
            oi.setOrder(order);
            oi.setProduct(product);
            oi.setQuantity(it.getQuantity());
            oi.setUnitPrice(it.getUnitPrice());
            oi.setLineTotal(lineTotal);
            oi.setCurrency(order.getCurrency()); // keep items consistent with order currency
            orderItemRepo.save(oi);
        }

        // (Optional) sanity: ensure grand_total ≈ subtotal + tax + shipping − discount
        // You can add a tolerance check here if desired.
    }

    private static BigDecimal nz(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }

    private static OrderStatus parseStatus(String raw) {
        String s = raw.trim().toUpperCase();
        try {
            return OrderStatus.valueOf(s);
        } catch (IllegalArgumentException ex) {
            throw new BadRequestException("Unsupported order status: " + raw +
                    " (expected one of: PAID, PENDING, CANCELLED, REFUNDED)");
        }
    }
}
