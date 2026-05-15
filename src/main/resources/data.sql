INSERT INTO quizzes (id, title, description)
VALUES
    (1, 'Java Basics', 'A short quiz for Java beginners'),
    (2, 'HTML Basics', 'Practice common HTML tags and page structure'),
    (3, 'Git and GitHub Basics', 'Learn version control, commits, branches, and pull requests'),
    (4, 'Spring Boot Basics', 'Review Spring Boot annotations, layers, and repositories')
ON DUPLICATE KEY UPDATE
    title = VALUES(title),
    description = VALUES(description);

INSERT INTO questions (id, question_text, option_a, option_b, option_c, option_d, correct_option, quiz_id)
VALUES
    (1, 'Which keyword is used to create a class in Java?', 'function', 'class', 'object', 'define', 'B', 1),
    (2, 'Which method starts a Java application?', 'start()', 'run()', 'main()', 'init()', 'C', 1),
    (3, 'Which data type stores true or false values?', 'int', 'String', 'boolean', 'double', 'C', 1),

    (4, 'What does HTML stand for?', 'Hyperlinks and Text Markup Language', 'Hyper Text Markup Language', 'Home Tool Markup Language', 'High Text Machine Language', 'B', 2),
    (5, 'Which tag is used for the largest heading?', '<heading>', '<h6>', '<h1>', '<head>', 'C', 2),
    (6, 'Which tag creates a hyperlink?', '<a>', '<link>', '<href>', '<url>', 'A', 2),
    (7, 'Where is the visible page content usually placed?', '<head>', '<body>', '<meta>', '<title>', 'B', 2),

    (8, 'Which command creates a new Git repository?', 'git start', 'git init', 'git new', 'git create', 'B', 3),
    (9, 'Which command saves staged changes to history?', 'git push', 'git commit', 'git clone', 'git pull', 'B', 3),
    (10, 'What is GitHub mainly used for?', 'Editing photos', 'Hosting Git repositories', 'Running SQL only', 'Designing fonts', 'B', 3),
    (11, 'Which command uploads local commits to a remote repository?', 'git upload', 'git pull', 'git push', 'git status', 'C', 3),

    (12, 'Which annotation marks a Spring Boot main class?', '@Service', '@SpringBootApplication', '@Repository', '@Entity', 'B', 4),
    (13, 'Which layer should contain score calculation logic?', 'Service', 'Entity', 'CSS', 'Database driver', 'A', 4),
    (14, 'Which repository type is used for JPA CRUD operations?', 'RestController', 'JpaRepository', 'PasswordEncoder', 'HttpStatus', 'B', 4),
    (15, 'Which annotation exposes REST API endpoints?', '@Entity', '@RestController', '@Table', '@Column', 'B', 4)
ON DUPLICATE KEY UPDATE
    question_text = VALUES(question_text),
    option_a = VALUES(option_a),
    option_b = VALUES(option_b),
    option_c = VALUES(option_c),
    option_d = VALUES(option_d),
    correct_option = VALUES(correct_option),
    quiz_id = VALUES(quiz_id);
