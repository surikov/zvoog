console.log('zvoog v2.02');
function composeUI(){
	console.log('composeUI');
	let layers:TileModelLayer[]=[{
		g: (document.getElementById('backGroundGroup') as any) as SVGElement,
		mode:  layerModeNormal,
		shift: 0,
		//viceversa: boolean;
		definition: [
			{
				id: '123123123'// = 'id'+Math.floor(Math.random()*1000000000)
				, draw: 'rectangle'
				, css: 'redbackground'
				, x: 0
				, y: 0
				, w: 3000
				, h: 500
				, action: function(x: number, y: number) {console.log('action');}
				, z: [1,1000]
				, scale: 1
				, rx: 0
				, ry: 0
				, x1: 0
				, x2: 0
				, y1: 0
				, y2: 0
				, text: 'txt'
				, points: ''//path definition
				, sub: [
					{
						id: '222333'// = 'id'+Math.floor(Math.random()*1000000000)
						, draw: 'rectangle'
						, css: 'redbackground'
						, x: 0
						, y: 0
						, w: 3000
						, h: 500
						, action: function(x: number, y: number) {console.log('action');}
						, z: [1,1000]
						, scale: 1
						, rx: 0
						, ry: 0
						, x1: 0
						, x2: 0
						, y1: 0
						, y2: 0
						, text: 'txt'
						, points: ''//path definition
						, sub: [
							
						]
					}
				]
			}
		]
	}];
	var tl:TileLevel=new TileLevel((document.getElementById('contentSVG') as any) as SVGElement
	,3000
	,500
	,1,100,1000
	,layers
	);
	tl.dump();
//backgroundLayer={};
}