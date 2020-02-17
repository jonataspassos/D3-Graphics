
(() => {
    jg = {};
    jg.y = {}

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
            selection.classed("bar-chart", true).classed("bar-chart-" + chart.__counter, true);
            var size_info = jg.size_info(".bar-chart-" + chart.__counter)
            chart.__size_info = size_info
            selection.classed("bar-chart-" + chart.__counter, false);
            var width = chart.width(),        //Width of Chart
                height = chart.height(),      //Height of chart
                margin = chart.margin()                      //Margin of chart
            if (width < margin.left + margin.right + 40)
                margin.right = 0, margin.left = -1;
            if (height < margin.top + margin.bottom + 10)
                margin.top = 1, margin.bottom = 3;
            if (height < margin.top + margin.bottom + 2)
                margin.top = 0, margin.bottom = 0;
            chart.margin(margin);
            color = chart.color(),                       //Function to define color
                key = chart.key(),                           //String of key
                value = chart.value();                       //String of value

            //Tags
            //Insert
            selection.selectAll("svg").data([null]).enter().append("svg")
            //Update
            var svg = selection.select("svg").attr("width", width).attr("height", height);
            //Insert
            svg.selectAll("g").data([null]).enter().append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
            //Update
            var g = selection.select("g");

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
            var bars = g.selectAll(".bar").data(chart.data()).enter().append("g").attr("class", "bar")
                .attr("transform", function (d) { return `translate(${x(d[key])},${h})` })
            bars.append("rect").attr("width", x.bandwidth()).attr("fill",color);
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
            bars = g.selectAll(".bar").data(chart.data());
            if (transition) {
                bars.transition().delay(transition.delay + transition.duration * 0.3).duration(transition.duration * 0.4)
                    .attr("transform", function (d) { return `translate(${x(d[key])},${h})` })
                    .select("rect").attr("width", x.bandwidth())
                bars.transition().delay(transition.delay + transition.duration * 0.7).duration(transition.duration * 0.3)
                    .select("rect").attr("height", function (d) { return h - y(d[value]) })
                    .attr("y", function (d) { return y(d[value]) - h })
                    .attr("fill",color)
            } else {
                bars.attr("transform", function (d) { return `translate(${x(d[key])},${h})` })
                    .select("rect").attr("width", x.bandwidth()).attr("height", function (d) { return h - y(d[value]) })
                    .attr("y", function (d) { return y(d[value]) - h })
                    .attr("fill",color)
            }


        }

        chart.__data = undefined
        /**
         * Set data of chart as a array with parameters
         * specifieds in chart.key() and chart.value()
         * @param {Array} data list of data to set chart
         * @returns the self chart
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
            return data!=undefined ? this : this.__data;
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
            return this.__width || this.__size_info ? this.__size_info.w : undefined;
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
            return this.__height || this.__size_info ? this.__size_info.h : undefined;
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
         * Set a color rule to bars. This can be a value of color or a function with data, index, dataset as param
         * @param {Function,String} color The color rule to the bars
         * @return the self chart
         * If you dont sent a parameter, you will get the current color rule
         */
        chart.color = function (color) {
            if(color) {
                this.__color = color;
                return this;
            }
            return this.__color || "steelblue";
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
                if (domain instanceof Array)
                    this.__x_domain = domain;
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
        chart.__x_range = undefined
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

        chart.data(data);
        chart.__counter = jg.__chart_bar_counter++;

        return chart;
    }



})()

chart = jg.chart_bar();
function repeat() { setTimeout(() => d3.select("#vis").transition().duration(2000).call(chart.data(true)).on("end", repeat), 1000) }
repeat();