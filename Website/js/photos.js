function processPhotos(callback) {

  FB.api('/me/photos/?limit=500', function(response) {
    var uidToLikeCount = {};
    var photos = response.data;
    var photoCount = photos.length;
    var maxScore = -1;
    _.each(photos, function(photo) {
      var tags = photo.tags;
      var taggedIds = {};
      if (typeof tags != "undefined") {
        _.each(tags.data, function(tag) {
          taggedIds[tag.id] = true;
        })
      }

      var likes = photo.likes;
      if (typeof likes != "undefined") {
        _.each(likes.data, function(like) {
          if (!taggedIds[like.id]) {
            if (typeof uidToLikeCount[like.id] != "undefined") {
              uidToLikeCount[like.id].score = uidToLikeCount[like.id].score + 1;
            } else {
              uidToLikeCount[like.id] = {name: like.name};
              uidToLikeCount[like.id].score = 1;
            }
            maxScore = Math.max(maxScore, uidToLikeCount[like.id].score);
          }
        });
      }
    });

    var uidToLikeProbability = {};
    if (photoCount > 0) {
      _.each(uidToLikeCount, function(value, uid) {
        uidToLikeProbability[uid] = {name: value.name, score: value.score / maxScore};
      });
    }

    callback(uidToLikeProbability);
  });
}
