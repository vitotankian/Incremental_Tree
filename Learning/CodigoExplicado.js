/**
 * @file layers.js
 * @description Este archivo define todas las capas del juego, sus mecánicas, mejoras e interfaz.
 * Cada capa es un "objeto" de JavaScript, creado con la función addLayer, que agrupa datos y funcionalidades.
 */

// =====================================================================================================================
// CAPA: Rest (r) - Descanso
// =====================================================================================================================
// Esta es la primera capa de prestigio. Los jugadores reinician su progreso principal (Interacciones Sociales)
// para ganar una nueva moneda (Puntos de Descanso) que se usa para comprar mejoras permanentes.
//
// CONCEPTO JS: addLayer() es una función global proporcionada por el motor "The Modding Tree".
// No está definida en este archivo, sino en el código principal del motor. Sirve para registrar una nueva capa en el juego.
// Referencia TMT: El concepto general de capas se explica en "basic-layer-breakdown.md".
addLayer("r", {
    // --- Propiedades Básicas de la Capa ---
    // CONCEPTO JS: Lo que sigue es un "Objeto Literal". Es una colección de pares clave-valor.
    // 'name' es la clave (una cadena de texto), y "rest" es el valor (otra cadena de texto).
    // Para más detalles sobre objetos: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Objects
    name: "rest", // Nombre interno de la capa. Usado en el código para referenciarla, ej: player.r.points.
    symbol: "R", // El símbolo que aparece en el nodo del árbol de capas.
    position: 0, // La posición del nodo en su fila. No se usa en este mod, pero es útil para ordenar.

    // --- Inicialización de Datos ---
    // CONCEPTO JS: 'startData' es una función que define las variables que se guardarán para esta capa.
    // Una función es un bloque de código reutilizable. Se define con la palabra clave `function` o, como aquí, como una propiedad de un objeto.
    // Para más detalles sobre funciones: https://developer.mozilla.org/es/docs/Web/JavaScript/Guide/Functions
    // Referencia TMT: Esta función es obligatoria para cada capa. Ver "layer-features.md".
    startData() { 
        // CONCEPTO JS: 'return' es una instrucción que especifica el valor que una función debe "devolver" o "entregar" cuando es llamada.
        return {
            unlocked: true, // CONCEPTO JS: Esto es un valor Booleano (verdadero/falso). Indica que la capa está desbloqueada desde el inicio.
			points: new Decimal(0), // CONCEPTO JS: 'new Decimal(0)' crea una nueva instancia del objeto 'Decimal'.
                                    // El motor TMT usa una librería externa ("break_eternity.js") para manejar números muy grandes.
                                    // 'new' es el operador para crear un objeto a partir de un "constructor".
                                    // Referencia TMT: El uso de 'Decimal' se explica en "!general-info.md".
        }
    },

    // --- Visuales ---
    color: "#66b3ff", // CONCEPTO JS: Esto es un valor de tipo "string" (cadena de texto) que representa un color en formato hexadecimal.

    // --- Mecánicas de Prestigio ---
    // Referencia TMT: Esta función es parte de la fórmula de prestigio de tipo "normal". Ver "layer-features.md".
    requires() { 
        // CONCEPTO JS: 'if...else' es una estructura de control condicional.
        // Ejecuta un bloque de código si una condición es verdadera ('if'), y otro si es falsa ('else').
        // 'player.inBurnout' accede a una variable booleana definida en otro lugar del código (probablemente en mod.js o en el bucle principal).
        if (player.inBurnout) 
            return new Decimal(20); // Si está en Burnout, el coste se duplica.
        else 
            return new Decimal(10); // El coste normal es 10 Interacciones Sociales.
    },
    resource: "Rest Points", // El nombre que se muestra para la moneda de esta capa.
    baseResource: "Social Interactions", // La moneda que se consume al hacer prestigio.
    // CONCEPTO JS: 'baseAmount' es otra función. 'player.points' accede a la variable 'points' del objeto global 'player'.
    // El objeto 'player' almacena todos los datos guardados del jugador.
    baseAmount() { return player.points },
    type: "normal", // Referencia TMT: Un tipo de prestigio "normal" reinicia la capa anterior. Ver "layer-features.md".
    exponent: 0.75, // Referencia TMT: La fórmula de ganancia de prestigio usa este exponente: baseAmount^exponent.
    
    // CONCEPTO JS: 'gainMult' y 'gainExp' son funciones que devuelven un multiplicador y un exponente para la ganancia de prestigio.
    // Actualmente no tienen ningún bonus, por lo que solo devuelven un valor base.
    gainMult() { 
        let mult = new Decimal(1) // CONCEPTO JS: 'let' declara una variable local, 'mult'. Su alcance se limita a esta función.
        return mult
    },
    gainExp() { 
        return new Decimal(1)
    },

    // --- Árbol e Interfaz de Usuario ---
    row: 0, // Esta capa aparece en la primera fila (fila 0) del árbol.
    // CONCEPTO JS: 'hotkeys' es un "Array" (una lista ordenada) de objetos. Cada objeto define un atajo de teclado.
    // Para más detalles sobre arrays: https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array
    hotkeys: [
        {key: "r", description: "R: Reset for rest points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true}, // Esta capa siempre es visible.

    // CONCEPTO JS: Esta función cambia dinámicamente el estilo CSS de la pestaña de la capa.
    // CSS (Cascading Style Sheets) es el lenguaje usado para dar estilo a las páginas web.
    // Para más detalles sobre cómo JS interactúa con CSS: https://www.w3schools.com/js/js_htmldom_css.asp
    style() {
        // 'player.sleepBonus.gt(0)' comprueba si el valor de 'sleepBonus' es mayor que (> gt) cero.
        // Es un método del objeto 'Decimal'. Ver explicación de 'new Decimal()' en la línea 32.
        if (player.sleepBonus.gt(0)) return {
            'background-color': '#d3c5ff' // Devuelve un objeto de estilo si la condición es verdadera.
        }
    },

    // --- Bucle Principal del Juego ---
    // Referencia TMT: La función 'update(diff)' se llama en cada "tick" del juego. Ver "layer-features.md".
    update(diff) {
        // CONCEPTO JS: 'diff' es un "parámetro" de la función. Es una variable que recibe su valor desde donde la función es llamada.
        // En este caso, el motor del juego le pasa el tiempo en segundos desde el último tick.

        // Gestión del temporizador del "Sleep Bonus".
        if (player.sleepBonus.gt(0)) { // La descripción de 'gt()' está en la línea 106.
            // CONCEPTO JS: '.sub()' es otro método del objeto 'Decimal', que significa "subtract" (restar).
            player.sleepBonus = player.sleepBonus.sub(diff); // 'player.sleepBonus' se reduce por el valor de 'diff'.
            // '.lt()' significa "less than" (menor que).
            if (player.sleepBonus.lt(0)) player.sleepBonus = new Decimal(0); // Evita que el temporizador sea negativo.
        }

        // Mecánica principal de consumo de Spoons.
        // CONCEPTO JS: Aquí se encadenan varios métodos del objeto 'Decimal'.
        // 'tmp.pointGen' es una variable temporal calculada por el motor que contiene la ganancia de SIP/seg.
        // '.times(diff)' multiplica la ganancia por el tiempo, '.div(100)' la divide para obtener la proporción de Spoons.
        let spoonsToSpend = tmp.pointGen.times(diff).div(50); // Ratio ajustado a 50:1.
        player.spoons = player.spoons.sub(spoonsToSpend);

        // Activación del estado de Burnout.
        // CONCEPTO JS: El operador '&&' significa "Y" (AND). La condición es verdadera solo si ambas partes son verdaderas.
        // El operador '!' significa "NO" (NOT). '!player.inBurnout' es verdadero si 'inBurnout' es falso.
        if (player.spoons.lte(0) && !player.inBurnout) { // '.lte()' significa "less than or equal to" (menor o igual que).
            player.inBurnout = true;
            player.burnoutUnlocked = true; // Desbloquea permanentemente la pestaña de Burnout.
        }

        // Lógica para la mejora "Recuperación Constante".
        // CONCEPTO TMT: 'getGridData('r', 101)' es una función del motor que comprueba el estado de una celda en una 'grid'.
        // 'r' es el id de la capa, '101' es el id de la celda. Devuelve 'true' si está comprada.
        // Referencia TMT: Ver la documentación "grids.md".
        if (getGridData('r', 101)) {
            player.sipSinceRegen = player.sipSinceRegen.add(tmp.pointGen.times(diff));
            if (player.sipSinceRegen.gte(150)) {
                player.sipSinceRegen = player.sipSinceRegen.sub(150);
                player.spoons = player.spoons.add(1);
                // CONCEPTO TMT: 'doPopup()' es una función del motor para mostrar notificaciones.
                doPopup("achievement", "+1 Spoon", "Spoon Regenerated!", 2);
            }
        }

        // Asegura que los spoons no excedan el máximo.
        // CONCEPTO JS: 'getMaxSpoons()' es una función definida en otro archivo (probablemente mod.js o utils.js).
        // Sirve para calcular la capacidad máxima de spoons, que puede cambiar con las mejoras.
        if (player.spoons.gt(getMaxSpoons())) {
            player.spoons = getMaxSpoons();
        }
    },

    // --- Diseño de la Pestaña ---
    // Referencia TMT: 'tabFormat' define la estructura de la interfaz de la capa. Ver "custom-tab-layouts.md".
    tabFormat: {
        "Upgrades": {
            content: [
                "main-display", // Componente del motor que muestra la moneda principal.
                "prestige-button", // Componente del motor para el botón de prestigio.
                "blank", // Un espacio en blanco.
                "grid", // Componente del motor que renderiza la 'grid' definida abajo.
            ]
        }
    },

    // --- Rejilla de Mejoras ---
    // Referencia TMT: 'grid' es un objeto especial del motor para crear rejillas de botones/mejoras. Ver "grids.md".
    grid: {
        rows: 1,
        cols: 2,

        // CONCEPTO TMT: Esta función establece el dato inicial para cada celda de la rejilla.
        // 'id' es el identificador de la celda (ej: 101, 102).
        getStartData(id) {
            return false; // 'false' significa que la mejora no ha sido comprada.
        },
        getUnlocked(id) {
            return true; // Todas las celdas son visibles por defecto.
        },
        // CONCEPTO JS: 'switch' es otra estructura de control, similar a una serie de 'if...else if...else'.
        // Es muy útil cuando tienes múltiples casos para una sola variable.
        // Para más detalles sobre 'switch': https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Statements/switch
        getTitle(data, id) {
            switch (id) {
                case 101: return "Recuperación Constante";
                case 102: return "Mayor Resiliencia";
            }
        },
        getDisplay(data, id) {
            let cost = this.getCost(id); // CONCEPTO JS: 'this' es una palabra clave especial. En este contexto, se refiere al objeto 'grid'.
                                         // 'this.getCost(id)' llama a la función 'getCost' que está dentro de este mismo objeto 'grid'.
                                         // Para más detalles sobre 'this': https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Operators/this
            let description = "";
            switch (id) {
                case 101: 
                    description = "Cada 150 Interacciones Sociales ganadas, regenera 1 Spoon.";
                    break;
                case 102: 
                    description = "Añade +1 a la capacidad máxima de Spoons y otorga 1 Spoon instantáneamente.";
                    break;
            }
            // CONCEPTO JS: El operador '+' se usa aquí para concatenar (unir) cadenas de texto.
            // '<br>' es una etiqueta HTML para un salto de línea.
            // 'format(cost, 0)' es una función del motor para formatear números grandes de forma legible.
            return description + "<br><br>Cost: " + format(cost, 0) + " Rest Points";
        },
        getCost(id) {
            switch (id) {
                case 101: return new Decimal(1);
                case 102: return new Decimal(2);
            }
        },
        getCanClick(data, id) {
            // Comprueba si el jugador tiene suficientes Puntos de Descanso Y (&&) aún no ha comprado la mejora.
            return player.r.points.gte(this.getCost(id)) && !player.r.grid[id];
        },
        // CONCEPTO TMT: 'onClick' se ejecuta cuando se hace clic en una celda de la rejilla.
        onClick(data, id) {
            player.r.points = player.r.points.sub(this.getCost(id));
            // CONCEPTO TMT: 'setGridData' es una función del motor para cambiar el estado de una celda de la rejilla.
            // Referencia TMT: Ver "grids.md".
            setGridData(this.layer, id, true); // Marca la mejora como comprada.

            // Efectos que ocurren solo una vez, al comprar.
            switch (id) {
                case 102:
                    player.spoons = player.spoons.add(1);
                    if (player.spoons.gt(getMaxSpoons())) { // Ver explicación de 'getMaxSpoons()' en la línea 170.
                        player.spoons = getMaxSpoons();
                    }
                    break;
            }
        },
        getStyle(data, id) {
            if (player.r.grid[id]) return {
                'border-color': '#66ff66'
            }
        },
    },
})

// =====================================================================================================================
// CAPA: Pestaña de Información (info-tab)
// =====================================================================================================================
// Esta es una capa especial del motor que controla el contenido de la pestaña "i".
// La definimos aquí para añadir contenido personalizado, como las herramientas de depuración.
addLayer("info-tab", {
    // La descripción de 'addLayer' está en la línea 12.
    tabFormat: [
        "main-display",
        "prestige-button",
        // CONCEPTO JS: ["raw-html", function() { ... }] es un formato especial del motor.
        // El array indica al motor que el segundo elemento es una función que devuelve código HTML crudo.
        ["raw-html", function() { return modInfo.author ? "<br><h3>Made by " + modInfo.author + "</h3>" : "" }],
        "blank",
        ["raw-html", function() { return "Time Played: " + formatTime(player.timePlayed) }],
        "blank",
        "h-line",
        "blank",
        ["raw-html", "<h2>Debug Tools</h2>"],
        "blank",
        // CONCEPTO TMT: ["row", [ ... ]] crea una fila horizontal para organizar componentes.
        ["row", [["clickable", 11], ["clickable", 12]]],
    ],
    // Referencia TMT: 'clickables' es un objeto para definir botones interactivos. Ver "clickables.md".
    clickables: {
        11: {
            title: "Speed x2",
            canClick: true, // Este botón siempre se puede pulsar.
            onClick() { player.timeSpeed = player.timeSpeed.times(2) }, // Duplica la velocidad del juego.
            style: { "min-height": "40px", width: "120px" },
        },
        12: {
            title: "Speed /2",
            canClick: true,
            onClick() { player.timeSpeed = player.timeSpeed.div(2) }, // Reduce a la mitad la velocidad del juego.
            style: { "min-height": "40px", width: "120px" },
        },
    },
})

// =====================================================================================================================
// CAPA: Sleep (s) - Dormir
// =====================================================================================================================
// Esta es una capa estratégica que no implica un reinicio de prestigio. Proporciona una habilidad activa
// para ayudar al jugador a recuperarse del estado de Burnout.
addLayer("s", {
    // La descripción de 'addLayer' está en la línea 12.
    // La descripción de la mayoría de estas propiedades se encuentra en la capa "r" (líneas 18-35).
    name: "sleep",
    symbol: "S",
    position: 0,
    startData() { return {
        unlocked: true,
		points: new Decimal(0), // Esta capa no tiene moneda, pero 'points' es una propiedad obligatoria.
    }},
    color: "#a37cff",
    row: 1,
    layerShown(){return true},
    type: "none", // Referencia TMT: Un tipo "none" indica que la capa no tiene mecánica de prestigio. Ver "layer-features.md".

    tabFormat: [
        ["display-text", "Use your Rest Points to perform strategic recovery actions."],
        "blank",
        "clickables",
    ],

    // La descripción de 'clickables' está en la línea 279.
    clickables: {
        11: {
            title: "Get some Sleep",
            display() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15);
                return "Costs: " + format(cost, 0) + " Rest Points<br><br>Instantly recover 5 Spoons and boost Rest upgrades by 1.5x for 10 seconds."
            },
            canClick() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15);
                return player.r.points.gte(cost);
            },
            onClick() {
                let cost = new Decimal(10);
                if (player.spoons.lte(-50)) cost = new Decimal(15);

                player.r.points = player.r.points.sub(cost);
                player.spoons = player.spoons.add(5);
                player.sleepBonus = new Decimal(10);

                if (player.spoons.gt(getMaxSpoons())) { // La descripción de 'getMaxSpoons()' está en la línea 170.
                    player.spoons = getMaxSpoons();
                }
                if (player.spoons.gt(0)) {
                    player.inBurnout = false;
                }
            },
            style: { "min-height": "120px", width: "200px" },
        },
    },
})

// =====================================================================================================================
// CAPA: Burnout (b)
// =====================================================================================================================
// Esta es una capa lateral puramente informativa que muestra el estado y las penalizaciones del Burnout.
addLayer("b", {
    // La descripción de 'addLayer' está en la línea 12.
    name: "burnout",
    symbol: "B",
    color() { // El color del nodo es dinámico.
        if (player.inBurnout) return "#ff6666";
        return "#777777";
    },
    row: "side", // Referencia TMT: "side" convierte esta capa en una capa lateral en el árbol. Ver "layer-features.md".
    layerShown() { 
        return player.burnoutUnlocked 
    },
    type: "none", // Ver explicación en la línea 320.

    nodeStyle() { // Estilo dinámico para el nodo en el árbol.
        if(player.inBurnout) return {
            "box-shadow": "0 0 20px #ff6666",
            "border-color": "#ff8888"
        }
    },

    tabFormat: [
        ["display-text", "You are in Burnout. Your energy is draining and your capacity to recover is impaired."],
        "blank",
        "milestones", // Componente del motor que renderiza los 'milestones' de abajo.
    ],

    // Referencia TMT: 'milestones' es un objeto para definir hitos que se desbloquean al cumplir condiciones. Ver "milestones.md".
    milestones: {
        0: {
            requirementDescription: "Level 1: Agotamiento",
            effectDescription: "- Social Interaction gain is reduced by 50%.<br>- The cost of 'Rest' is doubled.",
            // CONCEPTO TMT: 'done()' es la función que el motor comprueba para ver si el hito se ha cumplido.
            done() { return player.spoons.lte(0) },
            style() {
                // Si este nivel está activo...
                if (player.spoons.lte(0) && player.spoons.gt(-10)) return {'background-color': '#993333'} 
                // Si no está activo, pero ya se ha completado...
                // CONCEPTO TMT: 'hasMilestone()' es una función del motor para comprobar si un hito ya se ha conseguido.
                else if (hasMilestone(this.layer, this.id)) return {'background-color': '#575757'} 
            },
        },
        1: {
            requirementDescription: "Level 2: Fatiga Crónica",
            effectDescription: "- Social Interaction gain is reduced by 75%.<br>- 'Mindful Breathing' regeneration is reduced by 50%.",
            done() { return player.spoons.lte(-10) },
            style() {
                if (player.spoons.lte(-10) && player.spoons.gt(-50)) return {'background-color': '#993333'} 
                else if (hasMilestone(this.layer, this.id)) return {'background-color': '#575757'} 
            },
        },
        2: {
            requirementDescription: "Level 3: Colapso",
            effectDescription: "- 'Mindful Breathing' regeneration stops completely.<br>- The cost of 'Sleep' ability increases.",
            done() { return player.spoons.lte(-50) },
            style() {
                if (player.spoons.lte(-50)) return {'background-color': '#993333'} 
                else if (hasMilestone(this.layer, this.id)) return {'background-color': '#575757'} 
            },
        },
    },
})
