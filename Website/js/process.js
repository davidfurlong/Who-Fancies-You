// Here we run a very simple test of the Graph API after login is successful. 
// This testAPI() function is only called in those cases. 
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me/posts/', function(response) {
    console.log(response)
  });
};


var limit = 10;

//Input: the "paging" node of the json and a callback accepting the responce from FB
function processPaging(pagingData, callback) {
  if(typeof pagingData == "undefined") return;
  if(typeof pagingData.next != "undefined") {
      $.ajax({
        url: pagingData.next,
        type: "get",
        success: callback,
        error:function(){
          console.log("Error processing paging")
        }
    });
  }
}