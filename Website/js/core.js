var lastProgressValue = 0;

function gearsGrinding(){
	whoLikesMe(function(result) {
	      	console.log("FINAL RESULT:");
	      	console.log(result);
	      	changeProgressValue(100);
	      	changeProgressText("Complete");
    		showResults(result);
	});
	$('#connectToFacebook').addClass('working');
	$('#connectToFacebook').val("");

	changeProgressText('Crunching');

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
  }, (v-store)*20, function() {
  });
}

function showResults(result){
	//scroll down page
	$('#resultslink').click();
	makeLoveTable(result);
	makeLoveGraph(result);
	makeHateTable(result);
	makeLoveGraph(result);
}