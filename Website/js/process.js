function whoLikesMe(callback) {
  var POSTS_WEIGHT = 1;
  var PHOTOS_WEIGHT = 1;
  var MESSAGES_WEIGHT = 1;
  var STATUSES_WEIGHT = 0.4;
  var MAX_SCORE = PHOTOS_WEIGHT + MESSAGES_WEIGHT + STATUSES_WEIGHT;

  var progress = 0;

  var results = [];
  var latch = new Latch(3, function() {
    progress = 5;
    changeProgressValue(progress);

    var result = _.reduce(results, function(m1, c2) {
      return mergeCollections(m1, c2.map, c2.weight);
    }, {});

    var entryList = mapToList(result);
    var sortedList = _.sortBy(entryList, function(entry) {
      return -entry.score;
    })

    var normalisedList = [];
    if (sortedList.length > 0) {
      var maxScore = sortedList[0].score;
      if (maxScore > 0) {
        normalisedList = _.map(sortedList, function(entry) {
          return {
            id: entry.id,
            name: entry.name,
            score: entry.score / MAX_SCORE,
          }
        });
      } else {
        normalisedList = sortedList;
      }
    }

    progress = 100;
    changeProgressValue(progress);
    callback(normalisedList);
  });

  processStatuses(function(result) {
    results.push({map: result, weight: STATUSES_WEIGHT});
    console.log("Statuses returned");
    progress += 20;
    changeProgressValue(progress);
    latch.complete();
  });
  processPhotos(function(result) {
    results.push({map: result, weight: PHOTOS_WEIGHT});
    console.log("Photos returned");
    progress += 20;
    changeProgressValue(progress);
    latch.complete();
  });
  calculateMessageScore(function(result, certainty) {
    results.push({map: result, weight: MESSAGES_WEIGHT});
    console.log("Messages returned");
    progress += 20;
    changeProgressValue(progress);
    latch.complete();
  });
}

function mergeCollections(c1, c2, weight) {
  var result = c1;
  _.each(c2, function(value, key) {
    if (typeof c1[key] != "undefined") {
      result[key].score = c1[key].score + value.score * weight;
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