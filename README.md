# Ecommerce Insights API  

📊 **Ecommerce Analytics Backend** built with **Spring Boot, PostgreSQL, and Liquibase**, designed to showcase ETL pipelines, analytics functions, and business KPIs.  

---

## 🚀 Features  

- **ETL Pipeline**  
  - Ingests raw order data (`orders`, `order_items`, `customers`)  
  - Transforms and aggregates into analytical tables via stored functions  

- **Analytics APIs**  
  - 📈 Sales summary (`/api/analytics/summary`)  
  - 📅 Sales by day (`/api/analytics/sales-by-day`)  
  - 🏆 Top products (`/api/analytics/top-products`)  

- **PostgreSQL Stored Functions** for performance and reusability (`fn_summary`, `fn_sales_by_day`, `fn_top_products`)  

- **Liquibase Migration** to manage schema + analytics functions  

- **Production-ready stack** with  
  - Spring Boot 3  
  - Hibernate / JPA  
  - PostgreSQL 15+  
  - Liquibase  
  - Docker-ready (optional)  

---

flowchart TD
  A[Raw CSV/JSON Orders] -->|POST /api/ingest| B[(PostgreSQL Staging Tables)]
  B -->|SQL Functions| C[(Analytics Views)]
  C -->|REST API| D[Spring Boot Service Layer]
  D -->|JSON| E[Frontend / BI Dashboard]

