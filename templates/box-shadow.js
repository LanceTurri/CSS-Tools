<script type="text/html" id="box-shadow">
	<div class="box-shadow" data-bind="style: { 'box-shadow': boxShadow, 'background-color': boxColor }">

		<!--<div class="btn-group" data-toggle="buttons">
			<label class="btn">
				<input type="radio" name="colorType" value="HEX" data-bind="checked: colorType" /> HEX
			</label>
			<label class="btn">
				<input type="radio" name="colorType" value="RGB" data-bind="checked: colorType" /> RGB
			</label>
			<label class="btn">
				<input type="radio" name="colorType" value="RGBA" data-bind="checked: colorType" /> RGBA
			</label>
		</div>-->

		<pre class="language-css" data-bind="text: boxShadowBuilder()"></pre>

		<label class="label-full-width">Horizontal Length</label>
		<input type="range" data-bind="textInput: horizontalLength" min="-100" max="100" />

		<label class="label-full-width">Vertical Length</label>
		<input type="range" data-bind="textInput: verticalLength" min="-100" max="100" />

		<label class="label-full-width">Blur Radius</label>
		<input type="range" data-bind="textInput: blurRadius" min="0" max="100" />

		<label class="label-full-width">Spread Radius</label>
		<input type="range" data-bind="textInput: spreadRadius" min="-100" max="100" />

		<!--<label class="label-full-width">Opacity</label>
		<p class="range-field">
			<input type="range" data-bind="textInput: opacity, enabled: colorType() === 'RGBA'" min="0" max="1" step="0.01" />
		</p>-->

		<label class="label-full-width">Shadow Color</label>
		<input type="color" data-bind="value: shadowColor" />

		<!--<label class="label-full-width">Background Color</label>
		<input type="color" data-bind="value: backgroundColor" />

		<label class="label-full-width">Box Color</label>
		<input type="color" data-bind="value: boxColor" />-->
	</div>
</script>