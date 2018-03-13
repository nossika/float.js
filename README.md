# float.js

Create a series of dots floating randomly with interactive animation for mouse events.

## Examples

	<canvas id="example"></canvas>
	<script src="float.min.js"></script>
	<script>
		const float = new Float(document.querySelector('#example'), {
			dotSpeedRange: [2.5, 6],
			maxDots: 30
		});
	</script>

Click [DEMO](https://nossika.github.io/float.js/demo.html) to try it!

## Init options

	new Float(container, options);

* **container** (required, type: HTMLElement)

* **options** (optional, type: Object)

	* **dotSpeedRange** (type: Number / Array of Number, default: `[1, 6]`): moving speed of dots, `[1, 6]` represents random speed between 1 and 6

	* **dotLinkDistance** (type: Number, default: 100): the distance that dots begin to link

	* **clickDots** (type: Number / Array of Number, default: 3): number of dots created by each click

	* **dotRadius** (type: Number / Array of Number, default: `[0.3, 1.5]`): radius of dots

	* **maxDots** (type: Number, default: 20): max number of dots on canvas

	* **createInterval** (type: Number, default: 500): the interval between two creation

	* **clickEvent** (type: Boolean, default: true): whether to add click listener

	* **mousemoveEvent** (type: Boolean, default: true): whether to add mousemove listener

	* **borderExtend** (type: Number, default: 30): the buffer distance of dots' disppearence. (e.g. 0 represents that dots will disappear when they touchs canvas' border)

	* **style** (type: Object): styles of dots and lines. example: `{width: 0.6, line: {r: 255, g: 255, b: 255}, dot: ...}`

 

## Methods

* **suspend()**

	Suspend animation.

* **resume()**

	Resume animation.

* **setSize()**

	Auto set canvas width and height by size.

* **setStyle(config)** 

	Set styles with `config`. Check out **style** in **Init options**.

* **click(e)**

	Trigger click event with `e`.

* **mousemove(e)**

	Trigger mousemove event with `e`.

## Tips

* Generally, we should execute `float.setSize()` when canvas size changed for better visual result.
* Sometimes, we need to trigger `click` / `mousemove` event manually, use method `float.click(e)` / `float.mousemove(e)` to trigger it. `e` could be native JS DOM event or simple as `{offsetX, offsetY}`.

	For example, we could trigger `click` event on canvas at (20, 30) like this:
		
		float.click({
			offsetX: 20,
			offsetY: 30
		})

* It doesn't support running on mutilple canvas at present, I will consider adding it when needed.



