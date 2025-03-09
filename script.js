let gameEnded = false;


document.addEventListener("DOMContentLoaded", () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    const roulette = document.getElementById("roulette");
    const radius = 130;
    let currentIndex = 0;
    const statuses = new Array(letters.length).fill(null); // null = no respondido, 'correct', 'incorrect', 'passed'
    let score = 0;
    let timeLeft = 180; // Tiempo en segundos
    let timerInterval;
    

    const questions = {
        "A": { text: "Empieza con A: Anotó 6 goles en un solo partido de Copa Libertadores", type: "Jugador" , answer:"Alvarez"},
        "B": { text: "Empieza con B: Golden Boy 2023", type: "Jugador", answer: "Bellingham" },
        "C": { text: "Empieza con C: ¿Cuál es el nombre del estadio del FC Barcelona?", type: "Estadio", answer: "Camp Nou"},
        "D": { text: "Empieza con D: Delantero ganador de liga nacional con Wolfsburg y Manchester City", type: "Jugador", answer:"Dzeko"},
        "E": { text: "Empieza con E: Jugador de histórico peinado que porta el dorsal n°92", type:"Jugador", answer:"El Shaarawy"},
        "F": { text: "Empieza con F: Mejor jugador del Mundial 2010", type:"Jugador", answer:"Forlan"},
        "G": { text: "Empieza con G: Mayor número de apariciones en la historia de la selección francesa", type:"Jugador", answer:"Griezmann"},
        "H": { text: "Empieza con H: Record de goles en una temporada de la Premier League", type:"Jugador", answer:"Haaland"},
        "I": { text: "Empieza con I: LLevaba la 8 en el Barcelona y el 6 en la selección española", type:"Jugador", answer:"Iniesta"},
        "J": { text: "Empieza con J: (Nombre) Premio Puskas 2014", type:"Jugador", answer:"James"},
        "K": { text: "Empieza con K: Mediocampista/Lateral del Bayern Munich", type:"Jugador", answer:"Kimmich"},
        "L": { text: "Empieza con L: Usaba la n°10 del Everton en la temporada 15/16", type:"Jugador", answer:"Lukaku"},
        "M": { text: "Empieza con M: Joven promesa actual del Manchester United con el dorsal n°37", type:"Jugador", answer:"Mainoo"},
        "N": { text: "Empieza con N: Mediocampista belga que jugó en Roma, Inter y Cagliari", type:"Jugador", answer:"Nainggolan"},
        "O": { text: "Empieza con O: Ganador del Balón de Oro 2001", type:"Jugador", answer:"Owen"},
        "P": { text: "Empieza con P: Fue vendido gratis para luego ser recomprado por más de 100M de euros", type:"Jugador", answer:"Pogba"},
        "Q": { text: "Empieza con Q: Reconocido por sus goles de 'trivela'", type:"Jugador", answer:"Quaresma"},
        "R": { text: "Empieza con R: Trayectoria: Stuttgart > Roma > Chelsea > Real Madrid", type:"Jugador", answer:"Rudiger"},
        "S": { text: "Empieza con S: N°19 del Manchester City en la temporada 18/19 (Centurions)", type:"Jugador", answer:"Sane"},
        "T": { text: "Empieza con T: Apellido de los hermanos franceses que juegan en Juventus e Inter de Milán", type:"Jugador", answer:"Thuram"},
        "U": { text: "Empieza con U: Arquero del Bayern Munich", type:"Jugador", answer:"Ulreich"},
        "V": { text: "Empieza con V: Jugador chileno apodado 'El Mago'", type:"Jugador", answer:"Valdivia"},
        "W": { text: "Empieza con W: Equipo londinense de la Premier League", type:"Equipo", answer:"West Ham"},
        "X": { text: "Empieza con X: N°34 del Arsenal en la temporada 22/23", type:"Jugador", answer:"Xhaka"},
        "Y": { text: "Empieza con Y: Jugador turco de la Juventus", type:"Jugador", answer:"Yildiz"},
        "Z": { text: "Empieza con Z: Lesionó a Neymar en el Mundial 2014", type:"Jugador", answer:"Zuñiga"},
        // Agregar todas las letras con sus preguntas...
    };

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
        timeLeft = 180;
        startTimer();
        updateActiveLetter();
        updateQuestion();
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
