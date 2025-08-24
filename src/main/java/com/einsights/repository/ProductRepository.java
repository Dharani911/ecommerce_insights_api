package com.einsights.repository;

import com.einsights.model.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
    Optional<Product> findByName(String name);

    @Query("""
      select p from Product p
      where (:q is null or :q = '' or
            lower(p.name) like lower(concat('%', :q, '%')) or
            lower(p.sku)  like lower(concat('%', :q, '%')))
      order by p.name asc
      """)
    List<Product> searchRef(@Param("q") String q, Pageable page);
}
