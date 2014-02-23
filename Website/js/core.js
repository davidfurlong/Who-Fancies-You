var lastProgressValue = 0;

function gearsGrinding(){
	whoLikesMe(function(result, badResult) {
	      	console.log("FINAL RESULT IS IN!");

    		whoDoesntCare(result, function(r2) {
    			//r2 is who doesn't care
                changeProgressValue(100);

                result = _.sortBy(result, function(entry) {
      				return -entry.score;
    			})

                showResults(result,r2);
    		})

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
	if(store<v){
		var c = 3*v;
		$('.ui-progress').animate({
	    	width:c
	  	}, (v-store)*20, function() {
		  	if(v>=100){
		  		changeProgressText("Complete");
		  		scrollToResults();
		  		$('#progress-text').show();
		  	}
	 	});
	}
}

function scrollToResults(){
	//scroll down page

	$("body").css("overflow","visible");
	var pos = $('#w').position().top;
	var body = $("html, body");
	body.animate({scrollTop:pos}, '650', 'swing', function() { 
   		
	});
}

function showResults(result,badresult){
    console.log(result);
    console.log(badresult);
	makeLoveTable(result);
	makeLoveGraph(result);
	makeHateTable(badresult);
	makeHateGraph(badresult);
}