// Banco de datos actualizado: se eliminó 'lista' y se agregaron los ciclos 'for' y 'while'
const pythonDatabase = [
    { word: "variable", hint: "Caja virtual donde guardamos datos o valores con un nombre." },
    { word: "funcion", hint: "Bloque de código reutilizable que realiza una tarea específica (ej: print)." },
    { word: "bucle", hint: "Instrucción que repite un bloque de código (como while o for)." },
    { word: "booleano", hint: "Tipo de dato que solo puede ser Verdadero (True) o Falso (False)." },
    { word: "entero", hint: "Tipo de número que no tiene decimales (en Python se llama int)." },
    { word: "cadena", hint: "Texto encerrado entre comillas (en Python conocido como string)." },
    { word: "indentacion", hint: "Los 4 espacios obligatorios al inicio de una línea que ordenan el código." },
    { word: "ciclofor", hint: "Bucle ideal para repetir un bloque de código un número exacto de veces usando rangos." },
    { word: "ciclowhile", hint: "Bucle que repite instrucciones de forma indefinida MIENTRAS una condición sea True." },
    { word: "condicional", hint: "Estructuras que toman decisiones en el código usando 'if' y 'else'." },
    { word: "modulo", hint: "Archivo que contiene código de Python listo para importar (ej: random, time)." },
    { word: "operador", hint: "Símbolos usados para hacer cálculos o comparar cosas (+, -, ==, >)." },
    { word: "retornar", hint: "Acción de una función para devolver un resultado (palabra clave 'return')." }
];

let selectedWordData = {};
let guessedLetters = [];
let lives = 6;
let streak = 0;
const targetStreak = 10;

// Gráficos visuales en texto plano que simulan el avance del ahorcado
const hangmanStages = [
    "💀 ¡GAME OVER! Te has quedado sin líneas de código.",
    "🔧 Estado crítico: ¡Solo queda la base del script! (1 vida)",
    "💻 Error de sintaxis: Estructura comprometida (2 vidas)",
    "⚠️ Advertencia: El bucle está fallando (3 vidas)",
    "⚙️ Compilando: Pérdida de datos menor (4 vidas)",
    "⚡ Escaneando: Pequeños bugs detectados (5 vidas)",
    "🚀 Servidor estable: Todo corriendo a la perfección (6 vidas)"
];

const alphabet = "abcdefghijklmnñopqrstuvwxyz";

function startRound() {
    // Verificar si ganaron el desafío de racha completa
    if (streak >= targetStreak) {
        document.getElementById("game-card").innerHTML = `
            <h1 style="color: var(--success-color);">¡HACKER SUPREMO! 👑</h1>
            <p style="font-size: 1.3rem;">¡Increíble! Lograste una racha perfecta de ${streak} palabras consecutivas.</p>
            <button class="restart-btn" onclick="location.reload()">Reiniciar Desafío</button>
        `;
        return;
    }

    // Seleccionar una palabra al azar de la base de datos
    const randomIndex = Math.floor(Math.random() * pythonDatabase.length);
    selectedWordData = pythonDatabase[randomIndex];
    
    guessedLetters = [];
    lives = 6;

    document.getElementById("lives").innerText = lives;
    document.getElementById("streak").innerText = streak;
    document.getElementById("hint-target").innerText = `💡 Pista: ${selectedWordData.hint}`;
    document.getElementById("message-target").innerText = "";
    document.getElementById("hangman-visual").innerText = hangmanStages[lives];

    renderWord();
    createKeyboard();
}

function renderWord() {
    const displayHtml = selectedWordData.word
        .split("")
        .map(letter => (guessedLetters.includes(letter) ? letter : "_"))
        .join(" ");
    
    document.getElementById("word-target").innerText = displayHtml;

    // Condición de victoria de la ronda
    if (!displayHtml.includes("_")) {
        streak++;
        document.getElementById("streak").innerText = streak;
        document.getElementById("message-target").style.color = "var(--success-color)";
        document.getElementById("message-target").innerText = "¡Palabra descifrada! Cargando siguiente... 🔄";
        disableAllKeys();
        setTimeout(startRound, 2000);
    }
}

function createKeyboard() {
    const keyboardContainer = document.getElementById("keyboard-container");
    keyboardContainer.innerHTML = "";

    alphabet.split("").forEach(letter => {
        const button = document.createElement("button");
        button.innerText = letter;
        button.classList.add("key");
        button.id = `key-${letter}`;
        button.addEventListener("click", () => handleGuess(letter));
        keyboardContainer.appendChild(button);
    });
}

function handleGuess(letter) {
    document.getElementById(`key-${letter}`).disabled = true;

    if (selectedWordData.word.includes(letter)) {
        guessedLetters.push(letter);
        renderWord();
    } else {
        lives--;
        document.getElementById("lives").innerText = lives;
        document.getElementById("hangman-visual").innerText = hangmanStages[lives];

        if (lives <= 0) {
            streak = 0; // Se rompe la racha si pierden
            document.getElementById("streak").innerText = streak;
            document.getElementById("word-target").innerText = selectedWordData.word.toUpperCase();
            document.getElementById("message-target").style.color = "var(--danger-color)";
            document.getElementById("message-target").innerText = "¡Ahorcado! Inténtalo de nuevo.";
            disableAllKeys();
            
            // Botón para volver a intentar
            const retryBtn = document.createElement("button");
            retryBtn.innerText = "Siguiente Palabra";
            retryBtn.classList.add("restart-btn");
            retryBtn.onclick = startRound;
            document.getElementById("message-target").appendChild(document.createElement("br"));
            document.getElementById("message-target").appendChild(retryBtn);
        }
    }
}

function disableAllKeys() {
    const buttons = document.querySelectorAll(".key");
    buttons.forEach(btn => btn.disabled = true);
}

// Iniciar al cargar la ventana
window.onload = startRound;
