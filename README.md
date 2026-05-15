# Spring Boot Online Quiz System

Beginner-friendly Online Quiz System built with Java, Maven, Spring Boot, Spring MVC, Spring Data JPA, REST APIs, and MySQL.

## Features

- User registration and login
- BCrypt password hashing
- Quiz creation, listing, updating, and deletion
- Question management
- Quiz submission
- Result calculation and result history
- MySQL database integration
- MVC-style folder structure

## Project Structure

```text
src/main/java/com/example/quizsystem
|-- config        # Spring beans such as PasswordEncoder
|-- controller    # REST API endpoints
|-- dto           # Request and response objects
|-- exception     # Common API error handling
|-- model         # JPA database entities
|-- repository    # Spring Data JPA database access
|-- service       # Business logic
`-- QuizSystemApplication.java
```

## How The MVC Flow Works

1. A client sends an HTTP request to a controller.
2. The controller receives the request body as a DTO.
3. The service contains the main business logic.
4. The repository talks to MySQL using Spring Data JPA.
5. The controller returns a JSON response.

Example flow for quiz submission:

```text
POST /api/results/submit
-> ResultController
-> ResultService
-> QuestionRepository + ResultRepository
-> JSON result with score and percentage
```

## Database Setup

Create a MySQL database:

```sql
CREATE DATABASE quiz_system;
```

Update your MySQL username and password in:

```text
src/main/resources/application.properties
```

Default configuration:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quiz_system?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=your_password
```

Tables are created automatically by Hibernate because:

```properties
spring.jpa.hibernate.ddl-auto=update
```

## Run The Project

```bash
mvn spring-boot:run
```

The API runs at:

```text
http://localhost:8080
```

## API Examples

### Register User

```http
POST /api/users/register
Content-Type: application/json
```

```json
{
  "name": "Asha",
  "email": "asha@example.com",
  "password": "secret123"
}
```

### Login User

```http
POST /api/users/login
Content-Type: application/json
```

```json
{
  "email": "asha@example.com",
  "password": "secret123"
}
```

### Create Quiz

```http
POST /api/quizzes
Content-Type: application/json
```

```json
{
  "title": "Java Basics",
  "description": "Simple Java quiz",
  "questions": [
    {
      "questionText": "Which keyword creates a class in Java?",
      "optionA": "function",
      "optionB": "class",
      "optionC": "object",
      "optionD": "define",
      "correctOption": "B"
    }
  ]
}
```

### Get All Quizzes

```http
GET /api/quizzes
```

### Submit Quiz

```http
POST /api/results/submit
Content-Type: application/json
```

```json
{
  "userId": 1,
  "quizId": 1,
  "answers": [
    {
      "questionId": 1,
      "selectedOption": "B"
    },
    {
      "questionId": 2,
      "selectedOption": "C"
    }
  ]
}
```

### Get User Results

```http
GET /api/results/user/1
```

## Beginner Code Explanation

- `model` classes become database tables. For example, `User` maps to the `users` table.
- `repository` interfaces provide ready-made database methods such as `save`, `findById`, and `findAll`.
- `dto` classes define the JSON shape accepted or returned by the API.
- `controller` classes define URLs like `/api/users/login`.
- `service` classes keep business rules away from controllers.
- `GlobalExceptionHandler` converts common errors into clean JSON responses.
- `PasswordEncoder` hashes passwords before saving them, so plain passwords are not stored.

## Important Note

This project keeps login simple for learning purposes. A production application should add Spring Security authentication, sessions or JWT, user roles, and endpoint authorization.
