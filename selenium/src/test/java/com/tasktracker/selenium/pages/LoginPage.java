package com.tasktracker.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * Page Object for the login screen.
 *
 * This is the Page Object Model (POM) pattern: tests call methods like login(...) 
 * rather than reaching for By locators directly. Real-world Selenium codebases wrap 
 * pages like this instead, since Selenium gives you no equivalent of Cypress's 
 * custom commands or Playwright's fixtures to share that logic another way.
 */
public class LoginPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private static final By USERNAME_INPUT = By.cssSelector("[data-testid='username-input']");
    private static final By PASSWORD_INPUT = By.cssSelector("[data-testid='password-input']");
    private static final By LOGIN_BUTTON = By.cssSelector("[data-testid='login-button']");
    private static final By LOGIN_ERROR = By.cssSelector("[data-testid='login-error']");

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void open(String baseUrl) {
        driver.get(baseUrl);
        wait.until(ExpectedConditions.visibilityOfElementLocated(USERNAME_INPUT));
    }

    public void login(String username, String password) {
        driver.findElement(USERNAME_INPUT).sendKeys(username);
        driver.findElement(PASSWORD_INPUT).sendKeys(password);
        driver.findElement(LOGIN_BUTTON).click();
    }

    /**
     * Selenium has no auto-retrying assertion like Playwright's expect(...) or Cypress's 
     * .should(...). WebDriverWait polls until the element actually shows up (or times out 
     * and fails loudly), which is what those other tools do for you invisibly.
     */
    public String waitForErrorMessage() {
        WebElement error = wait.until(ExpectedConditions.visibilityOfElementLocated(LOGIN_ERROR));
        return error.getText();
    }
}
