function whoLikesMe(callback) {
  var POSTS_WEIGHT = 1;
  var PHOTOS_WEIGHT = 1;
  var MESSAGES_WEIGHT = 1;
  var STATUSES_WEIGHT = 1;

  var results = [];
  var latch = new Latch(2, function() {
    var result = _.reduce(results, function(m1, c2) {
      return mergeCollections(m1, c2.map, c2.weight);
    }, {});
    
    var entryList = mapToList(result);
    var sortedList = _.sortBy(entryList, function(entry) {
      return -entry.value;
    })
    callback(sortedList);
  });

  processStatuses(function(result) {
    results.push({map: result, weight: STATUSES_WEIGHT});
    latch.complete();
  });
  processPhotos(function(result) {
    results.push({map: result, weight: PHOTOS_WEIGHT});
    latch.complete();
  });
}

function mergeCollections(c1, c2, weight) {
  var result = {};
  _.each(c2, function(value, key) {
    if (typeof c1[key] != "undefined") {
      result[key] = c1[key] + value * weight;
    } else {
      result[key] = value * weight;
    }
  });
  return result;
}

function mapToList(map) {
  var entryList = [];
  _.each(map, function(value, key) {
    entryList.push({key: key, value: value});
  });
  return entryList;
}