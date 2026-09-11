package com.tasktracker.selenium.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.StaleElementReferenceException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;
import java.util.List;

/**
 * Page Object for the task list screen - add/delete/edit, plus the waits
 * that stand in for what Playwright/Cypress give you automatically.
 */
public class TaskListPage {

    private final WebDriver driver;
    private final WebDriverWait wait;

    private static final By TASK_LIST = By.cssSelector("[data-testid='task-list']");
    private static final By NEW_TASK_INPUT = By.cssSelector("[data-testid='new-task-input']");
    private static final By ADD_TASK_BUTTON = By.cssSelector("[data-testid='add-task-button']");
    private static final By TASK_ITEMS = By.cssSelector("[data-testid='task-item']");
    private static final By TASK_TITLE = By.cssSelector("[data-testid='task-title']");
    private static final By TASK_EDIT_BUTTON = By.cssSelector("[data-testid='task-edit-button']");
    private static final By TASK_EDIT_INPUT = By.cssSelector("[data-testid='task-edit-input']");
    private static final By TASK_SAVE_BUTTON = By.cssSelector("[data-testid='task-save-button']");
    private static final By TASK_DELETE_BUTTON = By.cssSelector("[data-testid='task-delete-button']");

    public TaskListPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    public void waitUntilLoaded() {
        wait.until(ExpectedConditions.visibilityOfElementLocated(TASK_LIST));
    }

    public void addTask(String title) {
        driver.findElement(NEW_TASK_INPUT).sendKeys(title);
        driver.findElement(ADD_TASK_BUTTON).click();
    }

    /**
     * Clicking "add" only proves the click happened, not that the create-then-refetch round trip has 
     * actually finished and the new row is on the page. This polls the live DOM until a task with this 
     * exact title shows up (or times out and fails with a real error) - the same job Playwright's 
     * expect(locator).toBeVisible() or Cypress's cy.contains(...) do with automatic retrying built in.
     */
    public WebElement waitForTaskWithTitle(String title) {
        return wait.until(driver -> findTaskByTitle(title));
    }

    public void waitForTaskToDisappear(String title) {
        wait.until(driver -> findTaskByTitle(title) == null);
    }

    public void deleteTask(WebElement taskItem) {
        taskItem.findElement(TASK_DELETE_BUTTON).click();
    }

    public void startEditing(WebElement taskItem) {
        taskItem.findElement(TASK_EDIT_BUTTON).click();
        wait.until(ExpectedConditions.visibilityOfElementLocated(TASK_EDIT_INPUT));
    }

    public void saveEdit(WebElement taskItem, String newTitle) {
        WebElement input = taskItem.findElement(TASK_EDIT_INPUT);
        input.clear();
        input.sendKeys(newTitle);
        taskItem.findElement(TASK_SAVE_BUTTON).click();
    }

    private WebElement findTaskByTitle(String title) {
        List<WebElement> items = driver.findElements(TASK_ITEMS);
        for (WebElement item : items) {
            try {
                if (item.findElement(TASK_TITLE).getText().equals(title)) {
                    return item;
                }
            } catch (StaleElementReferenceException | org.openqa.selenium.NoSuchElementException ignored) {
                // The list re-rendered between findElements() and reading this item's text (or this item is 
                // currently mid-edit and has no task-title node right now) - just skip it and keep looking.
            }
        }
        return null;
    }
}
