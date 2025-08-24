package com.einsights.repository;

import com.einsights.model.Customer;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByEmail(String email);
    boolean existsByEmail(String email);
    @Query("""
      select c from Customer c
      where (:q is null or :q = '' or
            lower(c.name)  like lower(concat('%', :q, '%')) or
            lower(c.email) like lower(concat('%', :q, '%')))
      order by c.name nulls last, c.email asc
      """)
    List<Customer> searchRef(@Param("q") String q, Pageable page);
}
