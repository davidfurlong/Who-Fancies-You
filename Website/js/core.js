var lastProgressValue = 0;

function gearsGrinding(){
	$('#connectToFacebook').addClass('working');
	$('#connectToFacebook').val("");

	changeProgressText('Crunching');
	changeProgressValue(50);
	changeProgressValue(100);
}

function changeProgressText(t){
	$('#progress-text').html(t);
}
function changeProgressValue(v){
	if(lastProgressValue==0){
		$('#progress-container').css('display','inherit');
	}
	var store=lastProgressValue;
	lastProgressValue = v;
	var c = 3*v;
	$('.ui-progress').animate({
    width:c
  }, (v-store)*60, function() {
    if(v>=100)
    	showResults();
  });
}

function showResults(){
	//scroll down page
	
}