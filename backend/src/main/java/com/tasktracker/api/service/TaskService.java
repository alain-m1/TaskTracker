package com.tasktracker.api.service;

import com.tasktracker.api.dto.StatsResponse;
import com.tasktracker.api.dto.UpdateTaskRequest;
import com.tasktracker.api.model.Task;
import com.tasktracker.api.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getTasks(String status) {
        if ("active".equalsIgnoreCase(status)) {
            return taskRepository.findByCompleted(false);
        }
        if ("completed".equalsIgnoreCase(status)) {
            return taskRepository.findByCompleted(true);
        }
        return taskRepository.findAll();
    }

    public StatsResponse getStats() {
        long total = taskRepository.count();
        long completed = taskRepository.findByCompleted(true).size();
        long active = total - completed;
        return new StatsResponse(total, active, completed);
    }

    public Task createTask(String title) {
        return taskRepository.save(new Task(title));
    }

    public Optional<Task> updateTask(Long id, UpdateTaskRequest request) {
        return taskRepository.findById(id)
                .map(task -> {
                    if (request.getTitle() != null) {
                        task.setTitle(request.getTitle());
                    }
                    if (request.getCompleted() != null) {
                        task.setCompleted(request.getCompleted());
                    }
                    return taskRepository.save(task);
                });
    }

    public boolean deleteTask(Long id) {
        if (!taskRepository.existsById(id)) {
            return false;
        }
        taskRepository.deleteById(id);
        return true;
    }
}