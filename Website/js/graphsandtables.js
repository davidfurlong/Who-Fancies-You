// Make Tables and Graphs

function makeLoveTable(result){
	var i = result.length;
	var t = 0;
	if(i>0) t = result[0].score;

	for(var iter=0;iter<5;iter++){
		if(iter==0 || result[iter].score>t/2){
			var prob = "";
			var v = result[iter].score;
			if(v>0.2) prob = "Very Likely";
			else if(v>0.15) prob = "Likely";
			else if(v>0.10) prob = "Perhaps";
			else prob = "Unlikely";
			$('#loveTable table').append('<tr><td><span height="auto" width="auto" class="person-pic-wrapper"><img class="person-pic" src="http://graph.facebook.com/'+result[iter].id+'/picture?type=square&width=200&height=200"/></span>'+result[iter].name+'</td><td>'+prob+'</td></tr>');	
		}
	}
}
function makeLoveGraph(result){
	//$('#loveGraph')
}
function makeHateTable(result){
	//$('#hateTable')
}
function makeHateGraph(result){
	//$('#hateGraph')
}