const CONFIG = {
  herName:  "Ankita",       
  yourName: "Saikat",       
  yourEmail: "saikatpaul2820@gmail.com",         

  locationOptions: [
    { name: "Desi Lane Esplanade", note: "Esplanade", image: "d.jpg.png" },
    { name: "The First Date K-afe & Restro", note: "Phoolbagan", image: "k.jpg.jpeg" },
    { name: "Calcutta Bungalow", note: "Shyam Bazar", image: "b.jpg.png" },
    { name: "Princep Ghat", note: "Maidan", image: "p.jpg.png" }
  ],

  timeOptions: [
    { label: "Time Option 1", note: "10:00 AM" },
    { label: "Time Option 2", note: "2:00 PM" }
  ]
};

const state = { date: null, location: null, time: null };

// Seal initial + greeting initialization
const initial = (CONFIG.herName && CONFIG.herName !== "Her Name") ? CONFIG.herName.trim().charAt(0).toUpperCase() : "?";
document.getElementById('sealInitial').textContent = initial;
document.getElementById('toLine1').textContent = `Dear ${CONFIG.herName},`;

// Allow any date from today onward
function toISO(d) { return d.toISOString().split('T')[0]; }
const today = new Date(); today.setHours(0,0,0,0);
document.getElementById('rangeNote').textContent = `Choose any day from today onward`;

let viewYear = today.getFullYear();
let viewMonth = today.getMonth();
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function isSameDay(a, b) { return a.getFullYear()===b.getFullYear() && a.getMonth()===b.getMonth() && a.getDate()===b.getDate(); }
function inRange(d) { return d >= today; }

function renderCalendar() {
  document.getElementById('calMonthLabel').textContent = `${monthNames[viewMonth]} ${viewYear}`;
  const daysWrap = document.getElementById('calDays');
  daysWrap.innerHTML = '';

  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  for (let i = 0; i < startWeekday; i++) {
    const empty = document.createElement('div');
    empty.className = 'cal-day empty';
    daysWrap.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cellDate = new Date(viewYear, viewMonth, day);
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = day;

    if (isSameDay(cellDate, today)) cell.classList.add('today');

    if (inRange(cellDate)) {
      cell.onclick = () => selectDay(cellDate, cell);
      if (state.date && isSameDay(cellDate, new Date(state.date + 'T00:00:00'))) {
        cell.classList.add('selected');
      }
    } else {
      cell.classList.add('disabled');
    }
    daysWrap.appendChild(cell);
  }

  // Nav limits: can't go before today's month
  document.getElementById('calPrev').disabled = (viewYear === today.getFullYear() && viewMonth === today.getMonth());
  document.getElementById('calNext').disabled = false;
}

function changeMonth(delta) {
  viewMonth += delta;
  if (viewMonth < 0) { viewMonth = 11; viewYear--; }
  if (viewMonth > 11) { viewMonth = 0; viewYear++; }
  renderCalendar();
}

function selectDay(cellDate, cellEl) {
  document.querySelectorAll('.cal-day.selected').forEach(c => c.classList.remove('selected'));
  cellEl.classList.add('selected');
  state.date = toISO(cellDate);
  document.getElementById('dateNext').disabled = false;
}

// Global scope attachments for HTML inline handlers
window.changeMonth = changeMonth;
window.openEnvelope = openEnvelope;
window.goTo = goTo;
window.showSummary = showSummary;
window.confirmDate = confirmDate;

renderCalendar();

function openEnvelope() {
  const env = document.getElementById('envelope');
  const wrap = document.getElementById('envelopeWrap');
  if (env.classList.contains('open')) return;
  env.classList.add('open');
  setTimeout(() => {
    wrap.style.display = 'none';
    document.getElementById('cardDate').classList.add('show');
  }, 550);
}

function goTo(cardId, stepNum) {
  document.querySelectorAll('.card').forEach(c => c.classList.remove('show'));
  document.getElementById(cardId).classList.add('show');
}

// Build location options
const locWrap = document.getElementById('locationOptions');
CONFIG.locationOptions.forEach((opt, i) => {
  const el = document.createElement('div');
  const hasPhoto = !!opt.image;
  el.className = 'option has-photo';
  const photoHtml = hasPhoto
    ? `<div class="opt-photo" style="background-image:url('${opt.image}')"></div>`
    : `<div class="opt-photo-placeholder">♡</div>`;
  el.innerHTML = `${photoHtml}<div class="opt-body"><div class="opt-name">${opt.name}</div><div class="opt-note">${opt.note || ''}</div></div>`;
  el.onclick = () => {
    document.querySelectorAll('#locationOptions .option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    state.location = opt.name;
    document.getElementById('locationNext').disabled = false;
  };
  locWrap.appendChild(el);
});

// Build time options
const timeWrap = document.getElementById('timeOptions');
CONFIG.timeOptions.forEach((opt) => {
  const el = document.createElement('div');
  el.className = 'option';
  el.innerHTML = `<div class="opt-body"><div class="opt-name">${opt.label}</div><div class="opt-note">${opt.note || ''}</div></div>`;
  el.onclick = () => {
    document.querySelectorAll('#timeOptions .option').forEach(o => o.classList.remove('selected'));
    el.classList.add('selected');
    state.time = opt.label;
    document.getElementById('timeNext').disabled = false;
  };
  timeWrap.appendChild(el);
});

function prettyDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function showSummary() {
  const body = document.getElementById('summaryBody');
  body.innerHTML = `
    <div class="summary-row"><span class="label">Date</span><span class="value">${prettyDate(state.date)}</span></div>
    <div class="summary-row"><span class="label">Location</span><span class="value">${state.location}</span></div>
    <div class="summary-row"><span class="label">Time</span><span class="value">${state.time}</span></div>
  `;
  goTo('cardSummary', 4);
}

function confirmDate() {
  const body = document.getElementById('doneBody');
  body.innerHTML = `
    <div class="summary-row"><span class="label">Date</span><span class="value">${prettyDate(state.date)}</span></div>
    <div class="summary-row"><span class="label">Location</span><span class="value">${state.location}</span></div>
    <div class="summary-row"><span class="label">Time</span><span class="value">${state.time}</span></div>
  `;
  document.getElementById('doneSignature').textContent = `— see you then, ${CONFIG.yourName}`;
  goTo('cardDone', 5);

  if (CONFIG.yourEmail) {
    const subject = encodeURIComponent(`${CONFIG.herName} said yes! 🤍`);
    const message = encodeURIComponent(
      `${CONFIG.herName} picked:\n\nDate: ${prettyDate(state.date)}\nLocation: ${state.location}\nTime: ${state.time}`
    );
    window.location.href = `mailto:${CONFIG.yourEmail}?subject=${subject}&body=${message}`;
  }
}