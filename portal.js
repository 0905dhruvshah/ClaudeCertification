/* Dashboard and practice mode. Data stays in the visitor's browser via localStorage. */
const portal = {
    practiceIndex: 0,
    practiceAnswers: {}
};
const portalSections = ['welcome', 'exam', 'results', 'dashboard', 'practice', "resources"];
async function getDashboardData() {
    try {
        const response = await fetch(API_URL + "?t=" + Date.now(),{cache: "no-store"});
        if (!response.ok) {
            throw new Error("Unable to load dashboard data.");
        }
        return await response.json();
    }
    catch (error) {
        console.error(error);
        return [];
    }
}
async function showPortal(name) {
    portalSections.forEach(id =>
        document.getElementById(id).classList.toggle("hidden", id !== name)
    );
    document.querySelectorAll(".nav-link").forEach(btn => {
        btn.classList.remove("active");
        if (btn.dataset.portal === name)
            btn.classList.add("active");
    });
    if (name === "practice") {
        renderPractice();
    }
    if (name === "dashboard") {
        await renderDashboard();
    }
    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

function attemptData(candidateName) {
    if (!candidateName) return [];
    return JSON.parse(localStorage.getItem(getCandidateStorageKey(candidateName)) || "[]");
}

function allCandidates() {
    return JSON.parse(localStorage.getItem("ccaf-users") || "[]");
}
async function renderDashboard() {
    const data = await getDashboardData();
    updateStatistics(data);
    buildLeaderboard(data);
    buildRecentAttempts(data);
}
function updateStatistics(data) {
    const total = data.length;
    const passed = data.filter(x => x.status === "PASS").length;
    const failed = total - passed;
    const highest = total ? Math.max(...data.map(x => Number(x.score))) : 0;
    const average = total ? (data.reduce((a, b) => a + Number(b.score), 0) / total).toFixed(0) : 0;
    const passRate = total ? ((passed / total) * 100).toFixed(1) : 0;
    document.getElementById("totalAttempts").textContent = total;
    document.getElementById("totalPassed").textContent = passed;
    document.getElementById("totalFailed").textContent = failed;
    document.getElementById("highestScore").textContent = highest;
    document.getElementById("averageScore").textContent = average;
    document.getElementById("passRate").textContent = passRate + "%";
}
function buildLeaderboard(data) {
    const tbody = document.querySelector("#leaderboardTable tbody");
    tbody.innerHTML = "";
    const leaderboard = [...data].sort((a, b) => Number(b.score) - Number(a.score)).slice(0, 10);
    leaderboard.forEach((item, index) => {
        const row = document.createElement("tr");
        const rankClass = index === 0 ? "rank-1" : index === 1 ? "rank-2" : index === 2 ? "rank-3" : "rank-other";
        row.innerHTML = `        <td>            <div class="rank-badge ${rankClass}">                ${index + 1}            </div>        </td>        <td>${item.name}</td>        <td>${item.score}</td>        <td>            <span class="badge ${item.status === "PASS"                ? "badge-pass"                : "badge-fail"}">                ${item.status}            </span>        </td>        <td>${item.timestamp}</td>        `;
        tbody.appendChild(row);
    });
}
function buildRecentAttempts(data) {
    const tbody = document.querySelector("#recentAttemptsTable tbody");
    tbody.innerHTML = "";
    [...data].reverse().slice(0, 20).forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `            <td>${item.name}</td>            <td>${item.score}</td>            <td>${item.correct}</td>            <td>${item.wrong}</td>            <td>                <span class="badge ${item.status === "PASS"                    ? "badge-pass"                    : "badge-fail"}">                    ${item.status}                </span>            </td>            <td>${item.timestamp}</td>            `;
        tbody.appendChild(row);
    });
}
document.getElementById("refreshDashboard").addEventListener("click", renderDashboard);
document.getElementById("candidateSearch").addEventListener("input", async function() {
    const keyword = this.value.toLowerCase();
    const data = await getDashboardData();
    const history = data.filter(x => x.name.toLowerCase().includes(keyword));
    const container = document.getElementById("candidateHistory");
    if (!history.length) {
        container.innerHTML = "No candidate found.";
        return;
    }
    container.innerHTML = history.map(x => `        <p>            <strong>${x.score}</strong>            (${x.status})            - ${x.date}        </p>    `).join("");
});
function renderPracticeNavigator() {
    const nav = document.getElementById("practiceQuestionNav");
    nav.innerHTML = "";
    QUESTION_BANK.forEach((q, index) => {
        const btn = document.createElement("button");
        btn.className = "practice-nav-button";
        if (portal.practiceIndex === index) btn.classList.add("current");
        if (portal.practiceAnswers[index]) btn.classList.add("answered");
        btn.textContent = index + 1;
        btn.onclick = () => {
            portal.practiceIndex = index;
            renderPractice();
        };
        nav.appendChild(btn);
    });
    document.getElementById("practiceNavCount").textContent = `${Object.keys(portal.practiceAnswers).length}/${QUESTION_BANK.length}`;
}
function renderPractice() {
    const q = QUESTION_BANK[portal.practiceIndex];
    const answer = portal.practiceAnswers[portal.practiceIndex];
    document.getElementById('practiceCount').textContent = `${QUESTION_BANK.length} questions available - no timer, instant feedback.`;
    document.getElementById('practicePosition').textContent = `Question ${portal.practiceIndex + 1} of ${QUESTION_BANK.length}`;
    document.getElementById('practicePrevious').disabled = portal.practiceIndex === 0;
    document.getElementById('practiceNext').disabled = portal.practiceIndex === QUESTION_BANK.length - 1;
    document.getElementById('practiceCard').innerHTML = `<div class="question-top"><span class="question-number">PRACTICE ${portal.practiceIndex + 1}</span><span class="answer-state">${answer ? 'Answered' : 'Choose an answer'}</span></div><h2>${q.question}</h2><div class="options">${Object.entries(q.options).map(([key, value]) => `<button class="practice-option ${answer === key ? 'selected' : ''} ${answer && key === q.answer ? 'practice-correct' : ''} ${answer && key === answer && key !== q.answer ? 'practice-wrong' : ''}" data-answer="${key}"><span class="option-key">${key}</span><span class="option-text">${value}</span></button>`).join('')}</div>${answer ? `<div class="practice-answer"><strong>Correct answer: ${q.answer}</strong><p>${q.justification}</p></div>` : ''}`;
    document.querySelectorAll('.practice-option').forEach(button => button.addEventListener('click', () => {
        portal.practiceAnswers[portal.practiceIndex] = button.dataset.answer;
        renderPractice();
    }));
    renderPracticeNavigator();
}
document.querySelectorAll('[data-portal]').forEach(button => button.addEventListener('click', () => showPortal(button.dataset.portal)));
document.getElementById('practicePrevious').addEventListener('click', () => {
    portal.practiceIndex--;
    renderPractice();``
});
document.getElementById('practiceNext').addEventListener('click', () => {
    portal.practiceIndex++;
    renderPractice();
});
const selector = document.getElementById("candidateSelector");
if (selector) {
    selector.addEventListener("change", renderDashboard);
}
const resetButton = document.getElementById("resetCandidateHistory");
if (resetButton) {
    resetButton.addEventListener("click", () => {
        const selector = document.getElementById("candidateSelector");
        if (!selector.value) return;
        if (!confirm(`Delete history for ${selector.value}?`)) return;
        localStorage.removeItem(getCandidateStorageKey(selector.value));
        renderDashboard();
    });
}
