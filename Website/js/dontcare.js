var ondone = null;
var ls = {};
var mutfriends = {};
var largest = 0;
var pdone = false;
var numProc = 0;
function processDontCare(likescores, callback) {
  ondone = callback;

  for(i in likescores) {
    ls[likescores[i].id] = 1;
  }

  FB.api('/me/friends/?limit=2000', processFriends);
};

function processFriends(resp) {
  var friends = resp.data;
  var count = 0;
  for (var i = 0; i < friends.length; i++) {
    if (typeof ls[friends[i].id] == "undefined") {
      numProc += 1;
      count += 1;
      FB.api('/me/mutualfriends/' + friends[i].id, mutFriend(friends[i].id, friends[i].name));
      if(count == 30)
        break;
    }
  }
  pdone = true;
  checkDone();
}

function mutFriend(iid,iname) {
    return function(r) { 
        mutfriends[iid] = { id: iid, name:iname, score: r.data.length };
        if(r.data.length > largest)
          largest = r.data.length;
        numProc -= 1;
        checkDone();
      }
};


function checkDone() {
  if(pdone && numProc == 0) {
    for(i in mutfriends) {
      mutfriends[i].score = (1 - mutfriends[i].score / largest) * 4 - 3.1; //yay random contants
    }
    ondone(mutfriends);
  }
}