# float.js

Make some random dots floating on canvas! 

## Examples

	<canvas id="example"></canvas>
	<script src="float.min.js"></script>
	<script>
		Float.init(document.querySelector('#example'), {
			dot_v: [2.5, 6],
			dot_max: 30
		});
	</script>

Click [demo](https://nossika.github.io/float.js/demo.html) to try it online.

## Options

|Parameter|Type|Default|Description|
|:-:|:-:|:-:|---|
|dot_v|Number / Array|[1, 6]|moving velocity of dots|
|dot_link|Number|100|the distance that dots begin to link|
|dot_click|Number / Array|3|number of dots created by each click|
|dot_r|Number / Array|[0.3, 1.5]|radius of dots|
|dot_max|Number|20|max number of dots on canvas|
|dot_create|Number|500|the interval between two creation<br>(unit: ms) |
|on_click|Boolean|true|switch click listener|
|on_mousemove|Boolean|true|switch mousemove listener|
|extend_border|Number|30|the buffer distance of dots' disppearence<br>(e.g. 0 indicates that dots will disappear when they touchs canvas' border)|
|style|Object|{<br>`line`: `{r: 255, g: 255, b: 255}`,<br>`dot`: `{r: 255, g: 255, b: 255, a: 1}`,<br>`width`: `0.6`,<br>}|styles of dots and lines|

## Methods

|Methods|Description|
|:-:|---|
|init(canvas [,options])|init float on canvas|
|suspend()|suspend animation|
|resume()|resume animation|
|set_size()|auto set canvas width and height by size|
|set_style(styles_obj)|set styles|
|on_click(e)|trigger click event|
|on_mousemove(e)|trigger mousemove event|

## Tips

* Generally, we should execute `set_size()` when canvas size changed for better visual result.
* Sometimes, we need to trigger `click` / `mousemove` event manually, use method `on_click(e)` / `on_mousemove(e)` to trigger it. `e` could be native JS DOM event or simple as `{offsetX, offsetY}`.

	For example, we could trigger `click` event on canvas at (20, 30) like this:
		
		Float.on_click({
			offsetX: 20,
			offsetY: 30
		})

* It doesn't support running on mutilple canvas at present, I will consider adding it when needed.



