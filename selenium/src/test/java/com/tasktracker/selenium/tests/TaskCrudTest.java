package com.tasktracker.selenium.tests;

import com.tasktracker.selenium.pages.LoginPage;
import com.tasktracker.selenium.pages.TaskListPage;
import com.tasktracker.selenium.support.BaseSeleniumTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebElement;

import static com.tasktracker.selenium.support.TestData.uniqueTitle;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class TaskCrudTest extends BaseSeleniumTest {

    private TaskListPage taskListPage;

    @BeforeEach
    void loginFirst() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open(BASE_URL);
        loginPage.login("tester", "TestPass123");

        taskListPage = new TaskListPage(driver);
        taskListPage.waitUntilLoaded();
    }

    @Test
    void addingATaskShowsItInTheListThenDeletingRemovesIt() {
        String title = uniqueTitle("Selenium add test");

        taskListPage.addTask(title);

        // No auto-retry here the way there is in Playwright/Cypress. This explicit wait 
        // is doing the job their built-in assertions do for free. This is the exact kind 
        // of race the Playwright suite hits with the checkbox test, made visible on purpose.
        WebElement task = taskListPage.waitForTaskWithTitle(title);
        assertNotNull(task, "newly added task should appear in the list");

        taskListPage.deleteTask(task);
        taskListPage.waitForTaskToDisappear(title);
    }
}
