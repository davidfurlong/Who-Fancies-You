// Make Tables and Graphs

function makeLoveTable(result){
	var i = result.length;
	var t = 0;
	if(i>0) t = result[0].score;

	for(var iter=0;iter<8;iter++){
		if(iter==0 || result[iter].score>0.10){
			var prob = "";
			var v = result[iter].score;
			if(v>0.75) prob = "Obsessed";
			else if(v>0.55) prob = "Very Likely";
			else if(v>0.35) prob = "Likely";
			else if(v>0.20) prob = "Perhaps";
			else prob = "Unlikely";

			$('#loveTable table').append('<tr><td><img class="person-pic" src="http://graph.facebook.com/' 
				+ result[iter].id+'/picture?type=square&width=200&height=200"/></td><td>'  
				+ result[iter].name+'</td><td>' + prob + '</td><td>' + (100 * v).toFixed(0) + '%</td></tr>');	
		}
	}
}
function makeLoveGraph(result){

	var d = [];
	for(var i=0;i<result.length;i++){
		if(isNaN(result[i].score))
			d.push((0).toFixed(3));
		else
			d.push((100*result[i].score).toFixed(3));
	}
	d = d.reverse();

	var dnew = [0,0,0,0,0,0,0,0,0,0];
	var j = 0;
	var k = 0;
	var c = 0;
	while(j<d.length){
		k = j;

		while(c*10<=parseInt(d[k]) && parseInt(d[k])<((c*10)+10) && k<d.length){
			dnew[c]=dnew[c]+1;
			k++;
		}
		c++;
		j = k;
		j++;
	}

	var w = $('#loveGraph').width();
	var newG = $.parseHTML('<canvas id="myChart" width="'+w+'" height="260" style="margin-top:40px"></canvas>');
	$('#loveGraph').append(newG);
	//var ctx = newG.get(0).getContext("2d");
	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myChart").get(0).getContext("2d");
	//This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);
	var data = {
		labels : ["0","10","20","30","40","50","60","70","80","90","100"],
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : dnew
			}
		]
	}
	new Chart(ctx).Line(data,{bezierCurve:false,pointDot:false,scaleShowGridLines : false});
}
function makeHateTable(result){
	var i = result.length;
	var t = 0;
	if(i>0) t = result[0].score;

	console.log(x=result);

	for(var iter=0;iter<8;iter++){
		if(iter==0 || result[iter].score>=0.10){
			var prob = "";
			var v = result[iter].score;
			if(v>0.75) prob = "Loathes you";
			else if(v>0.55) prob = "Hates you";
			else if(v>0.35) prob = "Dislike you";
			else if(v>0.20) prob = "Them Guts";
			else prob = "Perhaps?";

			$('#hateTable table').append('<tr><td><img class="person-pic" src="http://graph.facebook.com/' 
				+ result[iter].id+'/picture?type=square&width=200&height=200"/></td><td>'  
				+ result[iter].name+'</td><td>' + prob + '</td><td>' + (100 * v).toFixed(0) + '%</td></tr>');	
		}
	}
}
function makeHateGraph(result){

	var d = [];
	for(var i=0;i<result.length;i++){
		if(isNaN(result[i].score))
			d.push((0).toFixed(3));
		else
			d.push((100*result[i].score).toFixed(3));
	}
	d = d.reverse();

	var dnew = [0,0,0,0,0,0,0,0,0,0];
	var j = 0;
	var k = 0;
	var c = 0;
	while(j<d.length){
		k = j;

		while(c*10<=parseInt(d[k]) && parseInt(d[k])<((c*10)+10) && k<d.length){
			dnew[c]=dnew[c]+1;
			k++;
		}
		c++;
		j = k;
		j++;
	}

	var w = $('#hateGraph').width();
	var newG = $.parseHTML('<canvas id="myCharts" width="'+w+'" height="260" style="margin-top:40px"></canvas>');
	$('#hateGraph').append(newG);
	//var ctx = newG.get(0).getContext("2d");
	//Get context with jQuery - using jQuery's .get() method.
	var ctx = $("#myCharts").get(0).getContext("2d");
	//This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);
	var data = {
		labels : ["0","10","20","30","40","50","60","70","80","90","100"],
		datasets : [
			{
				fillColor : "rgba(151,187,205,0.5)",
				strokeColor : "rgba(151,187,205,1)",
				pointColor : "rgba(151,187,205,1)",
				pointStrokeColor : "#fff",
				data : dnew
			}
		]
	}
	new Chart(ctx).Line(data,{bezierCurve:false,pointDot:false,scaleShowGridLines : false});
}