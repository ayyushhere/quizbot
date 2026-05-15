package com.example.quizsystem.dto;

import java.time.LocalDateTime;

public class ResultResponse {

    private Long resultId;
    private String quizTitle;
    private int score;
    private int totalQuestions;
    private double percentage;
    private LocalDateTime submittedAt;

    public ResultResponse(Long resultId, String quizTitle, int score, int totalQuestions, LocalDateTime submittedAt) {
        this.resultId = resultId;
        this.quizTitle = quizTitle;
        this.score = score;
        this.totalQuestions = totalQuestions;
        this.percentage = totalQuestions == 0 ? 0 : (score * 100.0) / totalQuestions;
        this.submittedAt = submittedAt;
    }

    public Long getResultId() {
        return resultId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public int getScore() {
        return score;
    }

    public int getTotalQuestions() {
        return totalQuestions;
    }

    public double getPercentage() {
        return percentage;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }
}
