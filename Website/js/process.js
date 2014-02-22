function whoLikesMe(callback) {
  var POSTS_WEIGHT = 1;
  var PHOTOS_WEIGHT = 1;
  var MESSAGES_WEIGHT = 1;
  var STATUSES_WEIGHT = 1;

  var scoreByUid = {};

  processStatuses(function(result) {
    scoreByUid = mergeCollections(scoreByUid, result, STATUSES_WEIGHT);

    var entryList = mapToList(scoreByUid);
    var sortedList = _.sortBy(entryList, function(entry) {
      return -entry.value;
    })
    callback(sortedList);
  });
}

function mergeCollections(c1, c2, weight) {
  _.each(c2, function(value, key) {
    if (typeof c1[key] != "undefined") {
      c1[key] = c1[key] + value * weight;
    } else {
      c1[key] = value * weight;
    }
  });
  return c1;
}

function mapToList(map) {
  var entryList = [];
  _.each(map, function(value, key) {
    entryList.push({key: key, value: value});
  });
  return entryList;
}