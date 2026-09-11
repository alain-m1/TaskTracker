package com.tasktracker.selenium.tests;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tasktracker.selenium.support.BaseSeleniumTest;
import org.junit.jupiter.api.Test;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static com.tasktracker.selenium.support.TestData.uniqueTitle;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;

/**
 * Hits the Spring Boot API directly, bypassing the browser entirely. Doesn't extend BaseSeleniumTest 
 * and never touches WebDriver: unlike the other two suites (where even their API-only spec still runs 
 * inside that tool's own browser-oriented test runner/config), a Selenium project's API test is just 
 * a plain JUnit test using Java's built-in HttpClient (nothing browser-related).
 */
class ApiTest {

    private final HttpClient client = HttpClient.newHttpClient();
    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void postTasksCreatesATask() throws Exception {
        String title = uniqueTitle("Selenium API test");
        String requestBody = mapper.writeValueAsString(new CreateTaskRequestBody(title));

        HttpRequest createRequest = HttpRequest.newBuilder()
                .uri(URI.create(BaseSeleniumTest.API_BASE_URL + "/tasks"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(requestBody))
                .build();

        HttpResponse<String> createResponse = client.send(createRequest, HttpResponse.BodyHandlers.ofString());
        assertEquals(201, createResponse.statusCode());

        JsonNode created = mapper.readTree(createResponse.body());
        assertEquals(title, created.get("title").asText());
        assertFalse(created.get("completed").asBoolean());

        long id = created.get("id").asLong();
        HttpRequest deleteRequest = HttpRequest.newBuilder()
                .uri(URI.create(BaseSeleniumTest.API_BASE_URL + "/tasks/" + id))
                .DELETE()
                .build();

        HttpResponse<Void> deleteResponse = client.send(deleteRequest, HttpResponse.BodyHandlers.discarding());
        assertEquals(204, deleteResponse.statusCode());
    }

    private record CreateTaskRequestBody(String title) {
    }
}
