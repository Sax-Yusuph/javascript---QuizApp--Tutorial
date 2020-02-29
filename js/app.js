// fetch DOM elements
const quizContainer = document.getElementById('quizContainer');
const finalScore = document.getElementById('finalScore');
const questionContainer = document.getElementById('questionContainer');
const answerContainer = document.getElementById('answerContainer');
const start = document.getElementById('start');
const startBtn = document.getElementById('startBtn')
const progressVisual = document.getElementById('progressVisual');
const progress = document.getElementById('prog');


const labelA = document.querySelector(".a1");
const labelB = document.querySelector(".a2");
const labelC = document.querySelector(".a3");
const labelD = document.querySelector(".a4");


// //  working variables
let lastQuestionIndex;
let currentQuestionIndex = 0;
let count = 0;
const questionTime = 30; // 60s
const gaugeWidth = 100; // 100%
const gaugeUnit = Math.floor(gaugeWidth / questionTime);
let TIMER;
let score = 0;
let isPlaying = false

// render questions
 const renderQuestions = (questions)=>{
    resetInput();
    let q = questions[currentQuestionIndex];
    questionContainer.textContent = q.question;
    labelA.textContent = q.answers[0];
    labelB.textContent = q.answers[1];
    labelC.textContent = q.answers[2];
    labelD.textContent = q.answers[3]
};

// start quiz

 let startQuiz = async ()=>{
     isPlaying = true;
     start.style.display= 'none';
     quizContainer.style.display = 'block'
        // get questions from JSON Data
     const quizData = await fetch('../data/questions.json');
     const questions = await quizData.json();


     renderQuestions(questions);
     quizCount(questions);
     

     const renderCounter = ()=>{
        if(count <= 99){
                progress.style.width = count + "%";
                count ++;
        }else{
            answerIsWrong();
            nextQuestion(questions);
        }
        
    }

    renderCounter()
    TIMER = setInterval(renderCounter, 100);
    
    
    //  checkAnswer();
     let choices = document.querySelectorAll('.ac-custom ul li');

     for( let i = 0 ; i < choices.length; i++){
        choices[i].addEventListener('click',(e)=>{
            if(e.target.tagName.toLowerCase()==='input'){
                let correctAnswer = e.target.id
                if((questions[currentQuestionIndex].correct == correctAnswer) && isPlaying){
                    setTimeout(()=>{
                        score++;
                        answerIsCorrect();
                        nextQuestion(questions);
                    },1000)
                }else{
                    setTimeout(()=>{
                        answerIsWrong();
                        nextQuestion(questions);
                    },1000)
                }
            }
            
        })
     }

    

 }


 const nextQuestion = (questions)=>{
    count = 0;
    lastQuestionIndex = questions.length - 1;
        if((currentQuestionIndex < lastQuestionIndex) && isPlaying){
            currentQuestionIndex++;
            renderQuestions(questions);
        }else{
            // end the quiz and show the score
            isPlaying = false;
            clearInterval(TIMER);
            setTimeout(()=>{
                scoreRender(questions);
            },1200)
            
        }

 }

const quizCount = (questions)=>{
    let  q= questions.length -1;
    for(let qIndex = 0; qIndex <= q; qIndex++){
        progressVisual.innerHTML += `<span class='prog' id="${qIndex}"></span>`
    }

}






// answer is correct
function answerIsCorrect(){
    document.getElementById(currentQuestionIndex).style.backgroundColor = "#1cc88a";
}

// answer is Wrong
function answerIsWrong(){
    document.getElementById(currentQuestionIndex).style.backgroundColor = "#e74a3b";
}




// score render
function scoreRender(questions){
    finalScore.style.display = "block";
    
    // calculate the amount of question percent answered by the user
    const scorePerCent = Math.round(100 * score/questions.length);
    
    // choose the image based on the scorePerCent
    let img = (scorePerCent >= 80) ? "in-love.svg" :
              (scorePerCent >= 60) ? "suprised.svg" :
              (scorePerCent >= 40) ? "ugly.svg" :
              (scorePerCent >= 20) ? "sad.svg" :
              "dead.svg";
    
    finalScore.innerHTML += `<img src="../img/${img}" alt="">
    <p class=" h4 text-white px-2 rounded bg-dark ">score is ${scorePerCent}%</p>`
}

function resetInput() {
    const liElements = Array.from(document.querySelectorAll('#answerContainer>ul>li'))
    liElements.forEach(li=>{
        var path = li.querySelector( 'svg > path' );
        if( path ) {
            path.parentNode.removeChild( path );

            li.addEventListener('change',()=>{
                li.querySelector('svg').appendChild(path)
            })
        }
        

    })
}

// startQuiz
startBtn.addEventListener('click', startQuiz);


// display question container
// 1. render question and answers list
// 2. render progress bar
// 
// 2. start counting timer
// render progress
