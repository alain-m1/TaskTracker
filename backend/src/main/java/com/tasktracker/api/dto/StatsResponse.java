package com.tasktracker.api.dto;

public class StatsResponse {

    private long total;
    private long active;
    private long completed;

    public StatsResponse(long total, long active, long completed) {
        this.total = total;
        this.active = active;
        this.completed = completed;
    }

    public long getTotal() {
        return total;
    }

    public long getActive() {
        return active;
    }

    public long getCompleted() {
        return completed;
    }
}
