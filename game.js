// THE PATTERN — 3 Stages
const TRIES_PER_STAGE = 3;

const DAILY_STAGES = [
{
name: "EASY",
start: [2,3,5],
next: (n) => (n*2)-1,
ruleN: "nₖ₊₁ = (nₖ × 2) − 1"
},
{
name: "MEDIUM",
start: [10,-14,-2],
next: (n) => (n/-2)-9,
ruleN: "nₖ₊₁ = (nₖ / -2) − 9"
},
{
name:"HARD",
start:[5,9,21],
next:(n)=>3*(n-2),
ruleN:"3(n-2)"
}
];

let stageIndex=0;
let triesUsedThisStage=0;
let seq=[];

const results=[[],[],[]];

const sequenceEl=document.getElementById("sequence");
const feedback=document.getElementById("feedback");
const stageLabel=document.getElementById("stageLabel");
const resultsSection=document.getElementById("results");
const resultsGrid=document.getElementById("resultsGrid");

function normalizeNumber(str){
const n=Number(str);
return Number.isFinite(n)?n:null;
}

function setFeedback(text,cls){
feedback.className=`feedback ${cls||""}`;
feedback.textContent=text;
}

function currentStage(){
return DAILY_STAGES[stageIndex];
}

function nextAnswer(){
const last=seq[seq.length-1];
return currentStage().next(last);
}

function renderSequence(){

sequenceEl.innerHTML="";

for(const n of seq){

const d=document.createElement("div");
d.className="pill";
d.textContent=n;
sequenceEl.appendChild(d);

}

const input=document.createElement("input");
input.className="pill";
input.type="text";
input.autocapitalize="off";
input.autocomplete="off";
input.spellcheck=false;

sequenceEl.appendChild(input);

input.focus();

input.addEventListener("keydown",(e)=>{

if(e.key!=="Enter")return;

submitGuess(input.value);

});

}

function startStage(i){

stageIndex=i;
triesUsedThisStage=0;

seq=[...currentStage().start];

stageLabel.textContent=`Stage ${stageIndex+1}`;

setFeedback("");

renderSequence();

}

function finishStageAndAdvance(msg,cls){

setFeedback(msg,cls);

setTimeout(()=>{

if(stageIndex<2)
startStage(stageIndex+1);
else
endGameShowResults();

},2000);

}

function submitGuess(value){

const guess=normalizeNumber(value);

if(guess===null){
setFeedback("Enter a valid number.","bad");
return;
}

const ans=nextAnswer();

triesUsedThisStage++;

if(guess===ans){

results[stageIndex].push("G");

seq.push(ans);

renderSequence();

finishStageAndAdvance("Correct","good");

return;

}

results[stageIndex].push("R");

seq.push(ans);

if(triesUsedThisStage>=TRIES_PER_STAGE){

renderSequence();

finishStageAndAdvance("Out of tries.","bad");

return;

}

renderSequence();

setFeedback(`${TRIES_PER_STAGE-triesUsedThisStage} tries left`,"bad");

}

function endGameShowResults(){

stageLabel.textContent="DONE";

resultsGrid.innerHTML="";

const labels=["EASY","MEDIUM","HARD"];

for(let r=0;r<3;r++){

const row=document.createElement("div");
row.className="resultsRow";

const lab=document.createElement("div");
lab.className="resultsRowLabel";
lab.textContent=labels[r];

row.appendChild(lab);

for(let c=0;c<TRIES_PER_STAGE;c++){

const b=document.createElement("div");
b.className="box";

const val=results[r][c];

if(val==="G")b.classList.add("green");
else if(val==="R")b.classList.add("red");
else b.classList.add("empty");

row.appendChild(b);

}

resultsGrid.appendChild(row);

}

const shareBtn=document.createElement("button");
shareBtn.id="shareBtn";
shareBtn.className="btn";
shareBtn.textContent="Share";

shareBtn.onclick=shareResults;

resultsSection.appendChild(shareBtn);

resultsSection.classList.remove("hidden");

}

function shareResults(){

let text="The Pattern\n\n";

const labels=["EASY","MEDIUM","HARD"];

for(let r=0;r<3;r++){

text+=labels[r]+" ";

for(let c=0;c<TRIES_PER_STAGE;c++){

const val=results[r][c];

if(val==="G")text+="🟩";
else if(val==="R")text+="🟥";
else text+="⬜";

}

text+="\n";

}

if(navigator.share){

navigator.share({
title:"The Pattern",
text:text,
url:window.location.href
});

}else{

navigator.clipboard.writeText(text);
alert("Results copied to clipboard.");

}

}

startStage(0);
