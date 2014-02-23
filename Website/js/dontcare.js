var ondone = null;
var ls = null;
function processDontCare(likescores, callback) {
  ondone = callback;
  ls = likescores;
  FB.api('/me/friends/?limit=2000', processFriends);
};

function processFriends(resp) {
  var friends = resp.data;
  var dc = {};
  for (var i = 0; i < friends.length; i++) {
    if (typeof ls[friends[i].id] == "undefined")
      dc[friends[i].id] = friends[i].name;
  }
  ondone(dc);
}