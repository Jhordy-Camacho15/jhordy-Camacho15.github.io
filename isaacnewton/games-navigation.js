// ===== GAMES NAVIGATION SYSTEM =====
// Sistema de navegación entre juegos con carrusel horizontal

class GamesNavigation {
    constructor() {
        this.currentGame = 0;
        this.gamesContainer = document.getElementById('games-container');
        this.navButtons = document.querySelectorAll('.game-nav-btn');
        
        this.init();
    }
    
    init() {
        // Inicializar estado
        this.updateCarousel();
        
        // Agregar event listeners a los botones de navegación
        this.navButtons.forEach((btn, index) => {
            btn.addEventListener('click', () => {
                this.switchToGame(index);
            });
        });
        
        // Inicializar primer juego como activo
        setTimeout(() => {
            // Marcar el primer juego como activo inmediatamente
            const firstSlide = this.gamesContainer.querySelector('.game-slide');
            if (firstSlide) {
                firstSlide.classList.add('active');
            }
            // Aplicar estado de transición completa desde el inicio
            this.gamesContainer.classList.add('transition-complete');
        }, 100);
    }
    
    switchToGame(gameIndex) {
        // Validar índice
        if (gameIndex < 0 || gameIndex >= 3) return;
        
        // Si es el juego 3 (índice 2), mostrar mensaje de "próximamente"
        if (gameIndex === 2) {
            alert('¡Próximamente! Este juego estará disponible pronto.');
            return;
        }
        
        // Si ya está activo, no hacer nada
        if (gameIndex === this.currentGame) return;
        
        // Actualizar estado
        this.currentGame = gameIndex;
        
        // Actualizar UI
        this.updateCarousel();
        this.updateNavButtons();
        
        // Opcional: detener juegos activos al cambiar
        this.stopActiveGames();
    }
    
    updateCarousel() {
        if (this.gamesContainer) {
            // Remover clase de transición completa para permitir la animación
            this.gamesContainer.classList.remove('transition-complete');
            
            // Actualizar el atributo data-active para la transición CSS
            this.gamesContainer.setAttribute('data-active', this.currentGame.toString());
            
            // Actualizar clases activas
            const gameSlides = this.gamesContainer.querySelectorAll('.game-slide');
            gameSlides.forEach((slide, index) => {
                if (index === this.currentGame) {
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Después de que termine la transición, ocultar completamente los juegos no activos
            setTimeout(() => {
                if (this.gamesContainer) {
                    this.gamesContainer.classList.add('transition-complete');
                }
            }, 400); // Duración de la transición CSS
        }
    }
    
    updateNavButtons() {
        this.navButtons.forEach((btn, index) => {
            if (index === this.currentGame) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    stopActiveGames() {
        // Parar y resetear todos los juegos activos
        console.log('Deteniendo todos los juegos activos...');
        
        // 1. Juego de Pares (script.js)
        if (typeof stopTimer === 'function') {
            stopTimer();
        }
        if (typeof reiniciarJuegoPares === 'function') {
            reiniciarJuegoPares();
        }
        
        // 2. Juego de Geografía (geo.js)
        if (typeof stopGeoTimer === 'function') {
            stopGeoTimer();
        }
        if (typeof resetToInitialState === 'function') {
            resetToInitialState();
        }
        
        // 3. Juego de Trivia
        if (window.triviaGame && typeof window.triviaGame.forceRestart === 'function') {
            window.triviaGame.forceRestart();
        }
        
        // Cerrar todos los modales que puedan estar abiertos
        this.closeAllModals();
    }
    
    closeAllModals() {
        const modals = ['modal-pares', 'modal-geo', 'modal-trivia'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    }
    
    // Método público para cambiar juego desde fuera
    goToGame(gameIndex) {
        this.switchToGame(gameIndex);
    }
    
    // Método para obtener el juego actual
    getCurrentGame() {
        return this.currentGame;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global para poder acceder desde otros scripts
    window.gamesNavigation = new GamesNavigation();
});

// Exportar para uso modular si es necesario
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GamesNavigation;
}