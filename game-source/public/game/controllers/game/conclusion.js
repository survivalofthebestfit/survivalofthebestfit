function conc_next() {

	var page1 = document.getElementById("part1");
	var page2 = document.getElementById("part3");
	console.log("button clicked");
	
	if (page1.style.display === block && page2.style.display === none) {
		page1.style.display = "none";
		page2.style.display = "block";

	}
	
} 

// function open2() {

// 	var current = document.getElementById("text2");
// 	var next = document.getElementById("text3");
	
// 	current.style.display = "none";
// 	next.style.display = "block";
	
// } 

