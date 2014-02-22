function processPhotos(callback) {

  FB.api('/me/photos/?limit=500', function(response) {
    var uidToLikeCount = {};
    var photos = response.data;
    var photoCount = photos.length;
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
          var count = uidToLikeCount[like.id];
          if (!taggedIds[like.id]) {
            if (typeof count != "undefined") {
              uidToLikeCount[like.id] = count + 1;
            } else {
              uidToLikeCount[like.id] = 1;
            }
          }
        });
      }
    });

    var uidToLikeProbability = {};
    if (photoCount > 0) {
      _.each(uidToLikeCount, function(likeCount, uid) {
        uidToLikeProbability[uid] = likeCount / photoCount;
      })
    }

    console.log(photoCount + " photos processed");

    callback(uidToLikeProbability);
  });
}
