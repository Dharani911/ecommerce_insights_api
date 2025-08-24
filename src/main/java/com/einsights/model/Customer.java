package com.einsights.model;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.Objects;

@Entity
@Table(name = "customers")
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false, unique=true, length=320)
    private String email;

    @Column(length=120)
    private String name;

    @Column(name="created_at", nullable=false, updatable=false)
    private Instant createdAt = Instant.now();

    @Column(nullable=false)
    private boolean active = true;

    public Customer() {
    }

    public Customer(Long id, String email, String name, Instant createdAt, boolean active) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.createdAt = createdAt;
        this.active = active;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Customer customer)) return false;
        return isActive() == customer.isActive() && Objects.equals(getId(), customer.getId()) && Objects.equals(getEmail(), customer.getEmail()) && Objects.equals(getName(), customer.getName()) && Objects.equals(getCreatedAt(), customer.getCreatedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getEmail(), getName(), getCreatedAt(), isActive());
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", name='" + name + '\'' +
                ", createdAt=" + createdAt +
                ", active=" + active +
                '}';
    }
}
