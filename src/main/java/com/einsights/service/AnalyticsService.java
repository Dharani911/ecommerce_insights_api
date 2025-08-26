package com.einsights.service;

import com.einsights.dto.analytics.SalesByDayRow;
import com.einsights.dto.analytics.SummaryResponse;
import com.einsights.dto.analytics.TopCategoryRow;
import com.einsights.dto.analytics.TopCustomerRow;
import com.einsights.dto.analytics.TopProductRow;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
public class AnalyticsService {

    private final EntityManager em;

    public AnalyticsService(EntityManager em) {
        this.em = em;
    }

    private static BigDecimal nz(BigDecimal v) { return v == null ? BigDecimal.ZERO : v; }

    private static void requireValidRange(LocalDate start, LocalDate end) {
        if (start == null || end == null || end.isBefore(start)) {
            throw new IllegalArgumentException("Invalid date range");
        }
    }

    private void tagSession(String tag) {
        try {
            // SET LOCAL application_name = ?  <-- doesn't work with parameters in PG
            em.createNativeQuery("SELECT set_config('application_name', :app, true)")
                    .setParameter("app", "einsights-api:" + tag)
                    .getSingleResult(); // or executeUpdate(); either is fine
        } catch (Exception ignored) {
            // harmless if not permitted by server settings
        }
    }

    public SummaryResponse getSummary(LocalDate start, LocalDate end) {
        requireValidRange(start, end);
        tagSession("summary");

        Query q = em.createNativeQuery("SELECT * FROM fn_summary(:start, :end)");
        q.setParameter("start", Date.valueOf(start));
        q.setParameter("end", Date.valueOf(end));

        Object[] r = (Object[]) q.getSingleResult();
        SummaryResponse out = new SummaryResponse();
        out.setRevenue(nz((BigDecimal) r[0]));
        out.setOrders(((Number) r[1]).longValue());
        out.setUnits(((Number) r[2]).longValue());
        out.setAov(nz((BigDecimal) r[3]));
        out.setNewCustomers(((Number) r[4]).longValue());
        out.setReturningCustomers(((Number) r[5]).longValue());
        out.setReturningRate(r[6] == null ? 0.0 : ((Number) r[6]).doubleValue());
        return out;
    }

    public List<SalesByDayRow> getSalesByDay(LocalDate start, LocalDate end) {
        requireValidRange(start, end);
        tagSession("sales-by-day");

        Query q = em.createNativeQuery("""
      SELECT d::date AS day,
             COALESCE(v.revenue,0) AS revenue,
             COALESCE(v.orders,0)  AS orders,
             COALESCE(v.units,0)   AS units
      FROM generate_series(CAST(:start AS date), CAST(:end AS date), INTERVAL '1 day') d
      LEFT JOIN vw_sales_by_day v ON v.day = d::date
      ORDER BY day
      """);
        q.setParameter("start", java.sql.Date.valueOf(start));
        q.setParameter("end",   java.sql.Date.valueOf(end));

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<SalesByDayRow> out = new ArrayList<>(rows.size());
        for (Object[] r : rows) {
            out.add(new SalesByDayRow(
                    String.valueOf(r[0]),
                    nz((java.math.BigDecimal) r[1]),
                    ((Number) r[2]).longValue(),
                    ((Number) r[3]).longValue()
            ));
        }
        return out;
    }

    public List<TopProductRow> getTopProducts(LocalDate start, LocalDate end, int limit) {
        requireValidRange(start, end);
        if (limit <= 0) limit = 10;
        tagSession("top-products");

        // Select only the columns we want, in the order our DTO expects
        Query q = em.createNativeQuery("""
      SELECT product_id, name, units, revenue
      FROM fn_top_products(:start, :end, :limit)
      """);
        q.setParameter("start", java.sql.Date.valueOf(start));
        q.setParameter("end",   java.sql.Date.valueOf(end));
        q.setParameter("limit", limit);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<TopProductRow> out = new ArrayList<>(rows.size());
        for (Object[] r : rows) {
            out.add(new TopProductRow(
                    ((Number) r[0]).longValue(),              // product_id
                    (String) r[1],                            // name
                    r[2] == null ? 0L : ((Number) r[2]).longValue(),      // units
                    r[3] == null ? java.math.BigDecimal.ZERO : (java.math.BigDecimal) r[3] // revenue
            ));
        }
        return out;
    }


    @Transactional(readOnly = true)
    public List<TopCategoryRow> getTopCategories(LocalDate start, LocalDate end, int limit) {
        requireValidRange(start, end);
        if (limit <= 0) limit = 10;
        tagSession("top-categories");

        Query q = em.createNativeQuery("""
        SELECT category, units, revenue
        FROM fn_top_categories(:start, :end, :limit)
    """);
        q.setParameter("start", Date.valueOf(start));
        q.setParameter("end", Date.valueOf(end));
        q.setParameter("limit", limit);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<TopCategoryRow> out = new ArrayList<>(rows.size());
        for (Object[] r : rows) {
            // r[0]=category (String), r[1]=units (Number), r[2]=revenue (BigDecimal/Number)
            String category = (String) r[0];
            long units = (r[1] == null) ? 0L : ((Number) r[1]).longValue();

            BigDecimal revenue;
            if (r[2] == null) {
                revenue = BigDecimal.ZERO;
            } else if (r[2] instanceof BigDecimal bd) {
                revenue = bd;
            } else {
                revenue = new BigDecimal(r[2].toString());
            }

            out.add(new TopCategoryRow(category, units, revenue));
        }
        return out;
    }

    @Transactional(readOnly = true)
    public List<TopCustomerRow> getTopCustomers(LocalDate start, LocalDate end, int limit) {
        requireValidRange(start, end);
        if (limit <= 0) limit = 10;
        tagSession("top-customers");

        Query q = em.createNativeQuery("""
        SELECT customer_id, name, orders, revenue
        FROM fn_top_customers(:start, :end, :limit)
    """);
        q.setParameter("start", Date.valueOf(start));
        q.setParameter("end", Date.valueOf(end));
        q.setParameter("limit", limit);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        List<TopCustomerRow> out = new ArrayList<>(rows.size());
        for (Object[] r : rows) {
            // r[0]=customer_id (Number), r[1]=name (String), r[2]=orders (Number), r[3]=revenue (BigDecimal/Number)
            long customerId = ((Number) r[0]).longValue();
            String name = (String) r[1];
            long orders = ((Number) r[2]).longValue();

            BigDecimal revenue;
            if (r[3] == null) {
                revenue = BigDecimal.ZERO;
            } else if (r[3] instanceof BigDecimal bd) {
                revenue = bd;
            } else {
                revenue = new BigDecimal(r[3].toString());
            }

            out.add(new TopCustomerRow(customerId, name, orders, revenue));
        }
        return out;
    }
}
