// ===== TRIVIA GAME =====
// Juego de preguntas de cultura general para bachillerato

class TriviaGame {
    constructor() {
        // Banco de preguntas (20+ preguntas)
        this.questionBank = [
            {
                question: "¿Cuál es la capital de Francia?",
                options: ["Londres", "París", "Madrid", "Roma"],
                correct: 1
            },
            {
                question: "¿Quién escribió 'Cien años de soledad'?",
                options: ["Mario Vargas Llosa", "Gabriel García Márquez", "Jorge Luis Borges", "Pablo Neruda"],
                correct: 1
            },
            {
                question: "¿En qué año se descubrió América?",
                options: ["1490", "1491", "1492", "1493"],
                correct: 2
            },
            {
                question: "¿Cuál es el elemento químico con símbolo 'O'?",
                options: ["Oro", "Oxígeno", "Osmio", "Óxido"],
                correct: 1
            },
            {
                question: "¿Quién pintó 'La Gioconda'?",
                options: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"],
                correct: 2
            },
            {
                question: "¿Cuál es el país más grande del mundo?",
                options: ["China", "Canadá", "Estados Unidos", "Rusia"],
                correct: 3
            },
            {
                question: "¿En qué continente se encuentra Egipto?",
                options: ["Asia", "África", "Europa", "América"],
                correct: 1
            },
            {
                question: "¿Cuál es la fórmula química del agua?",
                options: ["CO2", "H2O", "NaCl", "CH4"],
                correct: 1
            },
            {
                question: "¿Quién fue el primer hombre en llegar a la Luna?",
                options: ["Yuri Gagarin", "John Glenn", "Neil Armstrong", "Buzz Aldrin"],
                correct: 2
            },
            {
                question: "¿Cuántos continentes hay en el mundo?",
                options: ["5", "6", "7", "8"],
                correct: 2
            },
            {
                question: "¿Cuál es la montaña más alta del mundo?",
                options: ["K2", "Monte Everest", "Aconcagua", "Kilimanjaro"],
                correct: 1
            },
            {
                question: "¿En qué año terminó la Segunda Guerra Mundial?",
                options: ["1944", "1945", "1946", "1947"],
                correct: 1
            },
            {
                question: "¿Cuál es el océano más grande?",
                options: ["Atlántico", "Índico", "Ártico", "Pacífico"],
                correct: 3
            },
            {
                question: "¿Quién desarrolló la teoría de la relatividad?",
                options: ["Isaac Newton", "Albert Einstein", "Galileo Galilei", "Stephen Hawking"],
                correct: 1
            },
            {
                question: "¿Cuál es el planeta más cercano al Sol?",
                options: ["Venus", "Mercurio", "Tierra", "Marte"],
                correct: 1
            },
            {
                question: "¿En qué país se encuentra Machu Picchu?",
                options: ["Colombia", "Ecuador", "Perú", "Bolivia"],
                correct: 2
            },
            {
                question: "¿Cuántos huesos tiene el cuerpo humano adulto aproximadamente?",
                options: ["156", "186", "206", "256"],
                correct: 2
            },
            {
                question: "¿Quién escribió 'Romeo y Julieta'?",
                options: ["Charles Dickens", "William Shakespeare", "Oscar Wilde", "Jane Austen"],
                correct: 1
            },
            {
                question: "¿Cuál es el río más largo del mundo?",
                options: ["Amazonas", "Nilo", "Yangtsé", "Mississippi"],
                correct: 0
            },
            {
                question: "¿En qué año se fundó la ONU?",
                options: ["1943", "1944", "1945", "1946"],
                correct: 2
            },
            {
                question: "¿Cuál es el gas más abundante en la atmósfera terrestre?",
                options: ["Oxígeno", "Nitrógeno", "Dióxido de carbono", "Argón"],
                correct: 1
            },
            {
                question: "¿Quién fue el primer presidente de Estados Unidos?",
                options: ["Thomas Jefferson", "John Adams", "Benjamin Franklin", "George Washington"],
                correct: 3
            },
            {
                question: "¿En qué ciudad se encuentra la Torre Eiffel?",
                options: ["Londres", "París", "Roma", "Madrid"],
                correct: 1
            },
            {
                question: "¿Cuál es el metal más abundante en la corteza terrestre?",
                options: ["Hierro", "Aluminio", "Cobre", "Oro"],
                correct: 1
            }
        ];

        // Elementos del DOM
        this.elements = {
            startBtn: document.getElementById('trivia-start'),
            restartBtn: document.getElementById('trivia-restart'),
            questionText: document.getElementById('trivia-question-text'),
            optionsContainer: document.getElementById('trivia-options'),
            currentQuestion: document.getElementById('trivia-current'),
            timer: document.getElementById('trivia-time'),
            progressFill: document.getElementById('trivia-progress-fill'),
            correctScore: document.getElementById('trivia-correct'),
            wrongScore: document.getElementById('trivia-wrong'),
            unansweredScore: document.getElementById('trivia-unanswered'),
            modal: document.getElementById('modal-trivia'),
            modalCloseBtn: document.getElementById('cerrar-modal-trivia'),
            finalStats: {
                correct: document.getElementById('final-correct'),
                wrong: document.getElementById('final-wrong'),
                unanswered: document.getElementById('final-unanswered')
            },
            stars: document.getElementById('trivia-stars'),
            performanceMessage: document.getElementById('trivia-performance-message')
        };

        // Estado del juego
        this.gameState = {
            currentQuestions: [],
            currentQuestionIndex: 0,
            timeLeft: 10,
            timer: null,
            gameActive: false,
            stats: {
                correct: 0,
                wrong: 0,
                unanswered: 0
            }
        };

        this.init();
    }

    init() {
        this.elements.startBtn.addEventListener('click', () => this.startGame());
        this.elements.restartBtn.addEventListener('click', () => this.restartGame());
        this.elements.modalCloseBtn.addEventListener('click', () => this.closeModal());
    }

    selectRandomQuestions() {
        // Mezclar array y tomar 10 preguntas aleatorias
        const shuffled = [...this.questionBank].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, 10);
    }

    startGame() {
        this.gameState.currentQuestions = this.selectRandomQuestions();
        this.gameState.currentQuestionIndex = 0;
        this.gameState.stats = { correct: 0, wrong: 0, unanswered: 0 };
        this.gameState.gameActive = true;

        this.elements.startBtn.classList.add('hidden');
        this.elements.restartBtn.classList.remove('hidden');

        this.updateScores();
        this.showQuestion();
    }

    showQuestion() {
        if (this.gameState.currentQuestionIndex >= 10) {
            this.endGame();
            return;
        }

        const currentQ = this.gameState.currentQuestions[this.gameState.currentQuestionIndex];
        
        // Actualizar UI
        this.elements.currentQuestion.textContent = this.gameState.currentQuestionIndex + 1;
        this.elements.questionText.textContent = currentQ.question;
        this.updateProgress();
        
        // Crear opciones
        this.createOptions(currentQ);
        
        // Iniciar timer
        this.startQuestionTimer();
    }

    createOptions(question) {
        this.elements.optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'trivia-option';
            optionBtn.textContent = option;
            optionBtn.addEventListener('click', () => this.selectOption(index));
            this.elements.optionsContainer.appendChild(optionBtn);
        });
    }

    selectOption(selectedIndex) {
        if (!this.gameState.gameActive) return;

        const currentQ = this.gameState.currentQuestions[this.gameState.currentQuestionIndex];
        const options = this.elements.optionsContainer.querySelectorAll('.trivia-option');
        
        // Deshabilitar todas las opciones
        options.forEach(opt => opt.classList.add('disabled'));
        
        // Marcar respuesta correcta e incorrecta
        options[currentQ.correct].classList.add('correct');
        
        if (selectedIndex === currentQ.correct) {
            this.gameState.stats.correct++;
        } else {
            options[selectedIndex].classList.add('incorrect');
            this.gameState.stats.wrong++;
        }

        this.clearTimer();
        this.updateScores();
        
        // Avanzar a la siguiente pregunta después de 2 segundos
        setTimeout(() => this.nextQuestion(), 2000);
    }

    startQuestionTimer() {
        this.gameState.timeLeft = 10;
        this.elements.timer.textContent = this.gameState.timeLeft;
        this.elements.timer.classList.remove('urgent');

        this.gameState.timer = setInterval(() => {
            this.gameState.timeLeft--;
            this.elements.timer.textContent = this.gameState.timeLeft;

            if (this.gameState.timeLeft <= 3) {
                this.elements.timer.classList.add('urgent');
            }

            if (this.gameState.timeLeft <= 0) {
                this.timeUp();
            }
        }, 1000);
    }

    timeUp() {
        if (!this.gameState.gameActive) return;

        const currentQ = this.gameState.currentQuestions[this.gameState.currentQuestionIndex];
        const options = this.elements.optionsContainer.querySelectorAll('.trivia-option');
        
        // Mostrar respuesta correcta
        options[currentQ.correct].classList.add('correct');
        options.forEach(opt => opt.classList.add('disabled'));
        
        this.gameState.stats.unanswered++;
        this.clearTimer();
        this.updateScores();
        
        setTimeout(() => this.nextQuestion(), 2000);
    }

    nextQuestion() {
        this.gameState.currentQuestionIndex++;
        this.showQuestion();
    }

    clearTimer() {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
            this.gameState.timer = null;
        }
        this.elements.timer.classList.remove('urgent');
    }

    updateProgress() {
        const progress = (this.gameState.currentQuestionIndex / 10) * 100;
        this.elements.progressFill.style.width = progress + '%';
    }

    updateScores() {
        this.elements.correctScore.textContent = this.gameState.stats.correct;
        this.elements.wrongScore.textContent = this.gameState.stats.wrong;
        this.elements.unansweredScore.textContent = this.gameState.stats.unanswered;
    }

    endGame() {
        this.gameState.gameActive = false;
        this.clearTimer();
        this.updateProgress();
        
        // Mostrar modal con resultados
        this.showResults();
    }

    showResults() {
        const { correct, wrong, unanswered } = this.gameState.stats;
        
        // Actualizar estadísticas finales
        this.elements.finalStats.correct.textContent = correct;
        this.elements.finalStats.wrong.textContent = wrong;
        this.elements.finalStats.unanswered.textContent = unanswered;
        
        // Calcular y mostrar estrellas
        this.showStars(correct);
        
        // Mensaje de rendimiento
        this.elements.performanceMessage.textContent = this.getPerformanceMessage(correct);
        
        // Mostrar modal
        this.elements.modal.classList.remove('hidden');
    }

    showStars(correct) {
        this.elements.stars.innerHTML = '';
        
        // Sistema simple: cantidad de estrellas basada en porcentaje
        const percentage = (correct / 10) * 100; // Porcentaje de aciertos
        let starsToShow = 0;
        
        // Determinar cuántas estrellas mostrar (0-5)
        if (percentage >= 90) starsToShow = 5;      // 9-10 correctas = 5 estrellas
        else if (percentage >= 70) starsToShow = 4; // 7-8 correctas = 4 estrellas  
        else if (percentage >= 50) starsToShow = 3; // 5-6 correctas = 3 estrellas
        else if (percentage >= 30) starsToShow = 2; // 3-4 correctas = 2 estrellas
        else if (percentage >= 10) starsToShow = 1; // 1-2 correctas = 1 estrella
        else starsToShow = 0; // 0 correctas = 0 estrellas
        
        // Crear solo las estrellas que corresponden al puntaje
        for (let i = 0; i < starsToShow; i++) {
            const star = document.createElement('span');
            star.className = 'star filled';
            star.textContent = '⭐';
            
            // Animación escalonada
            setTimeout(() => {
                star.style.opacity = '1';
                star.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    star.style.transform = 'scale(1)';
                }, 200);
            }, i * 300);
            
            this.elements.stars.appendChild(star);
        }
    }

    getPerformanceMessage(correct) {
        const percentage = (correct / 10) * 100;
        
        if (percentage >= 90) return `¡Excelente! ${percentage}% - Conocimiento excepcional.`;
        if (percentage >= 80) return `¡Muy bien! ${percentage}% - Buen nivel de cultura general.`;
        if (percentage >= 70) return `¡Bien! ${percentage}% - Conocimiento satisfactorio.`;
        if (percentage >= 60) return `Regular. ${percentage}% - Puedes mejorar.`;
        if (percentage >= 50) return `${percentage}% - Necesitas estudiar más.`;
        if (percentage >= 30) return `${percentage}% - Requiere mucho más estudio.`;
        return `${percentage}% - ¡No te rindas, sigue intentando!`;
    }

    closeModal() {
        this.elements.modal.classList.add('hidden');
        // Al cerrar modal, resetear el juego completamente
        this.restartGame();
    }

    restartGame() {
        this.clearTimer();
        this.gameState.gameActive = false;
        this.gameState.currentQuestionIndex = 0;
        
        this.elements.startBtn.classList.remove('hidden');
        this.elements.restartBtn.classList.add('hidden');
        this.elements.questionText.textContent = "Presiona INICIAR para comenzar";
        this.elements.optionsContainer.innerHTML = '';
        this.elements.currentQuestion.textContent = "0";
        this.elements.timer.textContent = "10";
        this.elements.progressFill.style.width = "0%";
        
        this.gameState.stats = { correct: 0, wrong: 0, unanswered: 0 };
        this.updateScores();
        
        // Cerrar modal si está abierto
        this.closeModal();
    }
    
    // Función pública para reiniciar desde navegación
    forceRestart() {
        this.restartGame();
    }
}

// Actualizar el sistema de navegación para permitir el acceso al juego 3
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar trivia
    window.triviaGame = new TriviaGame();
    
    // Actualizar navegación para permitir juego 3
    if (window.gamesNavigation) {
        // Sobrescribir el método switchToGame para permitir acceso al juego 3
        const originalSwitchToGame = window.gamesNavigation.switchToGame;
        window.gamesNavigation.switchToGame = function(gameIndex) {
            // Validar índice
            if (gameIndex < 0 || gameIndex >= 3) return;
            
            // Si ya está activo, no hacer nada
            if (gameIndex === this.currentGame) return;
            
            // Actualizar estado
            this.currentGame = gameIndex;
            
            // Actualizar UI
            this.updateCarousel();
            this.updateNavButtons();
            
            // Opcional: detener juegos activos al cambiar
            this.stopActiveGames();
        };
    }
});