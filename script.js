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
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
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
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
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
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
        return allAnswers
            .map(
                (answer) => `
            <label>
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
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
        //... form submission logic including setting cookies and calculating score
        const username = document.getElementById("username").value;
    
        // Check if the username is provided and it's not the same as the one in the cookie
        if (username && username !== getCookie("username")) {
        // Save the username as a cookie with a 7-day expiration
        setCookie("username", username, 7);
        }
        
        // Call checkUsername to update the UI after submission
        checkUsername();
    }
    function checkUsername() {
        //... code for checking if a username cookie is set and adjusting the UI
        const username = getCookie("username");

    if (username) {
        // Hide the username input and show the "New Player" button
        document.getElementById("username").classList.add("hidden");
        document.getElementById("new-player").classList.remove("hidden");
        
        // Optionally, display a greeting or welcome back message
        const greeting = document.createElement("p");
        greeting.textContent = `Welcome back, ${username}!`;
        document.getElementById("game-container").insertBefore(greeting, document.getElementById("trivia-form"));
    } else {
        // Show the username input and hide the "New Player" button
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
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Calculate expiration time
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value}; ${expires}; path=/`; // Set the cookie with the path as root
    }
    /**
     * Retrieves the value of a specific cookie by its name.
     * @param {string} name - The name of the cookie.
     * @returns {string|null} - The value of the cookie or null if the cookie is not found.
     */
    function getCookie(name) {
        const nameEQ = `${name}=`;
        const cookies = document.cookie.split(';'); // Split all cookies by semicolon

        for (let i = 0; i < cookies.length; i++) {
            let cookie = cookies[i].trim(); // Remove any leading spaces
            if (cookie.indexOf(nameEQ) === 0) {
                return cookie.substring(nameEQ.length, cookie.length); // Return cookie value
            }
        }

        return null; // Return null if the cookie is not found

    }
    function saveScore(username, score) {
        //... code for saving the score to localStorage
    }
    function newPlayer() {
        //... code for clearing the username cookie and updating the UI
        // Clear the username cookie
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        // Optionally, reset UI elements (clear input fields, hide score, etc.)
        document.getElementById("username").value = ""; // Clear the username input
        document.getElementById("new-player").classList.add("hidden"); // Hide the new player button
        document.getElementById("submit-game").disabled = false; // Enable the submit button if needed
    }
    function calculateScore() {
        //... code for calculating the score
    }
    function displayScores() {
        //... code for displaying scores from localStorage
    }
});
