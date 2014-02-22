function testStatuses() {
  FB.api('/me/statuses/', function(response) {
    console.log(response)
  });
}