console.log('zvoog v2.02');
//tsc --target es5 tilelevel.ts zvoog.ts
function addZoomItem(){
	
}
function composeUI() {
	console.log('composeUI');

	let layers: (TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay)[] = [];
	var tl: TileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
		, 100
		, 100
		, 0.1, 10, 1000
		, layers
	);
	/*layers.push(
		{
			g: (document.getElementById('backGroundGroup') as any) as SVGElement,
			//mode: layerModeNormal,
			//shift: 0,
			groups: [
				{
					id: ''
					, css: ''
					, x: 0
					, y: 0
					, w: 3000
					, h: 500
					, action: null
					//, z: [0.1, 1001]
					, showZoom: 0.1
					, hideZoom: 1001
					, content: [
						{
							id: '', css: 'testred', x: 0, y: 0, w: 3000, h: 500, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0
							, action: function (x: number, y: number) { console.log('action red'); }
						}
						, {
							id: '', css: 'testblue', x: 0, y: 0, w: 100, h: 100, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0
							, action: function (x: number, y: number) { console.log('action blue'); }
						}
						, {
							id: '', css: 'testpurple', x: 3000 - 100, y: 0, w: 100, h: 100, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0
							, action: function (x: number, y: number) { console.log('action purple'); }
						}
						, {
							id: '', css: 'testgreen', x: 3000 - 100, y: 500 - 100, w: 100, h: 100, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0
							, action: function (x: number, y: number) { console.log('action green'); }
						}
						, {
							id: '', css: 'testyellow', x: 0, y: 500 - 100, w: 100, h: 100, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0
							, action: function (x: number, y: number) { console.log('action yellow'); }
						}
						, {
							id: '', css: 'onecm1', x: 0, y: 0, w: 1, h: 1, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0
							, action: function (x: number, y: number) { console.log('action 1'); }
						}
						, { id: '', css: 'testline', x1: 3000 - 20, y1: 20, x2: 20, y2: 500 - 20, showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext01', x: 0, y: 0.1, text: 'Test #01', showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext05', x: 0, y: 0.5, text: 'Test #05', showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext1', x: 0, y: 1, text: 'Test #1', showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext10', x: 0, y: 10, text: 'Test #10', showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext100', x: 0, y: 100, text: 'Test #100', showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext200', x: 0, y: 200, text: 'Test #200', showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext300', x: 0, y: 300, text: 'Test #300', showZoom: 0.1, hideZoom: 1001, action: null }
						, { id: '', css: 'testtext500', x: 0, y: 500, text: 'Test #500', showZoom: 0.1, hideZoom: 1001, action: null }
					]
				}
			]
		}
	);
	layers.push(
		{
			g: (document.getElementById('overlayGroup') as any) as SVGElement
			,overlay:1
			,groups: [{id: '', css: '', x: 0, y: 0, w: 3000, h: 500, action: null, showZoom: 0.1, hideZoom: 1001, content: [
				{id: '', css: 'testgreen', x: 0, y: 0, w: 1, h: 1, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0, action:null}
				, {id: '', css: 'testpurple', x: 0, y: 0,scale :0.3
					, points: 'M230.505,102.78c-0.365-3.25-4.156-5.695-7.434-5.695c-10.594,0-19.996-6.218-23.939-15.842 c-4.025-9.855-1.428-21.346,6.465-28.587c2.486-2.273,2.789-6.079,0.705-8.721c-5.424-6.886-11.586-13.107-18.316-18.498 c-2.633-2.112-6.502-1.818-8.787,0.711c-6.891,7.632-19.27,10.468-28.836,6.477c-9.951-4.187-16.232-14.274-15.615-25.101 c0.203-3.403-2.285-6.36-5.676-6.755c-8.637-1-17.35-1.029-26.012-0.068c-3.348,0.37-5.834,3.257-5.723,6.617 c0.375,10.721-5.977,20.63-15.832,24.667c-9.451,3.861-21.744,1.046-28.621-6.519c-2.273-2.492-6.074-2.798-8.725-0.731 c-6.928,5.437-13.229,11.662-18.703,18.492c-2.133,2.655-1.818,6.503,0.689,8.784c8.049,7.289,10.644,18.879,6.465,28.849 c-3.99,9.505-13.859,15.628-25.156,15.628c-3.666-0.118-6.275,2.345-6.68,5.679c-1.016,8.683-1.027,17.535-0.049,26.289 c0.365,3.264,4.268,5.688,7.582,5.688c10.07-0.256,19.732,5.974,23.791,15.841c4.039,9.855,1.439,21.341-6.467,28.592 c-2.473,2.273-2.789,6.07-0.701,8.709c5.369,6.843,11.537,13.068,18.287,18.505c2.65,2.134,6.504,1.835,8.801-0.697 c6.918-7.65,19.295-10.481,28.822-6.482c9.98,4.176,16.258,14.262,15.645,25.092c-0.201,3.403,2.293,6.369,5.672,6.755 c4.42,0.517,8.863,0.773,13.32,0.773c4.23,0,8.461-0.231,12.692-0.702c3.352-0.37,5.834-3.26,5.721-6.621 c-0.387-10.716,5.979-20.626,15.822-24.655c9.514-3.886,21.752-1.042,28.633,6.512c2.285,2.487,6.063,2.789,8.725,0.73 c6.916-5.423,13.205-11.645,18.703-18.493c2.135-2.65,1.832-6.503-0.689-8.788c-8.047-7.284-10.656-18.879-6.477-28.839 c3.928-9.377,13.43-15.673,23.65-15.673l1.43,0.038c3.318,0.269,6.367-2.286,6.768-5.671 C231.476,120.379,231.487,111.537,230.505,102.78z M115.616,182.27c-36.813,0-66.654-29.841-66.654-66.653 s29.842-66.653,66.654-66.653s66.654,29.841,66.654,66.653c0,12.495-3.445,24.182-9.428,34.176l-29.186-29.187 c2.113-4.982,3.229-10.383,3.228-15.957c0-10.915-4.251-21.176-11.97-28.893c-7.717-7.717-17.978-11.967-28.891-11.967 c-3.642,0-7.267,0.484-10.774,1.439c-1.536,0.419-2.792,1.685-3.201,3.224c-0.418,1.574,0.053,3.187,1.283,4.418 c0,0,14.409,14.52,19.23,19.34c0.505,0.505,0.504,1.71,0.433,2.144l-0.045,0.317c-0.486,5.3-1.423,11.662-2.196,14.107 c-0.104,0.103-0.202,0.19-0.308,0.296c-0.111,0.111-0.213,0.218-0.32,0.328c-2.477,0.795-8.937,1.743-14.321,2.225l0.001-0.029 l-0.242,0.061c-0.043,0.005-0.123,0.011-0.229,0.011c-0.582,0-1.438-0.163-2.216-0.94c-5.018-5.018-18.862-18.763-18.862-18.763 c-1.242-1.238-2.516-1.498-3.365-1.498c-1.979,0-3.751,1.43-4.309,3.481c-3.811,14.103,0.229,29.273,10.546,39.591 c7.719,7.718,17.981,11.968,28.896,11.968c5.574,0,10.975-1.115,15.956-3.228l29.503,29.503 C141.125,178.412,128.825,182.27,115.616,182.27z'
					, showZoom: 0.1, hideZoom: 1001, rx: 0, ry: 0, action:null}
				,{ id: '', css: 'testtext1', x: 0, y: 1, text: 'Overlay', showZoom: 0.1, hideZoom: 1001, action: null }
			]}]
		}
	);
	layers.push(
		{
			g: (document.getElementById('stickLeftGroup') as any) as SVGElement
			,stickLeft:5
			,groups: [{id: '', css: '', x: 0, y: 0, w: 3000, h: 500, action: null, showZoom: 0.1, hideZoom: 1001, content: [
				{ id: '', css: 'testtext100', x: 0, y: 100, text: 'Left 100', showZoom: 0.1, hideZoom: 1001, action: null }
			]}]
		}
	);
	layers.push(
		{
			g: (document.getElementById('stickRightGroup') as any) as SVGElement
			,stickRight:5
			,groups: [{id: '', css: '', x: 0, y: 0, w: 3000, h: 500, action: null, showZoom: 0.1, hideZoom: 1001, content: [
				{ id: '', css: 'testtext100', x: -300, y: 200, text: 'right 100', showZoom: 0.1, hideZoom: 1001, action: null }
			]}]
		}
	);
	layers.push(
		{
			g: (document.getElementById('stickTopGroup') as any) as SVGElement
			,stickTop:5
			,groups: [{id: '', css: '', x: 0, y: 0, w: 3000, h: 500, action: null, showZoom: 0.1, hideZoom: 1001, content: [
				{ id: '', css: 'testtext100', x: 100, y: 0, text: 'top 100', showZoom: 0.1, hideZoom: 1001, action: null }
			]}]
		}
	);
	layers.push(
		{
			g: (document.getElementById('stickBottomGroup') as any) as SVGElement
			,stickBottom:5
			,groups: [{id: '', css: '', x: 0, y: 0, w: 3000, h: 500, action: null, showZoom: 0.1, hideZoom: 1001, content: [
				{ id: '', css: 'testtext100', x: 500, y: 0, text: 'bottom 100', showZoom: 0.1, hideZoom: 1001, action: null }
			]}]
		}
	);*/
	let noteLineHeight: number = 0.5;
	let note32th120width: number = 0.5;
	let bgcontent: (TileGroup | TileRectangle | TileText | TilePath | TileLine)[] = [];
	layers.push(
		{
			g: (document.getElementById('backGroundGroup') as any) as SVGElement
			, groups: [{ xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight
				, action: null, showZoom: 0.1, hideZoom: 1001
				, content: bgcontent 
			}]
		}
	);
	
	layers.push(
		{
			g: (document.getElementById('buttonsGroup') as any) as SVGElement
			, groups: [{ xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight
				, action: null
				, showZoom: 1.5, hideZoom: 200
				, content: [{x: 44, y: 10, w: 8, h: 20, css:'zvoogSpot1', action(){
					/*let dx=(1.4*tl.viewWidth/tl.tapSize-8)/2;
					let dy=(1.4*tl.viewHeight/tl.tapSize-20)/2;
					console.log('click spot',dx,dy);
					tl.startSlideTo((dx-44)* tl.tapSize,(dy-10)* tl.tapSize,1.4,function(){console.log('done slide');})*/
					tl.startSlideCenter(44,10,1.4,8,20,function(){console.log('done slide');})
				}}]
			}]
		}
	);
	layers.push(
		{
			g: (document.getElementById('buttonsGroup') as any) as SVGElement
			, groups: [{ xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight
				, action: null
				, showZoom: 0.1, hideZoom: 1.5
				, content: [{x: 44, y: 10, w: 8, h: 20, css:'zvoogSpot1'}
							,{x:44,y:10,scale:1.1, dots:[0,0, 8,0, 8,20], css:'zvoogSpot1'}
				]
			}]
		}
	);
	//bgcontent.push({ id: '', css: 'zvoogBackgroundFill', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null });
	
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 64, hideZoom: 1001, content: [{ id: '', css: 'zvoogTile8', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText256', x: 0, y: 256, text: '64-256-1001', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 32, hideZoom: 512, content: [{ id: '', css: 'zvoogTile8', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText128', x: 0, y: 128, text: '32-128-512', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 16, hideZoom: 128, content: [{ id: '', css: 'zvoogTile8', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText64', x: 0, y: 64, text: '16-64-128', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 8, hideZoom: 64, content: [{ id: '', css: 'zvoogTile8', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{id: '', css: 'zvoogText32', x: 0, y: 32, text: '8-32-64', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 4, hideZoom: 32, content: [{ id: '', css: 'zvoogTile8', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText16', x: 0, y: 16, text: '4-16-32', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 2, hideZoom: 16, content: [{ id: '', css: 'zvoogTile4', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText8', x: 0, y: 8, text: '2-8-16',  action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 1, hideZoom: 8, content: [{ id: '', css: 'zvoogTile2', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText4', x: 0, y: 4, text: '1-4-8', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 0.5, hideZoom: 4, content: [{ id: '', css: 'zvoogTile1', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText2', x: 0, y: 2, text: '0.5-2-4', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 0.25, hideZoom: 2, content: [{ id: '', css: 'zvoogTile05', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText1', x: 0, y: 1, text: '0.25-1-2', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 0.125, hideZoom: 1, content: [{ id: '', css: 'zvoogTile25', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText05', x: 0, y: 0.5, text: '0.125-0.5-1', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 0.1, hideZoom: 0.5, content: [{ id: '', css: 'zvoogTile125', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{ id: '', css: 'zvoogText025', x: 0, y: 0.25, text: '0.1-0.25-0.5', action: null }]});
	bgcontent.push({id: '', css: '', xx: 0, yy: 0, ww: 200 * 32 * note32th120width, hh: (128 + 2) * noteLineHeight, action: null
		, showZoom: 0.1, hideZoom: 0.25, content: [{ id: '', css: 'zvoogTile625', x: 0, y: 0, w: 200 * 32 * note32th120width, h: (128 + 2) * noteLineHeight, rx: 0, ry: 0, action: null }
			,{  id: '', css: 'zvoogText0125', x: 0, y: 0.125, text: '0.1-0.125-0.25', action: null }]});
	
	tl.innerWidth = 200 * 32 * note32th120width * tl.tapSize;
	tl.innerHeight = (128 + 2) * noteLineHeight * tl.tapSize;
	tl.setModel(layers);
	//tl.dump();
	//backgroundLayer={};
}