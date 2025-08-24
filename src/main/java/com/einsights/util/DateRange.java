package com.einsights.util;

import java.time.LocalDate;

public record DateRange(LocalDate start, LocalDate end) {
    public DateRange {
        if (start == null || end == null) throw new IllegalArgumentException("Start and end are required");
        if (end.isBefore(start)) throw new IllegalArgumentException("End date must be on/after start date");
    }
}
