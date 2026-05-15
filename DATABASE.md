# MySQL Database Setup

This project uses MySQL with Spring Data JPA.

## Database Name

```sql
quiz_system
```

## Tables

- `users` stores registered users.
- `quizzes` stores quiz titles and descriptions.
- `questions` stores quiz questions and answer options.
- `results` stores each submitted quiz result.
- `attempt_answers` stores the selected answer for each question in a result.

## Manual Setup

Open MySQL Workbench or MySQL CLI and run:

```sql
SOURCE src/main/resources/schema.sql;
```

Or copy the SQL from `src/main/resources/schema.sql` and run it manually.

## Spring Boot Connection

The database connection is configured in:

```text
src/main/resources/application.properties
```

Important properties:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/quiz_system?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=your_password
```

Explanation:

- `jdbc:mysql://localhost:3306/quiz_system` tells Spring Boot to connect to MySQL on your computer, port `3306`, using the `quiz_system` database.
- `createDatabaseIfNotExist=true` creates the database automatically if it does not already exist.
- `spring.datasource.username` is your MySQL username.
- `spring.datasource.password` is your MySQL password.
- `spring.jpa.hibernate.ddl-auto=update` lets Hibernate create or update tables based on your JPA entity classes.
- `spring.sql.init.mode=always` runs `schema.sql` and `data.sql` during startup.

For production projects, avoid `ddl-auto=update`; use database migration tools such as Flyway or Liquibase.
