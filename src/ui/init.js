var currentVersion='3.0.1';
var main={};
console.log('init v'+currentVersion);
document.title = currentVersion;
var song=loadLastSong();
if(!(song)){
	song=createNewSong();
}
main.song=song;
main.tiler = new TileLevel("contentSVG", 'cntnt');
main.tiler.translateZ = 1;
main.backgroundLayer = main.tiler.addBaseLayer();
var accidentalZoomLevel=3;
var noteZoomLevel=9;
var measureZoomLevel=50;
var wholeZoomLevel=500;
main.tiler.addZoomLevel(accidentalZoomLevel, accidentalZoomRender);
main.tiler.resetAllLayersNow();
console.log('done init',main);
