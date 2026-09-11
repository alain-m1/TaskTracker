package com.tasktracker.selenium.support;

import java.util.UUID;

/**
 * Same "unique title + explicit cleanup" isolation habit used in the Playwright 
 * and Cypress suites so tests stay safe to rerun and don't collide with seed data 
 * or leftovers from a previous failed run.
 */
public final class TestData {

    private TestData() {
    }

    public static String uniqueTitle(String label) {
        return label + " " + UUID.randomUUID().toString().substring(0, 8);
    }
}
