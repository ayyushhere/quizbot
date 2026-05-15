package com.example.quizsystem.repository;

import com.example.quizsystem.model.Result;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<Result, Long> {

    List<Result> findByUserId(Long userId);

    List<Result> findByQuizId(Long quizId);

    List<Result> findByUserIdAndQuizId(Long userId, Long quizId);
}
