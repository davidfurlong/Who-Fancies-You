// Look at your last 500 messages rank friends based upon positive terms in the messages, who initiated conversations: not implemented [num of messages, average reply time]
var friendsmileymap = {};
var friendcharmap = {};

var friendscoremap = {};
var certainty = 0;

var ondone = null;

function calculateMessageScore(callback) {
  ondone = callback;
  console.log('Fetching message score information');
  FB.api('/me/?fields=id', function(r) { myId = r.id; FB.api('/me/outbox/?limit='+limit, processMessages); });
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
    console.log("ready to compute!");
    largest = 0;
    for (var i in friendsmileymap) {
      friendscoremap[i] = friendsmileymap[i] / friendcharmap[i];
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
        friendscoremap[i] = friendscoremap[i] / largest;
      }
    }
    ondone(friendscoremap,certainty);
  }
  else
  {
    if(done)
    console.log("not ready - still waiting on " + procsgoing + "processes");
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
  for (var i = 0; i < obj.length; i++) {
    var comment = obj[i];
    processMessage(comment.from,comment.message)
  }
  procDone();
}

function processMessage(from,message) {
  //console.log(message);
  totalMessagesProcessed += 1;

  var pcount = friendcharmap[from.id];
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
