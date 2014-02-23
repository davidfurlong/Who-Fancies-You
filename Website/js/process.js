function whoLikesMe(callback) {
  var POSTS_WEIGHT = 1;
  var PHOTOS_WEIGHT = 1;
  var MESSAGES_WEIGHT = 1;
  var STATUSES_WEIGHT = 1;

  var results = [];
  var latch = new Latch(3, function() {
    var result = _.reduce(results, function(m1, c2) {
      return mergeCollections(m1, c2.map, c2.weight);
    }, {});

    var entryList = mapToList(result);
    var sortedList = _.sortBy(entryList, function(entry) {
      return -entry.score;
    })
    callback(sortedList);
  });

  processStatuses(function(result) {
    results.push({map: result, weight: STATUSES_WEIGHT});
    console.log("Statuses returned");
    latch.complete();
  });
  processPhotos(function(result) {
    results.push({map: result, weight: PHOTOS_WEIGHT});
    console.log("Photos returned");
    latch.complete();
  });
  calculateMessageScore(function(result, certainty) {
    results.push({map: result, weight: MESSAGES_WEIGHT});
    console.log("Messages returned");
    latch.complete();
  });
}

function mergeCollections(c1, c2, weight) {
  var result = c1;
  _.each(c2, function(value, key) {
    if (typeof c1[key] != "undefined") {
      result[key].score = c1[key] + value.score * weight;
    } else {
      result[key] = {name: value.name};
      result[key].score = value.score * weight;
    }
  });
  return result;
}

function mapToList(map) {
  var entryList = [];
  _.each(map, function(value, key) {
    entryList.push({id: key, name: value.name, score: value.score});
  });
  return entryList;
}