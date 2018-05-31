function accidentalZoomRender(left, top, width, height) {
	main.backgroundLayer.renderGroup(0, 0, 200, 200, 'test', left, top, width, height, function (tg) {
		tg.layer.tileRectangle(tg.g, tg.x , tg.y, tg.w, tg.h, '#ff0000');
	});
}
