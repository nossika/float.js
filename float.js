(factory => {
    let root = (typeof self === 'object' && self.self === self && self) ||
        (typeof global === 'object' && global.global === global && global);
    if (typeof define === 'function' && define.amd) {
        define([], ()=> {
            root.Float = factory();
        });
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Float = factory();
    }
})(() => {

    let _config = Object.seal({
        dot_link: 100,
        dot_v: [1, 6],
        dot_click: 3,
        dot_max: 20,
        dot_create: 500,
        dot_r: [0.3, 1.5],
        on_mousemove: true,
        on_click: true,
        extend_border: 30,
        style: Object.seal({
            line: {r: 255, g: 255, b: 255},
            width: 0.6,
            dot: {r: 255, g: 255, b: 255, a: 1},
        })
    });

    let _style = _config.style;
    let _ctx, _ctx_w, _ctx_h, _mouse_dot, _dot_list, _animating_id, _borders;

    class Dot {
        constructor({
            x = 0,
            y = 0,
            v_x = 0,
            v_y = 0,
            r = 0
        }){
            this.x = x;
            this.y = y;
            this.v_x = v_x;
            this.v_y = v_y;
            this.r = r;
        }
    }

    let json_clone = (target, source) => { // cover target with source
        for (let item in source) {
            if (source[item] instanceof Object) {
                target[item] = target[item] instanceof Object
                    ? target[item]
                    : (Object.prototype.toString.call(source[item]) === '[object Array]' ? [] : {});
                json_clone(target[item], source[item]);
            } else {
                target[item] = source[item];
            }
        }
    };

    let get_num = (source, fixed = 1) => { // source could be Number or Array
        return source instanceof Array
            ? source[0] + Math.floor(Math.random() * ((source[1] - source[0]) * fixed + 1)) / fixed
            : source;
    };

    let Float = {

        init (canvas, config = {}) {
            _ctx = canvas.getContext('2d');
            _mouse_dot = null;
            _dot_list = new Set();
            json_clone(_config, config);
            Float.set_size();
            Float.bind_event();
            Float.auto_add_dot(_config.dot_max);
            Float.suspend();
            Float.resume();
        },

        bind_event () {
            let events = [];
            if (_config.on_click) events.push('click');
            if (_config.on_mousemove) events.push('mousemove', 'mouseleave');
            events.forEach((event) => {
                _ctx.canvas.removeEventListener(event, Float[`on_${event}`]);
                _ctx.canvas.addEventListener(event, Float[`on_${event}`]);
            });
        },

        on_mousemove (e) {
            let [x, y] = [e.offsetX, e.offsetY];
            if (!_mouse_dot) {
                _mouse_dot = new Dot({x: x, y: y});
                _dot_list.add(_mouse_dot);
                return;
            }
            _mouse_dot.x = x;
            _mouse_dot.y = y;
        },

        on_mouseleave (e) {
            _dot_list.delete(_mouse_dot);
            _mouse_dot = null;
        },

        on_click (e) {
            let [x, y] = [e.offsetX, e.offsetY];
            let n = get_num(_config.dot_click);
            for (let i = 0; i < n; i++) {
                _dot_list.add(new Dot({
                    x: x,
                    y: y,
                    v_x: get_num(_config.dot_v, 100) * (Math.random() > 0.5 ? -1 : 1) / 10,
                    v_y:get_num(_config.dot_v, 100) * (Math.random() > 0.5 ? -1 : 1) / 10,
                    r: get_num(_config.dot_r, 100),
                }))
            }
        },

        resume () {
            cancelAnimationFrame(_animating_id);
            let animation = () => {
                Float.clear();
                Float.render();
                _animating_id = requestAnimationFrame(animation);
            };
            _animating_id = requestAnimationFrame(animation);
        },

        suspend () {
            cancelAnimationFrame(_animating_id);
        },

        update (dot) {
            let [top, right, bottom, left] = _borders;
            dot.x = dot.x + dot.v_x;
            dot.y = dot.y + dot.v_y;
            if (dot.x < left || dot.x > right || dot.y < top || dot.y > bottom) {
                _dot_list.delete(dot);
                if (_dot_list.size > _config.dot_max) return;
                Float.add_dot();
            }
        },

        render () {
            let temp_list = new Set();
            _dot_list.forEach((dot) => {
                Float.update(dot);
                if (!_dot_list.has(dot)) return;
                _ctx.beginPath();
                _ctx.moveTo(dot.x, dot.y);
                _ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
                _ctx.closePath();
                _ctx.fillStyle = `rgba(${_style.dot.r},${_style.dot.g},${_style.dot.b},${1})`;
                _ctx.fill();
                temp_list.forEach((other_dot) => {
                    let dis = Math.pow(Math.pow(dot.x - other_dot.x, 2) + Math.pow(dot.y - other_dot.y, 2), 1/2);
                    if (dis > _config.dot_link) return;
                    _ctx.beginPath();
                    _ctx.moveTo(dot.x, dot.y);
                    _ctx.lineTo(other_dot.x, other_dot.y);
                    _ctx.closePath();
                    _ctx.strokeStyle = `rgba(${_style.line.r},${_style.line.g},${_style.line.b},${(1 - dis/_config.dot_link)*2})`;
                    _ctx.lineWidth = _style.width;
                    _ctx.stroke();
                });
                temp_list.add(dot);
            });
        },

        auto_add_dot (num) {
            let interval = setInterval(() => {
                if (_dot_list.size > num) {
                    clearInterval(interval);
                    return;
                }
                Float.add_dot();
            }, _config.dot_create);
        },

        add_dot () {
            let [x, y, v_x, v_y] = [
                get_num([0, _ctx_w]),
                get_num([0, _ctx_h]),
                get_num(_config.dot_v, 100) * (Math.random() > 0.5 ? -1 : 1) / 10,
                get_num(_config.dot_v, 100) * (Math.random() > 0.5 ? -1 : 1) / 10
            ];
            switch (get_num([0, 3])) {
                case 0:
                    y = 0;
                    v_y = Math.abs(v_y);
                    break;
                case 1:
                    x = _ctx_w;
                    v_x = -Math.abs(v_x);
                    break;
                case 2:
                    y = _ctx_h;
                    v_y = -Math.abs(v_y);
                    break;
                case 3:
                    x = 0;
                    v_x = Math.abs(v_x);
                    break;
            }

            _dot_list.add(new Dot({
                x: x,
                y: y,
                v_x: v_x,
                v_y: v_y,
                r: get_num(_config.dot_r, 100)
            }));
        },

        set_style (style) {
            style = JSON.parse(JSON.stringify(style));
            for (let prop in style) {
                _style[prop] = style[prop];
            }
        },

        set_size () {
            if (!_ctx) return;
            _ctx_w = _ctx.canvas.offsetWidth;
            _ctx_h = _ctx.canvas.offsetHeight;
            _ctx.canvas.width = _ctx_w;
            _ctx.canvas.height = _ctx_h;
            _borders = [
                0 - _config.extend_border,
                _ctx_w + _config.extend_border,
                _ctx_h + _config.extend_border,
                0 - _config.extend_border,
            ];
        },

        clear () {
            _ctx.clearRect(0, 0, _ctx_w, _ctx_h);
        },

    };

    return Float;

});



