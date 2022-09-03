// Pages
const gamePage = document.getElementById('game-page')
const scorePage = document.getElementById('score-page')
const splashPage = document.getElementById('splash-page')
const countdownPage = document.getElementById('countdown-page')
// Splash Page
const startForm = document.getElementById('start-form')
const radioContainers = document.querySelectorAll('.radio-container')
const radioInputs = document.querySelectorAll('input')
const bestScores = document.querySelectorAll('.best-score-value')
// Countdown Page
const countdown = document.querySelector('.countdown')
// Game Page
const itemContainer = document.querySelector('.item-container')
// Score Page
const finalTimeEl = document.querySelector('.final-time')
const baseTimeEl = document.querySelector('.base-time')
const penaltyTimeEl = document.querySelector('.penalty-time')
const playAgainBtn = document.querySelector('.play-again')

// Equations
let questionAmount = 0
let equationsArray = []
let playerGuessArray = []
let bestScoreArray = []

// Game Page
let firstNumber = 0
let secondNumber = 0
let equationObject = {}
const wrongFormat = []

// Time
let timer
let timePlayed = 0
let baseTime = 0
let penaltyTime = 0
let FinalTime = 0
let finalTimeDisplay = '0.0'
// Best Scores to DOM
function BestScoreToDOM() {
  bestScores.forEach((bestscore, index) => {
    const bestScoreEl = bestscore
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}`
  })
}

// Check local storage for best score and set best score array
function getSaveBestScore() {
  if (localStorage.getItem('bestScores')) {
    bestScoreArray = JSON.parse(localStorage.bestScores)
  } else {
    bestScoreArray = [
      {
        question: '10',
        bestScore: finalTimeDisplay,
      },
      {
        question: '25',
        bestScore: finalTimeDisplay,
      },
      {
        question: '50',
        bestScore: finalTimeDisplay,
      },
      {
        question: '99',
        bestScore: finalTimeDisplay,
      },
    ]
    localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
  }
  BestScoreToDOM()
}
// Update best score array of local storage
function updateBestScore() {
  bestScoreArray.forEach((Score, index) => {
    // Select correct best score to update
    if (questionAmount == Score.question) {
      // return best score with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore)
      // Update only if final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > FinalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay
      }
    }
  })
  // Update splash page
  BestScoreToDOM()
  // save to Local storage
  localStorage.setItem('bestScores', JSON.stringify(bestScoreArray))
}

// Reset the game
function playAgain() {
  gamePage.addEventListener('click', startTimer)
  scorePage.hidden = true
  splashPage.hidden = false
  equationsArray = []
  playerGuessArray = []
  valueY = 0
  playAgainBtn.hidden = true
}

function showScorePage() {
  //   show play Again button after 1 sec
  setTimeout(() => {
    playAgainBtn.hidden = false
  }, 1000)
  gamePage.hidden = true
  console.log(scorePage)
  scorePage.hidden = false
}
// Display score to DOM
function scoreToDOM() {
  finalTimeDisplay = FinalTime.toFixed(1)
  baseTime = timePlayed.toFixed(1)
  penaltyTime = penaltyTime.toFixed(1)
  baseTimeEl.textContent = `Base Time: ${baseTime}s`
  penaltyTimeEl.textContent = `Penalty Time Time: + ${penaltyTime}s`
  finalTimeEl.textContent = ` ${finalTimeDisplay}s`
  updateBestScore()

  //   scrolls to trop, go to score page
  itemContainer.scrollTo({ top: 0, behavior: 'instant' })

  showScorePage()
}

// stop timer, process result, go to score page
function checkTime() {
  console.log(timePlayed)
  if (playerGuessArray.length == questionAmount) {
    console.log(questionAmount)
    console.log(playerGuessArray)

    clearInterval(timer)
    // check for wrong guess and add penalty
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        //that is correct guess
      } else {
        // wrong guess
        penaltyTime += 0.5
      }
    })
    FinalTime = timePlayed + penaltyTime
    console.log('time', timePlayed, 'penalty', penaltyTime, 'final', FinalTime)
    scoreToDOM()
  }
}

// Add 10th of second to a timeplayed
function addTime() {
  timePlayed += 0.1
  checkTime()
}

function startTimer() {
  // Resetting timer
  timePlayed = 0
  baseTime = 0
  penaltyTime = 0
  timer = setInterval(() => {
    addTime()
  }, 100)
  gamePage.removeEventListener('click', startTimer)
}

// Scroll
let valueY = 0

// Scroll and store user selections
function select(guessTrue) {
  // scroll 80px
  valueY += 80
  itemContainer.scroll(0, valueY)
  //   Add player guess to array
  return guessTrue
    ? playerGuessArray.push('true')
    : playerGuessArray.push('false')
}

// Display game page
function showgamePage() {
  gamePage.hidden = false
  countdownPage.hidden = true
}
// get random number
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

// Create Correct/Incorrect Random Equations
function createEquations() {
  // Randomly choose how many correct equations there should be
  const correctEquations = getRandomInt(questionAmount)
  // Set amount of wrong equations
  const wrongEquations = questionAmount - correctEquations
  // Loop through, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`
    equationObject = { value: equation, evaluated: 'true' }
    equationsArray.push(equationObject)
  }
  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquations; i++) {
    firstNumber = getRandomInt(9)
    secondNumber = getRandomInt(9)
    const equationValue = firstNumber * secondNumber
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`
    const formatChoice = getRandomInt(3)
    const equation = wrongFormat[formatChoice]
    equationObject = { value: equation, evaluated: 'false' }
    equationsArray.push(equationObject)
  }
  shuffle(equationsArray)
}
// Adding equation to dom
function equationsTODOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement('div')
    item.classList.add('item')
    // Equation text
    const equationText = document.createElement('h1')
    equationText.textContent = equation.value
    // Append
    item.appendChild(equationText)
    itemContainer.appendChild(item)
  })
}

// Dynamically adding correct/incorrect equations
function populateGamePage() {
  // Reset DOM, Set Blank Space Above
  itemContainer.textContent = ''
  // Spacer
  const topSpacer = document.createElement('div')
  topSpacer.classList.add('height-240')
  // Selected Item
  const selectedItem = document.createElement('div')
  selectedItem.classList.add('selected-item')
  // Append
  itemContainer.append(topSpacer, selectedItem)

  // Create Equations, Build Elements in DOM
  createEquations()
  equationsTODOM()
  // Set Blank Space Below
  const bottomSpacer = document.createElement('div')
  bottomSpacer.classList.add('height-500')
  itemContainer.appendChild(bottomSpacer)
}

const changeradioElement = () => {
  radioContainers.forEach((radioElement) => {
    //remove selected element
    radioElement.classList.remove('selected-label')
    // Add selected class if it is checked
    if (radioElement.children[1].checked) {
      radioElement.classList.add('selected-label')
    }
  })
}
// displays 3,2,1,go
function countdownshow() {
  const countDownArray = ['3', '2', '1', 'GO']
  countDownArray.forEach((element, index) => {
    setTimeout(() => (countdown.textContent = element), index * 500)
  })
  console.log(countdown.textContent)
}
function showCountDown() {
  countdownPage.hidden = false
  //   console.log(countdownPage)
  splashPage.hidden = true
  populateGamePage()
  showgamePage()
}
// Get value from selected radio button
function getRadioValue() {
  let radioValue
  radioInputs.forEach((input) => {
    if (input.checked) {
      radioValue = input.value
    }
  })
  return radioValue
}

// Form that descides amount of questions
const selectQuestionAmout = (e) => {
  e.preventDefault()
  questionAmount = getRadioValue()
  if (questionAmount) {
    showCountDown()
  }
}
startForm.addEventListener('click', changeradioElement)
startForm.addEventListener('submit', selectQuestionAmout)
gamePage.addEventListener('click', startTimer)

// ON load
getSaveBestScore()
