package com.tasktracker.selenium.tests;

import com.tasktracker.selenium.pages.LoginPage;
import com.tasktracker.selenium.pages.TaskListPage;
import com.tasktracker.selenium.support.BaseSeleniumTest;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertTrue;

class LoginTest extends BaseSeleniumTest {

    @Test
    void validLoginShowsTheTaskList() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open(BASE_URL);
        loginPage.login("tester", "TestPass123");

        TaskListPage taskListPage = new TaskListPage(driver);
        assertDoesNotThrow(taskListPage::waitUntilLoaded,
                "task list should become visible after a valid login");
    }

    @Test
    void invalidLoginShowsAnErrorMessage() {
        LoginPage loginPage = new LoginPage(driver);
        loginPage.open(BASE_URL);
        loginPage.login("wrong-user", "wrong-password");

        String errorText = loginPage.waitForErrorMessage();
        assertTrue(errorText.contains("Invalid"),
                "error message should mention 'Invalid', was: " + errorText);
    }
}
