// Look at your last 500 messages rank friends based upon positive terms in the messages, who initiated conversations and [not implemented] num of messages, average reply time
//#noideahowthisworks

var friendsmileymap = {};
var friendcharmap = {};

var friendscoremap = {};

var friendconvsstarted = {}
var friendconvtotal = {};

var friendcovscore = {};

var certainty = 0;

var friendmap = {};

var ondone = null;

function calculateMessageScore(callback) {
  ondone = callback;
  FB.api('/me/?fields=id', function(r) { myId = r.id; FB.api('/me/outbox/?limit='+limit + '&since=' + oneYearAgo , processMessages); });
};

var myId = "";
var totalSmileys = 0;
var totalMessagesProcessed = 0;
var procsgoing = 0;
var done = false;

function processMessages(response) {
  var messages = response.data;
  if(typeof messages == "undefined") return;
  for (var i = 0; i < messages.length; i++) {
    var message = messages[i];
    if (countPeople(message) == 2) { //only parse messages between two people. #nothreesomes
      processConversation(message);
    }
  }
  done = true;
  procsgoing += 1;
  procDone();
};

function procDone() {
  procsgoing -= 1;
  if(done && procsgoing == 0) {
    var largest = 0;

    var clargest = 0;
    for (var i in friendconvsstarted) {
      if(friendconvtotal[i] > 5 && i != myId) {
        friendcovscore[i] = (friendconvsstarted[i] / friendconvtotal[i]) + friendconvtotal[i] / totalMessagesProcessed;
        if(friendcovscore[i] > clargest)
          clargest = friendcovscore[i];
      }
    }

    if(clargest != 0) {
      for (var i in friendcovscore) {
        friendcovscore[i] = friendcovscore[i] / clargest;
      }
    }

    for (var i in friendsmileymap) {
      if(i == myId)
        continue;
      friendscoremap[i] = (friendsmileymap[i] / friendcharmap[i]) * ((friendconvtotal[i] + 10) / (totalMessagesProcessed + 10));
      if(friendscoremap[i] > largest)
        largest = friendscoremap[i];
    }

    if(totalSmileys > 50 && totalMessagesProcessed > 200)
      certainty = ((totalSmileys - 50) / totalSmileys + (totalMessagesProcessed - 200) / totalMessagesProcessed) * 0.5;
    else
      certainty = 0;
    //normalise
    if(largest != 0) {
      for (var i in friendsmileymap) {
        friendscoremap[i] = {name: friendmap[i], score: (friendscoremap[i] / largest)};
      }
    }

    for (var i in friendsmileymap) {
      if(typeof friendcovscore[i] != "undefined") {
        friendscoremap[i].score = (friendscoremap[i].score + friendcovscore[i]) / 2;
        if(isNaN(friendscoremap[i].score))
          friendscoremap[i].score = 0;
      }
      else {
        friendscoremap[i].score = friendscoremap[i].score * 2 / 3; //reduce it a bit
        if(isNaN(friendscoremap[i].score))
          friendscoremap[i].score = 0;
      }
    }

    ondone(friendscoremap,certainty);
  }
}

function processConversation(conv) {
  processMessage(conv.from,conv.message); //the first message
  if(typeof conv.comments == "undefined")
    return;
  processComments(conv.comments);
  procsgoing += 2;
  processPaging(conv.comments.paging, processComments);
}

function processComments(comments)
{
  var obj = comments.data;
  var prevdate = null;
  for (var i = 0; i < obj.length; i++) {
    var newDate = new Date(obj[i].created_time);


    if(prevdate != null) {
      var tstart = friendconvtotal[comment.from.id];
      if (typeof tstart == "undefined") {
        tstart = 0;
      }

      friendconvtotal[comment.from.id] = tstart + 1;


        var timediff = newDate - prevdate;
        if(timediff > 50000000) {

          var cstart = friendconvsstarted[comment.from.id];
          if (typeof cstart == "undefined") {
            cstart = 0;
          }

          friendconvsstarted[comment.from.id] = cstart + 1;
        }
    }
    var comment = obj[i];
    processMessage(comment.from,comment.message)
    prevdate = newDate;
  }
  procDone();
}

function processMessage(from,message) {
  if(typeof friendmap[from.id] == "undefined") {
    friendmap[from.id] = from.name;
  }
  if(from.id != myId)
    totalMessagesProcessed += 1;

  var pcount = friendcharmap[from.id];
  changeProgressText(from.name);
  if (typeof pcount == "undefined") {
    pcount = 0;
  }

  if (typeof message != "undefined") 
    friendcharmap[from.id] = pcount + message.length;

  var scount = friendsmileymap[from.id];
  if (typeof scount == "undefined") {
    scount = 0;
  }
  friendsmileymap[from.id] = scount + countSmileys(message);
}

function countPeople(message) {
	return message.to.data.length;
};

function countSmileys(str) {
  if(typeof str == "undefined") return 0;
  var res = str.match(/((:|;)(-|)(D|\)|P)|<3|xxx|xx|love|good|nice|happy|haha)/g);
  if(res == null) return 0;
  totalSmileys += res.length;
  return res.length;
}
