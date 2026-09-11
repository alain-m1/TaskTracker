package com.tasktracker.selenium.support;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;

/**
 * Every test class extends this instead of managing its own WebDriver.
 *
 * Selenium (unlike Playwright/Cypress) has no test-runner integration of its own 
 * (no built-in fixture that hands you a ready-to-use browser). Wiring driver 
 * setup/teardown into JUnit's @BeforeEach/@AfterEach lifecycle by hand, in a shared 
 * base class, is the standard way this gets done in real Selenium + JUnit projects.
 */
public abstract class BaseSeleniumTest {

    public static final String BASE_URL = "http://localhost:5173";
    public static final String API_BASE_URL = "http://localhost:8080/api";

    protected WebDriver driver;

    @BeforeEach
    void setUpDriver() {
        ChromeOptions options = new ChromeOptions();
        // Uncomment to run without a visible browser window:
        // options.addArguments("--headless=new");
        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
    }

    @AfterEach
    void tearDownDriver() {
        if (driver != null) {
            driver.quit();
        }
    }
}
