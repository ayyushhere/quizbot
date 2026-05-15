package com.example.quizsystem.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class AnswerRequest {

    @NotNull
    private Long questionId;

    @NotBlank
    @Pattern(regexp = "[ABCDabcd]", message = "selectedOption must be A, B, C, or D")
    private String selectedOption;

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getSelectedOption() {
        return selectedOption;
    }

    public void setSelectedOption(String selectedOption) {
        this.selectedOption = selectedOption;
    }
}
