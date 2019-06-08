//clean this code


function next1() {

	console.log("button clicked");
    var page1 = document.getElementById("part1");
    var page1_2 = document.getElementById("part2");
    var page2 = document.getElementById("part3");
   
    page1.style.display = "none";
    page1_2.style.display = "none";
    page2.style.display = "block";
	
} 

function next2() {

	console.log("button clicked");
    var current = document.getElementById("part3");
    var next = document.getElementById("part4");
   
    current.style.display = "none";
	next.style.display = "block";
	
	window.open("https://survivalofthebestfit.com/resources/");
} 

function next3() {
	window.open("https://survivalofthebestfit.github.io/survivalofthebestfit/resources/");
} 



//clean this into 1 function

function open1() {

	var current = document.getElementById("text1");
	var next = document.getElementById("text2");
	
	current.style.display = "none";
	next.style.display = "block";
	
} 



function open2() {

	var current = document.getElementById("text2");
	var next = document.getElementById("text3");
	
	current.style.display = "none";
	next.style.display = "block";
	
} 


function back() {

	var text1 = document.getElementById("text1");
	var text2 = document.getElementById("text2");
	var text3 = document.getElementById("text3");
	
	if (text2.style.display === "block") {
	text2.style.display = "none";
	text1.style.display = "block";
}

if (text3.style.display === "block") {
	text3.style.display = "none";
	text2.style.display = "block";
}

} 

