package com.example.quizsystem.service;

import com.example.quizsystem.dto.AnswerRequest;
import com.example.quizsystem.dto.ResultResponse;
import com.example.quizsystem.dto.SubmitQuizRequest;
import com.example.quizsystem.exception.BadRequestException;
import com.example.quizsystem.exception.ResourceNotFoundException;
import com.example.quizsystem.model.AttemptAnswer;
import com.example.quizsystem.model.Question;
import com.example.quizsystem.model.Quiz;
import com.example.quizsystem.model.Result;
import com.example.quizsystem.model.User;
import com.example.quizsystem.repository.QuestionRepository;
import com.example.quizsystem.repository.QuizRepository;
import com.example.quizsystem.repository.ResultRepository;
import com.example.quizsystem.repository.UserRepository;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ResultService {

    private final UserRepository userRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ResultRepository resultRepository;

    public ResultService(
            UserRepository userRepository,
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            ResultRepository resultRepository
    ) {
        this.userRepository = userRepository;
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.resultRepository = resultRepository;
    }

    @Transactional
    public ResultResponse submitQuiz(SubmitQuizRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + request.getUserId()));
        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + request.getQuizId()));

        List<Question> quizQuestions = questionRepository.findByQuizId(quiz.getId());
        Map<Long, Question> questionMap = mapQuestionsById(quizQuestions);

        Result result = new Result();
        result.setUser(user);
        result.setQuiz(quiz);
        result.setTotalQuestions(quizQuestions.size());

        int score = calculateScoreAndStoreAnswers(request.getAnswers(), questionMap, result);
        result.setScore(score);

        Result savedResult = resultRepository.save(result);

        return new ResultResponse(
                savedResult.getId(),
                quiz.getTitle(),
                savedResult.getScore(),
                savedResult.getTotalQuestions(),
                savedResult.getSubmittedAt()
        );
    }

    @Transactional(readOnly = true)
    public List<ResultResponse> getResultsByUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }

        return resultRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ResultResponse> getAllResults() {
        return resultRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ResultResponse> getResultsByQuiz(Long quizId) {
        if (!quizRepository.existsById(quizId)) {
            throw new ResourceNotFoundException("Quiz not found with id: " + quizId);
        }

        return resultRepository.findByQuizId(quizId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private ResultResponse toResponse(Result result) {
        return new ResultResponse(
                result.getId(),
                result.getQuiz().getTitle(),
                result.getScore(),
                result.getTotalQuestions(),
                result.getSubmittedAt()
        );
    }

    private Map<Long, Question> mapQuestionsById(List<Question> questions) {
        Map<Long, Question> questionMap = new HashMap<>();
        for (Question question : questions) {
            questionMap.put(question.getId(), question);
        }
        return questionMap;
    }

    private int calculateScoreAndStoreAnswers(
            List<AnswerRequest> answers,
            Map<Long, Question> questionMap,
            Result result
    ) {
        int score = 0;
        Set<Long> answeredQuestionIds = new HashSet<>();

        for (AnswerRequest answerRequest : answers) {
            Question question = findValidQuestion(answerRequest, questionMap, answeredQuestionIds);
            String selectedOption = answerRequest.getSelectedOption().toUpperCase();
            boolean correct = question.getCorrectOption().equals(selectedOption);

            if (correct) {
                score++;
            }

            result.addAnswer(new AttemptAnswer(question, selectedOption, correct));
        }

        return score;
    }

    private Question findValidQuestion(
            AnswerRequest answerRequest,
            Map<Long, Question> questionMap,
            Set<Long> answeredQuestionIds
    ) {
        if (!answeredQuestionIds.add(answerRequest.getQuestionId())) {
            throw new BadRequestException("Question " + answerRequest.getQuestionId() + " was answered more than once");
        }

        Question question = questionMap.get(answerRequest.getQuestionId());
        if (question == null) {
            throw new BadRequestException("Question " + answerRequest.getQuestionId() + " does not belong to this quiz");
        }

        return question;
    }
}
