const canvas = document.getElementById('gameScreen');
const ctx = canvas.getContext('2d');
let bubbles = [];
let score = 0; // Variable para la puntuación
let gameStarted = false; // Variable para controlar el estado del juego
let timer; // Variable para el temporizador
let timerDisplay; // Variable para el cuadro del temporizador

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Clase Burbuja
class Bubble {
    constructor(x, y, radius, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.opacity = Math.random() * 0.3 + 0.2; // Transparencia entre 0.2 y 0.5
    }

    draw() {
        // Dibuja la burbuja principal
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(173, 216, 230, ${this.opacity})`; // Azul claro translúcido
        ctx.fill();
        
        // Agregar borde blanco suave alrededor
        ctx.lineWidth = 2;
        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity + 0.1})`; // Borde blanco
        ctx.stroke();

        // Efecto de reflejo en la burbuja
        ctx.beginPath();
        ctx.arc(this.x - this.radius / 3, this.y - this.radius / 3, this.radius / 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity + 0.2})`; // Brillo blanco
        ctx.fill();
        ctx.closePath();
    }

    update() {
        this.y -= this.speed; // Mover hacia arriba

        // Reposicionar la burbuja si sale de la pantalla
        if (this.y + this.radius < 0) {
            this.y = canvas.height + this.radius;
            this.x = Math.random() * canvas.width;
            this.radius = Math.random() * 25 + 10; // Tamaño aleatorio entre 10 y 35
            this.speed = Math.random() * 1.5 + 0.5; // Nueva velocidad aleatoria entre 0.5 y 2
            this.opacity = Math.random() * 0.3 + 0.2; // Nueva opacidad aleatoria
        }
    }

    // Verifica si el clic está dentro de la burbuja
    isClicked(x, y) {
        const distance = Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2);
        return distance < this.radius;
    }
}

// Crear burbujas iniciales
function createBubbles(num) {
    for (let i = 0; i < num; i++) {
        let x = Math.random() * canvas.width;
        let y = canvas.height + Math.random() * 100; // Comenzar desde abajo
        let radius = Math.random() * 25 + 10; // Tamaño aleatorio entre 10 y 35
        let speed = Math.random() * 1.5 + 0.5; // Velocidad aleatoria entre 0.5 y 2
        bubbles.push(new Bubble(x, y, radius, speed));
    }
}

// Dibujar y actualizar las burbujas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Si el juego no ha terminado, dibuja el rectángulo de puntuación
    if (bubbles.length > 0) {
        // Dibujar el rectángulo de puntuación
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // Fondo blanco translúcido
        ctx.fillRect((canvas.width - 200) / 2, 20, 200, 50); // Rectángulo centrado en la parte superior
        ctx.fillStyle = '#000'; // Color del texto
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Puntuación: ${score}`, canvas.width / 2, 50); // Mostrar la puntuación
    }

    bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw();
    });

    // Verifica si quedan burbujas
    if (bubbles.length === 0) {
        endGame(); // Llama a la función endGame si no hay burbujas
    } else {
        requestAnimationFrame(animate);
    }
}

// Eliminar burbuja al hacer clic
canvas.addEventListener('click', (e) => {
    if (!gameStarted) return; // No hacer nada si el juego no ha comenzado
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Filtrar las burbujas que no han sido clickeadas
    const clickedBubbles = bubbles.filter(bubble => bubble.isClicked(x, y));
    if (clickedBubbles.length > 0) {
        score += clickedBubbles.length; // Incrementar la puntuación por el número de burbujas clickeadas
    }
    bubbles = bubbles.filter(bubble => !bubble.isClicked(x, y));
});

// Función para finalizar el juego
function endGame() {
    gameStarted = false; // Cambiar el estado del juego
    clearInterval(timer); // Detener el temporizador
    timerDisplay.style.display = 'none'; // Ocultar el cuadro de temporizador
    document.getElementById('finalScore').innerText = score; // Mostrar la puntuación final
    document.getElementById('scoreBox').style.display = 'block'; // Mostrar el cuadro de puntuación
}

// Función para reiniciar el juego
function restartGame() {
    score = 0; // Reiniciar la puntuación
    bubbles = []; // Limpiar burbujas
    clearInterval(timer); // Limpiar el temporizador anterior

    if (timerDisplay) {
        timerDisplay.remove(); // Remover el cuadro del temporizador
    }

    createBubbles(30); // Crear nuevas burbujas
    document.getElementById('scoreBox').style.display = 'none'; // Ocultar el cuadro de puntuación
    animate(); // Iniciar la animación
    gameStarted = true; // Cambiar el estado del juego
    startTimer(15); // Iniciar el temporizador de 15 segundos
}

// Función para iniciar el temporizador
function startTimer(seconds) {
    let remainingTime = seconds;
    timerDisplay = document.createElement('div');
    timerDisplay.style.position = 'absolute';
    timerDisplay.style.top = '10px';
    timerDisplay.style.left = '10px';
    timerDisplay.style.color = 'white';
    timerDisplay.style.fontSize = '24px';
    document.body.appendChild(timerDisplay);

    timer = setInterval(() => {
        if (remainingTime <= 0) {
            clearInterval(timer);
            endGame(); // Finalizar el juego cuando el tiempo se acabe
        } else {
            timerDisplay.innerText = `Tiempo: ${remainingTime} s`;
            remainingTime--;
        }
    }, 1000);
}

// Configurar el tamaño del canvas y crear las burbujas
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Función para iniciar el juego
function startGame() {
    document.getElementById('instructionBox').style.display = 'none'; // Ocultar el cuadro de instrucciones
    gameStarted = true; // Cambiar el estado del juego
    createBubbles(30); // Número de burbujas
    animate(); // Iniciar la animación
    startTimer(15); // Iniciar el temporizador de 15 segundos
}

// Agregar evento al botón de inicio y reinicio
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
