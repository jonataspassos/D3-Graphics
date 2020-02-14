(() => {
    jg = {};

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

        chart = function (context) {

            //General parameters
            var transition = undefined;
            if (context.duration)
                transition = { duration: context.duration(), delay: context.delay(), ease: context.ease() };

            var selection = context.selection ? context.selection() : context;
            selection.classed("bar-chart", true).classed("bar-chart-" + this.counter, true);
            var size_info = jg.size_info(".bar-chart-" + this.counter)
            var width = chart.width() || size_info.w,        //Width of Chart
                height = chart.height() || size_info.h,      //Height of chart
                margin = chart.margin()                      //Margin of chart
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

            var w = width - margin.left - margin.right,
                h = height - margin.top - margin.bottom;

            var x = chart.x_scale() || d3.scaleBand().domain(chart.x_domain()).range(chart.x_range() || [0, w])
                .paddingInner(0.1).paddingOuter(0.1),
                y = chart.y_scale() || d3.scaleLinear().domain(chart.y_domain()).range(chart.y_range() || [h, 0]);

            var xAxis = chart.x_axis() || d3.axisBottom(x),
                yAxis = chart.x_axis() || d3.axisLeft(y);

            //Insert
            g.selectAll(".chart-axis").data([{ k: "x", v: xAxis }, { k: "y", v: yAxis }]).enter().append("g")
                .attr("class", function (d) { return "chart-axis chart-axis-" + d.k })
                .attr("transform", function (d) { if (d.k == "x") return `translate(0,${h})` });

            //Update
            var xAxisGroup = g.select(".chart-axis-x"),
                yAxisGroup = g.select(".chart-axis-y")

            //Conditional Transition
            if (transition) {
                xAxisGroup.transition().delay(transition.delay+transition.duration*0.3)
                    .duration(transition.duration*0.7)
                    .call(xAxis)
                    .attr("transform", `translate(0,${h})`);
                yAxisGroup.transition().delay(transition.delay+transition.duration*0.3).duration(transition.duration*0.7)
                    .call(yAxis);
            } else {
                xAxisGroup.call(xAxis)
                    .attr("transform", `translate(0,${h})`);
                yAxisGroup
                    .call(yAxis);
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
            return data ? this : this.__data;
        }
        chart.width = function () { }
        chart.height = function () { }

        chart.__margin = { top: 10, bottom: 20, left: 20, right: 10 }
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
            return chart.__margin;
        }
        chart.color = function () { }
        chart.__key = "key"
        /**
         * Set key index in dataset
         * @param {String} key Name of param in data set
         */
        chart.key = function (key) {
            if (key) {
                this.__key = key;
                return this;
            }
            return this.__key;
        }
        chart.__value = "value"
        /**
         * Set value index in dataset
         * @param {String} value Name of param in data set
         */
        chart.value = function (value) {
            if (value) {
                this.__value = value;
                return this;
            }
            return this.__value;
        }

        chart.x_scale = function () { }

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
        chart.x_range = function () { }
        chart.x_axis = function () { }
        chart.y_scale = function () { }

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
        chart.y_range = function () { }
        chart.y_axis = function () { }

        chart.data(data);
        chart.counter = jg.chart_bar_counter++;

        return chart;
    }

    chart = jg.chart_bar();

})()