function processStatuses() {
  var nameToLikeCount = {};

  FB.api('/me/statuses/?limit=50', function(response) {
    console.log("Processing status response");
    var data = response.data;
    _.each(data, function(status) {
      var likes = status.likes;
      if (typeof likes != "undefined") {
        _.each(likes.data, function(like) {
          var count = nameToLikeCount[like.id];
          if (typeof count != "undefined") {
            nameToLikeCount[like.id] = count + 1;
          } else {
            nameToLikeCount[like.id] = 1;
          }
        });
      }
    });

    console.log(nameToLikeCount);

    var next = response.paging.next;
  });
}
