$("a[href^='https://']").attr("target","_blank");

/*
FOR WEBSITE LANDING PAGE RESOURCES
*/

var pages = ["#reading1", "#reading2", "#reading3", "#reading4"];

function getActivePageIndex() {
    for (var i=0; i<pages.length; i++) {
        if (!$(pages[i]).hasClass('is-inactive')) {
            return i;
        };
    }
}

function handleNavButton(targetPage) {
    $('#prevPage').removeClass('is-inactive');
    $('#nextPage').removeClass('is-inactive');

    if (targetPage == pages[0]) {
        $('#prevPage').addClass('is-inactive');
    }

    if (targetPage == pages[pages.length-1]) {
        $('#nextPage').addClass('is-inactive');
    }

    for (var i=0; i<pages.length; i++) {
        var page = pages[i];
        if (page != targetPage) {
            $(page).addClass('is-inactive');
        }
        else {
            $(page).removeClass('is-inactive')
            $("html").animate({ scrollTop: 300 }, "slow");
        }
    }

    var gtagEventName = "open-resources-{n}"
    gtag('event', gtagEventName.replace('{n}', targetPage), {'event_category': 'progress', 'event_label': 'resources-page'});
}

function prevPage() {
    var activePageIndex = getActivePageIndex();
    var targetPage = activePageIndex > 0 ? pages[activePageIndex-1] : pages[0];
    handleNavButton(targetPage);
}

function nextPage() {
    var activePageIndex = getActivePageIndex();
    var targetPage = activePageIndex <  pages.length-1 ? pages[activePageIndex+1] : pages[pages.length-1];
    handleNavButton(targetPage);
}

/*
FOR GAME WRAP UP OVERLAY
*/

function select() {
    var buttons = document.getElementById("buttons");
    var next = document.getElementById("part2");

    console.log("function entered");
    
    buttons.style.display = "none";
    next.style.display = "block";

}

function next1() {

	console.log("button clicked");
	document.getElementsByClassName('conversation-container')[0].scrollTop = 0
    var page1 = document.getElementById("part1");
    var page1_2 = document.getElementById("part2");
    var page2 = document.getElementById("part3");
   
    page1.style.display = "none";
    page1_2.style.display = "none";
    page2.style.display = "block";
    
} 

function next2() {

	console.log("button clicked");
	document.getElementsByClassName('conversation-container')[0].scrollTop = 0
    var current = document.getElementById("part3");
    var next = document.getElementById("part4");
   
    current.style.display = "none";
    next.style.display = "block";
    
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

function goToResourcesLog() {
    gtag('event', 'open-resources-first-page', {'event_category': 'progress', 'event_label': 'resources-page'});
    return true;
}

/*
NAVBAR HANDLING
*/

// Smooth scrolling using jQuery easing
$('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function () {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 70)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });
  
  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function () {
    $('.navbar-collapse').collapse('hide');
  });
  
  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 100
  });
  
  // Collapse Navbar
  var navbarCollapse = function () {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  
  $('.navbar-toggler').click(function () {
    $('#mainNav').toggleClass('bg-white-transparent');
  })
  
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);
  