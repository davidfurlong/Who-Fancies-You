var totalStatusLikes = 0;
var totalStatuses = 0;
function processStatuses(callback) {

  FB.api('/me/statuses/?limit=200&since=' + roughlyOneYearAgo, function(response) {
    var uidToLikeCount = {};
    var statuses = response.data;
    var statusCount = statuses.length;
    var maxScore = -1;
    _.each(statuses, function(status) {
      totalStatuses += 1;
      var likes = status.likes;
      if (typeof likes != "undefined") {
        totalStatusLikes += likes.data.length;
        _.each(likes.data, function(like) {
          if (typeof uidToLikeCount[like.id] != "undefined") {
            uidToLikeCount[like.id].score = uidToLikeCount[like.id].score + 1;
          } else {
            uidToLikeCount[like.id] = {name: like.name};
            uidToLikeCount[like.id].score = 1;
          }
          maxScore = Math.max(maxScore, uidToLikeCount[like.id].score);
        });
      }
    });

    var uidToLikeProbability = {};
    if (statusCount > 0) {
      _.each(uidToLikeCount, function(value, uid) {
        uidToLikeProbability[uid] = {name: value.name, score: value.score / maxScore};
      });

    }

    callback(uidToLikeProbability);
  });
}
