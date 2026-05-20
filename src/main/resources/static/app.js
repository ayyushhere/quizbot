// Backend Base API URLs
const API_BASE = '/api';

// Page Routing & Initialization
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    if (window.lucide) {
        lucide.createIcons();
    }
});

// Route initialization based on current pathname
function initPage() {
    const path = window.location.pathname;

    if (path.includes('login.html') || path === '/' || path === '') {
        checkSessionOnLogin();
    } else if (path.includes('dashboard.html')) {
        requireUser();
        loadDashboard();
    } else if (path.includes('quiz.html')) {
        requireUser();
        loadQuizArena();
    } else if (path.includes('result.html')) {
        requireUser();
        loadResultPage();
    } else if (path.includes('admin.html')) {
        requireAdmin();
        loadAdminDashboard();
    }
}

// Session Helpers
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

function isAdminLoggedIn() {
    return localStorage.getItem('isAdmin') === 'true';
}

function requireUser() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = 'login.html';
    }
}

function requireAdmin() {
    if (!isAdminLoggedIn()) {
        window.location.href = 'login.html';
    }
}

function checkSessionOnLogin() {
    if (getCurrentUser()) {
        window.location.href = 'dashboard.html';
    } else if (isAdminLoggedIn()) {
        window.location.href = 'admin.html';
    }
}

// LOGOUT
function logout(event) {
    if (event) event.preventDefault();
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    window.location.href = 'login.html';
}

function adminLogout(event) {
    logout(event);
}

// -------------------------------------------------------------
// USER LOGIN & REGISTRATION
// -------------------------------------------------------------
function switchLoginTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(`tab-${tab}`).classList.add('active');
    
    document.getElementById('form-login').classList.add('hidden');
    document.getElementById('form-register').classList.add('hidden');
    document.getElementById('form-admin').classList.add('hidden');
    
    document.getElementById(`form-${tab}`).classList.remove('hidden');
    
    // Clear errors
    document.getElementById('login-error').style.display = 'none';
    document.getElementById('register-error').style.display = 'none';
    document.getElementById('admin-error').style.display = 'none';
}

async function handleUserLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Invalid email or password');
        }

        const user = await response.json();
        localStorage.setItem('currentUser', JSON.stringify(user));
        localStorage.removeItem('isAdmin');
        window.location.href = 'dashboard.html';
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    }
}

async function handleUserRegister(event) {
    event.preventDefault();
    const name = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const errorEl = document.getElementById('register-error');
    const successEl = document.getElementById('register-success');
    
    errorEl.style.display = 'none';
    successEl.style.display = 'none';

    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Registration failed. Email might already be taken.');
        }

        successEl.style.display = 'block';
        document.getElementById('form-register').reset();
        setTimeout(() => {
            switchLoginTab('login');
        }, 1500);
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    }
}

async function handleAdminLogin(event) {
    event.preventDefault();
    const email = document.getElementById('admin-email').value.trim();
    const password = document.getElementById('admin-password').value;
    const errorEl = document.getElementById('admin-error');
    errorEl.style.display = 'none';

    // Simple Admin Credentials match (standard for mock admin context)
    if (email === 'admin@quizbot.com' && password === 'admin123') {
        localStorage.setItem('isAdmin', 'true');
        localStorage.removeItem('currentUser');
        window.location.href = 'admin.html';
    } else {
        errorEl.style.display = 'block';
    }
}

// -------------------------------------------------------------
// STUDENT DASHBOARD
// -------------------------------------------------------------
async function loadDashboard() {
    const user = getCurrentUser();
    if (!user) return;

    // Set Welcome Name
    document.querySelectorAll('[data-user-name]').forEach(el => {
        el.textContent = user.name;
    });
    const emailEl = document.getElementById('user-email');
    if (emailEl) emailEl.textContent = user.email;

    // Load Quizzes
    try {
        const response = await fetch(`${API_BASE}/quizzes`);
        if (!response.ok) throw new Error('Could not retrieve quizzes.');
        const quizzes = await response.json();
        
        const countEl = document.getElementById('topics-count');
        if (countEl) countEl.textContent = `${quizzes.length} topics available`;
        
        const quizListEl = document.getElementById('dashboard-quiz-list');
        if (quizListEl) {
            if (quizzes.length === 0) {
                quizListEl.innerHTML = `<div class="text-slate-400 text-center py-6 col-span-2">No quizzes deployed yet. Check back later!</div>`;
            } else {
                quizListEl.innerHTML = quizzes.map(quiz => `
                    <div class="card flex flex-col justify-between">
                        <div>
                            <span class="pill pill-info text-xs"><i data-lucide="book-open" style="width:12px; height:12px;"></i> Quiz Pack</span>
                            <h3 class="text-xl font-bold mt-2">${escapeHtml(quiz.title)}</h3>
                            <p class="text-sm text-slate-400 mt-2">${escapeHtml(quiz.description || 'Level up your concept knowledge in this area.')}</p>
                        </div>
                        <button class="btn btn-primary w-full mt-4" onclick="selectAndStartQuiz(${quiz.id}, '${escapeHtml(quiz.title)}')">
                            <i data-lucide="play"></i> Start Challenge
                        </button>
                    </div>
                `).join('');
            }
            if (window.lucide) lucide.createIcons();
        }
    } catch (err) {
        console.error(err);
        const quizListEl = document.getElementById('dashboard-quiz-list');
        if (quizListEl) quizListEl.innerHTML = `<div class="text-danger text-center py-4">Error loading quizzes. Please retry.</div>`;
    }

    // Load History
    loadUserHistory(user.id);
}

async function loadUserHistory(userId) {
    try {
        const response = await fetch(`${API_BASE}/results/user/${userId}`);
        if (!response.ok) throw new Error('Could not retrieve attempt logs.');
        const attempts = await response.json();

        // Stats updates
        const totalAttempts = attempts.length;
        document.getElementById('stat-completed').textContent = totalAttempts;

        if (totalAttempts > 0) {
            const avgAccuracy = attempts.reduce((acc, curr) => acc + curr.percentage, 0) / totalAttempts;
            document.getElementById('stat-avg-score').textContent = `${Math.round(avgAccuracy)}%`;

            // Calculate Best Topic
            const scoreByQuiz = {};
            attempts.forEach(att => {
                if (!scoreByQuiz[att.quizTitle] || scoreByQuiz[att.quizTitle] < att.percentage) {
                    scoreByQuiz[att.quizTitle] = att.percentage;
                }
            });
            let bestTopic = 'N/A';
            let bestScore = -1;
            for (const [title, score] of Object.entries(scoreByQuiz)) {
                if (score > bestScore) {
                    bestScore = score;
                    bestTopic = title;
                }
            }
            document.getElementById('stat-best-topic').textContent = bestTopic;

            // Populate Table
            const tableBody = document.getElementById('user-history-table');
            tableBody.innerHTML = attempts.map(att => {
                const percentageStyle = att.percentage >= 70 ? 'pill-success' : (att.percentage >= 40 ? 'pill-warning' : 'bg-[#ffe9ee] text-danger border-rose-950');
                return `
                    <tr>
                        <td class="font-bold">${escapeHtml(att.quizTitle)}</td>
                        <td>${att.score} / ${att.totalQuestions}</td>
                        <td><span class="pill ${percentageStyle}">${Math.round(att.percentage)}%</span></td>
                        <td class="text-xs text-slate-400">${formatDate(att.submittedAt)}</td>
                    </tr>
                `;
            }).join('');
        }
    } catch (err) {
        console.error(err);
    }
}

function selectAndStartQuiz(quizId, title) {
    localStorage.setItem('selectedQuizId', quizId);
    localStorage.setItem('selectedQuizTitle', title);
    window.location.href = 'quiz.html';
}

// -------------------------------------------------------------
// QUIZ ARENA (Single Question at a Time)
// -------------------------------------------------------------
let activeQuizQuestions = [];
let activeQuizIndex = 0;
let activeUserAnswers = {}; // key: questionId, value: option selected
let quizTimerInterval = null;
let quizSecondsLeft = 600; // default 10 minutes

async function loadQuizArena() {
    const quizId = localStorage.getItem('selectedQuizId');
    const quizTitle = localStorage.getItem('selectedQuizTitle') || 'Online Quiz';
    if (!quizId) {
        window.location.href = 'dashboard.html';
        return;
    }

    document.getElementById('quiz-sidebar-title').textContent = quizTitle;

    try {
        const response = await fetch(`${API_BASE}/quizzes/${quizId}`);
        if (!response.ok) throw new Error('Could not retrieve questions.');
        const quiz = await response.json();
        
        activeQuizQuestions = quiz.questions || [];
        if (activeQuizQuestions.length === 0) {
            document.getElementById('question-container').innerHTML = `
                <div class="text-center text-slate-400 py-6">
                    <i data-lucide="alert-triangle" class="mx-auto text-warning mb-2"></i>
                    This quiz contains no questions.
                </div>
            `;
            document.getElementById('btn-submit-quiz').disabled = true;
            if (window.lucide) lucide.createIcons();
            return;
        }

        // Setup Timer
        quizSecondsLeft = activeQuizQuestions.length * 60; // 1 min per question
        startQuizTimer();

        // Render first question
        activeQuizIndex = 0;
        activeUserAnswers = {};
        renderActiveQuestion();
        updateQuizProgress();
    } catch (err) {
        console.error(err);
        document.getElementById('question-container').innerHTML = `
            <div class="text-danger text-center py-4">Error loading questions. Redirecting back to dashboard...</div>
        `;
        setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
    }
}

function startQuizTimer() {
    if (quizTimerInterval) clearInterval(quizTimerInterval);
    
    updateTimerUI();
    quizTimerInterval = setInterval(() => {
        quizSecondsLeft--;
        updateTimerUI();
        if (quizSecondsLeft <= 0) {
            clearInterval(quizTimerInterval);
            alert('Time is up! Your answers will be submitted automatically.');
            submitActiveQuiz();
        }
    }, 1000);
}

function updateTimerUI() {
    const mins = Math.floor(quizSecondsLeft / 60);
    const secs = quizSecondsLeft % 60;
    const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    const timerEl = document.getElementById('quiz-timer');
    if (timerEl) {
        timerEl.textContent = timeStr;
        if (quizSecondsLeft < 60) {
            timerEl.style.color = 'var(--danger)';
        } else {
            timerEl.style.color = '';
        }
    }
}

function renderActiveQuestion() {
    const qEl = document.getElementById('question-container');
    if (!qEl || activeQuizQuestions.length === 0) return;

    const currentQ = activeQuizQuestions[activeQuizIndex];
    const selectedOpt = activeUserAnswers[currentQ.id] || null;

    qEl.innerHTML = `
        <div class="space-y-4 animate-fade-in">
            <div class="flex items-center justify-between">
                <span class="pill pill-info text-xs">Question ${activeQuizIndex + 1} of ${activeQuizQuestions.length}</span>
                <span class="text-xs font-semibold text-slate-400">ID: ${currentQ.id}</span>
            </div>
            <h2 class="text-xl font-bold text-white mt-2">${escapeHtml(currentQ.questionText)}</h2>
            
            <div class="grid gap-3 mt-4">
                <button class="option ${selectedOpt === 'A' ? 'is-selected' : ''}" onclick="selectQuizOption(${currentQ.id}, 'A')">
                    <span class="answer-dot">A</span>
                    <span>${escapeHtml(currentQ.optionA)}</span>
                </button>
                <button class="option ${selectedOpt === 'B' ? 'is-selected' : ''}" onclick="selectQuizOption(${currentQ.id}, 'B')">
                    <span class="answer-dot">B</span>
                    <span>${escapeHtml(currentQ.optionB)}</span>
                </button>
                <button class="option ${selectedOpt === 'C' ? 'is-selected' : ''}" onclick="selectQuizOption(${currentQ.id}, 'C')">
                    <span class="answer-dot">C</span>
                    <span>${escapeHtml(currentQ.optionC)}</span>
                </button>
                <button class="option ${selectedOpt === 'D' ? 'is-selected' : ''}" onclick="selectQuizOption(${currentQ.id}, 'D')">
                    <span class="answer-dot">D</span>
                    <span>${escapeHtml(currentQ.optionD)}</span>
                </button>
            </div>
        </div>
    `;

    // Render Dots Navigation
    const dotsEl = document.getElementById('question-dots');
    if (dotsEl) {
        dotsEl.innerHTML = activeQuizQuestions.map((q, idx) => {
            const isCurrent = idx === activeQuizIndex;
            const isAnswered = activeUserAnswers[q.id] !== undefined;
            let btnClass = 'btn-sm ';
            if (isCurrent) {
                btnClass += 'btn-primary';
            } else if (isAnswered) {
                btnClass += 'btn-accent';
            } else {
                btnClass += '';
            }
            return `<button class="btn ${btnClass}" style="min-width: 32px; padding: 4px;" onclick="jumpToQuestion(${idx})">${idx + 1}</button>`;
        }).join('');
    }

    // Disable buttons if bounds
    document.getElementById('btn-prev-question').disabled = activeQuizIndex === 0;
    document.getElementById('btn-next-question').textContent = activeQuizIndex === activeQuizQuestions.length - 1 ? 'Finish Options' : 'Next';
    if (activeQuizIndex === activeQuizQuestions.length - 1) {
        document.getElementById('btn-next-question').classList.add('btn-primary');
        document.getElementById('btn-next-question').classList.remove('btn-accent');
    } else {
        document.getElementById('btn-next-question').classList.remove('btn-primary');
        document.getElementById('btn-next-question').classList.add('btn-accent');
    }
}

function selectQuizOption(questionId, optionLetter) {
    activeUserAnswers[questionId] = optionLetter;
    renderActiveQuestion();
    updateQuizProgress();
}

function updateQuizProgress() {
    const answeredCount = Object.keys(activeUserAnswers).length;
    const totalCount = activeQuizQuestions.length;
    
    document.getElementById('quiz-progress-label').textContent = `${answeredCount}/${totalCount}`;
    const pct = totalCount === 0 ? 0 : (answeredCount / totalCount) * 100;
    document.getElementById('quiz-progress-fill').style.width = `${pct}%`;
}

function navigateQuestion(direction) {
    const newIdx = activeQuizIndex + direction;
    if (newIdx >= 0 && newIdx < activeQuizQuestions.length) {
        activeQuizIndex = newIdx;
        renderActiveQuestion();
    } else if (newIdx === activeQuizQuestions.length) {
        // user clicked "Next" on the last question, prompt submit
        if (confirm('Ready to submit your answers?')) {
            submitActiveQuiz();
        }
    }
}

function jumpToQuestion(index) {
    if (index >= 0 && index < activeQuizQuestions.length) {
        activeQuizIndex = index;
        renderActiveQuestion();
    }
}

async function submitActiveQuiz() {
    const user = getCurrentUser();
    const quizId = localStorage.getItem('selectedQuizId');
    if (!user || !quizId) return;

    // Check if unanswered questions remain
    const unansweredCount = activeQuizQuestions.length - Object.keys(activeUserAnswers).length;
    if (unansweredCount > 0) {
        if (!confirm(`You have ${unansweredCount} unanswered questions. Submit anyway?`)) {
            return;
        }
    }

    // Construct Payload answers array
    const answersPayload = activeQuizQuestions.map(q => ({
        questionId: q.id,
        selectedOption: activeUserAnswers[q.id] || 'A' // default to 'A' if unanswered
    }));

    try {
        if (quizTimerInterval) clearInterval(quizTimerInterval);

        const response = await fetch(`${API_BASE}/results/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: user.id,
                quizId: Number(quizId),
                answers: answersPayload
            })
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Submission failed.');
        }

        const result = await response.json();

        // Save attempts data to localStorage for the result sheet breakdown
        localStorage.setItem('lastQuizResult', JSON.stringify(result));
        localStorage.setItem('lastQuizQuestions', JSON.stringify(activeQuizQuestions));
        localStorage.setItem('lastUserAnswers', JSON.stringify(activeUserAnswers));

        // Format duration taken
        const totalDuration = activeQuizQuestions.length * 60;
        const timeTaken = totalDuration - quizSecondsLeft;
        const mins = Math.floor(timeTaken / 60);
        const secs = timeTaken % 60;
        localStorage.setItem('lastQuizTime', `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`);

        window.location.href = 'result.html';
    } catch (err) {
        alert('Error submitting quiz: ' + err.message);
        startQuizTimer(); // resume timer
    }
}

// -------------------------------------------------------------
// PERFORMANCE CARD (RESULT)
// -------------------------------------------------------------
function loadResultPage() {
    const resultStr = localStorage.getItem('lastQuizResult');
    const questionsStr = localStorage.getItem('lastQuizQuestions');
    const answersStr = localStorage.getItem('lastUserAnswers');
    const timeTaken = localStorage.getItem('lastQuizTime') || 'N/A';

    if (!resultStr || !questionsStr || !answersStr) {
        // Fallback to demo layout if no previous test runs
        document.getElementById('result-quiz-title').textContent = 'Sample Practice Result';
        document.getElementById('result-score').textContent = '2 / 3';
        document.getElementById('result-percent').textContent = '67%';
        document.getElementById('result-progress-fill').style.width = '67%';
        document.getElementById('result-time').textContent = '01m 45s';
        return;
    }

    const result = JSON.parse(resultStr);
    const questions = JSON.parse(questionsStr);
    const answers = JSON.parse(answersStr);

    // Update Scores details
    document.getElementById('result-quiz-title').textContent = result.quizTitle;
    document.getElementById('result-score').textContent = `${result.score} / ${result.totalQuestions}`;
    
    const pct = Math.round(result.percentage);
    document.getElementById('result-percent').textContent = `${pct}%`;
    document.getElementById('result-progress-fill').style.width = `${pct}%`;
    document.getElementById('result-date').textContent = formatDate(result.submittedAt);
    document.getElementById('result-time').textContent = timeTaken;

    // Render dynamic question analysis review
    const breakdownList = document.getElementById('result-breakdown-list');
    if (breakdownList) {
        breakdownList.innerHTML = questions.map((q, idx) => {
            const userAns = answers[q.id] || 'None';
            const correctAns = q.correctOption;
            const isCorrect = userAns === correctAns;
            
            let statusBadge = `<span class="pill pill-success text-xs"><i data-lucide="check" style="width:12px;height:12px;"></i> Correct</span>`;
            let borderStyle = 'border-emerald-950 bg-emerald-950/10';
            if (!isCorrect) {
                statusBadge = `<span class="pill bg-[#ffe9ee] text-danger border-rose-950 text-xs"><i data-lucide="x" style="width:12px;height:12px;"></i> Incorrect</span>`;
                borderStyle = 'border-rose-950 bg-rose-950/10';
            }

            // Get option texts
            const getOptText = (optLetter) => {
                if (optLetter === 'A') return q.optionA;
                if (optLetter === 'B') return q.optionB;
                if (optLetter === 'C') return q.optionC;
                if (optLetter === 'D') return q.optionD;
                return 'No option selected';
            };

            return `
                <div class="card border ${borderStyle} p-4 animate-fade-in" style="animation-delay: ${idx * 0.05}s">
                    <div class="flex items-center justify-between gap-4 mb-2">
                        <span class="text-xs font-bold text-slate-400">Question ${idx + 1}</span>
                        ${statusBadge}
                    </div>
                    <p class="font-bold text-white mb-3 text-sm">${escapeHtml(q.questionText)}</p>
                    <div class="grid gap-2 text-xs">
                        <div class="flex items-start gap-2">
                            <span class="text-slate-400 font-bold w-20">Your choice:</span>
                            <span class="${isCorrect ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}">${userAns} - ${escapeHtml(getOptText(userAns))}</span>
                        </div>
                        ${!isCorrect ? `
                        <div class="flex items-start gap-2">
                            <span class="text-slate-400 font-bold w-20">Correct:</span>
                            <span class="text-emerald-400 font-semibold">${correctAns} - ${escapeHtml(getOptText(correctAns))}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
        
        if (window.lucide) lucide.createIcons();
    }
}

function retryLastQuiz() {
    window.location.href = 'quiz.html';
}

// -------------------------------------------------------------
// ADMIN CONSOLE WORKSPACE
// -------------------------------------------------------------
function switchAdminTab(tabName) {
    document.querySelectorAll('[data-admin-tab]').forEach(btn => {
        btn.classList.remove('btn-primary');
    });
    const activeBtn = document.querySelector(`[data-admin-tab="${tabName}"]`);
    if (activeBtn) activeBtn.classList.add('btn-primary');

    document.getElementById('panel-quizzes').classList.add('hidden');
    document.getElementById('panel-users').classList.add('hidden');
    document.getElementById('panel-results').classList.add('hidden');

    document.getElementById(`panel-${tabName}`).classList.remove('hidden');
}

async function loadAdminDashboard() {
    // Enable admin links navigation in headers
    document.querySelectorAll('#nav-admin-link').forEach(el => {
        el.style.display = 'inline-flex';
    });

    // Add initial question field
    addQuestionField();

    // Fetch lists
    await loadAdminQuizzes();
    await loadAdminUsers();
    await loadAdminResults();
}

function showAdminAlert(text) {
    const alertEl = document.getElementById('admin-alert');
    const alertText = document.getElementById('admin-alert-text');
    if (alertEl && alertText) {
        alertText.textContent = text;
        alertEl.style.display = 'flex';
        // Auto scroll to top to see alert
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// QUIZ CREATOR FORM - ADD QUESTIONS
let questionFieldCounter = 0;
function addQuestionField() {
    questionFieldCounter++;
    const qList = document.getElementById('form-questions-list');
    if (!qList) return;

    const card = document.createElement('div');
    card.className = 'card border border-indigo-950 p-4 space-y-3';
    card.id = `admin-q-field-${questionFieldCounter}`;
    card.innerHTML = `
        <div class="flex items-center justify-between">
            <span class="pill pill-info text-xs">Question #${questionFieldCounter}</span>
            <button class="btn btn-sm btn-coral" type="button" onclick="removeQuestionField(${questionFieldCounter})">
                <i data-lucide="trash-2"></i> Remove
            </button>
        </div>
        <label class="grid">
            <span>Question Statement</span>
            <textarea class="field min-h-12" data-q-text required placeholder="e.g. What is the default port of a Spring Boot app?"></textarea>
        </label>
        <div class="grid gap-3 sm:grid-cols-2">
            <label class="grid">
                <span>Option A</span>
                <input class="field" type="text" data-q-a required placeholder="e.g. 8080">
            </label>
            <label class="grid">
                <span>Option B</span>
                <input class="field" type="text" data-q-b required placeholder="e.g. 8081">
            </label>
            <label class="grid">
                <span>Option C</span>
                <input class="field" type="text" data-q-c required placeholder="e.g. 9000">
            </label>
            <label class="grid">
                <span>Option D</span>
                <input class="field" type="text" data-q-d required placeholder="e.g. 3306">
            </label>
        </div>
        <label class="grid max-w-2xl">
            <span>Correct Answer Option</span>
            <select class="field" data-q-correct required>
                <option value="A">Option A</option>
                <option value="B">Option B</option>
                <option value="C">Option C</option>
                <option value="D">Option D</option>
            </select>
        </label>
    `;
    qList.appendChild(card);
    if (window.lucide) lucide.createIcons();
}

function removeQuestionField(id) {
    const el = document.getElementById(`admin-q-field-${id}`);
    if (el) el.remove();
}

// POST: CREATE QUIZ
async function handleCreateQuiz(event) {
    event.preventDefault();
    const title = document.getElementById('quiz-title').value.trim();
    const description = document.getElementById('quiz-desc').value.trim();

    // Construct questions list payload
    const qCards = document.querySelectorAll('#form-questions-list > .card');
    if (qCards.length === 0) {
        alert('Please add at least one question to deploy a quiz.');
        return;
    }

    const questionsPayload = [];
    qCards.forEach(card => {
        questionsPayload.push({
            questionText: card.querySelector('[data-q-text]').value.trim(),
            optionA: card.querySelector('[data-q-a]').value.trim(),
            optionB: card.querySelector('[data-q-b]').value.trim(),
            optionC: card.querySelector('[data-q-c]').value.trim(),
            optionD: card.querySelector('[data-q-d]').value.trim(),
            correctOption: card.querySelector('[data-q-correct]').value
        });
    });

    try {
        const response = await fetch(`${API_BASE}/admin/quizzes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                description,
                questions: questionsPayload
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'Error creating quiz.');
        }

        showAdminAlert(`Success! New quiz "${title}" deployed.`);
        
        // Reset form
        document.getElementById('quiz-title').value = '';
        document.getElementById('quiz-desc').value = '';
        document.getElementById('form-questions-list').innerHTML = '';
        questionFieldCounter = 0;
        addQuestionField();

        // Refresh list
        await loadAdminQuizzes();
    } catch (err) {
        alert('Failed to deploy quiz: ' + err.message);
    }
}

// GET & DELETE: ADMIN QUIZZES LIST
async function loadAdminQuizzes() {
    try {
        const response = await fetch(`${API_BASE}/quizzes`);
        if (!response.ok) throw new Error('Could not retrieve quizzes.');
        const quizzes = await response.json();

        const tableBody = document.getElementById('admin-quizzes-table');
        if (tableBody) {
            if (quizzes.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-slate-400 py-4">No active quizzes in the repository database.</td></tr>`;
            } else {
                tableBody.innerHTML = quizzes.map(q => `
                    <tr>
                        <td><strong>${q.id}</strong></td>
                        <td>${escapeHtml(q.title)}</td>
                        <td>${escapeHtml(q.description || '-')}</td>
                        <td>
                            <button class="btn btn-sm btn-coral" onclick="deleteQuiz(${q.id}, '${escapeHtml(q.title)}')">
                                <i data-lucide="trash-2"></i> Delete
                            </button>
                        </td>
                    </tr>
                `).join('');
            }
            if (window.lucide) lucide.createIcons();
        }
    } catch (err) {
        console.error(err);
    }
}

async function deleteQuiz(quizId, title) {
    if (!confirm(`Are you sure you want to permanently delete the quiz "${title}" and all its questions?`)) {
        return;
    }

    try {
        const response = await fetch(`${API_BASE}/admin/quizzes/${quizId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const text = await response.text();
            throw new Error(text || 'Delete failed.');
        }

        showAdminAlert(`Quiz "${title}" deleted successfully.`);
        await loadAdminQuizzes();
    } catch (err) {
        alert('Could not delete quiz: ' + err.message);
    }
}

// GET: ADMIN USER DIRECTORY
async function loadAdminUsers() {
    try {
        const response = await fetch(`${API_BASE}/admin/users`);
        if (!response.ok) throw new Error('Could not retrieve user directory.');
        const users = await response.json();

        const tableBody = document.getElementById('admin-users-table');
        if (tableBody) {
            if (users.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="3" class="text-center text-slate-400 py-4">No users registered in the system database.</td></tr>`;
            } else {
                tableBody.innerHTML = users.map(u => `
                    <tr>
                        <td><strong>${u.id}</strong></td>
                        <td>${escapeHtml(u.name)}</td>
                        <td>${escapeHtml(u.email)}</td>
                    </tr>
                `).join('');
            }
        }
    } catch (err) {
        console.error(err);
    }
}

// GET: ADMIN GLOBAL LOGS
async function loadAdminResults() {
    try {
        const response = await fetch(`${API_BASE}/admin/results`);
        if (!response.ok) throw new Error('Could not retrieve results log.');
        const results = await response.json();

        const tableBody = document.getElementById('admin-results-table');
        if (tableBody) {
            if (results.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="6" class="text-center text-slate-400 py-4">No quiz attempts recorded globally.</td></tr>`;
            } else {
                tableBody.innerHTML = results.map(r => {
                    const percentageStyle = r.percentage >= 70 ? 'pill-success' : (r.percentage >= 40 ? 'pill-warning' : 'bg-[#ffe9ee] text-danger border-rose-950');
                    return `
                        <tr>
                            <td><strong>${r.resultId}</strong></td>
                            <td class="font-bold">${escapeHtml(r.userName || 'N/A')}</td>
                            <td>${escapeHtml(r.quizTitle)}</td>
                            <td>${r.score} / ${r.totalQuestions}</td>
                            <td><span class="pill ${percentageStyle}">${Math.round(r.percentage)}%</span></td>
                            <td class="text-xs text-slate-400">${formatDate(r.submittedAt)}</td>
                        </tr>
                    `;
                }).join('');
            }
        }
    } catch (err) {
        console.error(err);
    }
}

// -------------------------------------------------------------
// UTILITY FUNCTIONS
// -------------------------------------------------------------
function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

function formatDate(dateStr) {
    if (!dateStr) return 'N/A';
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return dateStr;
        return d.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }) + ' at ' + d.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        return dateStr;
    }
}
