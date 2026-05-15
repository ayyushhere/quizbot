package com.example.quizsystem.repository;

import com.example.quizsystem.model.AttemptAnswer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AttemptAnswerRepository extends JpaRepository<AttemptAnswer, Long> {

    List<AttemptAnswer> findByResultId(Long resultId);

    List<AttemptAnswer> findByQuestionId(Long questionId);
}
