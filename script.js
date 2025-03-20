let gameEnded = false;


document.addEventListener("DOMContentLoaded", () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const roulette = document.getElementById("roulette");
    const radius = 130;
    let currentIndex = 0;
    const statuses = new Array(letters.length).fill(null); // null = no respondido, 'correct', 'incorrect', 'passed'
    let score = 0;
    let timeLeft = 300; // Tiempo en segundos
    let timerInterval;
    

    const questions = {
        "A": { text: "Empieza con A: Equipo con 4 Champions (o Copas de Europa)", type: "Equipo" , answer:"Ajax"},
        "B": { text: "Empieza con B: Jugador galés ganador de 5 Champions", type: "Jugador", answer: "Bale" },
        "C": { text: "Empieza con C: (Apodo) Delantero mexicano que jugó en Manchester United y Real Madrid", type: "Jugador", answer: "Chicharito"},
        "D": { text: "Empieza con D: Campeón del mundo en 2006 y n°10 de la Juventus", type: "Jugador", answer:"Del Piero"},
        "E": { text: "Empieza con E: Lateral francés con más de 350 partidos en el Manchester United", type:"Jugador", answer:"Evra"},
        "F": { text: "Empieza con F: Ídolo uruguayo de River Plate", type:"Jugador", answer:"Francescoli"},
        "G": { text: "Empieza con G: Joven argentino nacido en Madrid", type:"Jugador", answer:"Garnacho"},
        "H": { text: "Empieza con H: Anotó en la final de la Champions 20/21", type:"Jugador", answer:"Havertz"},
        "I": { text: "Empieza con I: (Apodo) Golden Boy 2012", type:"Jugador", answer:"Isco"},
        "J": { text: "Empieza con J: Fichaje: Palmeiras -> Man City, Año: 2017, Precio: 32M de euros", type:"Jugador", answer:"Jesus"},
        "K": { text: "Empieza con K: Balón de Oro 2007", type:"Jugador", answer:"Kaka"},
        "L": { text: "Empieza con L: Arquero ucraniano del Real Madrid", type:"Jugador", answer:"Lunin"},
        "M": { text: "Empieza con M: Anotó 3 goles en una final de Mundial", type:"Jugador", answer:"Mbappe"},
        "N": { text: "Empieza con N: Debutante más joven en la historia de la Premier League", type:"Jugador", answer:"Nwaneri"},
        "O": { text: "Empieza con O: Galardonado Futbolista Africano del Año en 2023", type:"Jugador", answer:"Osimhen"},
        "P": { text: "Empieza con P: (Apodo) Golden Boy 2021", type:"Jugador", answer:"Pedri"},
        "Q": { text: "Empieza con Q: Anotó en la final de la Libertadores 2018", type:"Jugador", answer:"Quintero"},
        "R": { text: "Empieza con R: Jugador del Real Madrid surgido en Santos", type:"Jugador", answer:"Rodrygo"},
        "S": { text: "Empieza con S: Trayectoria: Liverpool > Man City > Chelsea > Arsenal", type:"Jugador", answer:"Sterling"},
        "T": { text: "Empieza con T: Conforma el 'Derbi della Mole' junto con la Junventus", type:"Equipo", answer:"Torino"},
        "U": { text: "Empieza con U: Primer campeón del mundo de la historia", type:"País", answer:"Uruguay"},
        "V": { text: "Empieza con V: Delantero del Leicester campeón de la Premier League 15/16", type:"Jugador", answer:"Vardy"},
        "W": { text: "Empieza con W: Mediocampista belga que jugó en el Zenit de Rusia", type:"Jugador", answer:"Witsel"},
        "X": { text: "Empieza con X: Jugó más de 700 partidos con el Barcelona", type:"Jugador", answer:"Xavi"},
        "Y": { text: "Empieza con Y: (Apellido) Mejor jugador joven de la Eurocopa 2024", type:"Jugador", answer:"Yamal"},
        "Z": { text: "Empieza con Z: Fue expulsado en su último partido como jugador profesional", type:"Jugador", answer:"Zidane"},
        // Agregar todas las letras con sus preguntas...
    };

    const userAnswers = new Array(letters.length).fill(null);

    letters.forEach((letter, index) => {
        const span = document.createElement("span");
        span.classList.add("letter");
        span.textContent = letter;
        span.setAttribute("data-index", index);
        
        const angle = ((index / letters.length) * (2 * Math.PI)) - (Math.PI / 2);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        span.style.transform = `translate(${x}px, ${y}px)`;
        roulette.appendChild(span);
    });

    startTimer();
    updateQuestion();
    
    const letterElements = document.querySelectorAll(".letter");
    letterElements[currentIndex].classList.add("active");

    function updateQuestion() {
        const currentLetter = letters[currentIndex];
        const questionData = questions[currentLetter];
    
        if (questionData) {
            document.getElementById("question").textContent = questionData.text;
            document.getElementById("category").textContent = questionData.type;
        } else {
            document.getElementById("question").textContent = "Sin pregunta disponible";
            document.getElementById("category").textContent = "";
        }
        
    }

    function updateActiveLetter(){
        if(statuses[currentIndex] === "passed"){
            letterElements[currentIndex].classList.remove("passed");
        }
        letterElements[currentIndex].classList.add("active");
    }

    function getNextIndex(startIndex) {
        letterElements[currentIndex].classList.remove("active");
        let nextIndex = startIndex;
        do {
            nextIndex = (nextIndex + 1) % letters.length;
            if(nextIndex == startIndex){
                return -1;
            }
        } while (statuses[nextIndex] === "correct" || statuses[nextIndex] === "incorrect");
        return nextIndex;
    }

    window.passQuestion = function() {
        statuses[currentIndex] = "passed";
        letterElements[currentIndex].classList.add("passed");
        currentIndex = getNextIndex(currentIndex);
        if(currentIndex != -1){
            updateActiveLetter();
            updateQuestion();
        }
        document.getElementById("answer").value = "";

    };

    window.checkAnswer = function(){
        const userAnswer = document.getElementById("answer").value.trim().toLowerCase();
        if (userAnswer === "") {
            alert("Ingrese una respuesta no vacía.");
            return; // Evita procesar respuestas vacías
        }
        const currentLetter = letters[currentIndex];
        const correctAnswer = questions[currentLetter].answer.trim().toLowerCase();
        userAnswers[currentIndex] = userAnswer;   //siempre va a estar en minúsculas, cambiar más adelante
        // Comparar la respuesta del usuario con la correcta
        if (userAnswer === correctAnswer) {
            statuses[currentIndex] = "correct";
            letterElements[currentIndex].classList.add("correct");
            score++;
        } else {
            statuses[currentIndex] = "incorrect";
            letterElements[currentIndex].classList.add("incorrect");
        }

        currentIndex = getNextIndex(currentIndex);
        if(currentIndex === -1){
            endGame();
        }else{
            updateActiveLetter();
            updateQuestion();
        }
        document.getElementById("answer").value = "";
    };


    function startTimer() {
        updateTimerDisplay();
        timerInterval = setInterval(() => {
            document.getElementById("timer").textContent = timeLeft;
            if (timeLeft <= 0) {
                endGame(); // Se acaba el tiempo
            }
            timeLeft--;
            updateTimerDisplay();
        }, 1000);
    }

    function endGame() {
        clearInterval(timerInterval); // Detener el temporizador

        // Ocultar elementos de la interfaz del juego
        document.getElementById("quit-button").style.display = "none";
        document.getElementById("category").style.display = "none"; 
        document.getElementById("question").style.display = "none"; 
        document.getElementById("answer").style.display = "none"; 
        document.querySelector(".buttons").style.display = "none";

        const timerElement = document.getElementById("timer");
    
        if (timerElement) {
            timerElement.textContent = `Terminado!\nScore: ${score} / ${letters.length}`;
            timerElement.classList.add("ended"); // Aplicar estilos
        }

        document.getElementById("restart-button").style.display = "block";
        document.getElementById("results-button").style.display = "block";
        gameEnded = true;
    }

    function updateTimerDisplay() {
        if (timeLeft < 0) return; // Evita que se actualice a valores negativos
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById("timer").textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    window.confirmQuit = function() {
        const confirmQuit = confirm("¿Seguro que quieres abandonar la partida?");
        if (confirmQuit) {
            endGame();
        }
    };

    window.restartGame = function() {
        // Ocultar el mensaje y el botón de reinicio
        document.getElementById("restart-button").style.display = "none";
        document.getElementById("results-button").style.display = "none";
        document.getElementById("quit-button").style.display = "block";
        document.getElementById("category").style.display = "block"; 
        document.getElementById("question").style.display = "block"; 
        document.getElementById("answer").style.display = "block"; 
        document.querySelector(".buttons").style.display = "block";
    
        // Resetear todas las letras a estado inicial
        document.querySelectorAll(".letter").forEach(letter => {
            letter.classList.remove("correct", "incorrect", "passed", "active");
        });
        document.getElementById("timer").className = "timer";
    
        // Volver a empezar desde la A
        gameEnded = false;
        currentIndex = 0;
        score = 0;
        statuses.fill(null);
        timeLeft = 300;
        userAnswers.fill(null);
        startTimer();
        updateActiveLetter();
        updateQuestion();
    };

    window.showResults = function() { //un asco
        document.getElementById("game-content").style.display = "none"; // Oculta la ruleta y botones
        document.getElementById("results-screen").classList.remove("hidden"); // Muestra los resultados
    
        let resultsList = document.getElementById("resultsList");
        resultsList.innerHTML = ""; // Limpia la lista antes de llenarla
    
        for(let index=0; index < letters.length; index++){
            let li = document.createElement("li");
            let currentLetter = letters[index];
            if (userAnswers[index]) {
                if (userAnswers[index] === questions[currentLetter].answer.toLowerCase()) {
                    li.innerHTML = `<span class="correct">✅ ${letters[index].toUpperCase()} - ${userAnswers[index]}</span>`;
                } else {
                    li.innerHTML = `<span class="incorrect">❌ ${letters[index].toUpperCase()} - ${userAnswers[index]} (Correcto: ${questions[currentLetter].answer})</span>`;
                }
            } else {
                li.innerHTML = `<span class="skipped">⚠️ ${letters[index].toUpperCase()} - Sin responder</span>`;
            }
            resultsList.appendChild(li);
        }
    };

    window.backToEndScreen = function() {
        document.getElementById("results-screen").classList.add("hidden"); // Oculta los resultados
        document.getElementById("game-content").style.display = "block"; // Muestra la pantalla final
    };
    

});

document.addEventListener("keydown", (event) => {
    const answerInput = document.getElementById("answer");
    const buttons = document.querySelectorAll(".buttons button");
    const quitButton = document.getElementById("quit-button");
    const restartButton = document.getElementById("restart-button");
    let activeElement = document.activeElement;

    // Obtener lista de elementos interactivos
    const elements = [answerInput, ...buttons, quitButton];
    let index = elements.indexOf(activeElement);

    if(gameEnded){
        restartButton.focus();
        if(event.key === "Enter"){
            restartGame();
        }
        return;
    }

    if (event.key === "ArrowRight") {
        index = (index + 1) % elements.length; // Avanzar a la derecha
    } else if (event.key === "ArrowLeft") {
        index = (index - 1 + elements.length) % elements.length; // Retroceder a la izquierda
    } else if (event.key === "ArrowUp") {
        index = (index===3)? 1:0; // Siempre enfoca el input con flecha arriba
    } else if (event.key === "ArrowDown") {
        index = (index===0)? 1:3; // Enfoca el primer botón con flecha abajo
    }

    elements[index].focus(); // Enfocar el nuevo elemento

    if (event.key === "Enter") {
        event.preventDefault(); // Evitar doble activación

        if (activeElement === answerInput || activeElement === buttons[0]) {
            checkAnswer(); // Validar respuesta
        } else if (activeElement === buttons[1]) {
            passQuestion(); // Pasar pregunta
        }else if (activeElement === quitButton){
            confirmQuit();
        }
    }

});
