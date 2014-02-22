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
    var limIndex = pagingData.next.indexOf("limit=");
    var limEnd = pagingData.next.indexOf("&",limIndex);
    var newUrl = pagingData.next.substr(0,limIndex+6) + limit + pagingData.next.substr(limEnd);
    //above - code to fix up the limit to be what we want.
    $.ajax({
      url: newUrl,
      type: "get",
      success: callback,
      error:function(){
        console.log("Error processing paging");
      }
    });
  }
}

function Latch(asyncCount, completionFunc) {
  this._asyncCount = asyncCount;
  this._completionFunc = completionFunc;
}
Latch.prototype.complete = function() {
  this._asyncCount--;
  if (this._asyncCount <= 0){
    this._completionFunc();
  }
};