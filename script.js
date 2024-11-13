/**
 * Initializes the Trivia Game when the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    checkUsername();
    fetchQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        const loadingContainer = document.getElementById("loading-container");
        const questionContainer = document.getElementById("question-container");

        loadingContainer.classList.toggle("hidden", !isLoading);
        questionContainer.classList.toggle("hidden", isLoading);
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions

        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(question.correct_answer, question.incorrect_answers, index)}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(correctAnswer, incorrectAnswers, questionIndex) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
        
        return allAnswers
            .map(
                (answer) => `
                    <label>
                        <input type="radio" name="answer${questionIndex}" value="${answer}" 
                            ${answer === correctAnswer ? 'data-correct="true"' : ""}>
                        ${answer}
                    </label>
                `
            )
            .join("");
    }

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        let username = getCookie("username");

        // Set username if not found in cookie
        if (!username) {
            username = document.getElementById("username").value || "Anonymous";
            setCookie("username", username, 7);
        }

        const score = calculateScore();
        saveScore(username, score);
        displayScores();
        checkUsername();
        fetchQuestions();
    }

    /**
     * Checks if a username cookie is set and updates the UI accordingly.
     */
    function checkUsername() {
        const username = getCookie("username");

        if (username) {
            document.getElementById("username").classList.add("hidden");
            document.getElementById("new-player").classList.remove("hidden");

            const greeting = document.createElement("p");
            greeting.textContent = `Welcome back, ${username}!`;
            document.getElementById("game-container").insertBefore(greeting, document.getElementById("trivia-form"));
        } else {
            document.getElementById("username").classList.remove("hidden");
            document.getElementById("new-player").classList.add("hidden");
        }
    }

    /**
     * Sets a cookie with a specified name, value, and expiration days.
     * @param {string} name - The name of the cookie.
     * @param {string} value - The value to store in the cookie.
     * @param {number} days - The number of days until the cookie expires.
     */
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); 
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`;
    }

    /**
     * Retrieves the value of a specific cookie by its name.
     * @param {string} name - The name of the cookie.
     * @returns {string|null} - The value of the cookie or null if the cookie is not found.
     */
    function getCookie(name) {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';');

        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length);
            }
        }

        return null;
    }

    /**
     * Saves the user's score in localStorage.
     * @param {string} username - The name of the player.
     * @param {number} score - The score achieved by the player.
     */
    function saveScore(username, score) {
        let scores = JSON.parse(localStorage.getItem("triviaScores")) || [];
        scores.push({ username, score, date: new Date().toISOString() });
        localStorage.setItem("triviaScores", JSON.stringify(scores));
    }

    /**
     * Starts a new player session by clearing the username cookie and resetting the UI.
     */
    function newPlayer() {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
        document.getElementById("username").value = "";
        document.getElementById("new-player").classList.add("hidden");
        document.getElementById("submit-game").disabled = false;
    }

    /**
     * Calculates the user's score based on selected answers.
     * @returns {number} The total score based on correct answers.
     */
    function calculateScore() {
        let score = 0;
        const questions = document.querySelectorAll("#question-container div");

        questions.forEach((questionDiv) => {
            const selectedOption = questionDiv.querySelector("input[type='radio']:checked");

            if (selectedOption && selectedOption.dataset.correct === "true") {
                score += 1;
            }
        });

        return score;
    }

    /**
     * Displays scores from localStorage in the score table.
     */
    function displayScores() {
        const scores = JSON.parse(localStorage.getItem("triviaScores")) || [];
        const scoreTableBody = document.querySelector("#score-table tbody");

        scoreTableBody.innerHTML = "";

        scores.forEach((entry) => {
            const row = document.createElement("tr");
            const usernameCell = document.createElement("td");
            usernameCell.textContent = entry.username;

            const scoreCell = document.createElement("td");
            scoreCell.textContent = entry.score;

            row.appendChild(usernameCell);
            row.appendChild(scoreCell);
            scoreTableBody.appendChild(row);
        });
    }
});
