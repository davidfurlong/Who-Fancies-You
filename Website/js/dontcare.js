var ondone = null;
var ls = null;
var mutfriends = {};
var largest = 0;
var pdone = false;
var numProc = 0;
function processDontCare(likescores, callback) {
  ondone = callback;
  ls = likescores;
  FB.api('/me/friends/?limit=2000', processFriends);
};

function processFriends(resp) {
  var friends = resp.data;
  var count = 0;
  for (var i = 0; i < friends.length; i++) {
    if (typeof ls[friends[i].id] == "undefined") {
      numProc += 1;
      count += 1;
      FB.api('/me/mutualfriends/' + friends[i].id, function(r) { 
        mutfriends[friends[i].id] = { id: friends[i].id, name:friends[i].name, score: r.data.length };
        if(r.data.length > largest)
          largest = r.data.length;
        numProc -= 1;
        checkDone();
      });
      if(count == 30)
        break;
    }
  }
  pdone = true;
  checkDone();
}


function checkDone() {
  console.log(pdone)
  if(pdone && numProc == 0) {
    for(i in mutfriends) {
      mutfriends[i].score = (1 - mutfriends[i].score / largest) * 4 - 3.1; //yay random contants
    }
    ondone(mutfriends);
  }
}