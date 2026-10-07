// ==========================================================================
// PRÀCTICA: CALENDARI I AGENDA EN JAVASCRIPT VANILLA
// ==========================================================================

// --- ESTAT GLOBAL I ELEMENTS DEL DOM ---

let currentDate = new Date(); // Data actual que es mostra al calendari
let selectedDateKey = null;   // Data seleccionada en format 'YYYY-MM-DD'

// En la Fase 1 i 2 farem servir aquest objecte en memòria.
// En la Fase 3 el connectarem amb LocalStorage!
let events = {};

// Selecció d'elements del DOM (Ja completat)
const monthYearDisplay = document.getElementById('month-year-display');
const daysGrid = document.getElementById('days-grid');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

const selectedDateDisplay = document.getElementById('selected-date-display');
const eventForm = document.getElementById('event-form');
const eventInput = document.getElementById('event-input');
const eventsList = document.getElementById('events-list');

const notifyBtn = document.getElementById('notify-btn');
const shareBtn = document.getElementById('share-btn');

const monthNames = [
  "Gener", "Febrer", "Març", "Abril", "Maig", "Juny",
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre"
];


// ==========================================================================
// FASE 1: RENDERITZAT DEL CALENDARI I NAVEGACIÓ (DATE + DOM)
// ==========================================================================

/**
 * Retorna una data en format YYYY-MM-DD amb zeros a l'esquerra si cal.
 */
function formatDateKey(year, month, day) {
  // TODO: Converteix el mes (+1) i el dia, respectivament, a String i omple amb zeros a l'esquerra amb .padStart(2, '0')
  // TODO: Retorna data en format YYYY-MM-DD
  return `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
}

/**
 * Genera i dibuixa la graella de dies del mes actual.
 */
function renderCalendar() {
  // TODO 1: Neteja el contingut actual de 'daysGrid'
  monthYearDisplay.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
  daysGrid.innerHTML = '';

  // TODO 2: Obtén l'any i el mes de 'currentDate' i actualitza el text de '#monthYearDisplay'
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();

  // TODO 3: Càlcul de caselles buides inicials (padding):
  //  - Obtén el primer dia de la setmana del mes: new Date(year, month, 1).getDay()
  const firstDayIndex = new Date(year, month, 1).getDay();
  //  - Ajusta-ho perquè la setmana comenci en Dilluns (Dilluns = 0, Diumenge = 6)
  const paddingDays = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  //  - Crea les caselles buides (<div class="day empty"></div>) i afegeix-les a 'daysGrid' (appendChild)
  for (let i = 0; i < paddingDays; i++) {
    const emptyElement = document.createElement('div');
    emptyElement.classList.add('day', 'empty');
    daysGrid.appendChild(emptyElement);
  }
  // TODO 4: Càlcul de dies totals del mes:
  //  - Utilitza el truc: new Date(year, month + 1, 0).getDate()
  const totalDays = new Date(year, month + 1, 0).getDate();
  // TODO 5: Bucle per dibuixar cada dia (1..totalDays):
  //  - Crea un div amb la classe .day i el text del número de dia
  //  - Genera la clau 'dateKey' fent servir formatDateKey()
  //  - Afegeix la classe .today si el dia, mes i any coincideixen amb la data actual d'avui (new Date())
  //  - Afegeix la classe .has-events si existeix events[dateKey] amb elements
  //  - Afegeix la classe .selected si dateKey === selectedDateKey
  //  - Assigna l'esdeveniment click per cridar a selectDate(dateKey, dayElement) ALERTA, FUNCIÓ NO IMPLEMENTADA ENCARA
  //  - Afegeix la casella a 'daysGrid' (appendChild)
  for (let i = 1; i <= totalDays; i++) {
    const dayElement = document.createElement('div');
    dayElement.classList.add('day');
    dayElement.textContent = i.toString();
    const dateKey = formatDateKey(year, month, i);
    if (dateKey === formatDateKey(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())) {
      dayElement.classList.add('today');
    }
    if (events[dateKey] && events[dateKey].length > 0) {
      dayElement.classList.add('has-events');
    }
    if (dateKey === selectedDateKey) {
      dayElement.classList.add('selected');
    }
    dayElement.addEventListener('click', () => selectDate(dateKey, dayElement));
    daysGrid.appendChild(dayElement);
  }
}

// TODO: Escoltadors d'esdeveniments per als botons de navegació prevBtn i nextBtn
// (Sumar o restar 1 mes a 'currentDate' i tornar a cridar renderCalendar())
prevBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
});

nextBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
});


// ==========================================================================
// FASE 2: SELECCIÓ DE DIA I GESTIÓ D'ESDEVENIMENTS EN MEMÒRIA
// ==========================================================================

/**
 * Selecciona un dia del calendari i actualitza la interfície.
 */
function selectDate(dateKey, element) {
  // TODO 1: Elimina la classe .selected de tots els dies (.day)
  document.querySelectorAll('.day').forEach((day) => {
    day.classList.remove('selected');
  });
  // TODO 2: Afegeix la classe .selected al dia clicat i actualitza 'selectedDateKey'
  element.classList.add('selected');
  selectedDateKey = dateKey;
  // TODO 3: Actualitza el títol 'selectedDateDisplay' i crida a renderEvents()
  selectedDateDisplay.textContent = `Esdeveniments per al ${dateKey}`;
  renderEvents();
}

/**
 * Renderitza la llista d'esdeveniments del dia seleccionat.
 */
function renderEvents() {
  // TODO 1: Neteja 'eventsList'
  eventsList.innerHTML = '';
  // TODO 2: Si no hi ha 'selectedDateKey', surt de la funció
  if (!selectedDateKey) return;
  // TODO 3: Obtén els esdeveniments de 'selectedDateKey' o un array buit
  const dayEvents = events[selectedDateKey] || [];
  // TODO 4: Recorre els esdeveniments i crea els <li> amb un <span> (✕) per eliminar-los
  dayEvents.forEach((eventText, index) => {
    const li = document.createElement('li');
    li.textContent = eventText;
    const removeBtn = document.createElement('span');
    removeBtn.textContent = '✕';
    removeBtn.classList.add('remove-event');
    removeBtn.addEventListener('click', () => removeEvent(index));
    li.appendChild(removeBtn);
    eventsList.appendChild(li);
  });
}

/**
 * Afegir un nou esdeveniment a la data seleccionada.
 */
function addEvent(e) {
  e.preventDefault();
  // TODO 1: Valida que hi hagi un dia seleccionat (selectedDateKey) i text a l'input
  if (!selectedDateKey || !eventInput.value.trim()) {
    return;
  }
  // TODO 2: Si no existeix events[selectedDateKey], inicialitza-ho com un array buit []
  if (!events[selectedDateKey]) {
    events[selectedDateKey] = [];
  }
  // TODO 3: Afegeix el text a l'array d'esdeveniments de la data
  events[selectedDateKey].push(eventInput.value.trim());
  // TODO 4: Neteja l'input i torna a cridar renderEvents() i renderCalendar()
  eventInput.value = '';
  renderEvents();
  renderCalendar();
}

/**
 * Elimina un esdeveniment per la seva posició (índex).
 */
function removeEvent(index) {
  // TODO 1: Elimina l'element de l'array amb splice(index, 1)
  events[selectedDateKey].splice(index, 1);
  // TODO 2: Si l'array es queda buit, elimina la clau de l'objecte 'events' amb 'delete'
  if (events[selectedDateKey].length === 0) {
    delete events[selectedDateKey];
  }
  // TODO 3: Torna a cridar renderEvents() i renderCalendar()
  renderEvents();
  renderCalendar();
}


// TODO: Escoltador d'esdeveniment per al formulari eventForm (submit -> addEvent)
eventForm.addEventListener('submit', addEvent);

// ==========================================================================
// FASE 3: PERSISTÈNCIA DE DADES (LOCALSTORAGE I JSON)
// ==========================================================================

/*Desa l'objecte 'events' a LocalStorage convertit a text JSON.
 */
function saveEvents() {
  // TODO: Utilitza JSON.stringify(events) i localStorage.setItem('calendar_events', ...)
}

/**
 * Carrega els esdeveniments de LocalStorage en iniciar l'aplicació.
 */
function loadEvents() {
  // TODO: Utilitza localStorage.getItem('calendar_events') i JSON.parse()
  // Retorna l'objecte obtingut o un objecte buit {} si no hi havia res guardat.
}

// TODO: Modifica addEvent() i removeEvent() perquè cridin a saveEvents() després de modificar dades.


// ==========================================================================
// FASE 4: RESTA D'APIS DEL NAVEGADOR (NOTIFICATION I WEB SHARE)
// ==========================================================================

/**
 * Mostra una notificació del sistema si tenim permís concedit.
 */
function sendNotification(title, body) {
  // TODO: Comprova si Notification.permission === 'granted' i crea una new Notification()
  // Mira a la pràctica AC2 com es fa!
}

// TODO: Escoltador d'esdeveniment per a 'notifyBtn' (Sol·licitar permisos de notificació)
// Mira a la pràctica AC2 com es fa!


// TODO: Escoltador d'esdeveniment per a 'shareBtn' (Web Share API amb fallback a clipboard)
// Mira a la pràctica AC2 com es fa!


// ==========================================================================
// INICIALITZACIÓ DE L'APLICACIÓ
// ==========================================================================

function initApp() {
  // TODO 1: Carrega els esdeveniments des de LocalStorage cridant loadEvents()
  // TODO 2: Crida inicial a renderCalendar() per dibuixar la interfície inicial
  renderCalendar();
}

initApp();