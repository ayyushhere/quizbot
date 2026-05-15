const demoQuizzes = [
    {
        slug: "spring",
        title: "Spring Boot Basics",
        category: "Spring Boot",
        description: "Annotations, layers, repositories, and result calculation.",
        icon: "leaf",
        tone: "bg-[#e8fbf8]",
        questions: [
            {
                id: 1,
                text: "Which annotation marks a Spring Boot main class?",
                options: {
                    A: "@Service",
                    B: "@SpringBootApplication",
                    C: "@Repository",
                    D: "@Entity"
                },
                correct: "B"
            },
            {
                id: 2,
                text: "Which layer should contain score calculation logic?",
                options: {
                    A: "Service",
                    B: "Entity",
                    C: "CSS",
                    D: "Database driver"
                },
                correct: "A"
            },
            {
                id: 3,
                text: "Which repository type is used for JPA CRUD operations?",
                options: {
                    A: "RestController",
                    B: "JpaRepository",
                    C: "PasswordEncoder",
                    D: "HttpStatus"
                },
                correct: "B"
            }
        ]
    },
    {
        slug: "html",
        title: "HTML Basics",
        category: "Frontend",
        description: "Tags, links, headings, and page structure.",
        icon: "code-2",
        tone: "bg-[#fff4d3]",
        questions: [
            {
                id: 1,
                text: "What does HTML stand for?",
                options: {
                    A: "Hyperlinks and Text Markup Language",
                    B: "Hyper Text Markup Language",
                    C: "Home Tool Markup Language",
                    D: "High Text Machine Language"
                },
                correct: "B"
            },
            {
                id: 2,
                text: "Which tag is used for the largest heading?",
                options: {
                    A: "<heading>",
                    B: "<h6>",
                    C: "<h1>",
                    D: "<head>"
                },
                correct: "C"
            },
            {
                id: 3,
                text: "Which tag creates a hyperlink?",
                options: {
                    A: "<a>",
                    B: "<link>",
                    C: "<href>",
                    D: "<url>"
                },
                correct: "A"
            },
            {
                id: 4,
                text: "Where is the visible page content usually placed?",
                options: {
                    A: "<head>",
                    B: "<body>",
                    C: "<meta>",
                    D: "<title>"
                },
                correct: "B"
            }
        ]
    },
    {
        slug: "git",
        title: "Git and GitHub Basics",
        category: "Version Control",
        description: "Commits, branches, remotes, and pull requests.",
        icon: "git-branch",
        tone: "bg-[#ffe9ee]",
        questions: [
            {
                id: 1,
                text: "Which command creates a new Git repository?",
                options: {
                    A: "git start",
                    B: "git init",
                    C: "git new",
                    D: "git create"
                },
                correct: "B"
            },
            {
                id: 2,
                text: "Which command saves staged changes to history?",
                options: {
                    A: "git push",
                    B: "git commit",
                    C: "git clone",
                    D: "git pull"
                },
                correct: "B"
            },
            {
                id: 3,
                text: "What is GitHub mainly used for?",
                options: {
                    A: "Editing photos",
                    B: "Hosting Git repositories",
                    C: "Running SQL only",
                    D: "Designing fonts"
                },
                correct: "B"
            },
            {
                id: 4,
                text: "Which command uploads local commits to a remote repository?",
                options: {
                    A: "git upload",
                    B: "git pull",
                    C: "git push",
                    D: "git status"
                },
                correct: "C"
            }
        ]
    },
    {
        slug: "java",
        title: "Java Basics",
        category: "Core Java",
        description: "Classes, main method, types, and beginner syntax.",
        icon: "coffee",
        tone: "bg-[#eaf0ff]",
        questions: [
            {
                id: 1,
                text: "Which keyword is used to create a class in Java?",
                options: {
                    A: "function",
                    B: "class",
                    C: "object",
                    D: "define"
                },
                correct: "B"
            },
            {
                id: 2,
                text: "Which method starts a Java application?",
                options: {
                    A: "start()",
                    B: "run()",
                    C: "main()",
                    D: "init()"
                },
                correct: "C"
            },
            {
                id: 3,
                text: "Which data type stores true or false values?",
                options: {
                    A: "int",
                    B: "String",
                    C: "boolean",
                    D: "double"
                },
                correct: "C"
            }
        ]
    }
];

function getCurrentUserKey() {
    const email = localStorage.getItem("quizUserEmail")?.trim().toLowerCase();
    const name = localStorage.getItem("quizUserName")?.trim();
    return (email || name || "guest").toLowerCase();
}

function getActiveQuizStorageKey() {
    return `${getCurrentUserKey()}:activeQuiz`;
}

function getResultKey() {
    return `${getCurrentUserKey()}:quizResult`;
}

function getSelectedQuiz() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("quiz") || localStorage.getItem(getActiveQuizStorageKey()) || "spring";
    return demoQuizzes.find((quiz) => quiz.slug === slug) || demoQuizzes[0];
}

function getAnswerKey(quiz) {
    return `${getCurrentUserKey()}:quizAnswers:${quiz.slug}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function setupIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function saveDemoUser(event) {
    event.preventDefault();
    const name = document.querySelector("[data-name]")?.value.trim() || "Quiz Pilot";
    const email = document.querySelector("[type='email']")?.value.trim() || "";
    localStorage.setItem("quizUserName", name);
    if (email) {
        localStorage.setItem("quizUserEmail", email.toLowerCase());
    }
    clearQuizState();
    window.location.href = "dashboard.html";
}

function saveAdminLogin(event) {
    event.preventDefault();
    const email = document.querySelector("[data-admin-email]")?.value.trim();
    const password = document.querySelector("[data-admin-password]")?.value;
    const error = document.querySelector("[data-admin-error]");

    if (email === "admin@quizbot.com" && password === "admin123") {
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminName", "Quiz Admin");
        window.location.href = "admin.html";
        return;
    }

    if (error) {
        error.hidden = false;
    }
}

function setUserName() {
    const name = localStorage.getItem("quizUserName") || "Quiz Pilot";
    document.querySelectorAll("[data-user-name]").forEach((node) => {
        node.textContent = name;
    });

    const adminName = localStorage.getItem("adminName") || "Quiz Admin";
    document.querySelectorAll("[data-admin-name]").forEach((node) => {
        node.textContent = adminName;
    });
}

function clearQuizState() {
    demoQuizzes.forEach((quiz) => localStorage.removeItem(getAnswerKey(quiz)));
    localStorage.removeItem(getResultKey());
    localStorage.removeItem(getActiveQuizStorageKey());
}

function logout(event) {
    event.preventDefault();
    localStorage.removeItem("quizUserName");
    localStorage.removeItem("quizUserEmail");
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminName");
    clearQuizState();
    window.location.href = "login.html";
}

function adminLogout(event) {
    event.preventDefault();
    localStorage.removeItem("adminLoggedIn");
    localStorage.removeItem("adminName");
    window.location.href = "admin-login.html";
}

function requireAdmin() {
    if (!document.body.matches("[data-require-admin]")) return;

    if (localStorage.getItem("adminLoggedIn") !== "true") {
        window.location.replace("admin-login.html");
    }
}

function renderDashboardQuizzes() {
    const host = document.querySelector("[data-quiz-list]");
    if (!host) return;

    host.innerHTML = demoQuizzes.map((quiz) => `
        <article class="card p-4">
            <div class="flex items-start justify-between gap-3">
                <span class="grid h-12 w-12 place-items-center rounded-xl border-2 border-slate-900 ${quiz.tone}">
                    <i data-lucide="${quiz.icon}"></i>
                </span>
                <span class="pill">${quiz.questions.length} questions</span>
            </div>
            <p class="mt-4 text-sm font-black text-slate-500">${quiz.category}</p>
            <h3 class="mt-1 text-xl font-black">${quiz.title}</h3>
            <p class="mt-2 min-h-12 font-bold text-slate-500">${quiz.description}</p>
            <a class="btn btn-primary mt-4 w-full" href="quiz.html?quiz=${quiz.slug}" onclick="startQuiz('${quiz.slug}')">
                <i data-lucide="play"></i>
                Start quiz
            </a>
        </article>
    `).join("");

    setupIcons();
}

function startQuiz(slug) {
    localStorage.setItem(getActiveQuizStorageKey(), slug);
    const quiz = demoQuizzes.find((item) => item.slug === slug);
    if (quiz) {
        localStorage.removeItem(getAnswerKey(quiz));
    }
}

function renderQuiz() {
    const host = document.querySelector("[data-quiz]");
    if (!host) return;

    const quiz = getSelectedQuiz();
    localStorage.setItem(getActiveQuizStorageKey(), quiz.slug);

    document.querySelectorAll("[data-quiz-title]").forEach((node) => {
        node.textContent = quiz.title;
    });
    document.querySelectorAll("[data-quiz-category]").forEach((node) => {
        node.textContent = quiz.category;
    });
    document.querySelectorAll("[data-question-count]").forEach((node) => {
        node.textContent = quiz.questions.length;
    });

    host.innerHTML = quiz.questions.map((question, index) => `
        <section class="card p-5" data-question="${question.id}">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <p class="text-sm font-black text-slate-500">Question ${index + 1}</p>
                    <h2 class="mt-1 text-xl font-black">${question.text}</h2>
                </div>
                <span class="pill">1 point</span>
            </div>
            <div class="mt-5 grid gap-3">
                ${Object.entries(question.options).map(([key, value]) => `
                    <button class="option card" type="button" data-answer="${key}" onclick="selectAnswer(${question.id}, '${key}')">
                        <span class="answer-dot">${key}</span>
                    <span class="font-extrabold">${escapeHtml(value)}</span>
                    </button>
                `).join("")}
            </div>
        </section>
    `).join("");
}

function selectAnswer(questionId, answer) {
    const quiz = getSelectedQuiz();
    const section = document.querySelector(`[data-question="${questionId}"]`);
    section.querySelectorAll("[data-answer]").forEach((button) => {
        button.classList.toggle("is-selected", button.dataset.answer === answer);
    });

    const answers = JSON.parse(localStorage.getItem(getAnswerKey(quiz)) || "{}");
    answers[questionId] = answer;
    localStorage.setItem(getAnswerKey(quiz), JSON.stringify(answers));
    updateQuizProgress();
}

function updateQuizProgress() {
    const quiz = getSelectedQuiz();
    const answers = JSON.parse(localStorage.getItem(getAnswerKey(quiz)) || "{}");
    const answered = Object.keys(answers).length;
    const percent = Math.round((answered / quiz.questions.length) * 100);
    document.querySelectorAll("[data-progress]").forEach((node) => {
        node.style.width = `${percent}%`;
    });
    document.querySelectorAll("[data-progress-label]").forEach((node) => {
        node.textContent = `${answered}/${quiz.questions.length}`;
    });
}

function submitDemoQuiz() {
    const quiz = getSelectedQuiz();
    const answers = JSON.parse(localStorage.getItem(getAnswerKey(quiz)) || "{}");
    let score = 0;

    quiz.questions.forEach((question) => {
        if (answers[question.id] === question.correct) {
            score += 1;
        }
    });

    const result = {
        quizTitle: quiz.title,
        score,
        total: quiz.questions.length,
        percent: Math.round((score / quiz.questions.length) * 100),
        submittedAt: new Date().toLocaleString()
    };

    localStorage.setItem(getResultKey(), JSON.stringify(result));
    window.location.href = "result.html";
}

function renderResult() {
    const result = JSON.parse(localStorage.getItem(getResultKey()) || "null") || {
        quizTitle: "Spring Boot Basics",
        score: 2,
        total: 3,
        percent: 67,
        submittedAt: "Demo result"
    };

    document.querySelectorAll("[data-result-title]").forEach((node) => {
        node.textContent = result.quizTitle;
    });
    document.querySelectorAll("[data-score]").forEach((node) => {
        node.textContent = `${result.score}/${result.total}`;
    });
    document.querySelectorAll("[data-percent]").forEach((node) => {
        node.textContent = `${result.percent}%`;
    });
    document.querySelectorAll("[data-result-progress]").forEach((node) => {
        node.style.width = `${result.percent}%`;
    });
    document.querySelectorAll("[data-submitted-at]").forEach((node) => {
        node.textContent = result.submittedAt;
    });
}

function initAdminTabs() {
    const buttons = document.querySelectorAll("[data-admin-tab]");
    const panels = document.querySelectorAll("[data-admin-panel]");
    if (!buttons.length) return;

    buttons.forEach((button) => {
        button.addEventListener("click", () => {
            const selected = button.dataset.adminTab;
            buttons.forEach((item) => item.classList.toggle("btn-primary", item === button));
            panels.forEach((panel) => {
                panel.hidden = panel.dataset.adminPanel !== selected;
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    requireAdmin();
    setupIcons();
    setUserName();
    renderDashboardQuizzes();
    renderQuiz();
    updateQuizProgress();
    renderResult();
    initAdminTabs();
});
