var lastProgressValue = 0;

function gearsGrinding(){
	whoLikesMe(function(result) {
	      	console.log("FINAL RESULT:");
	      	console.log(result);
	      	changeProgressValue(100);
    		showResults(result);

    		whoDoesntCare(result, function(r2) {
    			//r2 is who doesn't care
    			console.log("dont care:");
    			console.log(r2);
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
		  	}
	 	});
	}
}

function scrollToResults(){
	//scroll down page
	var pos = $('#w').position().top;
	var body = $("html, body");
	body.animate({scrollTop:pos}, '650', 'swing', function() { 
   		
	});
}

function showResults(result){
	


	makeLoveTable(result);
	makeLoveGraph(result);
	makeHateTable(result);
	makeHateGraph(result);
}