//var temp;
var x, y;
(() => {
	jg = {};
	jg.y = {}

	/**
	 * This function copy values of object (JSON Compatible)
	 * and returns another independent instance
	 * @param {Object} object
	 * @return object like parameter
	 */
	jg.deep_copy = function (object) {
		return JSON.parse(JSON.stringify(object));
	}

	/**
	 * Returns a array with values orders as like samples:
	 * range(5) -> [0,1,2,3,4]
	 * range(2,10) -> [2,3,4,5,6,7,8,9]
	 * range(2,10,2) -> [2,4,6,8]
	 * @param {number} n Min value of range
	 * @param {number} max Max value of range
	 * @param {number} step Increment of values
	 * If is sent one only param, this will represent the max value with step 1
	 */
	//Retorna um vetor com os valores solicitados em sequencia
	//Ex: 
	jg.range = function (n, max, step) {
		let min = max ? n : 0;
		max = max || n;
		step = step || 1;
		var ret = []
		for (var i = min; i < max; i += step) {
			ret.push(i);
		}
		return ret;
	}

	/**
	 * This function returns a random value between min and max values
	 * @param {number} min
	 * @param {number} max
	 * @returns {number} random value
	 */
	jg.getRandom = function (min, max) {
		min = min || 1;
		max = max || 10;
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	/**
	 * This function returns a array with n elements of random value between min and max values
	 * @param {number} n
	 * @param {number} min
	 * @param {number} max
	 * @returns {Array} array with elements of random value
	 */
	jg.generate = function (n, min, max) {
		n = n || 10;
		min = min || 0;
		max = max || 20;

		let array = [];
		for (let i = 0; i < n; i++) {
			array.push(jg.getRandom(min, max));
		}

		return array;
	}

	/**
	 * This function returns these informations of tag:
	 * x - absolute x in window; 
	 * y - absolute y in window; 
	 * width or w - width of tag area;
	 * height or h - hright of tag area;
	 * left or l - distance of tag to left limit of window;
	 * right or r - distance of tag to right limit of window;
	 * top or t - distance of tag to top limit of window;
	 * bottom or b - distance of tag to bottom limit of window;
	 * @param {String} selector The expression to locate tag;
	 * @returns {Object} infomations about tag area (empty if tag is not found)
	 */
	jg.size_info = function (selector) {
		var tag = document.querySelector(selector);
		if (tag) {
			var b = tag.getBoundingClientRect();
			b.w = b.width,
				b.h = b.height,
				b.l = b.left,
				b.r = b.right,
				b.t = b.top,
				b.b = b.bottom;
			return b;
		}
		return {};
	}

	/*ToolTip: https://bl.ocks.org/d3noob/a22c42db65eb00d4e369*/
	jg.__tooltip_counter = 0;
	jg.tooltip = function () {
		var tool = function () {
			tool.selection(true);
			return tool;
		};

		tool.__id = jg.__tooltip_counter++;

		/**
		 * Get d3 selection to tooltip;
		 * @param {boolean} update send true to update paramns
		 */
		tool.selection = function (update) {
			var temp = d3.select("body").selectAll(".tooltip-" + tool.__id).data([null]).enter().append("div")
				.classed("tooltip-" + tool.__id, true)
				.style("opacity", 0)
			temp = d3.select(".tooltip-" + tool.__id)
			var c = temp.attr("class") || "";

			c = c.split(" ").filter((d) => !d.match(/tooltip(-[0-9]+)?/)).join(" ");

			temp.attr("class", (c + " tooltip tooltip-" + tool.__id).trim());
			if (update) {
				temp.style("position", "absolute")
					.style("text-align", this.align())
					.style("padding", "5px")
					.style("font", this.font())
					.style("background", this.background())
					.style("border", "0px")
					//.style("border-radius","8px")
					.style("pointer-events", "none");
			}
			return d3.select(".tooltip-" + tool.__id);
		}

		tool.__align = undefined;
		/**
		 * Set align of text inner tooltip
		 * @param {String} align
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current align of tooltip
		 */
		tool.align = function (align) {
			if (align) {
				this.__align = align;
				return this;
			}
			return this.__align || "center";
		}
		tool.__orientation = undefined;
		/**
		 * Set orientation relative to x,y position:
		 * top	  -   left
		 * middle   -   center
		 * bottom   -   right
		 * choose in order: vertical-horizontal
		 * Sample: "top-left","bottom-right"
		 * @param {String} orientation
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current orientation of tooltip
		 */
		tool.orientation = function (orientation) {
			if (orientation == true) {
				return this.__orientation;
			}
			if (orientation) {
				var m = orientation.match(/(top|middle|bottom)[ \t]*-[ \t]*(left|center|right)/);
				if (m) {
					this.__orientation = { v: m[1], h: m[2] }
				} else {
					console.error("Orientation Out Format!");
				}
				return this;
			}
			return (this.__orientation.v + "-" + this.__orientation.h) || "top-left";
		}

		tool.__dx = undefined;
		/**
		 * Set horizontaly desloc position
		 * @param {number} dx
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current deloc
		 */
		tool.dx = function (dx) {
			if (dx != undefined) {
				this.__dx = dx
				return this;
			}
			return this.__dx || 0;
		}

		tool.__dy = undefined;
		/**
		 * Set verticaly desloc position
		 * @param {number} dy
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current deloc
		 */
		tool.dy = function (dy) {
			if (dy != undefined) {
				this.__dy = dy
				return this;
			}
			return this.__dy || 0;
		}

		tool.__font = undefined;
		/**
		 * Set font of text inner tooltip
		 * @param {String} font
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current font of tooltip
		 */
		tool.font = function (font) {
			if (font) {
				this.__font = font;
				return this;
			}
			return this.__font || "12px sans-serif";
		}
		tool.__background = undefined;
		/**
		 * Set background of text inner tooltip
		 * @param {String} background
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current background of tooltip
		 */
		tool.background = function (background) {
			if (background) {
				this.__background = background;
				return this;
			}
			return this.__background || "lightsteelblue";
		}
		tool.__html = undefined;
		/**
		 * Set content of html inner tooltip
		 * @param {String} html
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current html of tooltip
		 */
		tool.html = function (html) {
			if (html) {
				this.__html = html;
				return this;
			}
			return this.__html;
		}
		tool.__fadein = undefined;
		/**
		 * Set content of fadein duration of tooltip
		 * @param {String} fadein
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current fadein duration of tooltip
		 */
		tool.fadein = function (duration) {
			if (duration) {
				this.__fadein = duration;
				return this;
			}
			return this.__fadein;
		}

		tool.__fadeout = undefined;
		/**
		 * Set content of fadeout duration of tooltip
		 * @param {String} fadeout
		 * @returns the self tooltip
		 * If you don't send a parameter, you will get the current fadeout duration of tooltip
		 */
		tool.fadeout = function (duration) {
			if (duration) {
				this.__fadeout = duration;
				return this;
			}
			return this.__fadeout;
		}
		/**
		 * Hide tooltip
		 * @param {number} duration time of fadeout (opitional)
		 * @returns the self tooltip
		 */
		tool.hide = function (duration) {
			duration = duration || this.fadeout();
			this.selection().transition()
				.duration(duration)
				.style("opacity", 0);
			return self;
		}
		/**
		 * Show tooltip
		 * @param {number} x absolute x position on window
		 * @param {number} y absolute y position on window
		 * @param {number} duration time of fadein (opitional)
		 * @returns the self tooltip
		 * If don't send the position, this will be get position of event
		 *  in d3.event.pageX and d3.event.pageY
		 */
		tool.show = function (x, y, duration) {
			duration = duration || this.fadein();
			x = x || d3.event.pageX;
			y = y || d3.event.pageY;

			this.selection().html(this.html());

			//Set orientation
			var size = jg.size_info(".tooltip-" + this.__id);
			var o = this.orientation(true);

			x += this.dx();
			y += this.dy();

			x -= size.w * (o.h == "left" ? 0 : (o.h == "center" ? 0.5 : 1));
			y -= size.h * (o.v == "top" ? 0 : (o.v == "middle" ? 0.5 : 1));

			//Normalizing to put in visible space
			if (x < 0) x = 0;
			if (y < 0) y = 0;
			if (x + size.w > window.innerWidth)
				x = window.innerWidth - size.w;
			if (y + size.h > window.innerHeight)
				y = window.innerHeight - size.h;

			this.selection()
				.style("left", `${x}px`)
				.style("top", `${y}px`);

			this.selection(true).transition()
				.duration(duration)
				.style("opacity", .9);

			return self;
		}
		return tool
	}

	jg.EventManager = class {
		constructor() {
			this.__events = [];
			this.__event_counter = 0;
		}
		event(f, type, name) {
			type = type || "click";

			var event = {
				__name: name,
				__f: f,
				__call: false
			}

			var index_type = -1;
			this.__events.forEach((d, i) => {
				if (d.__type == type)
					index_type = i;
			})
			if (index_type != -1) {
				var index = -1;
				this.__events[index_type].__handler.forEach((d, i) => {
					if (d.__name == name)
						index = i;
				})
				if (index != -1) {
					event.__id = this.__events[index_type].__handler[index].__id;
					this.__events[index_type].__handler[index] = event;
					return this;
				}
				event.__id = "e" + this.__event_counter++;
				this.__events[index_type].__handler.push(event);
				return this;
			}
			event.__id = "e" + this.__event_counter++;
			this.__events.push({ __type: type, __handler: [event] })

			return this;
		}
		get(name) {
			var index = -1;
			this.__events.forEach((d, i) => {
				d.__handler.forEach((e, j) => {
					if (e.__name == name)
						index = [i, j];
				})

			})
			if (index != -1) {
				return this.__events[index[0]].__handler[index[1]];
			}
		}
		drop(name) {
			var index = -1;
			this.__events.forEach((d, i) => {
				d.__handler.forEach((e, j) => {
					if (e.__name == name)
						index = [i, j];
				})

			})
			if (index != -1) {
				this.__events.__handler.splice(index, 1);
			}
			return this;
		}
		call() {
			var manager = this;
			return function (context) {
				var selection = context.selection ? context.selection() : context;

				manager.__events.forEach((event) => {
					for (var j = 0; j < event.__handler.length; j++) {
						event.__handler[j].__call = true;
					}
					selection.on(event.__type, function (d, i, e) {
						for (var j = 0; j < event.__handler.length; j++) {
							event.__handler[j].__f.call(this, d, i, e, this);
						}
					})
				})
			}
		}
	}

	jg.__chart_bar_counter = 0;
	/**
	 * Create a bar chart send only the data set with the parameters key and value.
	 * Some settings can be made, like change the name of parameters of data.
	 * @param {Array} data dataset with parameters key and value
	 */
	jg.chart_bar = function (data) {

		var chart = function (context) {

			//General parameters
			var transition = undefined;
			if (context.duration)
				transition = { duration: context.duration(), delay: context.delay(), ease: context.ease() };

			var selection = context.selection ? context.selection() : context;

			if (!chart.inner()) {
				selection.classed("bar-chart", true).classed("bar-chart-" + chart.__id, true);
				var size_info = jg.size_info(".bar-chart-" + chart.__id)
				chart.__size_info = size_info
				selection.classed("bar-chart-" + chart.__id, false);
			}

			var width = chart.width(),		//Width of Chart
				height = chart.height(),	  //Height of chart
				margin = chart.margin()					  //Margin of chart
			if (width < margin.left + margin.right + 40)
				margin.right = 0, margin.left = -1;
			if (height < margin.top + margin.bottom + 10)
				margin.top = 1, margin.bottom = 3;
			if (height < margin.top + margin.bottom + 2)
				margin.top = 0, margin.bottom = 0;
			// TODO vai mas não volta - corrigir depois (eixos)
			chart.margin(margin);
			color = chart.color(),					   //Function to define color
				key = chart.key(),						   //String of key
				value = chart.value();					   //String of value

			var g;
			if (!chart.inner()) {
				//Tags
				//Insert
				selection.selectAll("svg").data([null]).enter().append("svg")
				//Update
				var svg = selection.select("svg").attr("width", width).attr("height", height);
				//Insert
				svg.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`)
				//Update
				g = selection.select("g");
			} else {
				selection.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`);
				g = selection.select("g");
			}


			//Conditional Transition
			if (transition)
				g.transition().delay(transition.delay).duration(transition.duration)
					.attr("transform", `translate(${margin.left},${margin.top})`);
			else
				g.attr("transform", `translate(${margin.left},${margin.top})`);

			var h = chart.y_range()[0];

			var x = chart.x_scale().range(chart.x_range())
				,
				y = chart.y_scale().range(chart.y_range());

			var xAxis = chart.x_axis().scale(x),
				yAxis = chart.y_axis().scale(y);

			//Insert
			g.selectAll(".chart-axis").data([{ k: "x", v: xAxis }, { k: "y", v: yAxis }]).enter().append("g")
				.attr("class", function (d) { return "chart-axis chart-axis-" + d.k })
				.attr("transform", function (d) { if (d.k == "x") return `translate(0,${h})` });

			//Update
			var xAxisGroup = g.select(".chart-axis-x"),
				yAxisGroup = g.select(".chart-axis-y")

			//Conditional Transition
			if (transition) {
				xAxisGroup.transition().delay(transition.delay + transition.duration * 0.3)
					.duration(transition.duration * 0.4)
					.call(xAxis)
					.attr("transform", `translate(0,${h})`);
				yAxisGroup.transition().delay(transition.delay + transition.duration * 0.7)
					.duration(transition.duration * 0.3)
					.call(yAxis);
			} else {
				xAxisGroup.call(xAxis)
					.attr("transform", `translate(0,${h})`);
				yAxisGroup
					.call(yAxis);
			}

			//Bars
			//Insert
			var bars = g.selectAll(".bar")
				.data(chart.data()).enter()
				.append("g")
				.attr("class", (d, i) => "bar bar-" + i)
				.attr("transform", function (d) {
					return `translate(${x(d[key])},${h})`
				})
			bars.append("rect").attr("width", x.bandwidth()).attr("fill", color);
			//Remove
			bars = g.selectAll(".bar").data(chart.data()).exit();
			if (transition) {
				var lastDomain = jg.range(bars._groups[0].length);
				var lastX = chart.x_scale().domain(lastDomain).range(chart.x_range())

				bars.transition().delay(transition.delay).duration(transition.duration * 0.3)
					.attr("transform", function (d, i) { return `translate(${lastX(i)},${h})` })
					.select("rect").attr("height", 0).attr("y", 0);
				bars.transition().delay(transition.delay + transition.duration * 0.3).remove()
			} else
				bars.remove()

			//Update
			bars = g.selectAll(".bar").data(chart.data())
				.call(chart.__event_manager.call());
			if (transition) {
				bars.interrupt().style("opacity", 1).transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
					.attr("transform", function (d) { return `translate(${x(d[key])},${h})` })
					.select("rect").attr("width", x.bandwidth())
				bars.transition().delay(transition.delay + transition.duration * 0.7).duration(transition.duration * 0.3).ease(transition.ease)
					.select("rect").attr("height", function (d) { return h - y(d[value]) })
					.attr("y", function (d) { return y(d[value]) - h })
					.attr("fill", color)
			} else {
				bars.attr("transform", function (d) { return `translate(${x(d[key])},${h})` })
					.select("rect").attr("width", x.bandwidth()).attr("height", function (d) { return h - y(d[value]) })
					.attr("y", function (d) { return y(d[value]) - h })
					.attr("fill", color)
			}


		}

		chart.__data = undefined
		/**
		 * Set data of chart as a array with parameters
		 * specifieds in chart.key() and chart.value()
		 * @param {Array} data list of data to set chart
		 * @retuerns the self chart
		 * If you don't send a parameter, you will get the current data of chart
		 * If current data of chart is undefined of the data param sent is invalid,
		 * the function will generate a random value to simulate chart
		 */
		chart.data = function (data) {
			var random = false;

			if (data != undefined) {
				if (data instanceof Array) {
					this.__data = data;
					return this;
				} else
					random = true;
			}
			if (this.__data == undefined)
				random = true;
			if (random) {
				this.key("key").value("value")
					.__data = jg.generate(jg.getRandom(5, 15),//n elements
						jg.getRandom(0, 5),// min value
						jg.getRandom(10, 15))// max value
						.map(function (d, i) { return { key: "d" + i, value: d } })
			}
			return data != undefined ? this : this.__data;
		}

		chart.__inner = false;
		/**
		 * Say inner svg container. If false, this will create a svg inselection called
		 * If true, this will be created inner of structure selected in a svg.
		 * @param {boolean} inner mode of creation
		 * @returns the self chart
		 * If you don't send a parameter, you will get the current state inner of chart
		 * when true, the width and heigth parameters should be defined to creation and
		 * redraw.
		 */
		chart.inner = function (inner) {
			if (inner != undefined) {
				chart.__inner = inner;
				return this;
			} else {
				return chart.__inner;
			}

		}

		chart.__width = undefined;
		/**
		 * Define the width of graph
		 * @param {number} width
		 * @returns the self chart
		 */
		chart.width = function (width) {
			if (width != undefined) {
				this.__width = width;
				return this;
			}
			return this.__width || (this.__size_info ? this.__size_info.w : undefined);
		}
		chart.__height = undefined;
		/**
		 * Define the height of graph
		 * @param {number} height
		 * @returns the self chart
		 */
		chart.height = function (height) {
			if (height != undefined) {
				this.__height = height;
				return this;
			}
			return this.__height || (this.__size_info ? this.__size_info.h : undefined);
		}

		chart.__margin = undefined
		/**
		 * Defines a margin around the chart
		 * @param {Object} send a object with params : top, bottom, left, right
		 * @returns the self chart
		 * If you dont sent a parameter, you will get the current margin of chart
		 */
		chart.margin = function (d) {
			if (d) {
				var t = {}
				t.top = d.top || this.__margin.top;
				t.bottom = d.bottom || this.__margin.bottom;
				t.left = d.left || this.__margin.left;
				t.right = d.right || this.__margin.right;
				this.__margin = t;
				return this;
			}
			return chart.__margin || { top: 10, bottom: 20, left: 30, right: 10 };
		}
		chart.__color = undefined;
		/**
		 * Set a color rule to pattern of the stack bar to define the lines of stack bar.
		 * This can be a value of color or a function with 
		 * data(number), index(line), dataset(list of column) as param
		 * @param {Function,String,Array} color The color rule to pattern of the stack bar
		 * @param {boolean} control when true, give total control to param color (be function, String or array)
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current color rule
		 */
		chart.color = function (color) {
			if (color) {
				if (color instanceof Function)
					this.__color = color;
				else if (color instanceof Array)
					this.__color = ((d, i) => color[i]);
				else
					this.__color = color;
				return this;
			}
			return this.__color || ((d, i) => (d3.schemeCategory10[i]));
		}
		chart.__key = undefined
		/**
		 * Set key index in dataset
		 * @param {String} key Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current key indexer
		 */
		chart.key = function (key) {
			if (key) {
				this.__key = key;
				return this;
			}
			return this.__key || "key";
		}
		chart.__value = undefined
		/**
		 * Set value index in dataset
		 * @param {String} value Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current value indexer
		 */
		chart.value = function (value) {
			if (value) {
				this.__value = value;
				return this;
			}
			return this.__value || "value";
		}

		chart.__x_scale = undefined;
		/**
		 * Set the x scale of the chart. this should be a scaleBand
		 * @param {function} scaleBand
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x scale of chart
		 */
		chart.x_scale = function (scaleBand) {
			if (scaleBand) {
				this.__x_scale = scaleBand;
				return this;
			} else
				return chart.__x_scale || d3.scaleBand().domain(chart.x_domain()).paddingInner(0.1).paddingOuter(0.1);
		}

		chart.__x_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 */
		chart.x_domain = function (domain) {
			var a = this;
			if (domain) {
				if (domain instanceof Array) {
					this.__x_domain = domain;
					return this;
				}
			} return this.__x_domain ||
				this.data().map(function (d) {
					return d[a.key()]
				})
		}
		chart.__x_range = undefined
		/**
		 * Set range of x. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x range of chart
		 */
		chart.x_range = function (range) {
			if (range) {
				this.__x_range = range;
				return this;
			}
			return this.__x_range || [0, this.width() - this.margin().left - this.margin().right];
		}

		chart.__x_axis = undefined;
		/**
		 * Set axis of x. This should be a d3.axis****()
		 * @param {Object} axis the d3.axis****()
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x axis of chart
		 */
		chart.x_axis = function (axis) {
			if (axis) {
				this.__x_axis = axis;
				return this;
			}
			return this.__x_axis || d3.axisBottom();
		}

		chart.__y_scale = undefined;
		/**
		 * Set the y scale of the chart. this should be a scaleLinear
		 * @param {function} scaleLinear
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y scale of chart
		 */
		chart.y_scale = function (scaleLinear) {
			if (scaleLinear) {
				this.__y_scale = scaleLinear;
				return this;
			} else
				return chart.__y_scale || d3.scaleLinear().domain(chart.y_domain());
		}

		chart.__y_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 */
		chart.y_domain = function (domain) {
			var a = this
			if (domain) {
				if (domain instanceof Array)
					this.__y_domain = domain;
			} return this.__y_domain ||
				d3.extent(this.data(),
					function (d) {
						return d[a.value()]
					})
		}
		chart.__y_range = undefined
		/**
		 * Set range of y. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y range of chart
		 */
		chart.y_range = function (range) {
			if (range) {
				this.__y_range = range;
				return this;
			}
			return this.__y_range || [this.height() - this.margin().top - this.margin().bottom, 0];
		}
		chart.__y_axis = undefined;
		/**
		 * Set axis of y. This should be a d3.axis****()
		 * @param {Object} axis the d3.axis****()
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y axis of chart
		 */
		chart.y_axis = function (axis) {
			if (axis) {
				this.__y_axis = axis;
				return this;
			}
			return this.__y_axis || d3.axisLeft();
		}

		chart.__event_manager = new jg.EventManager();
		/**
		 * Set a event function
		 * This function can recive allow parrameters:
		 * data, index, list, tag
		 * @param {String} type event type (click,mouseover,mouseout,...)
		 * @param {function} func functions to execute
		 * @param {String} name event name(use to retrive and drop the event)
		 */
		chart.on = function (type, func, name) {
			this.__event_manager.event(func, type, name);
			return this;
		}
		/**
		 * Drop a event using the event name
		 * @param {String} name event name
		 */
		chart.drop_event = function (name) {
			this.__event_manager.drop(name);
			return this;
		}

		chart.__tooltip = jg.tooltip();
		chart.__tooltip_text = undefined;
		/**
		 * Set text function to activate tooltip
		 * @param {String, Function} text
		 * 
		 */
		chart.tooltip = function (text) {
			if (text) {
				this.__tooltip.orientation("bottom-left");
				this.on("mouseover", (d, i, e, t) => {
					var p = t.getBoundingClientRect();
					chart.__tooltip.html(text instanceof Function ? text(d, i, e, t) : text)
						.show(p.x + p.width, p.y)
					d3.select(t).style("opacity", 1.0).transition().style("opacity", 0.7)
				}, "tooltip-in")
					.on("mouseout", (d, i, e, t) => {
						chart.__tooltip.hide();
						d3.select(t).transition().style("opacity", 1)
					}, "tooltip-out")

				return this;
			}
			return this.__tooltip;
		}

		chart.data(data);
		chart.__id = jg.__chart_bar_counter++;

		return chart;
	}

	jg.__chart_tree_percent_counter = 0;
	/**
	 * Create a tree percent chart send only the data set with the parameters key and list.
	 * Some settings can be made, like change the name of parameters of data.
	 * @param {Array} data dataset with parameters key and list
	 */
	jg.chart_tree_percent = function (data) {

		var chart = function (context) {

			//General parameters
			var transition = undefined;
			if (context.duration)
				transition = { duration: context.duration(), delay: context.delay(), ease: context.ease() };

			var selection = context.selection ? context.selection() : context;

			if (!chart.inner()) {
				selection.classed("bar-chart", true).classed("bar-chart-" + chart.__id, true);
				var size_info = jg.size_info(".bar-chart-" + chart.__id)
				chart.__size_info = size_info
				selection.classed("bar-chart-" + chart.__id, false);
			}

			var width = chart.width(),		//Width of Chart
				height = chart.height(),	  //Height of chart
				margin = chart.margin(),					  //Margin of chart
				color = chart.color(),					   //Function to define color
				key = chart.key(),						   //String of key
				list = chart.list();					   //String of list

			var g;
			if (!chart.inner()) {
				//Tags
				//Insert
				selection.selectAll("svg").data([null]).enter().append("svg")
				//Update
				var svg = selection.select("svg").attr("width", width).attr("height", height);
				//Insert
				svg.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`)
				//Update
				g = selection.select("g");
			} else {
				selection.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`);
				g = selection.select("g");
			}

			//Conditional Transition
			if (transition)
				g.transition().delay(transition.delay).duration(transition.duration)
					.attr("transform", `translate(${margin.left},${margin.top})`);
			else
				g.attr("transform", `translate(${margin.left},${margin.top})`);

			var h = chart.y_range()[0];

			var totals = [];
			chart.data().map((d, i) => {
				totals.push(d[list].reduce((total, numero) => total + numero, 0));
			});

			var x = chart.x_scale().range(chart.x_range())
				,
				y = chart.y_scale().range(chart.y_range()),
				format = d3.format(".0%");

			//Columns Tree
			//Insert
			var c_trees = g.selectAll(".c-tree").data(chart.data()).enter().append("g")
				.attr("class", (d, i) => "c-tree c-tree-" + i)
				.attr("transform", function (d) { return `translate(${x(d[key])},0)` }).style("opacity", 0)

			c_trees.append("text").attr("class", (d, i) => `key-label key-label-+${i}`)
				//.attr("font-size",y.bandwidth()*0.16)
				.attr("text-anchor", "middle")
				.attr("font-family", "Roboto")
				.attr("y", -5).attr("x", (d) => x.bandwidth() / 2)
				.text((d, i) => `${d.key}(${totals[i]})`).style("opacity", 0);

			c_trees = g.selectAll(".c-tree").selectAll(".tree").data((d, col) => d[list].map((d, i) => { return { d: d, i: i, col: col } })).enter().append("g")
				.attr("class", (d, i) => `tree tree-${i}`)
				.attr("transform", function (d, i) { return `translate(0,${y(i)})` }).style("opacity", 0)

			c_trees.selectAll("rect")
				.data((d, i, e) => {
					return [
						{ d: d.d, i: d.i, e: e, x: 0, y: 0, w: x.bandwidth() * 0.6, h: y.bandwidth() },
						{ d: d.d, i: d.i, e: e, x: x.bandwidth() * 0.6, y: 0, w: x.bandwidth() * 0.4, h: y.bandwidth() },
						//y:(1-d.d/totals[d.col])*y.bandwidth()	h:(d.d/totals[d.col])*y.bandwidth()
						{ d: d.d, i: d.i, e: e, col: d.col, x: x.bandwidth() * 0.6, y: y.bandwidth(), w: x.bandwidth() * 0.4, h: 0 },
					]
				}).enter().append("rect").attr("class", (d, i) => `tree-rect tree-rect-${i}`).attr("width", (d) => d.w)
				.attr("height", (d) => d.h).attr("x", (d) => d.x).attr("y", (d) => d.y).attr("fill", color);
			c_trees.append("text").attr("class", (d, i) => `tree-absolute-label tree-absolute-label-${d.i}`)
				.attr("text-anchor", "middle")
				.attr("fill", "white")
				.attr("font-weight", "bold")
				.attr("font-family", "Roboto")
				.text((d) => d.d)
				.attr("x", x.bandwidth() * 0.6 / 2).attr("y", y.bandwidth() / 2).attr("dy", "0.8em")
				.style("opacity", 0);
			c_trees.append("text").attr("class", (d, i) => `tree-relative-label tree-relative-label-${d.i}`)
				.attr("text-anchor", "middle")
				.attr("font-size", 12)
				.attr("fill", "white")
				.attr("font-family", "Roboto")
				.attr("font-weight", "bold")
				.text((d) => `${parseInt(d.d * 100 / totals[d.col])}%`)
				.attr("x", x.bandwidth() * (0.6 + 0.4 / 2)).attr("y", (d, i) => y.bandwidth())
				.attr("dy", (d, i) => ((d.d / totals[d.col]) * y.bandwidth() <= 14) ? "-0.5em" : "0.8em")
				.style("opacity", 0);

			//Remove
			c_trees = g.selectAll(".c-tree").data(chart.data()).exit();
			trees = g.selectAll(".c-tree").data(chart.data()).selectAll(".tree").data((d) => d[list]).exit();
			if (transition) {
				c_trees.style("opacity", 1);
				c_trees.transition().delay(transition.delay).duration(transition.duration * 0.3)
					.style("opacity", 0);

				c_trees.transition().delay(transition.delay + transition.duration * 0.3).remove()

				trees.style("opacity", 1);
				trees.transition().delay(transition.delay).duration(transition.duration * 0.3)
					.style("opacity", 0);

				trees.transition().delay(transition.delay + transition.duration * 0.3).remove()
			} else
				c_trees.remove(), trees.remove()

			//Update
			c_trees = g.selectAll(".c-tree").data(chart.data())
			trees = c_trees.selectAll(".tree").data((d, col) => d[list].map((e, i) => { return { d: e, i: i, col: col, key: d[key] } }))
				.call(chart.__event_manager.call());
			var rects_trees = trees.selectAll("rect").data((d, i, e) => {
				return [
					{ d: d.d, i: d.i, e: e, x: 0, y: 0, w: x.bandwidth() * 0.6, h: y.bandwidth() },
					{ d: d.d, i: d.i, e: e, x: x.bandwidth() * 0.6, y: 0, w: x.bandwidth() * 0.4, h: y.bandwidth() },
					//y:(1-d.d/totals[d.col])*y.bandwidth()	h:(d.d/totals[d.col])*y.bandwidth()
					{ d: d.d, i: d.i, e: e, col: d.col, x: x.bandwidth() * 0.6, y: y.bandwidth(), w: x.bandwidth() * 0.4, h: 0 },
				]
			})
			if (transition) {
				// transition 1 - fade out
				c_trees.transition().delay(transition.delay + transition.duration * 0.15).duration(transition.duration * 0.15)
					.select(".key-label")
					.style("opacity", 0);
				// transition 2 - position
				c_trees.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
					.attr("transform", function (d) { return `translate(${x(d.key)},0)` }).style("opacity", 1)
					.select(".key-label")
					//.attr("font-size",y.bandwidth()*0.16)
					.attr("y", -5).attr("x", (d) => x.bandwidth() / 2)
					.text((d, i) => `${d.key}(${totals[i]})`).style("opacity", 1);
				trees.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
					.attr("transform", function (d) { return `translate(0,${y(d.i)})` }).style("opacity", 1);

				rects_trees.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
					.attr("width", (d) => d.w).attr("height", (d) => d.h)
					.attr("x", (d) => d.x).attr("y", (d) => d.y);

				trees.select(".tree-absolute-label")
					.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
					.attr("x", x.bandwidth() * 0.6 / 2).attr("y", y.bandwidth() / 2)
					.attr("dy", "0.35em")
					.attr("font-size", y.bandwidth() * 0.4)
					.tween("text", function () {
						var i = d3.interpolate(this.textContent, 0);
						return function (t) {
							this.textContent = Math.round(i(t));
						};
					})
					.style("opacity", 0);

				trees.select(".tree-relative-label")
					.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
					.attr("x", x.bandwidth() * (0.6 + 0.4 / 2)).attr("y", (d, i) => y.bandwidth())
					.attr("dy", "0.5em")
					.attr("font-size", y.bandwidth() * 0.16)
					.tween("text", function (d) {
						var i = d3.interpolate(this.textContent.match(/\d*/)[0] / 100, 0);
						return function (t) {
							this.textContent = format(i(t));
						};
					})

					.style("opacity", 0);

				// transition 3 - data content
				rects_trees.transition().delay(transition.delay + transition.duration * 0.7).duration(transition.duration * 0.3).ease(transition.ease)
					.attr("height", function (d, i) { return i == 2 ? (d.d / totals[d.col]) * y.bandwidth() : d.h })
					.attr("y", function (d, i) { return i == 2 ? (1 - d.d / totals[d.col]) * y.bandwidth() : d.y })
					.attr("fill", color);

				trees.select(".tree-absolute-label")
					.transition().delay(transition.delay + transition.duration * 0.7).duration(transition.duration * 0.3).ease(transition.ease)
					.tween("text", function (d) {
						var i = d3.interpolate(this.textContent, d.d);
						return function (t) {
							this.textContent = Math.round(i(t));
						};
					})
					.style("opacity", 1);



				trees.select(".tree-relative-label")
					.transition().delay(transition.delay + transition.duration * 0.7).duration(transition.duration * 0.3).ease(transition.ease)
					.tween("text", function (d) {
						var i = d3.interpolate(0, d.d / totals[d.col]);
						return function (t) {
							this.textContent = format(i(t));
						};
					})
					.attr("x", x.bandwidth() * (0.6 + 0.4 / 2))
					.attr("y", (d, i) => (1 - d.d / totals[d.col] / (((d.d / totals[d.col]) * y.bandwidth() <= y.bandwidth() * 0.17) ? 1 : 2)) * y.bandwidth())
					.attr("dy", (d, i) => ((d.d / totals[d.col]) * y.bandwidth() <= y.bandwidth() * 0.17) ? "-0.2em" : "0.4em")
					.style("opacity", 1);

			} else {
				c_trees
					.attr("transform", function (d) { return `translate(${x(d.key)},0)` })
					.style("opacity", 1);
				trees
					.attr("transform", function (d) { return `translate(0,${y(d.i)})` })
					.style("opacity", 1);

				rects_trees
					.attr("width", (d) => d.w)
					.attr("x", (d) => d.x)
					.attr("height", function (d, i) { return i == 2 ? (d.d / totals[d.col]) * y.bandwidth() : d.h })
					.attr("y", function (d, i) { return i == 2 ? (1 - d.d / totals[d.col]) * y.bandwidth() : d.y })
					.attr("fill", color)
				c_trees.select(".key-label")
					.attr("y", -5).attr("x", (d) => x.bandwidth() / 2)
					.text((d, i) => `${d.key}(${totals[i]})`).style("opacity", 1);
				trees.select(".tree-absolute-label")
					.attr("x", x.bandwidth() * 0.6 / 2).attr("y", y.bandwidth() / 2)
					.attr("dy", "0.35em")
					.attr("font-size", y.bandwidth() * 0.4)
					.style("opacity", 1);
				trees.select(".tree-relative-label")
					.attr("x", x.bandwidth() * (0.6 + 0.4 / 2))
					.attr("y", (d, i) => (1 - d.d / totals[d.col] / (((d.d / totals[d.col]) * y.bandwidth() <= y.bandwidth() * 0.17) ? 1 : 2)) * y.bandwidth())
					.attr("dy", (d, i) => ((d.d / totals[d.col]) * y.bandwidth() <= y.bandwidth() * 0.17) ? "-0.2em" : "0.4em")
					.attr("font-size", y.bandwidth() * 0.16)
					.style("opacity", 1);

			}

		}

		chart.__data = undefined
		/**
		 * Set data of chart as a array with parameters
		 * specifieds in chart.key() and chart.list()
		 * @param {Array} data list of data to set chart
		 * @returns the self chart
		 * If you don't send a parameter, you will get the current data of chart
		 * If current data of chart is undefined of the data param sent is invalid,
		 * the function will generate a random list to simulate chart
		 */
		chart.data = function (data) {
			var random = false;

			if (data != undefined) {
				if (data instanceof Array) {
					this.__data = data;
					return this;
				} else
					random = true;
			}
			if (this.__data == undefined)
				random = true;
			if (random) {
				this.key("key").list("list")
					.__data = jg.generate(jg.getRandom(1, 3),//n elements
						jg.getRandom(2, 3),// min value
						jg.getRandom(4, 5))// max value
						.map(function (d, i) {
							d = jg.generate(d, 40, 350);
							return { key: "d" + i, list: d }
						})
			}
			return data != undefined ? this : this.__data;
		}

		chart.__inner = false;
		/**
		 * Say inner svg container. If false, this will create a svg inselection called
		 * If true, this will be created inner of structure selected in a svg.
		 * @param {boolean} inner mode of creation
		 * @returns the self chart
		 * If you don't send a parameter, you will get the current state inner of chart
		 * when true, the width and heigth parameters should be defined to creation and
		 * redraw.
		 */
		chart.inner = function (inner) {
			if (inner != undefined) {
				chart.__inner = inner;
				return this;
			} else {
				return chart.__inner;
			}

		}

		chart.__width = undefined;
		/**
		 * Define the width of graph
		 * @param {number} width
		 * @returns the self chart
		 */
		chart.width = function (width) {
			if (width != undefined) {
				this.__width = width;
				return this;
			}
			return this.__width || (this.__size_info ? this.__size_info.w : undefined);
		}
		chart.__height = undefined;
		/**
		 * Define the height of graph
		 * @param {number} height
		 * @returns the self chart
		 */
		chart.height = function (height) {
			if (height != undefined) {
				this.__height = height;
				return this;
			}
			return this.__height || (this.__size_info ? this.__size_info.h : undefined);
		}

		chart.__margin = undefined
		/**
		 * Defines a margin around the chart
		 * @param {Object} send a object with params : top, bottom, left, right
		 * @returns the self chart
		 * If you dont sent a parameter, you will get the current margin of chart
		 */
		chart.margin = function (d) {
			if (d) {
				var t = {}
				t.top = d.top || this.__margin.top;
				t.bottom = d.bottom || this.__margin.bottom;
				t.left = d.left || this.__margin.left;
				t.right = d.right || this.__margin.right;
				this.__margin = t;
				return this;
			}
			return chart.__margin || { top: 20, bottom: 5, left: 5, right: 5 };
		}
		chart.__color = undefined;
		/**
		 * Set a color rule to pattern of the tree to define the lines of tree.
		 * This can be a value of color or a function with 
		 * data(number), index(line), dataset(list of column) as param
		 * @param {Function,String,Array} color The color rule to pattern of the tree
		 * @param {boolean} control when true, give total control to param color (be function, String or array)
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current color rule
		 */
		chart.color = function (color, control) {
			if (color) {
				if (control) {
					this.__color = color;
					return this;
				}
				this.__color = function (d, i) {
					var c;
					if (color instanceof Function)
						c = color(d.d, d.i, d.e, d.t);
					else if (color instanceof Array)
						c = color[d.i];
					else
						c = color;
					return (d3.scaleLinear().domain([0, 6]).range(["white", c]))(i + 3);
				}
				return this;
			}
			return this.__color || function (d, i, e) {

				return (d3.scaleLinear().domain([0, 6]).range(["white", "steelblue"]))(i + 3);
			};
		}
		chart.__key = undefined
		/**
		 * Set key index in dataset
		 * @param {String} key Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current key indexer
		 */
		chart.key = function (key) {
			if (key) {
				this.__key = key;
				return this;
			}
			return this.__key || "key";
		}
		chart.__list = undefined
		/**
		 * Set list index in dataset
		 * @param {String} list Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current list indexer
		 */
		chart.list = function (list) {
			if (list) {
				this.__list = list;
				return this;
			}
			return this.__list || "list";
		}

		chart.__x_scale = undefined;
		/**
		 * Set the x scale of the chart. this should be a scaleBand
		 * @param {function} scaleBand
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x scale of chart
		 */
		chart.x_scale = function (scaleBand) {
			if (scaleBand) {
				this.__x_scale = scaleBand;
				return this;
			} else
				return chart.__x_scale || d3.scaleBand().domain(chart.x_domain())
					.paddingInner(0.1)//.paddingOuter(0.1);
		}

		chart.__x_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 */
		chart.x_domain = function (domain) {
			var a = this;
			if (domain) {
				if (domain instanceof Array) {
					this.__x_domain = domain;
					return this;
				}
			} return this.__x_domain ||
				this.data().map(function (d) {
					return d[a.key()]
				})
		}
		chart.__x_range = undefined
		/**
		 * Set range of x. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x range of chart
		 */
		chart.x_range = function (range) {
			if (range) {
				this.__x_range = range;
				return this;
			}
			return this.__x_range || [0, this.width() - this.margin().left - this.margin().right];
		}

		chart.__y_scale = undefined;
		/**
		 * Set the y scale of the chart. this should be a scaleBand
		 * @param {function} scaleBand
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y scale of chart
		 */
		chart.y_scale = function (scaleBand) {
			if (scaleBand) {
				this.__y_scale = scaleBand;
				return this;
			} else
				return chart.__y_scale || d3.scaleBand().domain(chart.y_domain())
					.paddingInner(0.1).paddingOuter(0.01);
		}

		chart.__y_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 */
		chart.y_domain = function (domain) {
			var a = this
			if (domain) {
				if (domain instanceof Array)
					this.__y_domain = domain;
			} return this.__y_domain ||
				jg.range(
					d3.max(this.data(),
						function (d) {
							return d[a.list()].length
						})
				)
		}
		chart.__y_range = undefined
		/**
		 * Set range of y. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y range of chart
		 */
		chart.y_range = function (range) {
			if (range) {
				this.__y_range = range;
				return this;
			}
			return this.__y_range || [0, this.height() - this.margin().top - this.margin().bottom];
		}

		chart.__event_manager = new jg.EventManager();
		/**
		 * Set a event function
		 * This function can recive allow parrameters:
		 * data, index, list, tag
		 * @param {String} type event type (click,mouseover,mouseout,...)
		 * @param {function} func functions to execute
		 * @param {String} name event name(use to retrive and drop the event)
		 */
		chart.on = function (type, func, name) {
			this.__event_manager.event(func, type, name);
			return this;
		}
		/**
		 * Drop a event using the event name
		 * @param {String} name event name
		 */
		chart.drop_event = function (name) {
			this.__event_manager.drop(name);
			return this;
		}

		chart.__tooltip = jg.tooltip();
		chart.__tooltip_text = undefined;
		/**
		 * Set text function to activate tooltip
		 * @param {String, Function} text
		 * 
		 */
		chart.tooltip = function (text) {
			if (text) {
				this.__tooltip.orientation("bottom-left");
				this.on("mouseover", (d, i, e, t) => {
					var p = t.getBoundingClientRect();
					chart.__tooltip.html(text instanceof Function ? text(d, i, e, t) : text)
						.show(p.x + p.width, p.y)
					d3.select(t).style("opacity", 1.0).transition().style("opacity", 0.7)
				}, "tooltip-in")
					.on("mouseout", (d, i, e, t) => {
						chart.__tooltip.hide();
						d3.select(t).transition().style("opacity", 1)
					}, "tooltip-out")

				return this;
			}
			return this.__tooltip;
		}

		chart.data(data);
		chart.__id = jg.__chart_tree_percent_counter++;

		return chart;
	}

	jg.__chart_stack_group_bar_counter = 0;
	/**
	 * Create a stack/group-bar chart send only the data set with the parameters key and list.
	 * Some settings can be made, like change the name of parameters of data.
	 * @param {Array} data dataset with parameters key and list
	 */
	jg.chart_stack_group_bar = function (data) {

		var chart = function (context) {

			//General parameters
			var transition = undefined;
			if (context.duration)
				transition = { duration: context.duration(), delay: context.delay(), ease: context.ease() };

			var selection = context.selection ? context.selection() : context;

			if (!chart.inner()) {
				selection.classed("bar-chart", true).classed("bar-chart-" + chart.__id, true);
				var size_info = jg.size_info(".bar-chart-" + chart.__id)
				chart.__size_info = size_info
				selection.classed("bar-chart-" + chart.__id, false);
			}

			var width = chart.width(),		//Width of Chart
				height = chart.height(),	  //Height of chart
				margin = chart.margin(),					  //Margin of chart
				color = chart.color(),					   //Function to define color
				key = chart.key(),						   //String of key
				list = chart.list(),					   //String of list
				stack_mode = chart.stack_mode();			// boolean informs if is staked visualization

			if (width < margin.left + margin.right + 40)
				margin.right = 0, margin.left = -1;
			if (height < margin.top + margin.bottom + 10)
				margin.top = 1, margin.bottom = 3;
			if (height < margin.top + margin.bottom + 2)
				margin.top = 0, margin.bottom = 0;
			// TODO vai mas não volta - corrigir depois (eixos)
			chart.margin(margin);

			var g;
			if (!chart.inner()) {
				//Tags
				//Insert
				selection.selectAll("svg").data([null]).enter().append("svg")
				//Update
				var svg = selection.select("svg").attr("width", width).attr("height", height);
				//Insert
				svg.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`)
				//Update
				g = selection.select("g");
			} else {
				selection.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`);
				g = selection.select("g");
			}

			//Conditional Transition
			if (transition)
				g.transition().delay(transition.delay).duration(transition.duration)
					.attr("transform", `translate(${margin.left},${margin.top})`);
			else
				g.attr("transform", `translate(${margin.left},${margin.top})`);

			var h = chart.y_range()[0];

			x = chart.x_scale().range(chart.x_range()),
				y = chart.y_scale().range(chart.y_range());

			var totals = []; // stacked mode
			var xGroup = []; // grouped mode
			chart.data().map((d, i) => {
				totals.push(d[list].reduce((total, numero) => total + numero, 0));
				xGroup.push(d3.scaleBand().domain(d[list]).range([0, x.bandwidth()]));
			});

			//temp = ([chart.data(),totals,xGroup]) see this values on out context

			if (stack_mode)
				y.domain([0, d3.max(totals)])

			var xAxis = chart.x_axis().scale(x),
				yAxis = chart.y_axis().scale(y);

			//Insert
			g.selectAll(".chart-axis").data([{ k: "x", v: xAxis }, { k: "y", v: yAxis }]).enter().append("g")
				.attr("class", function (d) { return "chart-axis chart-axis-" + d.k })
				.attr("transform", function (d) { if (d.k == "x") return `translate(0,${h})` });

			//Update
			var xAxisGroup = g.select(".chart-axis-x"),
				yAxisGroup = g.select(".chart-axis-y")

			//Conditional Transition
			if (transition) {
				xAxisGroup.transition().delay(transition.delay + transition.duration * (!chart.__stack_mode_last && stack_mode ? 0.7 : 0.3))
					.duration(transition.duration * (!chart.__stack_mode_last && stack_mode ? 0.3 : 0.4))
					.call(xAxis)
					.attr("transform", `translate(0,${h})`);
				yAxisGroup.transition().delay(transition.delay + transition.duration * (!chart.__stack_mode_last && stack_mode ? 0.3 : 0.7))
					.duration(transition.duration * (!chart.__stack_mode_last && stack_mode ? 0.4 : 0.3))
					.call(yAxis);
			} else {
				xAxisGroup.call(xAxis)
					.attr("transform", `translate(0,${h})`);
				yAxisGroup
					.call(yAxis);
			}

			//Columns stackbar
			//Insert
			var c_stackbars = g.selectAll(".c-stackbar")
				.data(chart.data()).enter().append("g")
				.attr("class", (d, i) => "c-stackbar c-stackbar-" + i)
				.attr("transform", function (d) { return `translate(${x(d[key])},0)` })
				.style("opacity", 0)

			c_stackbars = g.selectAll(".c-stackbar")
				.selectAll("rect")
				.data((e, group) => {
					return e[list].map((d, i) => {
						return { d: d, i: i, group: group, key: e.key }
					})
				}).enter().append("rect")
				.attr("class", (d, i) => `stackbar stackbar-${i}`)
				.attr("width", (d) => stack_mode ? x.bandwidth() : xGroup[d.group].bandwidth())
				.attr("height", (d) => ((!chart.__stack_mode_last && stack_mode) ? h - y(d.d) : 1))
				.attr("y", (d) => ((!chart.__stack_mode_last && stack_mode) ? y(d.stack) : y(0)))
				.attr("x", (d) => stack_mode ? 0 : xGroup[d.group](d.d))
				.attr("fill", color)
				.style("opacity", 0)




			//Remove
			c_stackbars = g.selectAll(".c-stackbar").data(chart.data()).exit();
			stackbars = g.selectAll(".c-stackbar").data(chart.data()).selectAll(".stackbar").data((d) => d[list]).exit();
			if (transition) {
				c_stackbars.style("opacity", 1);
				c_stackbars.transition().delay(transition.delay).duration(transition.duration * 0.3)
					.style("opacity", 0);

				c_stackbars.transition().delay(transition.delay + transition.duration * 0.3).remove()

				stackbars.style("opacity", 1);
				stackbars.transition().delay(transition.delay).duration(transition.duration * 0.3)
					.style("opacity", 0);

				stackbars.transition().delay(transition.delay + transition.duration * 0.3).remove()
			} else
				c_stackbars.remove(), stackbars.remove()

			//Update
			c_stackbars = g.selectAll(".c-stackbar")
				.data(chart.data())
			stackbars = c_stackbars.selectAll(".stackbar")
				.data((e, group) => {
					stack_cumul = 0;
					return e[list].map((d, i) => {
						stack_cumul += d;
						var ret = { d: d, i: i, group: group, stack: stack_cumul }
						ret[key] = e[key];
						return ret;
					})
				}).call(chart.__event_manager.call());

			if (transition) {
				// transition 2 - position
				c_stackbars.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
					.attr("transform", function (d) { return `translate(${x(d.key)},0)` }).style("opacity", 1)

				if (!chart.__stack_mode_last && stack_mode) {
					stackbars
						.transition()
						.delay(transition.delay + transition.duration * 0.3)
						.duration(transition.duration * 0.4)
						.attr("fill", color)
						.style("opacity", 1)
						.ease(transition.ease)
						.attr("height", (d) => (h - y(d.d)))
						.attr("y", (d) => stack_mode ? y(d.stack) : y(d.d));




					stackbars
						.transition()
						.delay(transition.delay + transition.duration * 0.7)
						.duration(transition.duration * 0.3)
						.attr("width", (d) => stack_mode ? x.bandwidth() : xGroup[d.group].bandwidth())
						.attr("x", (d) => stack_mode ? 0 : xGroup[d.group](d.d))
				} else {
					stackbars
						.transition()
						.delay(transition.delay + transition.duration * 0.3)
						.duration(transition.duration * 0.4)
						.attr("width", (d) => stack_mode ? x.bandwidth() : xGroup[d.group].bandwidth())
						.attr("x", (d) => stack_mode ? 0 : xGroup[d.group](d.d))
						.attr("fill", color)
						.style("opacity", 1);

					stackbars
						.transition()
						.delay(transition.delay + transition.duration * 0.7)
						.duration(transition.duration * 0.3)
						.ease(transition.ease)
						.attr("height", (d) => (h - y(d.d)))
						.attr("y", (d) => stack_mode ? y(d.stack) : y(d.d))

				}


			} else {
				c_stackbars
					.attr("transform", function (d) {
						return `translate(${x(d[key])},0)`
					}).style("opacity", 1);
				stackbars
					.attr("width", (d) => stack_mode ? x.bandwidth() : xGroup[d.group].bandwidth())
					.attr("x", (d) => stack_mode ? 0 : xGroup[d.group](d.d))
					.attr("height", (d) => (h - y(d.d)))
					.attr("y", (d) => stack_mode ? y(d.stack) : y(d.d))
					.attr("fill", color)
					.style("opacity", 1);

			}

			chart.__stack_mode_last = stack_mode;
		}

		chart.__data = undefined
		/**
		 * Set data of chart as a array with parameters
		 * specifieds in chart.key() and chart.list()
		 * @param {Array} data list of data to set chart
		 * @returns the self chart
		 * If you don't send a parameter, you will get the current data of chart
		 * If current data of chart is undefined of the data param sent is invalid,
		 * the function will generate a random list to simulate chart
		 */
		chart.data = function (data) {
			var random = false;

			if (data != undefined) {
				if (data instanceof Array) {
					this.__data = data;
					return this;
				} else if (data)
					random = true;
			}
			if (this.__data == undefined)
				random = true;
			if (random) {
				this.key("key").list("list")
					.__data = jg.generate(jg.getRandom(5, 10),//n elements
						jg.getRandom(2, 3),// min value
						jg.getRandom(4, 5))// max value
						.map(function (d, i) {
							d = jg.generate(d, 40, 350);
							return { key: "d" + i, list: d }
						})
			}
			return data != undefined ? this : this.__data;
		}

		chart.__inner = false;
		/**
		 * Say inner svg container. If false, this will create a svg inselection called
		 * If true, this will be created inner of structure selected in a svg.
		 * @param {boolean} inner mode of creation
		 * @returns the self chart
		 * If you don't send a parameter, you will get the current state inner of chart
		 * when true, the width and heigth parameters should be defined to creation and
		 * redraw.
		 */
		chart.inner = function (inner) {
			if (inner != undefined) {
				chart.__inner = inner;
				return this;
			} else {
				return chart.__inner;
			}

		}

		chart.__width = undefined;
		/**
		 * Define the width of graph
		 * @param {number} width
		 * @returns the self chart
		 */
		chart.width = function (width) {
			if (width != undefined) {
				this.__width = width;
				return this;
			}
			return this.__width || (this.__size_info ? this.__size_info.w : undefined);
		}
		chart.__height = undefined;
		/**
		 * Define the height of graph
		 * @param {number} height
		 * @returns the self chart
		 */
		chart.height = function (height) {
			if (height != undefined) {
				this.__height = height;
				return this;
			}
			return this.__height || (this.__size_info ? this.__size_info.h : undefined);
		}

		chart.__margin = undefined
		/**
		 * Defines a margin around the chart
		 * @param {Object} send a object with params : top, bottom, left, right
		 * @returns the self chart
		 * If you dont sent a parameter, you will get the current margin of chart
		 */
		chart.margin = function (d) {
			if (d) {
				var t = {}
				t.top = d.top || this.__margin.top;
				t.bottom = d.bottom || this.__margin.bottom;
				t.left = d.left || this.__margin.left;
				t.right = d.right || this.__margin.right;
				this.__margin = t;
				return this;
			}
			return chart.__margin || { top: 5, bottom: 20, left: 30, right: 5 };
		}
		chart.__color = undefined;
		/**
		 * Set a color rule to pattern of the stack bar to define the lines of stack bar.
		 * This can be a value of color or a function with 
		 * data(number), index(line), dataset(list of column) as param
		 * @param {Function,String,Array} color The color rule to pattern of the stack bar
		 * @param {boolean} control when true, give total control to param color (be function, String or array)
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current color rule
		 */
		chart.color = function (color) {
			if (color) {
				if (color instanceof Function)
					this.__color = color;
				else if (color instanceof Array)
					this.__color = ((d, i) => color[i]);
				else
					this.__color = color;
				return this;
			}
			return this.__color || ((d, i) => (d3.schemeCategory10[i]));
		}
		chart.__key = undefined
		/**
		 * Set key index in dataset
		 * @param {String} key Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current key indexer
		 */
		chart.key = function (key) {
			if (key) {
				this.__key = key;
				return this;
			}
			return this.__key || "key";
		}
		chart.__list = undefined
		/**
		 * Set list index in dataset
		 * @param {String} list Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current list indexer
		 */
		chart.list = function (list) {
			if (list) {
				this.__list = list;
				return this;
			}
			return this.__list || "list";
		}

		chart.__x_scale = undefined;
		/**
		 * Set the x scale of the chart. this should be a scaleBand
		 * @param {function} scaleBand
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x scale of chart
		 */
		chart.x_scale = function (scaleBand) {
			if (scaleBand) {
				this.__x_scale = scaleBand;
				return this;
			} else
				return chart.__x_scale || d3.scaleBand().domain(chart.x_domain())
					.paddingInner(0.1).paddingOuter(0.1);
		}

		chart.__x_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 */
		chart.x_domain = function (domain) {
			var a = this;
			if (domain) {
				if (domain instanceof Array) {
					this.__x_domain = domain;
					return this;
				}
			} return this.__x_domain ||
				this.data().map(function (d) {
					return d[a.key()]
				})
		}
		chart.__x_range = undefined
		/**
		 * Set range of x. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x range of chart
		 */
		chart.x_range = function (range) {
			if (range) {
				this.__x_range = range;
				return this;
			}
			return this.__x_range || [0, this.width() - this.margin().left - this.margin().right];
		}

		chart.__x_axis = undefined;
		/**
		 * Set axis of x. This should be a d3.axis****()
		 * @param {Object} axis the d3.axis****()
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x axis of chart
		 */
		chart.x_axis = function (axis) {
			if (axis) {
				this.__x_axis = axis;
				return this;
			}
			return this.__x_axis || d3.axisBottom();
		}

		chart.__y_scale = undefined;
		/**
		 * Set the y scale of the chart. this should be a scaleLinear
		 * @param {function} scaleLinear
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y scale of chart
		 */
		chart.y_scale = function (scaleLinear) {
			if (scaleLinear) {
				this.__y_scale = scaleLinear;
				return this;
			} else
				return chart.__y_scale || d3.scaleLinear().domain(chart.y_domain());
		}

		chart.__y_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 */
		chart.y_domain = function (domain) {
			var a = this
			if (domain) {
				if (domain instanceof Array)
					this.__y_domain = domain;
			} return this.__y_domain ||
				[0, d3.max(this.data(),
					function (d) {
						return d3.max(d[a.list()], d => d)
					})]


		}
		chart.__y_range = undefined
		/**
		 * Set range of y. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y range of chart
		 */
		chart.y_range = function (range) {
			if (range) {
				this.__y_range = range;
				return this;
			}
			return this.__y_range || [this.height() - this.margin().top - this.margin().bottom, 0];
		}

		chart.__y_axis = undefined;
		/**
		 * Set axis of y. This should be a d3.axis****()
		 * @param {Object} axis the d3.axis****()
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y axis of chart
		 */
		chart.y_axis = function (axis) {
			if (axis) {
				this.__y_axis = axis;
				return this;
			}
			return this.__y_axis || d3.axisLeft();
		}

		chart.__stack_mode = undefined
		/**
		 * Say if is stack mode. This should be a boolean
		 * @param {boolean} stack_mode informs stack mode
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current status mode
		 * If you sent -1 number, this will be toggle status
		 */
		chart.stack_mode = function (stack_mode) {
			if (stack_mode) {
				if (stack_mode == -1)
					this.__stack_mode = !this.__stack_mode;
				else
					this.__stack_mode = stack_mode;
				return this;
			}
			return this.__stack_mode || false;
		}

		chart.__event_manager = new jg.EventManager();
		/**
		 * Set a event function
		 * This function can recive allow parrameters:
		 * data, index, list, tag
		 * @param {String} type event type (click,mouseover,mouseout,...)
		 * @param {function} func functions to execute
		 * @param {String} name event name(use to retrive and drop the event)
		 */
		chart.on = function (type, func, name) {
			this.__event_manager.event(func, type, name);
			return this;
		}
		/**
		 * Drop a event using the event name
		 * @param {String} name event name
		 */
		chart.drop_event = function (name) {
			this.__event_manager.drop(name);
			return this;
		}

		chart.__tooltip = jg.tooltip();
		chart.__tooltip_text = undefined;
		/**
		 * Set text function to activate tooltip
		 * @param {String, Function} text
		 * 
		 */
		chart.tooltip = function (text) {
			if (text) {
				this.__tooltip.orientation("bottom-left");
				this.on("mouseover", (d, i, e, t) => {
					var p = t.getBoundingClientRect();
					chart.__tooltip.html(text instanceof Function ? text(d, i, e, t) : text)
						.show(p.x + p.width, p.y)
					d3.select(t).style("opacity", 1.0).transition().style("opacity", 0.7)
				}, "tooltip-in")
					.on("mouseout", (d, i, e, t) => {
						chart.__tooltip.hide();
						d3.select(t).transition().style("opacity", 1)
					}, "tooltip-out")

				return this;
			}
			return this.__tooltip;
		}

		chart.data(data);
		chart.__id = jg.__chart_stack_group_bar_counter++;

		return chart;
	}

	jg.__chart_donut = 0;
	/**
	 * Create a slice chart send only the data set with the parameters key and value.
	 * Some settings can be made, like change the name of parameters of data.
	 * @param {Array} data dataset with parameters key and value
	 */
	jg.chart_donut = function (data) {

		var chart = function (context) {

			//General parameters
			var transition = undefined;
			if (context.duration)
				transition = { duration: context.duration(), delay: context.delay(), ease: context.ease() };

			var selection = context.selection ? context.selection() : context;

			if (!chart.inner()) {
				selection.classed("donut-chart", true).classed("donut-chart-" + chart.__id, true);
				var size_info = jg.size_info(".donut-chart-" + chart.__id)
				chart.__size_info = size_info
				selection.classed("donut-chart-" + chart.__id, false);
			}

			var width = chart.width(),		//Width of Chart
				height = chart.height(),	  //Height of chart
				margin = chart.margin(),					  //Margin of chart
				color = chart.color(),					   //Function to define color
				key = chart.key(),						   //String of key
				value = chart.value();					   //String of value

			var outer_radius = Math.min(width, height) / 2 - margin;
			var inner_radius = outer_radius * chart.inner_radius();
			var corner_radius = (outer_radius - inner_radius) * chart.corner_radius();

			var g;
			if (!chart.inner()) {
				//Tags
				//Insert
				selection.selectAll("svg").data([null]).enter().append("svg")
				//Update
				var svg = selection.select("svg").attr("width", width).attr("height", height);
				//Insert
				svg.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${width / 2},${height / 2})`)
				//Update
				g = selection.select("g");
			} else {
				selection.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${width / 2},${height / 2})`);
				g = selection.select("g");
			}


			//Conditional Transition
			if (transition)
				g.transition().delay(transition.delay).duration(transition.duration)
					.attr("transform", `translate(${width / 2},${height / 2})`);
			else
				g.attr("transform", `translate(${width / 2},${height / 2})`);

			//Slices
			var data = jg.deep_copy(chart.data());

			data.map((d, i) => { d.ord = i });

			var pie = d3.pie()
				.sort((d1, d2) => (d1.ord > d2.ord ? 1 : (d1.ord < d2.ord ? -1 : 0)))
				.value((d) => d[value])

			var arcs = pie(data);

			var arc_gen = d3.arc()
				.innerRadius(inner_radius)
				.outerRadius(outer_radius)
				.cornerRadius(corner_radius);

			//Insert
			var data_insert = [];
			for (var i = 0; i < chart.data().length; i++)
				data_insert.push(0);

			var pie_insert = (d3.pie())(data_insert)

			var slices = g.selectAll(".slice")
				.data(pie_insert).enter()
				.append("g")
				.attr("class", (d, i) => "slice slice-" + i)
				.style("opacity", 0)
				.append("path")
				.attr("fill", color)
				.attr("d", arc_gen)
				.each(function () { this._current = { startAngle: Math.PI * 2, endAngle: Math.PI * 2 }; });

			//Remove
			slices = g.selectAll(".slice").data(chart.data()).exit()
			if (transition) {
				slices.transition().delay(transition.delay)
					.duration(transition.duration * 0.3)
					.style("opacity", 0)
				slices.transition()
					.delay(transition.delay + transition.duration * 0.3)
					.remove();
			} else {
				slices.remove();
			}

			//Update


			slices = g.selectAll(".slice").data(arcs)

			if (transition) {

				slices.interrupt().style("opacity", 1)
					.transition().delay(transition.delay + transition.duration * 0.3)
					.duration(transition.duration * 0.7)
					.ease(transition.ease)
					.select("path")
					.attr("fill", color)
					.attrTween("d", function (d) {
						var interpolate = d3.interpolate(this._current, d);
						this._current = interpolate(0);
						return function (t) {
							return arc_gen(interpolate(t));
						};
					});
			} else {
				slices
					.style("opacity", 1)
					.select("path")
					.attr("fill", color)
					.attr("d", arc_gen)
			}
			g.selectAll(".slice").data(chart.data())
				.call(chart.__event_manager.call());


		}

		chart.__data = undefined
		/**
		 * Set data of chart as a array with parameters
		 * specifieds in chart.key() and chart.value()
		 * @param {Array} data list of data to set chart
		 * @retuerns the self chart
		 * If you don't send a parameter, you will get the current data of chart
		 * If current data of chart is undefined of the data param sent is invalid,
		 * the function will generate a random value to simulate chart
		 */
		chart.data = function (data) {
			var random = false;

			if (data != undefined) {
				if (data instanceof Array) {
					this.__data = data;
					return this;
				} else
					random = true;
			}
			if (this.__data == undefined)
				random = true;
			if (random) {
				this.key("key").value("value")
					.__data = jg.generate(jg.getRandom(5, 10),//n elements
						jg.getRandom(20, 30),// min value
						jg.getRandom(40, 50))// max value
						.map(function (d, i) { return { key: "d" + i, value: d } })
			}
			return data != undefined ? this : this.__data;
		}

		chart.__inner = false;
		/**
		 * Say inner svg container. If false, this will create a svg inselection called
		 * If true, this will be created inner of structure selected in a svg.
		 * @param {boolean} inner mode of creation
		 * @returns the self chart
		 * If you don't send a parameter, you will get the current state inner of chart
		 * when true, the width and heigth parameters should be defined to creation and
		 * redraw.
		 */
		chart.inner = function (inner) {
			if (inner != undefined) {
				chart.__inner = inner;
				return this;
			} else {
				return chart.__inner;
			}

		}

		chart.__width = undefined;
		/**
		 * Define the width of graph
		 * @param {number} width
		 * @returns the self chart
		 */
		chart.width = function (width) {
			if (width != undefined) {
				this.__width = width;
				return this;
			}
			return this.__width || (this.__size_info ? this.__size_info.w : undefined);
		}
		chart.__height = undefined;
		/**
		 * Define the height of graph
		 * @param {number} height
		 * @returns the self chart
		 */
		chart.height = function (height) {
			if (height != undefined) {
				this.__height = height;
				return this;
			}
			return this.__height || (this.__size_info ? this.__size_info.h : undefined);
		}

		chart.__margin = undefined
		/**
		 * Defines a margin around the chart
		 * @param {number} margin value of constant margin
		 * @returns the self chart
		 * If you dont sent a parameter, you will get the current margin of chart
		 */
		chart.margin = function (margin) {
			if (margin != undefined) {
				this.__margin = margin
				return this;
			}
			return chart.__margin || 5;
		}
		chart.__color = undefined;
		/**
		 * Set a color rule to pattern of the stack slice to define the lines of stack slice.
		 * This can be a value of color or a function with 
		 * data(number), index(line), dataset(list of column) as param
		 * @param {Function,String,Array} color The color rule to pattern of the stack slice
		 * @param {boolean} control when true, give total control to param color (be function, String or array)
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current color rule
		 */
		chart.color = function (color) {
			if (color) {
				if (color instanceof Function)
					this.__color = color;
				else if (color instanceof Array)
					this.__color = ((d, i) => color[i]);
				else
					this.__color = color;
				return this;
			}
			return this.__color || ((d, i) => (d3.schemeCategory10[i]));
		}
		chart.__key = undefined
		/**
		 * Set key index in dataset
		 * @param {String} key Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current key indexer
		 */
		chart.key = function (key) {
			if (key) {
				this.__key = key;
				return this;
			}
			return this.__key || "key";
		}
		chart.__value = undefined
		/**
		 * Set value index in dataset
		 * @param {String} value Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current value indexer
		 */
		chart.value = function (value) {
			if (value) {
				this.__value = value;
				return this;
			}
			return this.__value || "value";
		}

		chart.__inner_radius = 0;
		/**
		 * Set percent of inner radius
		 * @param {number} inner_radius value between 0 and 1
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current value inner_radius
		 */
		chart.inner_radius = function (inner_radius) {
			if (inner_radius != undefined) {
				this.__inner_radius = inner_radius;
				return this;
			}
			return this.__inner_radius;
		}

		chart.__corner_radius = 0;
		/**
		 * Set percent of corner radius
		 * @param {number} corner_radius value between 0 and 1
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current value corner_radius
		 */
		chart.corner_radius = function (corner_radius) {
			if (corner_radius != undefined) {
				this.__corner_radius = corner_radius;
				return this;
			}
			return this.__corner_radius;
		}

		chart.__event_manager = new jg.EventManager();
		/**
		 * Set a event function
		 * This function can recive allow parrameters:
		 * data, index, list, tag
		 * @param {String} type event type (click,mouseover,mouseout,...)
		 * @param {function} func functions to execute
		 * @param {String} name event name(use to retrive and drop the event)
		 */
		chart.on = function (type, func, name) {
			this.__event_manager.event(func, type, name);
			return this;
		}
		/**
		 * Drop a event using the event name
		 * @param {String} name event name
		 */
		chart.drop_event = function (name) {
			this.__event_manager.drop(name);
			return this;
		}

		chart.__tooltip = jg.tooltip();
		chart.__tooltip_text = undefined;
		/**
		 * Set text function to activate tooltip
		 * @param {String, Function} text
		 * 
		 */
		chart.tooltip = function (text) {
			if (text) {
				this.__tooltip.orientation("top-left").dy(20).dx(10);
				this.on("mousemove", (d, i, e, t) => {
					chart.__tooltip.html(text instanceof Function ? text(d, i, e, t) : text)
						.show()
					d3.select(t).style("opacity", 1.0).transition().style("opacity", 0.7)
				}, "tooltip-in")
					.on("mouseout", (d, i, e, t) => {
						chart.__tooltip.hide();
						d3.select(t).transition().style("opacity", 1)
					}, "tooltip-out")

				return this;
			}
			return this.__tooltip;
		}

		chart.data(data);
		chart.__id = jg.__chart_slice_counter++;

		return chart;
	}

	jg.__chart_line = 0;
	/**
	 * Create a line chart send only the data set with the parameters category and list with objects(key and value).
	 * Some settings can be made, like change the name of parameters of data.
	 * @param {Array} data dataset with parameters key and value
	 */
	jg.chart_line = function (data) {

		var chart = function (context) {

			//General parameters
			var transition = undefined;
			if (context.duration)
				transition = { duration: context.duration(), delay: context.delay(), ease: context.ease() };

			var selection = context.selection ? context.selection() : context;

			if (!chart.inner()) {
				selection.classed("line-chart", true).classed("line-chart-" + chart.__id, true);
				var size_info = jg.size_info(".line-chart-" + chart.__id)
				chart.__size_info = size_info
				selection.classed("line-chart-" + chart.__id, false);
			}

			var width = chart.width(),		//Width of Chart
				height = chart.height(),	  //Height of chart
				margin = chart.margin()					  //Margin of chart
			if (width < margin.left + margin.right + 40)
				margin.right = 0, margin.left = -1;
			if (height < margin.top + margin.bottom + 10)
				margin.top = 1, margin.bottom = 3;
			if (height < margin.top + margin.bottom + 2)
				margin.top = 0, margin.bottom = 0;
			// TODO vai mas não volta - corrigir depois (eixos)
			chart.margin(margin);
			color = chart.color(),					   //Function to define color
				category = chart.category(),						   //String of category
				list = chart.list(),					   //String of list
				key = chart.key(),						   //String of key
				value = chart.value();					   //String of value

			var g;
			if (!chart.inner()) {
				//Tags
				//Insert
				selection.selectAll("svg").data([null]).enter().append("svg")
				//Update
				var svg = selection.select("svg").attr("width", width).attr("height", height);
				//Insert
				svg.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`)
				//Update
				g = selection.select("g");
			} else {
				selection.selectAll("g").data([null]).enter().append("g")
					.attr("transform", `translate(${margin.left},${margin.top})`);
				g = selection.select("g");
			}


			//Conditional Transition
			if (transition)
				g.transition().delay(transition.delay).duration(transition.duration)
					.attr("transform", `translate(${margin.left},${margin.top})`);
			else
				g.attr("transform", `translate(${margin.left},${margin.top})`);

			var h = chart.y_range()[0];

			var x = chart.x_scale().range(chart.x_range())
				,
				y = chart.y_scale().range(chart.y_range());

			var xAxis = chart.x_axis().scale(x),
				yAxis = chart.y_axis().scale(y);

			//Insert
			g.selectAll(".chart-axis").data([{ k: "x", v: xAxis }, { k: "y", v: yAxis }]).enter().append("g")
				.attr("class", function (d) { return "chart-axis chart-axis-" + d.k })
				.attr("transform", function (d) { if (d.k == "x") return `translate(0,${h})` });

			//Update
			var xAxisGroup = g.select(".chart-axis-x"),
				yAxisGroup = g.select(".chart-axis-y")

			//Conditional Transition
			if (transition) {
				xAxisGroup.transition().delay(transition.delay + transition.duration * 0.3)
					.duration(transition.duration * 0.7)
					.call(xAxis)
					.attr("transform", `translate(0,${h})`);
				yAxisGroup.transition().delay(transition.delay + transition.duration * 0.3)
					.duration(transition.duration * 0.7)
					.call(yAxis);
			} else {
				xAxisGroup.call(xAxis)
					.attr("transform", `translate(0,${h})`);
				yAxisGroup
					.call(yAxis);
			}

			//Lines
			//Insert
			var lines = g.selectAll(".line")
				.data(chart.data()).enter()
				.append("g")
				.attr("class", (d, i) => "line line-" + i)
				.style("opacity", 0)

			lines.append("path").attr("d", (d) => {

				var ret = `M ${x(d[list][0][key]) + x.bandwidth() / 2} ${h}`;
				for (var i = 1; i < d[list].length; i++) {
					ret += `\nL ${x(d[list][i][key]) + x.bandwidth() / 2} ${h}`;
				}
				return ret;
			}).attr("stroke", color)
				.attr("stroke-width", chart.stroke())
				.attr("fill", "none")
				.each(function (d) {
					this._current = jg.deep_copy(d);
					this._current[list].map((d) => {
						d[value] = 0;
					})
				});
			
			g.selectAll(".line")
				.data(chart.data()).selectAll(".dot").data((d, i) => {
				return d[list].map((e) => {
					e[category] = d[category];
					e.cat_index = i;
					return e;
				})
			}).enter().append("g")
				.attr("class", (d, i) => `dot dot-${i}`)
				.attr("transform", (d,i,j) => {
					var last_d = j[i].parentElement.firstChild.attributes.d.nodeValue;
						var last_x_y = ([...last_d
							.match(/(\d+\.?\d*) (\d+\.?\d*)$/)
						]);
					return `translate(${last_x_y[1]},${last_x_y[2]})`
				})
				.call(chart.dots());

			//Remove
			lines = g.selectAll(".line").data(chart.data());
			dots = lines.selectAll(".dot").data((d)=>d[list]).exit();
			lines = lines.exit();
			if (transition) {
				lines.transition().delay(transition.delay).duration(transition.duration * 0.3)
					.style("opacity", 0)
					.select("path")
					.attr("d", (d, i, j) => {
						var last_d = d3.select(j[i]).attr("d");
						var last_x = ([...last_d
							.matchAll(/[ML] (\d+\.?\d*) \d+\.?\d*/g)
						]).map(d => parseFloat(d[1]));

						var ret = `M ${last_x[0]} ${h}`;
						for (var i = 1; i < last_x.length; i++) {
							ret += `\nL ${last_x[i]} ${h}`;
						}
						return ret;
					})
				dots.transition().delay(transition.delay).duration(transition.duration * 0.3)
					.style("opacity", 0)
				lines.transition().delay(transition.delay + transition.duration * 0.3).remove()
				dots.transition().delay(transition.delay + transition.duration * 0.3).remove()
			} else
				lines.remove()

			//Update
			lines = g.selectAll(".line").data(chart.data());
				
			
			dots = lines.selectAll(".dot").data((d, i) => {
				return d[list].map((e) => {
					e[category] = d[category];
					e.cat_index = i;
					return e;
				})
			}).call(chart.__event_manager.call());

			function line_format(a, n) {
				var ret = `M ${x(a[list][0][key]) + x.bandwidth() / 2} ${y(a[list][0][value])}`;
				for (var i = 1; i < a[list].length; i++) {
					ret += `\nL ${x(a[list][i][key]) + x.bandwidth() / 2} ${y(a[list][i][value])}`;
				}
				for (var j = i; j < i + n; j++)
					ret += `\nL ${x(a[list][i - 1][key]) + x.bandwidth() / 2} ${y(a[list][i - 1][value])}`;
				return ret;
			}
			if (transition) {
				lines.interrupt()
					.select("path")
					.attr("d", (d, i, j) => {
						var last_d = d3.select(j[i]).attr("d");
						var last_x_y = ([...last_d
							.matchAll(/[ML] (\d+\.?\d*) (\d+\.?\d*)/g)
						]);
						var n = d[list].length - last_x_y.length;
						var repeat = last_x_y[last_x_y.length - 1];
						for (var k = 0; k < n; k++)
							last_d += `\nL ${repeat[1]} ${repeat[2]}`;
						return last_d;
					})

				lines
					.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.7)
					.style("opacity", 1)
					.select("path")
					.ease(transition.ease)
					.attr("d", (d, i, j) => {
						var last_d = d3.select(j[i]).attr("d");
						var last_x_y = ([...last_d
							.matchAll(/[ML] (\d+\.?\d*) (\d+\.?\d*)/g)
						]);
						var n = last_x_y.length - d[list].length;

						return line_format(d, n);
					})
					.attr("stroke", color)
					.attr("stroke-width", chart.stroke())
					.attr("fill", "none")
					
				dots.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.7)
				.ease(transition.ease)
					.attr("transform", (d) => `translate(${x(d[key]) + x.bandwidth() / 2},${y(d[value])})`)
					.call(chart.dots());

				lines
					.transition().delay(transition.delay + transition.duration)
					.attr("d", line_format);

				/** */
			} else {
				lines
					.style("opacity", 1)
					.select("path")
					.attr("d", (d) => {
						var ret = `M ${x(d[list][0][key]) + x.bandwidth() / 2} ${y(d[list][0][value])}`;
						for (var i = 1; i < d[list].length; i++) {
							ret += `\nL ${x(d[list][i][key]) + x.bandwidth() / 2} ${y(d[list][i][value])}`;
						}
						return ret;
					})
					.attr("stroke", color)
					.attr("fill", "none")
			}


		}

		chart.__data = undefined
		/**
		 * Set data of chart as a array with parameters
		 * specifieds in chart.category() and chart.list()
		 * and in list a array of objects with parameters 
		 * specifieds in chart.key() and chart.value()
		 * @param {Array} data list of data to set chart
		 * @retuerns the self chart
		 * If you don't send a parameter, you will get the current data of chart
		 * If current data of chart is undefined of the data param sent is invalid,
		 * the function will generate a random value to simulate chart
		 */
		chart.data = function (data) {
			var random = false;

			if (data != undefined) {
				if (data instanceof Array) {
					this.__data = data;
					return this;
				} else
					random = true;
			}
			if (this.__data == undefined)
				random = true;
			if (random) {
				var n_elements = jg.getRandom(7, 12);

				this.category("category").list("list").key("key").value("value")
					.__data = jg.range(jg.getRandom(1, 4))//n elements
						.map(function (d) {
							return {
								category: "c" + d,
								list: jg.generate(n_elements,//n elements
									jg.getRandom(0, 20),// min value
									jg.getRandom(40, 50))// max value
									.map(function (d, i) { return { key: "d" + i, value: d } })
							}
						})
			}
			return data != undefined ? this : this.__data;
		}

		chart.__inner = false;
		/**
		 * Say inner svg container. If false, this will create a svg inselection called
		 * If true, this will be created inner of structure selected in a svg.
		 * @param {boolean} inner mode of creation
		 * @returns the self chart
		 * If you don't send a parameter, you will get the current state inner of chart
		 * when true, the width and heigth parameters should be defined to creation and
		 * redraw.
		 */
		chart.inner = function (inner) {
			if (inner != undefined) {
				chart.__inner = inner;
				return this;
			} else {
				return chart.__inner;
			}

		}

		chart.__width = undefined;
		/**
		 * Define the width of graph
		 * @param {number} width
		 * @returns the self chart
		 */
		chart.width = function (width) {
			if (width != undefined) {
				this.__width = width;
				return this;
			}
			return this.__width || (this.__size_info ? this.__size_info.w : undefined);
		}
		chart.__height = undefined;
		/**
		 * Define the height of graph
		 * @param {number} height
		 * @returns the self chart
		 */
		chart.height = function (height) {
			if (height != undefined) {
				this.__height = height;
				return this;
			}
			return this.__height || (this.__size_info ? this.__size_info.h : undefined);
		}

		chart.__margin = undefined
		/**
		 * Defines a margin around the chart
		 * @param {Object} send a object with params : top, bottom, left, right
		 * @returns the self chart
		 * If you dont sent a parameter, you will get the current margin of chart
		 */
		chart.margin = function (d) {
			if (d) {
				var t = {}
				t.top = d.top || this.__margin.top;
				t.bottom = d.bottom || this.__margin.bottom;
				t.left = d.left || this.__margin.left;
				t.right = d.right || this.__margin.right;
				this.__margin = t;
				return this;
			}
			return chart.__margin || { top: 10, bottom: 20, left: 30, right: 10 };
		}
		chart.__color = undefined;
		/**
		 * Set a color rule to pattern of the stack bar to define the lines of stack bar.
		 * This can be a value of color or a function with 
		 * data(number), index(line), dataset(list of column) as param
		 * @param {Function,String,Array} color The color rule to pattern of the stack bar
		 * @param {boolean} control when true, give total control to param color (be function, String or array)
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current color rule
		 */
		chart.color = function (color) {
			if (color) {
				if (color instanceof Function)
					this.__color = color;
				else if (color instanceof Array)
					this.__color = ((d, i) => color[i]);
				else
					this.__color = color;
				return this;
			}
			return this.__color || ((d, i) => (d3.schemeCategory10[i]));
		}

		chart.__category = undefined
		/**
		 * Set category index in dataset
		 * @param {String} category Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current category indexer
		 */
		chart.category = function (category) {
			if (category) {
				this.__category = category;
				return this;
			}
			return this.__category || "category";
		}
		chart.__list = undefined
		/**
		 * Set list index in dataset
		 * @param {String} list Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current list indexer
		 */
		chart.list = function (list) {
			if (list) {
				this.__list = list;
				return this;
			}
			return this.__list || "list";
		}

		chart.__key = undefined
		/**
		 * Set key index in dataset
		 * @param {String} key Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current key indexer
		 */
		chart.key = function (key) {
			if (key) {
				this.__key = key;
				return this;
			}
			return this.__key || "key";
		}
		chart.__value = undefined
		/**
		 * Set value index in dataset
		 * @param {String} value Name of param in data set
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current value indexer
		 */
		chart.value = function (value) {
			if (value) {
				this.__value = value;
				return this;
			}
			return this.__value || "value";
		}

		chart.__x_scale = undefined;
		/**
		 * Set the x scale of the chart. this should be a compatible with key scale
		 * @param {function} scale
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x scale of chart
		 */
		chart.x_scale = function (scale) {
			if (scale) {
				this.__x_scale = scale;
				return this;
			} else
				return chart.__x_scale || d3.scaleBand().domain(chart.x_domain());
		}

		chart.__x_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 * If x domain is not set, will be generated by keys of first row of dataset
		 */
		chart.x_domain = function (domain) {
			var a = this;
			if (domain) {
				if (domain instanceof Array) {
					this.__x_domain = domain;
					return this;
				}
			} return this.__x_domain ||
				this.data()[0][a.list()].map(function (d) {
					return d[a.key()]
				})
		}
		chart.__x_range = undefined
		/**
		 * Set range of x. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x range of chart
		 */
		chart.x_range = function (range) {
			if (range) {
				this.__x_range = range;
				return this;
			}
			return this.__x_range || [0, this.width() - this.margin().left - this.margin().right];
		}

		chart.__x_axis = undefined;
		/**
		 * Set axis of x. This should be a d3.axis****()
		 * @param {Object} axis the d3.axis****()
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x axis of chart
		 */
		chart.x_axis = function (axis) {
			if (axis) {
				this.__x_axis = axis;
				return this;
			}
			return this.__x_axis || d3.axisBottom();
		}

		chart.__y_scale = undefined;
		/**
		 * Set the y scale of the chart. this should be a scaleLinear
		 * @param {function} scaleLinear
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y scale of chart
		 */
		chart.y_scale = function (scaleLinear) {
			if (scaleLinear) {
				this.__y_scale = scaleLinear;
				return this;
			} else
				return chart.__y_scale || d3.scaleLinear().domain(chart.y_domain());
		}

		chart.__y_domain = undefined;
		/**
		 * Set domain of x scale
		 * @param {Array} domain specify the domain
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current x domain of chart
		 */
		chart.y_domain = function (domain) {
			var a = this
			if (domain) {
				if (domain instanceof Array)
					this.__y_domain = domain;
			} return this.__y_domain ||
				[0, d3.max(this.data(),
					function (d) {
						return d3.max(d[a.list()], d => d[a.value()])
					})]


		}
		chart.__y_range = undefined
		/**
		 * Set range of y. This should be a Array of numbers
		 * @param {Array} range Fixed range to chart
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y range of chart
		 */
		chart.y_range = function (range) {
			if (range) {
				this.__y_range = range;
				return this;
			}
			return this.__y_range || [this.height() - this.margin().top - this.margin().bottom, 0];
		}
		chart.__y_axis = undefined;
		/**
		 * Set axis of y. This should be a d3.axis****()
		 * @param {Object} axis the d3.axis****()
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current y axis of chart
		 */
		chart.y_axis = function (axis) {
			if (axis) {
				this.__y_axis = axis;
				return this;
			}
			return this.__y_axis || d3.axisLeft();
		}

		chart.__stroke = undefined
		/**
		 * Set stroke of lines
		 * @param {String,number,function} stroke attr of lines
		 * @return the self chart
		 * If you dont sent a parameter, you will get the current stroke
		 */
		chart.stroke = function (stroke) {
			if (stroke) {
				this.__stroke = stroke;
				return this;
			}
			return this.__stroke || "2px";
		}

		chart.__dots = undefined;
		/**
		 * Set a behavior to draw dots
		 * This function will be called inside of dots groups
		 * this need recive a selection and works with this.
		 * @param {Function} dots
		 * @returns the self chart
		 * If you dont sent a parameter, you will get the current dots function
		 */
		chart.dots = function (dots) {
			if (dots instanceof Function) {
				this.__dots = dots;
				return this;
			}
			return this.__dots || ((context) => {
				//General parameters
				var transition = undefined;
				if (context.duration)
					transition = { duration: context.duration(), delay: context.delay(), ease: context.ease() };

				var selection = context.selection ? context.selection() : context;
				
				selection.selectAll("circle").data((d)=>[d]).enter().append("circle").attr("r", 0)
					.attr("stroke", (d) => (chart.color()(undefined, d.cat_index)))
					.attr("stroke-width", 2).attr("fill", "white");

				if (transition)
					selection.select("circle").transition()
						.delay(transition.delay)
						.duration(transition.duration)
						.attr("r", 3)
						.attr("stroke", (d) => (chart.color()(undefined, d.cat_index)))
						.attr("stroke-width", 2).attr("fill", "white");
				else
					selection.select("circle").attr("r", 3)
						.attr("stroke", (d) => (chart.color()(undefined, d.cat_index)))
						.attr("stroke-width", 2).attr("fill", "white");
			});
		}

		chart.__event_manager = new jg.EventManager();
		/**
		 * Set a event function
		 * This function can recive allow parrameters:
		 * data, index, list, tag
		 * @param {String} type event type (click,mouseover,mouseout,...)
		 * @param {function} func functions to execute
		 * @param {String} name event name(use to retrive and drop the event)
		 */
		chart.on = function (type, func, name) {
			this.__event_manager.event(func, type, name);
			return this;
		}
		/**
		 * Drop a event using the event name
		 * @param {String} name event name
		 */
		chart.drop_event = function (name) {
			this.__event_manager.drop(name);
			return this;
		}

		chart.__tooltip = jg.tooltip();
		chart.__tooltip_text = undefined;
		/**
		 * Set text function to activate tooltip
		 * @param {String, Function} text
		 * 
		 */
		chart.tooltip = function (text) {
			if (text) {
				this.__tooltip.orientation("bottom-left");
				this.on("mouseover", (d, i, e, t) => {
					var p = t.getBoundingClientRect();
					chart.__tooltip.html(text instanceof Function ? text(d, i, e, t) : text)
						.show(p.x + p.width, p.y)
					d3.select(t).style("opacity", 1.0).transition().style("opacity", 0.7)
				}, "tooltip-in")
					.on("mouseout", (d, i, e, t) => {
						chart.__tooltip.hide();
						d3.select(t).transition().style("opacity", 1)
					}, "tooltip-out")

				return this;
			}
			return this.__tooltip;
		}

		chart.data(data);
		chart.__id = jg.__chart_line_counter++;

		return chart;
	}
})()