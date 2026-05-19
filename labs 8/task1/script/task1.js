const board = document.querySelector('#board');
const movesView = document.querySelector('#moves');
const message = document.querySelector('#message');
const restartButton = document.querySelector('#restart');
const startButton = document.querySelector('#startGame');
const resetButton = document.querySelector('#resetSettings');
const boardSize = document.querySelector('#boardSize');
const difficulty = document.querySelector('#difficulty');
const playerCount = document.querySelector('#playerCount');
const playerOne = document.querySelector('#playerOne');
const playerTwo = document.querySelector('#playerTwo');
const playerTwoWrap = document.querySelector('#playerTwoWrap');
const roundsInput = document.querySelector('#rounds');
const roundView = document.querySelector('#roundView');
const timerView = document.querySelector('#timer');
const turnView = document.querySelector('#turnView');
const playersStats = document.querySelector('#playersStats');
const roundHistory = document.querySelector('#roundHistory');

const deckItems = [
  { label: 'HTML', symbol: 'H' },
  { label: 'CSS', symbol: 'C' },
  { label: 'JS', symbol: 'J' },
  { label: 'DOM', symbol: 'D' },
  { label: 'API', symbol: 'A' },
  { label: 'JSON', symbol: '{}' },
  { label: 'Node', symbol: 'N' },
  { label: 'React', symbol: 'R' },
  { label: 'Vue', symbol: 'V' },
  { label: 'Git', symbol: 'G' },
  { label: 'Flex', symbol: 'F' },
  { label: 'Grid', symbol: '#' },
  { label: 'Fetch', symbol: 'Fx' },
  { label: 'Async', symbol: 'Aw' },
  { label: 'Event', symbol: 'Ev' },
  { label: 'Canvas', symbol: 'Cv' },
  { label: 'Array', symbol: '[]' },
  { label: 'Map', symbol: 'M' },
];

const difficultySeconds = {
  easy: 180,
  normal: 120,
  hard: 60,
};

let state = createInitialState();
let gameSerial = 0;

function createInitialState() {
  return {
    cards: [],
    opened: [],
    locked: false,
    moves: 0,
    currentRound: 1,
    totalRounds: 1,
    timeLeft: difficultySeconds.easy,
    timeLimit: difficultySeconds.easy,
    timerId: null,
    activePlayer: 0,
    players: [],
    history: [],
    gameActive: false,
    columns: 4,
    gameId: 0,
  };
}

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const rest = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${rest}`;
}

function parseSize(value) {
  const [rows, columns] = value.split('x').map(Number);
  return { rows, columns, total: rows * columns };
}

function getPlayerNames() {
  const names = [playerOne.value.trim() || 'Гравець 1'];

  if (playerCount.value === '2') {
    names.push(playerTwo.value.trim() || 'Гравець 2');
  }

  return names;
}

function createPlayers() {
  return getPlayerNames().map((name) => ({
    name,
    pairs: 0,
    moves: 0,
    roundWins: 0,
    totalPairs: 0,
    totalMoves: 0,
  }));
}

function createCards(totalCards) {
  const selected = deckItems.slice(0, totalCards / 2);
  return shuffle([...selected, ...selected]).map((item, index) => ({
    id: index,
    label: item.label,
    symbol: item.symbol,
    open: false,
    done: false,
    owner: null,
  }));
}

function setMessage(text, mode = '') {
  message.textContent = text;
  message.className = `message ${mode}`.trim();
}

function renderCards() {
  board.style.setProperty('--columns', state.columns);
  board.innerHTML = state.cards.map((card) => `
    <button class="card ${card.open ? 'open' : ''} ${card.done ? 'done' : ''}" data-id="${card.id}" type="button" ${!state.gameActive ? 'disabled' : ''}>
      <span class="card-inner">
        <span class="side back"></span>
        <span class="side front">
          <span class="card-symbol">${card.symbol}</span>
          <span class="card-label">${card.label}</span>
        </span>
      </span>
    </button>
  `).join('');
}

function renderStats() {
  movesView.textContent = state.moves;
  roundView.textContent = `${state.currentRound}/${state.totalRounds}`;
  timerView.textContent = formatTime(state.timeLeft);
  turnView.textContent = state.players[state.activePlayer]?.name || '-';

  playersStats.innerHTML = state.players.map((player, index) => `
    <article class="player-card ${index === state.activePlayer && state.gameActive ? 'active' : ''}">
      <strong>${player.name}</strong>
      Пари: ${player.pairs} | Ходи: ${player.moves} | Перемоги: ${player.roundWins}
    </article>
  `).join('');

  roundHistory.innerHTML = state.history.map((round) => `
    <li>${round.title}: ${round.winner}. Ходи: ${round.moves}. Час: ${round.time}.</li>
  `).join('');
}

function render() {
  renderCards();
  renderStats();
}

function stopTimer() {
  if (state.timerId) {
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer() {
  stopTimer();
  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    renderStats();

    if (state.timeLeft <= 0) {
      finishRound(false);
    }
  }, 1000);
}

function resetRoundStats() {
  state.players = state.players.map((player) => ({
    ...player,
    pairs: 0,
    moves: 0,
  }));
}

function startRound(nextRound = 1) {
  const size = parseSize(boardSize.value);
  state.cards = createCards(size.total);
  state.columns = size.columns;
  state.opened = [];
  state.locked = false;
  state.moves = 0;
  state.currentRound = nextRound;
  state.timeLimit = difficultySeconds[difficulty.value];
  state.timeLeft = state.timeLimit;
  state.activePlayer = 0;
  state.gameActive = true;
  resetRoundStats();
  setMessage('Знайдіть усі пари карток.');
  render();
  startTimer();
}

function startGame() {
  stopTimer();
  gameSerial += 1;
  state = {
    ...createInitialState(),
    totalRounds: Math.max(1, Math.min(9, Number(roundsInput.value) || 1)),
    timeLimit: difficultySeconds[difficulty.value],
    players: createPlayers(),
    gameId: gameSerial,
  };
  startRound(1);
}

function closeCards(firstId, secondId) {
  state.cards = state.cards.map((card) => (
    card.id === firstId || card.id === secondId
      ? { ...card, open: false }
      : card
  ));
}

function markPair(firstId, secondId) {
  state.cards = state.cards.map((card) => (
    card.id === firstId || card.id === secondId
      ? { ...card, done: true, owner: state.activePlayer }
      : card
  ));
}

function pickRoundWinner() {
  if (state.players.length === 1) {
    return state.players[0];
  }

  return [...state.players].sort((a, b) => (
    b.pairs - a.pairs || a.moves - b.moves || a.name.localeCompare(b.name)
  ))[0];
}

function pickGameWinner() {
  return [...state.players].sort((a, b) => (
    b.roundWins - a.roundWins ||
    b.totalPairs - a.totalPairs ||
    a.totalMoves - b.totalMoves ||
    a.name.localeCompare(b.name)
  ))[0];
}

function finishGame() {
  const winner = pickGameWinner();
  const totals = state.players
    .map((player) => `${player.name}: перемоги ${player.roundWins}, пари ${player.totalPairs}, ходи ${player.totalMoves}`)
    .join('; ');

  state.gameActive = false;
  stopTimer();
  setMessage(`Гру завершено. Переможець: ${winner.name}. ${totals}.`, 'win');
  render();
}

function finishRound(completed) {
  if (!state.gameActive) {
    return;
  }

  stopTimer();
  state.gameActive = false;

  const winner = completed ? pickRoundWinner() : null;
  const elapsed = state.timeLimit - state.timeLeft;

  state.players = state.players.map((player) => {
    const wonRound = winner && player.name === winner.name;
    return {
      ...player,
      roundWins: player.roundWins + (wonRound ? 1 : 0),
      totalPairs: player.totalPairs + player.pairs,
      totalMoves: player.totalMoves + player.moves,
    };
  });

  state.history = [
    ...state.history,
    {
      title: `Раунд ${state.currentRound}`,
      winner: completed ? `переможець ${winner.name}` : 'час вийшов',
      moves: state.moves,
      time: formatTime(elapsed),
    },
  ];

  if (!completed) {
    setMessage('Час вийшов. Натисніть "Розпочати гру", щоб почати заново.', 'lost');
    render();
    return;
  }

  if (state.currentRound >= state.totalRounds) {
    finishGame();
    return;
  }

  setMessage(`Раунд ${state.currentRound} завершено. Наступний раунд стартує автоматично.`, 'win');
  render();
  setTimeout(() => startRound(state.currentRound + 1), 1800);
}

function switchPlayer() {
  if (state.players.length > 1) {
    state.activePlayer = (state.activePlayer + 1) % state.players.length;
  }
}

function openCard(id) {
  if (state.locked || !state.gameActive) {
    return;
  }

  const card = state.cards.find((item) => item.id === id);

  if (!card || card.open || card.done) {
    return;
  }

  state.cards = state.cards.map((item) => (
    item.id === id ? { ...item, open: true } : item
  ));
  state.opened = [...state.opened, { ...card, open: true }];
  render();

  if (state.opened.length !== 2) {
    return;
  }

  state.moves += 1;
  state.players[state.activePlayer].moves += 1;
  state.locked = true;

  const [first, second] = state.opened;
  const isPair = first.label === second.label;
  const gameId = state.gameId;

  setTimeout(() => {
    if (!state.gameActive || state.gameId !== gameId) {
      return;
    }

    if (isPair) {
      markPair(first.id, second.id);
      state.players[state.activePlayer].pairs += 1;
      setMessage(`Пару знайдено: ${state.players[state.activePlayer].name}.`);
    } else {
      closeCards(first.id, second.id);
      switchPlayer();
      setMessage('Не пара. Хід переходить далі.');
    }

    state.opened = [];
    state.locked = false;

    if (state.cards.every((item) => item.done || item.id === first.id || item.id === second.id) && isPair) {
      finishRound(true);
      return;
    }

    render();
  }, 650);
}

function resetSettings() {
  boardSize.value = '4x4';
  difficulty.value = 'easy';
  playerCount.value = '1';
  playerOne.value = 'Гравець 1';
  playerTwo.value = 'Гравець 2';
  roundsInput.value = '1';
  updatePlayerFields();
}

function updatePlayerFields() {
  playerTwoWrap.hidden = playerCount.value !== '2';
}

board.addEventListener('click', (event) => {
  const card = event.target.closest('.card');

  if (card) {
    openCard(Number(card.dataset.id));
  }
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetSettings);
playerCount.addEventListener('change', updatePlayerFields);

updatePlayerFields();
state.players = createPlayers();
state.timeLeft = difficultySeconds.easy;
render();
