document.addEventListener("DOMContentLoaded", () => {
    const correctAnswers = {
        q1: "ა", 
        q2: "გ", 
        q3: "ბ", 
        q4: "ა", 
        q5: "ბ",
        q6: "ბ", 
        q7: "ა", 
        q8: "ბ", 
        q9: "ბ", 
        q10: "ბ",
        q11: "გ", 
        q12: "დ", 
        q13: "ა", 
        q14: "ა", 
        q15: "დ",
        q16: "გ",
        q17: "ბ",
        q18: "ა",
        q19: "გ",
        q20: "გ"
    };

    let currentQuestion = localStorage.getItem("currentQuestion") ? parseInt(localStorage.getItem("currentQuestion")) : 1;
    const totalQuestions = 20;
    const footerNavigation = document.getElementById("footer-navigation");
    const timerElement = document.getElementById("timer");
    let timeLeft =  2700;
    for (let i = 1; i <= totalQuestions; i++) {
        const questionButton = document.createElement("button");
        questionButton.textContent = i;
        questionButton.classList.add("nav-button");
        questionButton.addEventListener("click", () => {
            currentQuestion = i;
            showQuestion(currentQuestion);
            console.log("Jumped to question:", currentQuestion); // Debugging log
        });
        footerNavigation.appendChild(questionButton);
    }
    function showQuestion(index) {
        for (let i = 1; i <= totalQuestions; i++) {
            document.getElementById(`question${i}`).style.display = i === index ? 'block' : 'none';
        }
        document.getElementById('prev').style.display = index > 1 ? 'inline' : 'none';
        document.getElementById('next').style.display = index < totalQuestions ? 'inline' : 'none';
    }

    function nextQuestion() {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            showQuestion(currentQuestion);
        }
    }

    function prevQuestion() {
        if (currentQuestion > 1) {
            currentQuestion--;
            showQuestion(currentQuestion);
        }
    }

    function startTimer() {
        let timerInterval = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                submitQuiz();
            } else {
                let minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;
                timerElement.innerText = `დარჩენილია: ${minutes} წუთი და ${seconds} წამი`;
                localStorage.setItem("timeLeft", timeLeft);
                timeLeft--;
            }
        }, 1000);
    }
    
    function submitQuiz() {
        let score = 0;
        let tableContent = ""; // To store rows of the table
        document.getElementById("footer-navigation").style.display = "none";

        for (let i = 1; i <= 20; i++) {
            const studentAnswer = document.querySelector(`input[name="q${i}"]:checked`);
            const correctAnswer = correctAnswers[`q${i}`];
            const studentResponse = studentAnswer ? studentAnswer.value : "გამოტოვებული";
            
            const isCorrect = studentResponse === correctAnswer;
            if (isCorrect) score++;

            // Create a row in the table content
            tableContent += `
                <tr>
                    <td>კითხვა ${i}</td>
                    <td>${correctAnswer}</td>
                    <td>${studentResponse}</td>
                    <td style="color: ${isCorrect ? 'green' : 'red'};">
                        ${isCorrect ? "სწორია" : "არასწორია"}
                    </td>
                </tr>
            `;
        }

        // Display the score and table
        document.getElementById("result").innerText = `შენ დააგროვე ${score} ქულა 20-დან.`;
        document.getElementById("result-section").style.display = "block";
        document.getElementById("quizForm").style.display = "none";
        document.getElementById("submit-button").disabled = true;
        document.getElementById("timer").style.display = "none";

        // Insert the table content into the result-table div
        const tableHTML = `
            <table border="1" cellpadding="5" cellspacing="0">
                <thead>
                    <tr>
                        <th>კითხვა</th>
                        <th>სწორი პასუხი</th>
                        <th>შენი პასუხი</th>
                        <th>სტატუსი</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableContent}
                </tbody>
            </table>
        `;
        document.getElementById("result-table").innerHTML = tableHTML;

        // Clear the stored time and answers
        localStorage.removeItem("timeLeft");
        localStorage.removeItem("studentAnswers");
    }

    function saveAnswers() {
        let studentAnswers = {};
        for (let i = 1; i <= 20; i++) {
            const studentAnswer = document.querySelector(`input[name="q${i}"]:checked`);
            studentAnswers[`q${i}`] = studentAnswer ? studentAnswer.value : null;
        }
        localStorage.setItem("studentAnswers", JSON.stringify(studentAnswers));
    }

    function loadAnswers() {
        let studentAnswers = JSON.parse(localStorage.getItem("studentAnswers"));
        if (studentAnswers) {
            for (let i = 1; i <= 20; i++) {
                const answer = studentAnswers[`q${i}`];
                if (answer) {
                    document.querySelector(`input[name="q${i}"][value="${answer}"]`).checked = true;
                }
            }
        }
    }

    document.getElementById("submit-button").addEventListener("click", submitQuiz);
    document.querySelectorAll('input[type="radio"]').forEach((input) => {
        input.addEventListener("change", saveAnswers);
    });
  document.getElementById("next").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default button behavior
    nextQuestion();
});

document.getElementById("prev").addEventListener("click", (event) => {
    event.preventDefault(); // Prevent default button behavior
    prevQuestion();  
});
    
    showQuestion(currentQuestion); // Initialize the first question
    
   startTimer(); 
   loadAnswers();
  
});