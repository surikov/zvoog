type ZoomMainMenuItem = {
	label: string;
	power: number;
	subpadding: boolean;
	action: () => void;
};
type ZoomSubSubMenuItem = {
	label: string;
	action?: () => void;
};
type ZoomSubMenuItem = {
	label: string;
	action?: () => void;
	subSubMenu: ZoomSubSubMenuItem[];
};
type ZoomMenuItem = {
	label: string;
	action?: () => void;
	subMenu: ZoomSubMenuItem[];
};
class ZvoogPopup {
	app: ZvoogApp;
	constructor(app: ZvoogApp) {
		this.app = app;
	}
	showPopupMenu(x: number, y: number, z: number, w: number, size: number, items: ZoomMenuItem[]): void {
		this.app.popupMenuGroup.content.length = 0;
		this.app.popupMenuGroup.ww = this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize;
		this.app.popupMenuGroup.hh = this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize;
		this.app.popupMenuGroup.content.push({
			x: 0, y: 0, w: this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize
			, h: this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize
			, css: 'fog', action: this.closePopupMenu.bind(this)
		});
		this.app.popupMenuGroup.content.push({ x: size + x, y: size + y, w: w, h: items.length * size * 2, css: 'popupFill' });
		for (var i = 0; i < items.length; i++) {
			this.app.addMainTextButton(size + x, size + y + i * 2 * size, 2 * size, items[i].label
				, 'fontSize' + size, this.app.popupMenuGroup.content
				, this.createDoItem(items[i], 2 * size + x, 2 * size + y + i * 2 * size, w, size)
			);
		}
		this.app.tileLevel.redrawAnchor(this.app.popupMenuGroup);
		this.app.tileLevel.startSlideTo(-x * this.app.tileLevel.tapSize, -y * this.app.tileLevel.tapSize, z, null);
	}
	showPopupSubMenu(x: number, y: number, w: number, size: number, items: ZoomSubMenuItem[]): void {
		this.app.popupSubMenuGroup.content.length = 0;
		this.app.popupSubMenuGroup.ww = this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize;
		this.app.popupSubMenuGroup.hh = this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize;
		this.app.popupSubMenuGroup.content.push({
			x: 0, y: 0, w: this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize
			, h: this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize
			, css: 'fog', action: this.closePopupSubMenu.bind(this)
		});
		this.app.popupSubMenuGroup.content.push({ x: size + x, y: size + y, w: w, h: items.length * size * 2, css: 'popupFill' });
		for (var i = 0; i < items.length; i++) {
			this.app.addMainTextButton(size + x, size + y + i * 2 * size, 2 * size, (items[i] as any).label, 'fontSize' + size
				, this.app.popupSubMenuGroup.content
				, this.createDoSubItem(items[i], 2 * size + x, 2 * size + y + i * 2 * size, w, size)
			);
		}
		this.app.tileLevel.redrawAnchor(this.app.popupSubMenuGroup);

	}
	showPopupSubSubMenu(x: number, y: number, w: number, size: number, items: ZoomSubSubMenuItem[]): void {
		this.app.popupSubSubMenuGroup.content.length = 0;
		this.app.popupSubSubMenuGroup.ww = this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize;
		this.app.popupSubSubMenuGroup.hh = this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize;
		this.app.popupSubSubMenuGroup.content.push({
			x: 0, y: 0, w: this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize
			, h: this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize
			, css: 'fog', action: this.closePopupSubSubMenu.bind(this)
		});
		this.app.popupSubSubMenuGroup.content.push({ x: size + x, y: size + y, w: w, h: items.length * size * 2, css: 'popupFill' });
		for (var i = 0; i < items.length; i++) {
			this.app.addMainTextButton(size + x, size + y + i * 2 * size, 2 * size, (items[i] as any).label, 'fontSize' + size
				, this.app.popupSubSubMenuGroup.content
				, this.createDoSubSubItem(items[i], 2 * size + x, 2 * size + y + i * 2 * size, w, size)
			);
		}
		this.app.tileLevel.redrawAnchor(this.app.popupSubSubMenuGroup);

	}
	closePopupMenu() {
		this.app.popupMenuGroup.content.length = 0;
		this.app.tileLevel.redrawAnchor(this.app.popupMenuGroup);
	}
	closePopupSubMenu() {
		this.app.popupSubMenuGroup.content.length = 0;
		this.app.tileLevel.redrawAnchor(this.app.popupSubMenuGroup);
	}
	closePopupSubSubMenu() {
		this.app.popupSubSubMenuGroup.content.length = 0;
		this.app.tileLevel.redrawAnchor(this.app.popupSubSubMenuGroup);
	}
	createDoSubSubItem(item: ZoomSubSubMenuItem, x: number, y: number, w: number, size: number): () => void {
		var me = this;
		return () => {
			me.closePopupSubSubMenu();
			me.closePopupSubMenu();
			me.closePopupMenu();
			if (item.action) item.action();
		};
	}
	createDoSubItem(item: ZoomSubMenuItem, x: number, y: number, w: number, size: number): () => void {
		var me = this;
		if (item.subSubMenu.length > 0) {
			return () => {
				me.showPopupSubSubMenu(x, y, w, size, item.subSubMenu);
			};
		} else {
			return () => {
				me.closePopupSubMenu();
				me.closePopupMenu();
				if (item.action) item.action();
			};
		}
	}
	createDoItem(item: ZoomMenuItem, x: number, y: number, w: number, size: number): () => void {
		var me = this;
		if (item.subMenu.length > 0) {
			return () => {
				me.showPopupSubMenu(x, y, w, size, item.subMenu);
			};
		} else {
			return () => {
				me.closePopupMenu();
				if (item.action) item.action();
			};
		}
	}
}