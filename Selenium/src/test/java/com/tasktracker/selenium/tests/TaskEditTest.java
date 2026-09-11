package com.tasktracker.selenium.tests;

import com.tasktracker.selenium.pages.LoginPage;
import com.tasktracker.selenium.pages.TaskListPage;
import com.tasktracker.selenium.support.BaseSeleniumTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.WebElement;

import static com.tasktracker.selenium.support.TestData.uniqueTitle;

class TaskEditTest extends BaseSeleniumTest {

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
    void editingATaskUpdatesItsTitle() {
        String originalTitle = uniqueTitle("Selenium edit original");
        String newTitle = uniqueTitle("Selenium edit updated");

        taskListPage.addTask(originalTitle);
        WebElement task = taskListPage.waitForTaskWithTitle(originalTitle);

        taskListPage.startEditing(task);
        taskListPage.saveEdit(task, newTitle);

        // The title span gets swapped out for an input while editing, then back to a 
        // span with the new text once the save round trip lands, waiting for the new 
        // text to actually show up rather than asserting immediately after clicking Save.
        WebElement renamed = taskListPage.waitForTaskWithTitle(newTitle);
        taskListPage.waitForTaskToDisappear(originalTitle);

        taskListPage.deleteTask(renamed);
        taskListPage.waitForTaskToDisappear(newTitle);
    }
}
