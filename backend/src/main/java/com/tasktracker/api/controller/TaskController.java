package com.tasktracker.api.controller;

import com.tasktracker.api.dto.CreateTaskRequest;
import com.tasktracker.api.dto.StatsResponse;
import com.tasktracker.api.dto.UpdateTaskRequest;
import com.tasktracker.api.model.Task;
import com.tasktracker.api.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    @GetMapping
    public List<Task> getTasks(@RequestParam(required = false) String status) {
        return taskService.getTasks(status);
    }

    @GetMapping("/stats")
    public StatsResponse getStats() {
        return taskService.getStats();
    }

    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody CreateTaskRequest request) {
        Task saved = taskService.createTask(request.getTitle());
        return ResponseEntity.status(201).body(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody UpdateTaskRequest request) {
        return taskService.updateTask(id, request)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        boolean deleted = taskService.deleteTask(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
