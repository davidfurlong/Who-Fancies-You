function processStatuses(callback) {

  FB.api('/me/statuses/?limit=100', function(response) {
    var uidToLikeCount = {};
    var statuses = response.data;
    var statusCount = statuses.length;
    _.each(statuses, function(status) {
      var likes = status.likes;
      if (typeof likes != "undefined") {
        _.each(likes.data, function(like) {
          var count = uidToLikeCount[like.id];
          if (typeof count != "undefined") {
            uidToLikeCount[like.id] = count + 1;
          } else {
            uidToLikeCount[like.id] = 1;
          }
        });
      }
    });

    var uidToLikeProbability = {};
    if (statusCount > 0) {
      _.each(uidToLikeCount, function(likeCount, uid) {
        uidToLikeProbability[uid] = likeCount / statusCount;
      })
    }

    callback(uidToLikeProbability);
  });
}
