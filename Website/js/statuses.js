function processStatuses(callback) {

  FB.api('/me/statuses/?limit=100', function(response) {
    var uidToLikeCount = {};
    var statuses = response.data;
    var statusCount = statuses.length;
    _.each(statuses, function(status) {
      var likes = status.likes;
      if (typeof likes != "undefined") {
        _.each(likes.data, function(like) {
          if (typeof uidToLikeCount[like.id] != "undefined") {
            uidToLikeCount[like.id].score = uidToLikeCount[like.id].score + 1;
          } else {
            uidToLikeCount[like.id] = {name: like.name};
            uidToLikeCount[like.id].score = 1;
          }
        });
      }
    });

    var uidToLikeProbability = {};
    if (statusCount > 0) {
      _.each(uidToLikeCount, function(value, uid) {
        uidToLikeProbability[uid] = {name: value.name, score: value.score / statusCount};
      });
    }

    callback(uidToLikeProbability);
  });
}
