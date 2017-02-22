# float.js

Create a series of dots floating randomly with interactive animation for mouse events.

## Examples

	<canvas id="example"></canvas>
	<script src="float.min.js"></script>
	<script>
		Float.init(document.querySelector('#example'), {
			dot_v: [2.5, 6],
			dot_max: 30
		});
	</script>

Click [DEMO](https://nossika.github.io/float.js/demo.html) to try it!

## Init options

	Float.init(container, options);

* **container** (required, type: HTMLElement)

* **options** (optional, type: Object)

	* **dot_v** (type: Number / Array of Number, default: `[1, 6]`): moving speed of dots, `[1, 6]` represents random speed between 1 and 6

	* **dot_link** (type: Number, default: 100): the distance that dots begin to link

	* **dot_click** (type: Number / Array of Number, default: 3): number of dots created by each click

	* **dot_r** (type: Number / Array of Number, default: `[0.3, 1.5]`): radius of dots

	* **dot_max** (type: Number, default: 20): max number of dots on canvas

	* **dot_create** (type: Number, default: 500): the interval between two creation

	* **on_click** (type: Boolean, default: true): whether to add click listener

	* **on_mousemove** (type: Boolean, default: true): whether to add mousemove listener

	* **extend_border** (type: Number, default: 30): the buffer distance of dots' disppearence. (e.g. 0 represents that dots will disappear when they touchs canvas' border)

	* **style** (type: Object): styles of dots and lines. example: `{width: 0.6, line: {r: 255, g: 255, b: 255}, dot: ...}`

 

## Methods


* **init(container, options)**

	Check out **Init options** for details.

* **suspend()**

	Suspend animation.

* **resume()**

	Resume animation.

* **set_size()**

	Auto set canvas width and height by size.

* **set_style(config)** 

	Set styles with `config`. Check out **style** in **Init options**.

* **on_click(e)**

	Trigger click event with `e`.

* **on_mousemove(e)**

	Trigger mousemove event with `e`.

## Tips

* Generally, we should execute `set_size()` when canvas size changed for better visual result.
* Sometimes, we need to trigger `click` / `mousemove` event manually, use method `on_click(e)` / `on_mousemove(e)` to trigger it. `e` could be native JS DOM event or simple as `{offsetX, offsetY}`.

	For example, we could trigger `click` event on canvas at (20, 30) like this:
		
		Float.on_click({
			offsetX: 20,
			offsetY: 30
		})

* It doesn't support running on mutilple canvas at present, I will consider adding it when needed.



