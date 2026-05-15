package com.example.quizsystem.repository;

import com.example.quizsystem.model.Quiz;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuizRepository extends JpaRepository<Quiz, Long> {

    List<Quiz> findByTitleContainingIgnoreCase(String title);
}
