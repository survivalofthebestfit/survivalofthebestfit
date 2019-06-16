function prevPage() {
	if (!$('#part3').hasClass('is-inactive')) show2();
	else if (!$('#part2').hasClass('is-inactive')) show1();
}

function nextPage() {
	if (!$('#part1').hasClass('is-inactive')) show2(); 
	else if (!$('#part2').hasClass('is-inactive')) show3();
}

function show1() {
	$('#part1').removeClass('is-inactive');
	$('#part2').addClass('is-inactive');
	$('#part3').addClass('is-inactive');

	$('#prevPage').addClass('is-inactive');
	gtag('event', 'open-resources-first-page', {'event_category': 'progress', 'event_label': 'resources-page'});

}

function show2() {
	$('#part2').removeClass('is-inactive');

	$('#part1').addClass('is-inactive');
	$('#part3').addClass('is-inactive');

	$('#prevPage').removeClass('is-inactive');
	$('#nextPage').removeClass('is-inactive');
	gtag('event', 'open-resources-second-page', {'event_category': 'progress', 'event_label': 'resources-page'});

}

function show3() {
	$('#part3').removeClass('is-inactive');

	$('#part1').addClass('is-inactive');
	$('#part2').addClass('is-inactive');

	$('#nextPage').addClass('is-inactive');
	gtag('event', 'open-resources-third-page', {'event_category': 'progress', 'event_label': 'resources-page'});

}
