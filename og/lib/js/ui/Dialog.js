import { getDefault, stringTemplate } from '../utils/shared';
import { Button } from './Button';
import { CLOSE_ICON } from './icons';
import { View } from './View';
const DIALOG_EVENTS = ["resize", "focus", "visibility", "dragstart", "dragend"];
const TEMPLATE = `<div class="og-ddialog" 
        style="display:{display}; resize:{resize}; width: {width}px; {height}; top: {top}px; left: {left}px; min-height: {minHeight}; max-height: {maxHeight}; min-width: {minWidth}; max-width: {maxWidth};">
       <div class="og-ddialog-header">
         <div class="og-ddialog-header__title">{title}</div>      
         <div class="og-ddialog-header__buttons"></div>      
        </div>
       <div class="og-ddialog-container"></div>
    </div>>`;
class Dialog extends View {
    constructor(options = {}) {
        super({
            template: stringTemplate(TEMPLATE, {
                title: options.title || "",
                display: getDefault(options.visible, true) ? "flex" : "none",
                resize: getDefault(options.resizable, true) ? "both" : "none",
                width: options.width || 300,
                height: options.height ? `height: ${options.height || 200}px` : "",
                left: options.left || 0,
                top: options.top || 0,
                minHeight: options.minHeight ? `${options.minHeight}px` : 'unset',
                maxHeight: options.maxHeight ? `${options.maxHeight}px` : 'unset',
                minWidth: options.minWidth ? `${options.minWidth}px` : 'unset',
                maxWidth: options.maxWidth ? `${options.maxWidth}px` : 'unset',
            }),
            ...options
        });
        this._onCloseBtnClick = () => {
            this.close();
        };
        this._onMouseDownAll = () => {
            this.bringToFront();
        };
        this._onMouseDown = (e) => {
            e.preventDefault();
            this._startDragging();
            this._startPosX = e.clientX;
            this._startPosY = e.clientY;
            document.addEventListener("mousemove", this._onMouseMove);
            document.addEventListener("mouseup", this._onMouseUp);
        };
        this._onMouseMove = (e) => {
            e.preventDefault();
            let dx = this._startPosX - e.clientX;
            let dy = this._startPosY - e.clientY;
            this._startPosX = e.clientX;
            this._startPosY = e.clientY;
            this.setPosition(this.el.offsetLeft - dx, this.el.offsetTop - dy);
        };
        this._onMouseUp = () => {
            this._clearDragging();
            document.removeEventListener("mouseup", this._onMouseUp);
            document.removeEventListener("mousemove", this._onMouseMove);
        };
        //@ts-ignore
        this.events = this.events.registerNames(DIALOG_EVENTS);
        this._startPosX = 0;
        this._startPosY = 0;
        this.$header = null;
        this.$title = null;
        this.$container = null;
        this.$buttons = null;
        this._closeBtn = new Button({
            icon: CLOSE_ICON,
            classList: ["og-button-size__20"]
        });
        this.useHide = options.useHide || false;
        this._visibility = getDefault(options.visible, true);
    }
    setContainer(htmlStr) {
        this.$container.innerHTML = htmlStr;
    }
    get container() {
        return this.$container;
    }
    get width() {
        return this.el ? parseFloat(this.el.style.width) : 0;
    }
    get height() {
        return this.el ? parseFloat(this.el.style.height) : 0;
    }
    bringToFront() {
        this.el.style.zIndex = String(Dialog.__zIndex__++);
    }
    render(params) {
        super.render(params);
        this.bringToFront();
        this.$header = this.select(".og-ddialog-header");
        this.$title = this.select(".og-ddialog-header__title");
        this.$container = this.select(".og-ddialog-container");
        this.$buttons = this.select(".og-ddialog-header__buttons");
        this._initEvents();
        this._initButtons();
        return this;
    }
    show() {
        if (!this._visibility) {
            this._visibility = true;
            this.el.style.display = "flex";
            this.bringToFront();
            this.events.dispatch(this.events.visibility, true, this);
        }
    }
    hide() {
        if (this._visibility) {
            this._visibility = false;
            this.el.style.display = "none";
            this.events.dispatch(this.events.visibility, false, this);
        }
    }
    close() {
        if (this.useHide) {
            this.hide();
        }
        else {
            this.remove();
        }
    }
    setVisibility(visibility) {
        if (visibility) {
            this.show();
        }
        else {
            this.hide();
        }
    }
    _initButtons() {
        this._closeBtn.events.on("click", this._onCloseBtnClick);
        this._closeBtn.appendTo(this.$buttons);
    }
    _initEvents() {
        this.$header.addEventListener("mousedown", this._onMouseDown);
        this.el.addEventListener("mousedown", this._onMouseDownAll);
    }
    setPosition(x, y) {
        if (x != undefined) {
            this.el.style.left = `${x}px`;
        }
        if (y != undefined) {
            this.el.style.top = `${y}px`;
        }
    }
    _startDragging() {
        if (!this.el.classList.contains("dragging")) {
            this.el.classList.add("dragging");
            this.events.dispatch(this.events.dragstart, this);
        }
    }
    _clearDragging() {
        if (this.el.classList.contains("dragging")) {
            this.events.dispatch(this.events.dragend, this);
            this.el.classList.remove("dragging");
        }
    }
    remove() {
        this._clearDragging();
        this._clearEvents();
        super.remove();
    }
    _clearEvents() {
        this._closeBtn.events.off("click", this._onCloseBtnClick);
        document.removeEventListener("mouseup", this._onMouseUp);
        document.removeEventListener("mousemove", this._onMouseMove);
        this.$header.removeEventListener("mousedown", this._onMouseDown);
        this.el.removeEventListener("mousedown", this._onMouseDownAll);
    }
}
Dialog.__zIndex__ = 0;
export { Dialog };
