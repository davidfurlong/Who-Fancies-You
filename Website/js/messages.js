// Look at your last 500 messages and rank friends based upon num of messages, average reply time, and positive terms in the messages
var friendmap = {};

function calculateMessageScore() {
  console.log('Fetching message score information');
  FB.api('/me/?fields=id', function(r) { myId = r.id; FB.api('/me/outbox/?limit='+limit, processMessages); });
};

var myId = "";
var totalSmileys = 0;
var totalMessagesProcessed = 0;

function processMessages(response) {
  var messages = response.data;
  //console.log(messages);
  if(typeof messages == "undefined") return;
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      if (countPeople(message) == 2) { //only parse messages between two people. #nothreesomes
        processConversation(message);
      }
    }
};

function processConversation(conv) {
  processMessage(conv.from,conv.message); //the first message
  if(typeof conv.comments == "undefined")
    return;
  processComments(conv.comments);
  processPaging(conv.comments.paging, processComments);
}

function processComments(comments)
{
  var obj = comments.data;
  for (var i = 0; i < obj.length; i++) {
    var comment = obj[i];
    processMessage(comment.from,comment.message)
  }
}

function processMessage(from,message) {
  console.log(message);
  //totalMessagesProcessed += 1;
  scount = friendmap[from.id];
  if (typeof scount == "undefined") {
    scount = 0;
  }
  friendmap[from.id] = scount + countSmileys(message);
}

function countPeople(message) {
	return message.to.data.length;
};

function countSmileys(str) {
  if(typeof str == "undefined") return 0;
  var res = str.match(/((:|;)(-|)(D|\)|P)|<3|xxx|xx)/g);
  if(res == null) return 0;
  return res.length;
}