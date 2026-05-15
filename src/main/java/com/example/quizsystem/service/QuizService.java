package com.example.quizsystem.service;

import com.example.quizsystem.dto.QuestionRequest;
import com.example.quizsystem.dto.QuizRequest;
import com.example.quizsystem.exception.ResourceNotFoundException;
import com.example.quizsystem.model.Question;
import com.example.quizsystem.model.Quiz;
import com.example.quizsystem.repository.QuestionRepository;
import com.example.quizsystem.repository.QuizRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;

    public QuizService(QuizRepository quizRepository, QuestionRepository questionRepository) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
    }

    @Transactional
    public Quiz createQuiz(QuizRequest request) {
        Quiz quiz = new Quiz(request.getTitle(), request.getDescription());

        if (request.getQuestions() != null) {
            for (QuestionRequest questionRequest : request.getQuestions()) {
                quiz.addQuestion(toQuestion(questionRequest));
            }
        }

        return quizRepository.save(quiz);
    }

    @Transactional(readOnly = true)
    public List<Quiz> getAllQuizzes() {
        return quizRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Quiz getQuizById(Long quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
    }

    @Transactional
    public Question addQuestion(Long quizId, QuestionRequest request) {
        Quiz quiz = getQuizById(quizId);
        Question question = toQuestion(request);
        quiz.addQuestion(question);
        quizRepository.save(quiz);
        return question;
    }

    @Transactional
    public Quiz updateQuiz(Long quizId, QuizRequest request) {
        Quiz quiz = getQuizById(quizId);
        quiz.setTitle(request.getTitle());
        quiz.setDescription(request.getDescription());
        return quizRepository.save(quiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }
        quizRepository.deleteById(quizId);
    }

    @Transactional(readOnly = true)
    public List<Question> getQuestionsByQuiz(Long quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }
        return questionRepository.findByQuizId(quizId);
    }

    private Question toQuestion(QuestionRequest request) {
        return new Question(
                request.getQuestionText(),
                request.getOptionA(),
                request.getOptionB(),
                request.getOptionC(),
                request.getOptionD(),
                request.getCorrectOption().toUpperCase()
        );
    }
}
