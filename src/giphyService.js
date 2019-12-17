export function requestGiphyAPI() {
  var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=hello&api_key=pJh3bSaDpSVv2HFpLGs6U1Zy6VA3Amcs&limit=5");
  xhr.done(function(data) { 
    console.log("success got data", data); 
    return data;
  });

}