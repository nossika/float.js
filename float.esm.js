class Dot {
    constructor({
                    x = 0,
                    y = 0,
                    xV = 0,
                    yV = 0,
                    r = 0
                }){
        this.x = x;
        this.y = y;
        this.xV = xV;
        this.yV = yV;
        this.r = r;
    }
}

function jsonClone (target, source) { // cover target with source
    for (let item in source) {
        if (source[item] instanceof Object) {
            target[item] = target[item] instanceof Object
                ? target[item]
                : (Object.prototype.toString.call(source[item]) === '[object Array]' ? [] : {});
            jsonClone(target[item], source[item]);
        } else {
            target[item] = source[item];
        }
    }
};

function randomNum (source, precision = 1) { // get random Number in range
    return source[0] + Math.floor(Math.random() * ((source[1] - source[0]) * precision + 1)) / precision;
}

class Float {
    constructor (canvas, config = {}) {
        this._ctx = canvas.getContext('2d');
        this._mouseDot = null;
        this._dotList = new Set();
        this._config = Object.seal({
            clickDots: 3,
            maxDots: 20,
            createInterval: 500,
            dotRadius: [0.3, 1.5],
            dotSpeedRange: [1, 6],
            dotLinkDistance: 100,
            mousemoveEvent: true,
            clickEvent: true,
            borderExtend: 30,
            style: Object.seal({
                line: {r: 255, g: 255, b: 255},
                width: 0.6,
                dot: {r: 255, g: 255, b: 255, a: 1},
            })
        });
        jsonClone(this._config, config);

        this.setSize();
        this.bindEvent();
        this.autoAddDot(this._config.maxDots);
        this.suspend();
        this.resume();
    }


    bindEvent () {
        let events = [];
        if (this._config.clickEvent) events.push('click');
        if (this._config.mousemoveEvent) events.push('mousemove', 'mouseleave');
        if (this._events) {
            for (let event in this._events) {
                this._ctx.canvas.removeEventListener(event, this._events[event]);
            }
        }
        this._events = {};
        events.forEach((event) => {
            this._events[event] = this[event].bind(this);
            this._ctx.canvas.addEventListener(event, this._events[event]);
        });
    }

    mousemove (e) {
        let [x, y] = [e.offsetX, e.offsetY];
        if (!this._mouseDot) {
            this._mouseDot = new Dot({x: x, y: y});
            this._dotList.add(this._mouseDot);
            return;
        }
        this._mouseDot.x = x;
        this._mouseDot.y = y;
    }

    mouseleave (e) {
        this._dotList.delete(this._mouseDot);
        this._mouseDot = null;
    }

    click (e) {
        let [x, y] = [e.offsetX, e.offsetY];
        let n = this._config.clickDots;
        for (let i = 0; i < n; i++) {
            this._dotList.add(new Dot({
                x: x,
                y: y,
                xV: randomNum(this._config.dotSpeedRange, 100) * (Math.random() > 0.5 ? -1 : 1) / 10,
                yV:randomNum(this._config.dotSpeedRange, 100) * (Math.random() > 0.5 ? -1 : 1) / 10,
                r: randomNum(this._config.dotRadius, 100),
            }))
        }
    }

    resume () {
        cancelAnimationFrame(this._animatingId);
        let animation = () => {
            this.clear();
            this.render();
            this._animatingId = requestAnimationFrame(animation);
        };
        this._animatingId = requestAnimationFrame(animation);
    }

    suspend () {
        cancelAnimationFrame(this._animatingId);
    }
    unload () {
        cancelAnimationFrame(this._animatingId);
        this.clear();
    }
    update (dot) {
        let [top, right, bottom, left] = this._borders;
        dot.x = dot.x + dot.xV;
        dot.y = dot.y + dot.yV;
        if (dot.x < left || dot.x > right || dot.y < top || dot.y > bottom) {
            this._dotList.delete(dot);
            if (this._dotList.size > this._config.maxDots) return;
            this.addDot();
        }
    }

    render () {
        const tempList = new Set();
        const { _ctx } = this;
        this._dotList.forEach((dot) => {
            this.update(dot);
            if (!this._dotList.has(dot)) return;
            _ctx.beginPath();
            _ctx.moveTo(dot.x, dot.y);
            _ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
            _ctx.closePath();
            _ctx.fillStyle = `rgba(${this._config.style.dot.r},${this._config.style.dot.g},${this._config.style.dot.b},${1})`;
            _ctx.fill();
            tempList.forEach((otherDot) => {
                let dis = Math.pow(Math.pow(dot.x - otherDot.x, 2) + Math.pow(dot.y - otherDot.y, 2), 1 / 2);
                if (dis > this._config.dotLinkDistance) return;
                _ctx.beginPath();
                _ctx.moveTo(dot.x, dot.y);
                _ctx.lineTo(otherDot.x, otherDot.y);
                _ctx.closePath();
                _ctx.strokeStyle = `rgba(${this._config.style.line.r},${this._config.style.line.g},${this._config.style.line.b},${(1 - dis / this._config.dotLinkDistance) * 2})`;
                _ctx.lineWidth = this._config.style.width;
                _ctx.stroke();
            });
            tempList.add(dot);
        });
    }

    autoAddDot (num) {
        let interval = setInterval(() => {
            if (this._dotList.size > num) {
                clearInterval(interval);
                return;
            }
            this.addDot();
        }, this._config.createInterval);
    }

    addDot () {
        let [x, y, xV, yV] = [
            randomNum([0, this._ctxW]),
            randomNum([0, this._ctxH]),
            randomNum(this._config.dotSpeedRange, 100) * (Math.random() > 0.5 ? -1 : 1) / 10,
            randomNum(this._config.dotSpeedRange, 100) * (Math.random() > 0.5 ? -1 : 1) / 10
        ];
        switch (randomNum([0, 3])) {
            case 0:
                y = 0;
                yV = Math.abs(yV);
                break;
            case 1:
                x = this._ctxW;
                xV = -Math.abs(xV);
                break;
            case 2:
                y = this._ctxH;
                yV = -Math.abs(yV);
                break;
            case 3:
                x = 0;
                xV = Math.abs(xV);
                break;
        }

        this._dotList.add(new Dot({
            x,
            y,
            xV,
            yV,
            r: randomNum(this._config.dotRadius, 100)
        }));
    }

    setStyle (style) {
        style = JSON.parse(JSON.stringify(style));
        for (let prop in style) {
            this._config.style[prop] = style[prop];
        }
    }

    setSize () {
        const { _ctx } = this;
        if (!_ctx) return;
        this._ctxW = _ctx.canvas.offsetWidth;
        this._ctxH = _ctx.canvas.offsetHeight;
        _ctx.canvas.width = this._ctxW;
        _ctx.canvas.height = this._ctxH;
        this._borders = [
            0 - this._config.borderExtend,
            this._ctxW + this._config.borderExtend,
            this._ctxH + this._config.borderExtend,
            0 - this._config.borderExtend,
        ];
    }
    clear () {
        this._ctx.clearRect(0, 0, this._ctxW, this._ctxH);
    }
}

export default Float;