# Development Roadmap for The Neurodivergent Tree

This document outlines the planned features and development milestones for the game.

---

### Hito 1: Implementar la Mecánica de 'Burnout' Profundo (Enfoque Actual)

**Objetivo:** Convertir el "Burnout" en una mecánica central, dinámica y transparente. Debe guiar al jugador a través de una lucha significativa pero finalmente insostenible, estableciendo la "Anxiety Crisis" como el siguiente paso lógico en el ciclo del juego.

-   **[Capa] Crear la Capa 'Burnout' (B):**
    -   **Tipo:** Capa informativa, no manual (sin botón de reseteo).
    -   **Visibilidad:** La capa permanecerá oculta hasta que el jugador entre en Burnout por primera vez.
    -   **Función:** Mostrará de forma clara los niveles de profundidad del Burnout y sus penalizaciones asociadas.

-   **[Hitos] Implementar Hitos de Profundidad del Burnout:**
    -   **Nivel 1: Agotamiento (a 0 Spoons):**
        -   Penalización: Reducción de ganancia de SIP en 50% y coste de "Rest" duplicado.
    -   **Nivel 2: Fatiga Crónica (a -10 Spoons):**
        -   Penalización: La reducción de SIP aumenta al 75%. La regeneración de la mejora "Mindful Breathing" se reduce en un 50%.
    -   **Nivel 3: Colapso (a -50 Spoons):**
        -   Penalización: El coste en RP de la habilidad "Sleep" aumenta. La regeneración de Spoons se detiene por completo.

-   **[UI/UX] Añadir Feedback Visual y Explicativo:**
    -   **Ventana Emergente:** Al entrar en Burnout por primera vez, aparecerá un popup que explicará la mecánica y pausará el juego hasta que se cierre.
    -   **Estilo de Capa:** La pestaña de la capa "Burnout" se volverá visible y adoptará un estilo distintivo (color rojo, brillo o pulso) mientras el estado de Burnout esté activo.

---

### Hito 2: Rediseñar la Progresión de la Capa 'Rest'

**Objetivo:** Transformar la capa "Rest" en el núcleo estratégico del juego, con un sistema de mejoras dinámico que reaccione a las decisiones y al progreso del jugador.

-   **[Sistema] Implementar Parrilla de Mejoras Dinámica:**
    -   **Elección Inicial:** La capa comenzará con dos mejoras de Nivel 1 disponibles, con un coste inicial bajo (ej: 1 RP y 2 RP).
    -   **Mejoras Iniciales (Nivel 1):**
        -   **Columna Regeneración - "Recuperación Constante":** Cada 150 Interacciones Sociales ganadas, regenera 1 Spoon. *Feedback: Muestra un texto "+1 Spoon" al activarse.*
        -   **Columna Capacidad - "Mayor Resiliencia":** Añade +1 a la capacidad máxima de Spoons y otorga 1 Spoon instantáneamente al comprarla.
    -   **Coste Dinámico:** Al comprar una de las mejoras de Nivel 1, el coste en RP de la mejora restante en esa misma fila se duplicará.
    -   **Desbloqueo por Niveles (Filas):** Una vez que el jugador compre las dos mejoras de una fila, se desbloqueará la siguiente fila de mejoras debajo de las anteriores.

-   **[Sinergia] Desbloqueo de Mejoras por Capas (Columnas):**
    -   **Desbloqueo de la Capa 'Sleep':**
        -   **Condición:** La capa "Sleep" (S) se desbloqueará después de que el jugador haya realizado la acción "Rest" 5 veces.
        -   **Efecto:** Al desbloquear la capa "Sleep", aparecerá una **tercera columna** de mejoras en la parrilla de la capa "Rest".
    -   **Desbloqueo por 'Burnout':**
        -   **Efecto:** Cuando la capa "Burnout" (B) aparezca, se desbloqueará una **cuarta columna** en la parrilla de "Rest".

---

### Hito 3: Expandir la Capa 'Sleep'

**Objetivo:** Hacer que la capa "Sleep" sea más que una simple habilidad de un solo uso, convirtiéndola en un sistema con su propia progresión.

-   **[Moneda] Implementar "Sleep Credits":**
    -   **Idea:** Hacer que la acción "Get some Sleep" genere 1 "Sleep Credit".
    -   **Impacto:** Estos créditos se usarán para comprar mejoras permanentes dentro de la propia capa "Sleep".

-   **[Mejoras de 'Sleep'] Añadir Mejoras Permanentes:**
    -   **Idea 1:** Una mejora que aumente la cantidad de "Spoons" recuperadas al dormir.
    -   **Idea 2:** Una mejora que aumente la duración o la potencia del "Sleep Bonus".
    -   **Idea 3:** Una mejora que reduzca el coste en RP de la acción "Get some Sleep".

---

### Hito 4: Introducir capa "Anxiety Crisis"

**Objetivo:** Un primer layer de reseteo. El jugador ya no puede más con el burnout. Entra en Crisis.

-   **[Capa] Diseño de la Capa "Anxiety Crisis":**
    -   **Idea:** Todo parte de Cero. Pero hay un aprendizaje.
    -   **Moneda:** Malas Experiencias.
    -   **Pendientes:** Definir cuales serán las mejoras.

---

### Hito 5: Introducir la Tercera Capa - "Special Interest"

**Objetivo:** Introducir una nueva mecánica de juego que represente el efecto energizante de un interés especial.

-   **[Capa] Diseño de la Capa "Special Interest":**
    -   **Idea:** Podría ser una capa activa que el jugador puede iniciar para generar un nuevo recurso o recuperar "Spoons" de forma más efectiva.

---

### Hito 6: Balance y Pulido (Continuo)

**Objetivo:** Revisar y ajustar constantemente los números del juego para asegurar que la dificultad es desafiante pero justa.

-   **[Tarea]** Revisar los costes de las mejoras.
-   **[Tarea]** Ajustar las tasas de regeneración y consumo.
-   **[Tarea]** Añadir más feedback visual y textual para que las mecánicas sean claras.

---

### Upgrades Ideas to Consider

Esta sección contiene ideas de mecánicas para mejoras que podrían implementarse en el futuro para añadir más profundidad al juego.

-   **[Mecánica] Descanso Activo (Pausar SIP para Regenerar):**
    -   **Idea:** Una mejora importante (de coste alto) que permita al jugador pausar voluntariamente su ganancia de SIP. Durante esta pausa, la regeneración de Spoons es muy alta.
    -   **Impacto:** Crea una decisión estratégica de "progresar vs. recuperar", encajando perfectamente con la temática del juego. *(Nota: Idea favorita para implementar en el mid-game).*

-   **[Mejora] Botón de Habilidad Activa (con Cooldown):**
    -   **Idea:** Una mejora que añada un botón a la interfaz (ej: "Recuperar Aliento"). Al usarlo, se recupera 1 Spoon instantáneamente, pero tiene un largo tiempo de enfriamiento.
    -   **Impacto:** Otorga al jugador una herramienta de emergencia y le da más control y agencia.

-   **[UI] Feedback Visual para Regeneración Pasiva:**
    -   **Idea:** En lugar de mostrar la regeneración como un pequeño decimal (ej: +0.004/s), mostrar el tiempo restante hasta obtener el siguiente punto (ej: "Próximo Spoon en: 250s").
    -   **Impacto:** Hace que las pequeñas mejoras pasivas se sientan mucho más tangibles y satisfactorias.

-   **[Mejora] Mejoras de Eficiencia:**
    -   **Idea:** Una mejora que provoque que, de vez en cuando, una ganancia de SIP sea "gratis" y no cuente para el consumo de Spoons.
    -   **Impacto:** Se siente como un bonus de suerte y recompensa la actividad constante.