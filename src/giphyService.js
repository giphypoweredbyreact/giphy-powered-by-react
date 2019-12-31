export function fetchGifs(search, offset) {
  console.log('abc');
  return fetch("https://api.giphy.com/v1/gifs/search?q=" + search + "&api_key=pJh3bSaDpSVv2HFpLGs6U1Zy6VA3Amcs&limit=12&offset=" + offset)
  .then(response => response.json())
}