
const punteggi = [
  { id: 0, name: "LUDO +2", value: 2 },
  { id: 1, name: "LUDO +3", value: 3 },
  { id: 2, name: "PIZZA SUPREMA", value: 2 },
  { id: 3, name: "TESTATA", value: 3 },
  { id: 4, name: "CALCIO ROTANTE", value: 4 },
  { id: 5, name: "A CASO", value: 2 },
  { id: 6, name: "FUN FACT", value: 3 },
  { id: 7, name: "GEOGRAFIA", value: 3 },
  { id: 8, name: "STORIA", value: 4 },
  { id: 9, name: "ALTRO", value: 2 },
  { id: 10, name: "ALTRO SUPREMO", value: 5 },
  { id: 11, name: "SPORT", value: 3 },
  { id: 12, name: "TESTATA NASO", value: -3 },
  { id: 13, name: "SOLLETICO", value: -1 },
  { id: 14, name: "DISTRAZIONE", value: -1 },
  { id: 15, name: "IMBORGLIO", value: -10 }
];

const stage = document.getElementById('stage');
const endGame = document.getElementById('end-game');

let store = [];
let points_a = 0;
let points_b = 0;
const limit = 30;
axios.get('/data')
  .then(response => {
    store = response.data;
    printLists()
  })
  .catch(error => {
    console.error(error);
  });


punteggi.forEach(punteggio => {
  document.getElementById('select-a').innerHTML += `
    <option value="${punteggio.value}">${punteggio.name}</option>
  `
  document.getElementById('select-b').innerHTML += `
    <option value="${punteggio.value}">${punteggio.name}</option>
  `
})

document.getElementById('add-a').addEventListener('click', () => {
  const selectA = document.getElementById('select-a');
  const value = parseInt(selectA.value);
  const label = selectA.options[selectA.selectedIndex].innerHTML;
  if (value) {
    sendData('a', value, label);
  }
  selectA.value = '';
});

document.getElementById('add-b').addEventListener('click', () => {
  const selectB = document.getElementById('select-b');
  const value = parseInt(selectB.value);
  const label = selectB.options[selectB.selectedIndex].innerHTML;
  if (value) {
    sendData('b', value, label);
  }
  selectB.value = '';
});

function sendData(type, value, label) {
  console.log(typeof value);

  store.push({
    value,
    label,
    type,
    date: new Date().getTime()
  });

  axios.post('/data', store)
    .then(response => {
      console.log(response.data);
      store = response.data;
      printLists()
    })
    .catch(error => {
      console.error(error);
    });

}

function printLists() {
  const listA = document.getElementById('list-a');
  const listB = document.getElementById('list-b');
  const pointsA = document.getElementById('points-a');
  const pointsB = document.getElementById('points-b');

  listA.innerHTML = '';
  listB.innerHTML = '';
  points_a = 0;
  points_b = 0;

  store.reverse().forEach(item => {
    const itemEl = `<div class="d-flex justify-content-between align-items-center border-bottom">
        <span class="w-75">${item.label}</span>
        <span>${item.value}</span>
        <span ><i data-date="${item.date}" class="fa-solid fa-trash-can"></i></span>
      </div>`
    if (item.type === 'a') {
      points_a += item.value;
      listA.innerHTML += itemEl;
    } else {
      points_b += item.value;
      listB.innerHTML += itemEl;
    }
  });
  pointsA.innerHTML = points_a;
  pointsB.innerHTML = points_b;
  const trashCans = document.querySelectorAll('.fa-trash-can');
  trashCans.forEach(trashCan => {
    trashCan.addEventListener('click', removeItem);
  });
  const displayPoints = document.getElementById('display-points');
  let winner = '';
  let loser = '';
  if (points_a > points_b) {
    displayPoints.innerHTML = `MALAK vince con ${points_a} punti!`;
    winner = 'MALAK';
    loser = 'MELIKA';
  } else if (points_a < points_b) {
    winner = 'MELIKA';
    loser = 'MALAK';
    displayPoints.innerHTML = `MELIKA vince con ${points_b} punti!`;
  } else {
    displayPoints.innerHTML = `MALAK ${points_a} - ${points_b} MELIKA`;
  }

  if (points_a >= limit || points_b >= limit) {
    displayPoints.innerHTML = `VINCE ${winner} <br> SUCAAA`;
    stage.classList.add('d-none');
    endGame.classList.remove('d-none');
    document.getElementById('btn-restart').innerHTML = `${loser} vuoi perdere ancora??`;
  } else {
    stage.classList.remove('d-none');
    endGame.classList.add('d-none');
  }
}

function removeItem(e) {
  const date = e.target.dataset.date;
  console.log(date);

  store = store.filter(item => item.date != date);
  axios.post('/data', store)
    .then(response => {
      console.log(response.data);
      store = response.data;
      printLists()
    })
    .catch(error => {
      console.error(error);
    });
}

document.getElementById('end-game').addEventListener('click', () => {
  store = [];
  points_a = 0;
  points_b = 0;
  axios.post('/data', store)
    .then(response => {
      console.log(response.data);
      store = response.data;
      printLists();
    })
    .catch(error => {
      console.error(error);
    });
});

