package com.example.quizsystem.controller;

import com.example.quizsystem.dto.ResultResponse;
import com.example.quizsystem.dto.SubmitQuizRequest;
import com.example.quizsystem.service.ResultService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/results")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ResultResponse> submitQuiz(@Valid @RequestBody SubmitQuizRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(resultService.submitQuiz(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ResultResponse>> getResultsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(resultService.getResultsByUser(userId));
    }
}
