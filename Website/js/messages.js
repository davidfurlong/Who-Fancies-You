// Look at your last 500 messages and rank friends based upon num of messages, average reply time, and positive terms in the messages
var friendmap = {};

function calculateMessageScore() {
  console.log('Fetching message score information');
  FB.api('/me/outbox/?limit='+limit, processMessages);
};

function processMessages(response) {
  var messages = response.data;
  console.log(messages);
  if(typeof messages == "undefined") return;
    for (var i = 0; i < messages.length; i++) {
      var message = messages[i];
      if (countPeople(message) == 2) { //only parse messages between two people. #nothreesomes
        if(typeof message.comments != "undefined") {
          console.log(message.comments.paging);
          processPaging(message.comments.paging, cb);
          //console.log(message.comments.paging.next)
        }
      }
    }
};

function cb(resp) {
  console.log(resp);
};

function countPeople(message) {
	return message.to.data.length;
};