var totalPhotoLikes = 0;

function processPhotos(callback) {

  FB.api('/me/photos/?limit=500&since=' + roughlyOneYearAgo, function(response) {
    var uidToLikeCount = {};
    var photos = response.data;
    var taggedCounts = {};    
    var photoCount = photos.length;
    var maxScore = 0;
    var maxTags = 0;
    _.each(photos, function(photo) {
      var tags = photo.tags;
      var taggedIds = {};
      if (typeof tags != "undefined") {
        _.each(tags.data, function(tag) {
          taggedIds[tag.id] = true;
          if (typeof taggedCounts[tag.id] != "undefined") {
            taggedCounts[tag.id].score = taggedCounts[tag.id].score + 1;
          } else {
            taggedCounts[tag.id] = {name: tag.name};
            taggedCounts[tag.id].score = 1;
          }
          maxTags = Math.max(maxTags, taggedCounts[tag.id].score);
        })
      }

      var likes = photo.likes;
      if (typeof likes != "undefined") {
        totalPhotoLikes += likes.data.length;
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
    var uidToTagProbability = {}
    if (photoCount > 0) {
      _.each(uidToLikeCount, function(value, uid) {
        uidToLikeProbability[uid] = {name: value.name, score: value.score / maxScore};
      });
      _.each(taggedCounts, function(value, uid) {
        uidToTagProbability[uid] = {name: value.name, score: value.score / maxTags};
      });
    }

    callback(uidToLikeProbability, taggedCounts);
  });
}