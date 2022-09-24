const API_URL = 'https://the-trivia-api.com/api/questions?limit=10'

const questionElement = document.querySelector('#question')
const choicesElement = document.querySelectorAll('.choice-text')
const progressTextElement = document.querySelector('#progressText')
const progressBarFillElement = document.querySelector('#progressBarFill')
const scoreElement = document.querySelector('#score')
const timeElement = document.querySelector('#time-text')
const timerBarFillElement = document.querySelector('#timerBarFill')

getRandomQuestions()

let currentQuestion = 0
let score = 0
let randomQuestions = []
let answers = []
let acceptingAnswer = true
let time = 0
let interval = undefined

async function getRandomQuestions () {
    const response = await fetch(API_URL)
    let data = await response.json()
    randomQuestions = data
    addQuestion(randomQuestions[0])
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function resetStyle() {
    timeElement.style.color = ''
    time = 10
    timeElement.innerText = time
    timerBarFillElement.style.width = `100%`
    timerBarFillElement.style.background = 'blueviolet'
    timerBarFillElement.parentElement.style.border = `0.2rem solid blueviolet`
}


function addQuestion(questionData) {
    if (currentQuestion == randomQuestions.length) {
        localStorage.setItem('recentScore', score)
        return window.location.assign('/end.html')
    }
    if (interval) clearInterval(interval)

    resetStyle()
    interval = setInterval(() => {
        time--
        timeElement.innerText = time
        timerBarFillElement.style.width = `${time*10}%`
        if (time <= 3) {
            timeElement.style.color = 'rgb(185, 56, 16)'
            timerBarFillElement.style.background = 'rgb(185, 56, 16)'
            timerBarFillElement.parentElement.style.border = `0.2rem solid rgb(185, 56, 16)`
        }
        if (time == -1) {
            clearInterval(interval)
            currentQuestion++
            addQuestion(randomQuestions[currentQuestion])
        }
    }, 1000)
    acceptingAnswer = true
    answers = questionData.incorrectAnswers
    answers.push(questionData.correctAnswer)
    shuffle(answers)
    questionElement.innerText = questionData.question

    progressTextElement.innerText = `Question ${currentQuestion+1} of ${randomQuestions.length}`

    choicesElement.forEach(choice => {
        choice.innerText = answers[choice.id]
        choice.parentElement.classList.remove('correct')
    })

    progressBarFillElement.style.width = `${(currentQuestion+1)*10}%`
}

choicesElement.forEach(choice => {
    choice.parentElement.addEventListener('click', e => {
        if (!acceptingAnswer) {
            return
        }

        acceptingAnswer = false
        const selectedChoice = e.target
        const selectedAnswer = choice.innerText

        if (selectedAnswer == randomQuestions[currentQuestion].correctAnswer) {
            scoreElement.innerText = `${score += time}`
            selectedChoice.parentElement.classList.add('correct')
        } else {
            selectedChoice.parentElement.classList.add('incorrect')
            choicesElement.forEach(c => {
                if (c.innerText == randomQuestions[currentQuestion].correctAnswer) {
                    c.parentElement.classList.add('correct')
                }
            })
        }

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove('incorrect', 'correct')
            currentQuestion++
            addQuestion(randomQuestions[currentQuestion])
        }, 1000) 
    })
})
