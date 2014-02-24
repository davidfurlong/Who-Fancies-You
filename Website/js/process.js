function whoLikesMe(callback) {
  var POSTS_WEIGHT = 1;
  var PHOTOS_WEIGHT = 0.5;
  var MESSAGES_WEIGHT = 1;
  var STATUSES_WEIGHT = 1;
  var MAX_SCORE = PHOTOS_WEIGHT + MESSAGES_WEIGHT + STATUSES_WEIGHT;

  var progress = 0;

  var results = [];
  var ihr;
  var latch = new Latch(3, function() {
    progress = 5;
    //changeProgressValue(progress);

    var result = _.reduce(results, function(m1, c2) {
      return mergeCollections(m1, c2.map, c2.weight);
    }, {});

    var entryList = mapToList(result);
    var sortedList = _.sortBy(entryList, function(entry) {
      return -entry.score;
    })

    var badResult = mergeCollections(result, ihr, 1);
    var badEntryList = mapToList(badResult);
    var badSortedList = _.sortBy(badEntryList, function(entry) {
      return entry.score;
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

    var badNormalisedList = [];
    if (badSortedList.length > 0) {
      var maxScore = badSortedList[0].score;
      if (maxScore > 0) {
        badNormalisedList = _.map(badSortedList, function(entry) {
          return {
            id: entry.id,
            name: entry.name,
            score: entry.score / (MAX_SCORE + 1),
          }
        });
      } else {
        badNormalisedList = badSortedList;
      }
    }

    progress = 100;
    //changeProgressValue(progress);
    callback(normalisedList, badNormalisedList);
  });

  processStatuses(function(result) {
    results.push({map: result, weight: STATUSES_WEIGHT});
    console.log("Statuses returned");
    progress += 20;
    changeProgressValue(50);
    latch.complete();
  });
  processPhotos(function(likeResult, inverseHateResult) {
    results.push({map: likeResult, weight: PHOTOS_WEIGHT});
    console.log("Photos returned");
    latch.complete();
    ihr = inverseHateResult;
    progress += 20;
    changeProgressValue(50);
  });
  calculateMessageScore(function(result, certainty) {
    console.log("Messages returned");
    results.push({map: result, weight: MESSAGES_WEIGHT});
    latch.complete();
    progress += 20;
    //changeProgressValue(progress);
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

function whoDoesntCare(likescores, callback) {
  processDontCare(likescores,function(res) {
    var dontcaresorted = _.sortBy(res, function(entry) {
      return entry.score;
    });
    callback(dontcaresorted);
  });
}