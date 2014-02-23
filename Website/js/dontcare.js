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
      if(count == 50)
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
    var lar = 0;
    for(i in mutfriends) {
      mutfriends[i].score = Math.max((mutfriends[i].score / largest) * 2 - 1.1,0); // * 4 - 3.1; //yay random contants
      /*if (lar < mutfriends[i].score)
        lar = mutfriends[i].score;
      mutfriends[i].score = mutfriends[i].score / lar;*/
    }
    ondone(mutfriends);
  }
}