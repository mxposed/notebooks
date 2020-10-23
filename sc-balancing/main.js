//
//  Touchable.js
//
//  Created by Bret Victor on 3/10/11.
//  (c) 2011 Bret Victor.  MIT open-source license.
//

function makeTouchable(el, delegate) {

    var initialize = function () {
        el.addEventListener("mousedown", mouseDown);
        el.addEventListener("touchstart", touchStart);
    };

    var mouseDown = function (e) {
        e.preventDefault();
        document.body.addEventListener("mousemove", mouseMove);
        document.body.addEventListener("mouseup", mouseUp);
        delegate.touchDown(e, e.pageX, e.pageY);
    };

    var mouseMove = function (e) {
        e.preventDefault();
        delegate.touchMove(e, e.pageX, e.pageY);
    };

    var mouseUp = function (e) {
        e.preventDefault();
        delegate.touchUp(e, e.pageX, e.pageY);
        document.body.removeEventListener("mousemove", mouseMove);
        document.body.removeEventListener("mouseup", mouseUp);
    };

    var touchStart = function (e) {
        e.preventDefault();
        document.body.addEventListener("touchmove", touchMove);
        document.body.addEventListener("touchend", touchEnd);
        document.body.addEventListener("touchcancel", touchCancel);
        var pt = getTouchPoint(e);
        delegate.touchDown(e,pt[0],pt[1]);
    };

    var touchMove = function (e) {
        e.preventDefault();
        var pt = getTouchPoint(e);
        delegate.touchMove(e,pt[0],pt[1]);
    };

    var touchEnd = function (e) {
        e.preventDefault();
        var pt = getTouchPoint(e);
        delegate.touchUp(e,pt[0],pt[1]);
        document.body.removeEventListener("touchmove", touchMove);
        document.body.removeEventListener("touchend", touchEnd);
        document.body.removeEventListener("touchcancel", touchCancel);
    };

    var touchCancel = function (e) {
        touchEnd(e);
    };

    var getTouchPoint = function (e) {
        if (e.pageX !== undefined) { return [e.pageX, e.pageY]; }
        if (e.targetTouches && e.targetTouches[0]) { return [e.targetTouches[0].pageX, e.targetTouches[0].pageY]; }
        return [0,0];
    };

    initialize();
};

const $List = function(list) {
    this.nodes = list;
};

$List.prototype.has = function(x) {
    for (var i = 0, I = this.nodes.length; i < I; i++) {
        var node = this.nodes[i];
        if (x[0] == "#" && node.id == x.substr(1)) {
            return true;
        } else if (x[0] == ".") {
            if (node.getAttribute("class").split(/\s+/).indexOf(x.substr(1)) > -1) {
                return true;
            }
        } else {
            if (node.tagName && node.tagName.toLowerCase() == x) {
                return true;
            }
        }
    }
    return false;
};

const $ = function(x) {
    if (x[0] == "#") {
        return document.getElementById(x.substr(1));
    }
    if (x[0] == ".") {
        return document.getElementsByClassName(x.substr(1));
    }
    return document.getElementsByTagName(x);
};

$.new = function(tag) {
    return document.createElement(tag);
};

$.addClass = function(el, x) {
    let klass = el.getAttribute("class");
    if (klass === null) {
        klass = x;
    } else {
        if (klass.length > 0) {
            klass += " ";
        }
        klass += x;
    }
    el.setAttribute("class", klass);
};

$.removeClass = function(el, x) {
    let klass = el.getAttribute("class");
    if (klass === null) {
        return;
    }

    let classes = klass.split(/\s+/);
    klass = "";
    for (let i = 0, I = classes.length; i < I; i++) {
        if (classes[i] != x) {
            klass += classes[i];
            if (i < I) {
                klass += " ";
            }
        }
    }
    el.setAttribute("class", klass);
};

$.hasClass = function(el, x) {
    let klass = el.getAttribute("class");
    if (klass === null) {
        return false;
    }
    return new RegExp("(^| )" + x + "( |$)").test(klass);
};

$.parents = function(el, filter) {
    let result = [];
    el = el.parentNode;
    while (el) {
        if (filter !== undefined) {
            if (filter[0] == "#" && el.id == x.substr(1)) {
                result.push(el);
            } else if (filter[0] == ".") {
                if (el.getAttribute("class").split(/\s+/).indexOf(filter.substr(1)) > -1) {
                    result.push(el);
                }
            } else {
                if (el.tagName && el.tagName.toLowerCase() == filter) {
                    result.push(el);
                }
            }
        } else {
            result.push(el);
        }
        el = el.parentNode;
    }
    return new $List(result);
};

$.children = function(el, filter) {
    let result = [];
    for (let i = 0, I = el.childNodes.length; i < I; i++) {
        let node = el.childNodes[i];
        if (node.nodeType != Node.ELEMENT_NODE) {
            continue;
        }
        if (filter !== undefined) {
            if (filter[0] == "#" && node.id == x.substr(1)) {
                result.push(node);
            } else if (filter[0] == ".") {
                if ((node.getAttribute("class") || "").split(/\s+/).indexOf(filter.substr(1)) > -1) {
                    result.push(node);
                }
            } else {
                if (node.tagName && node.tagName.toLowerCase() == filter) {
                    result.push(node);
                }
            }
        } else {
            result.push(node);
        }
    }
    return new $List(result);
};

const $A = function(data) {
    if (!(this instanceof $A)) {
        return new $A(data);
    }
    this.data = data;
};

$A.prototype.size = function() {
    if (this.data instanceof Array) {
        return this.data.length;
    }
    return 0;
};

$A.prototype.div = function(data) {
    let leftSize = this.size();
    let rightSize = data.size();
    let maxSize = Math.max(leftSize, rightSize);

    let result = [];
    for (let i = 0, I = maxSize; i < I; i++) {
        let leftItem, rightItem;
        if (leftSize > 0) {
            leftItem = this.data[i];
        } else {
            leftItem = this.data;
        }
        if (rightSize > 0) {
            rightItem = data.data[i];
        } else {
            rightItem = data.data;
        }

        result.push(leftItem / rightItem);
    }
    return result;
};

$A.prototype.mul = function(data) {
    let leftSize = this.size();
    let rightSize = data.size();
    let maxSize = Math.max(leftSize, rightSize);

    let result = [];
    for (let i = 0, I = maxSize; i < I; i++) {
        let leftItem, rightItem;
        if (leftSize > 0) {
            leftItem = this.data[i];
        } else {
            leftItem = this.data;
        }
        if (rightSize > 0) {
            rightItem = data.data[i];
        } else {
            rightItem = data.data;
        }

        result.push(leftItem * rightItem);
    }
    return result;
};

$A.prototype.max = function() {
    let result = this.data[0];
    for (let i = 1, I = this.data.length; i < I; i++) {
        if (this.data[i] > result) {
            result = this.data[i];
        }
    }
    return $A(result);
};

$A.prototype.min = function() {
    let result = this.data[0];
    for (let i = 1, I = this.data.length; i < I; i++) {
        if (this.data[i] < result) {
            result = this.data[i];
        }
    }
    return $A(result);
};

$A.prototype.sum = function() {
    let result = 0;
    for (let i = 0, I = this.data.length; i < I; i++) {
        result += this.data[i];
    }
    return $A(result);
};

const INode = function(el) {
    if (!el) {
        return;
    }

    this.el = el;
    this.variable = el.getAttribute("data-id");
    this.idx = el.getAttribute("data-idx");
    if (this.idx !== null) {
        this.idx = parseInt(this.idx);
    }
    this.drawn = false;
    this.adjustable = false;
    this.format = el.getAttribute("data-format");

    if (el.getAttribute("class") == "adjustable") {
        this.adjustable = true;
    }
};

INode.isAnyAdjustableNumberDragging = false;

INode.prototype.setup = function() {
    $.addClass(this.el, "outlet");
    this.isHovering = false;
    this.el.addEventListener("mouseenter", (function () { this.setHovering(true) }).bind(this));
    this.el.addEventListener("mouseleave", (function () { this.setHovering(false) }).bind(this));
}

INode.prototype.setHovering = function(hovering) {
    this.isHovering = hovering;
    ctx.setVariableHovering(this.variable, this.idx, this.isActive());
};

INode.prototype.isActive = function() {
    return this.isHovering && !INode.isAnyAdjustableNumberDragging;
};

INode.prototype.updateStyle = function(isHovering) {
    if (isHovering) { $.addClass(this.el, "hovering"); }
    else { $.removeClass(this.el, "hovering"); }
};

INode.prototype.draw = function(model) {
    if (!this.drawn) {
        this.setup();
    }
    let data = model.get(this.variable);
    if (data instanceof Array) {
        if (this.idx !== null) {
            data = data[this.idx];
        } else {
            data = data.join(", ");
        }
    }
    if (this.format) {
        data = sprintf(this.format, data);
    }
    this.el.innerHTML = data;
    this.drawn = true;
};

INode.prototype.update = function(model) {
    this.draw(model);
};

const AdjustableINode = function() {
    this.constructor.prototype.constructor.apply(this, arguments);
    $.removeClass(this.el, "outlet");
};

AdjustableINode.prototype = new INode();

AdjustableINode.prototype.setup = function() {
};

AdjustableINode.prototype.initializeHover = function() {
    this.isHovering = false;
    this.el.addEventListener("mouseenter", (function () { this.setHovering(true) }).bind(this));
    this.el.addEventListener("mouseleave", (function () { this.setHovering(false) }).bind(this));
};

AdjustableINode.prototype.setHovering = function(hovering) {
    this.isHovering = hovering;
    this.updateRolloverEffects();
    ctx.setVariableHovering(this.variable, this.idx, this.isActive());
};

AdjustableINode.prototype.updateRolloverEffects = function(down) {
    if (!down && INode.isAnyAdjustableNumberDragging) { return; }  // ignore if dragging a different number
    this.updateStyle();
    this.updateCursor();
};

AdjustableINode.prototype.isActive = function() {
    return this.isDragging || (this.isHovering && !INode.isAnyAdjustableNumberDragging);
};

AdjustableINode.prototype.updateStyle = function () {
    // setVariableHovering(this.variable, this.isActive());

    if (this.isDragging) { $.addClass(this.el, "dragging"); }
    else { $.removeClass(this.el, "dragging"); }
};

AdjustableINode.prototype.updateCursor = function() {
    let body = document.body;
    if (this.isActive()) { $.addClass(body, "TKCursorDragHorizontal"); }
    else { $.removeClass(body, "TKCursorDragHorizontal"); }
};

AdjustableINode.prototype.initializeDrag = function() {
    this.isDragging = false;
    makeTouchable(this.el, this);
};

AdjustableINode.prototype.touchDown = function(e, x, y) {
    let data = this.model.get(this.parent.variable);

    INode.isAnyAdjustableNumberDragging = true;
    this.isDragging = true;
    this.valueAtMouseDown = data[this.idx];
    this.xAtMouseDown = x;

    this.updateRolloverEffects(true);
    this.updateStyle();
};

AdjustableINode.prototype.touchMove = function(e, x, y) {
    let dx = x - this.xAtMouseDown;
    let unclippedValue = this.valueAtMouseDown + dx / 5 * this.parent.step;
    let value = Math.min(
        this.parent.max,
        Math.max(
            this.parent.min,
            Math.round(
                unclippedValue / this.parent.step
            ) * this.parent.step
        )
    );

    let data = this.model.get(this.parent.variable);
    data[this.idx] = value;
    this.model.data[this.parent.variable] = data;
    ctx.update();
};

AdjustableINode.prototype.touchUp = function(e, x, y) {
    INode.isAnyAdjustableNumberDragging = false;
    this.isDragging = false;

    this.updateRolloverEffects();
    this.updateStyle();
};

const TableINode = function() {
    this.constructor.prototype.constructor.apply(this, arguments);

    let trueI = 0;
    for (let i = 0, I = this.el.parentNode.childNodes.length; i < I; i++) {
        let node = this.el.parentNode.childNodes[i];
        if (node.nodeType != Node.ELEMENT_NODE) {
            continue;
        }
        if (node === this.el) {
            this.idx = trueI;
            break;
        }
        trueI++;
    }

    this.table = $.parents(this.el, "table").nodes[0];
    this.body = $.children(this.table, "tbody").nodes[0];

    if (this.adjustable) {
        this.min = parseFloat(this.el.getAttribute("data-min"));
        this.max = parseFloat(this.el.getAttribute("data-max"));
        this.step = parseFloat(this.el.getAttribute("data-step"));
    }
};

TableINode.prototype = new INode();

TableINode.prototype.draw = function(model) {
    let data = model.get(this.variable);
    if (data === undefined) {
        return;
    }
    let rows = $.children(this.body, "tr").nodes;
    for (let i = 0, I = data.length; i < I; i++) {
        if (rows.length < i + 1) { // need to add a row
            this.body.appendChild($.new("tr"));
            rows = $.children(this.body, "tr").nodes;
        }
        let row = rows[i];
        let cells = $.children(row, "td").nodes;
        for (let j = 0, J = this.idx + 1 - cells.length; j < J; j++) {
            row.appendChild($.new("td"));
        }
        cells = $.children(row, "td").nodes;
        let node = $.new("var");
        node.setAttribute("data-id", this.variable);
        node.setAttribute("data-idx", i);
        if (this.format) {
            node.setAttribute("data-format", this.format);
        }
        if (this.adjustable) {
            $.addClass(node, "adjustable-number");
            node = new AdjustableINode(node);
            node.model = model;
            node.parent = this;
            node.initializeHover();
            node.initializeDrag();
        } else {
            node = new INode(node);
        }
        ctx.outlets[this.variable].push(node);
        node.draw(model);
        cells[this.idx].appendChild(node.el);
    }
    this.drawn = true;
};

TableINode.prototype.update = function(model) {
    // let data = model.get(this.variable);
    // if (data === undefined) {
    //     return;
    // }
    // let rows = $.children(this.body, "tr").nodes;
    // for (let i = 0, I = data.length; i < I; i++) {
    //     let cells = $.children(rows[i], "td").nodes;
    //     let item = data[i];
    //     if (this.format) {
    //         item = sprintf(this.format, item);
    //     }
    //     $.children(cells[this.idx], "var").nodes[0].innerHTML = item;
    // }
};

const PlotINode = function() {
    this.constructor.prototype.constructor.apply(this, arguments);

    this.variables = [];
    let spec = this.el.getAttribute("data-plot");
    this.x = spec.split(",")[0];
    this.y = spec.split(",")[1].split("|");
    this.yLabel = this.el.getAttribute("data-ylabel");
    if (this.yLabel === null) {
        this.yLabel = this.y.join(", ");
    }
    this.variables.push(this.x);
    this.variables = this.variables.concat(this.y);
};

PlotINode.prototype = new INode();

PlotINode.prototype.getVariables = function() {
    return this.variables;
};

PlotINode.prototype.draw = function(model) {
    for (let i = this.el.childNodes.length - 1, I = 0; i >= I; i--) {
        this.el.removeChild(this.el.childNodes[i]);
    }

    this.el.style.position = "relative";
    this.el.style.background = "white";

    let gap = 10;
    let titleHeight = 20;

    let x = model.get(this.x);
    let width = this.el.offsetWidth;
    let height = this.el.offsetHeight;

    let maxY = 0;
    for (let i = 0, I = x.length; i < I; i++) {
        for (let j = 0, J = this.y.length; j < J; j++) {
            let y = model.get(this.y[j]);
            if (y === undefined) {
                y = model.compute(this.y[j]);
            }
            let value = y[i];
            if (value > maxY) {
                maxY = value;
            }
        }
    }

    let yAxis = document.createElement("div");
    yAxis.innerHTML = this.yLabel;
    yAxis.style.position = "absolute";
    yAxis.style.visibility = "hidden";
    this.el.appendChild(yAxis);
    let yAxisWidth = yAxis.offsetWidth;
    let yAxisHeight = yAxis.offsetHeight;
    yAxis.style.left = (-yAxisWidth / 2 + (titleHeight - 4) / 2) + "px";
    yAxis.style.top = ((height - titleHeight) / 2  - (yAxisHeight / 2)) + "px";
    yAxis.style.transform = "rotate(-90deg)";
    yAxis.style.visibility = "visible";

    let barsCount = x.length * this.y.length;
    let itemWidth = Math.floor(
        (width - titleHeight - gap * (barsCount - 1)) / barsCount
    );
    for (let i = 0, I = x.length; i < I; i++) {
        let sectionWidth = itemWidth * this.y.length + gap * (this.y.length - 1);
        let x0 = i * sectionWidth + i * gap + titleHeight;
        let title = x[i];
        let caption = document.createElement("div");
        caption.innerHTML = title;
        caption.style.position = "absolute";
        caption.style.top = (height - titleHeight + 4) + "px";
        caption.style.visibility = "hidden";
        this.el.appendChild(caption);
        let captionWidth = caption.offsetWidth;
        caption.style.left = ((x0 + sectionWidth / 2) - (captionWidth / 2)) + "px";
        caption.style.visibility = "visible";

        for (let j = 0, J = this.y.length; j < J; j++) {
            let y = model.get(this.y[j]);
            if (y === undefined) {
                y = model.compute(this.y[j]);
            }
            if (y === undefined) {
                console.log("Unable to compute: " + this.y[j]);
                continue;
            }

            x0 = i * sectionWidth + j * itemWidth + (i + j) * gap + titleHeight;
            let itemHeight = y[i] / maxY * (height - titleHeight);

            let bar = document.createElement("div");
            bar.className = "bar";
            bar.style.position = "absolute";
            bar.style.left = x0 + "px";
            bar.style.width = itemWidth + "px";
            bar.style.top = (height - titleHeight - itemHeight) + "px";
            bar.style.height = itemHeight + "px";
            if (j == 0) {
                bar.style.background = "darkgray";
            } else {
                bar.style.background = "green";
            }
            this.el.appendChild(bar);
        }
    }
};

PlotINode.prototype.update = function(model) {
    let titleHeight = 20;

    let x = model.get(this.x);
    let height = this.el.offsetHeight;

    let maxY = 0;
    for (let i = 0, I = x.length; i < I; i++) {
        for (let j = 0, J = this.y.length; j < J; j++) {
            let y = model.get(this.y[j]);
            if (y === undefined) {
                y = model.compute(this.y[j]);
            }
            let value = y[i];
            if (value > maxY) {
                maxY = value;
            }
        }
    }

    let bars = $.children(this.el, ".bar").nodes;
    for (let i = 0, I = x.length; i < I; i++) {
        for (let j = 0, J = this.y.length; j < J; j++) {
            let barNumber = i * this.y.length + j;
            let y = model.get(this.y[j]);
            if (y === undefined) {
                y = model.compute(this.y[j]);
            }
            if (y === undefined) {
                console.log("Unable to compute: " + this.y[j]);
                continue;
            }

            let bar = bars[barNumber];
            let itemHeight = y[i] / maxY * (height - titleHeight);
            bar.style.top = (height - titleHeight - itemHeight) + "px";
            bar.style.height = itemHeight + "px";
        }
    }
};

PlotINode.prototype.updateStyle = function(status, variable, idx) {
    let variableIdx = this.y.indexOf(variable);
    if (variableIdx == -1) {
        return;
    }
    let bars = $.children(this.el, ".bar").nodes;
    let barNumber = idx * this.y.length + variableIdx;
    let bar = bars[barNumber];
    if (status) {
        if (bar.style.background == "darkgray") {
            bar.style.background = "gray";
        }
        if (bar.style.background == "green") {
            bar.style.background = "darkgreen";
        }
    } else {
        if (bar.style.background == "gray") {
            bar.style.background = "darkgray";
        }
        if (bar.style.background == "darkgreen") {
            bar.style.background = "green";
        }
    }
};

const SelectionNode = function(el, model) {
    this.el = el;
    this.model = model;
    this.hovering = false;
    this.selectedIdx = -1;

    this.options = $.children(el).nodes;
    for (let i = 0, I = this.options.length; i < I; i++) {
        let option = this.options[i];

        option.addEventListener("mouseenter", (function () { $.addClass(option, "hovering") }).bind(option));
        option.addEventListener("mouseleave", (function () { $.removeClass(option, "hovering") }).bind(option));
        option.addEventListener("click", (function (i) { this.select(i) }).bind(this, i));
        option.addEventListener("keypress", (function (e) { if (e.keyCode == 13) this.onSelect(true) }).bind(this));

        if ($.hasClass(option, "selected")) {
            this.selectedIdx = i;
        }
    }
    this.onSelect(false);
};

SelectionNode.prototype.select = function(idx) {
    this.selectedIdx = idx;
    for (let i = 0, I = this.options.length; i < I; i++) {
        if (i === idx) {
            $.addClass(this.options[i], "selected");
        } else {
            $.removeClass(this.options[i], "selected");
        }
    }
    this.onSelect(true);
};

SelectionNode.prototype.onSelect = function(redraw) {
    let expr = this.readValue(this.options[this.selectedIdx]);
    let variable = expr.split(/\s+=\s+/)[0];
    let value = expr.split(/\s+=\s+/)[1];
    this.model.formulae[variable] = value;

    if (redraw) {
        ctx.update();
    }
};

SelectionNode.prototype.readValue = function(el) {
    let value = "";
    for (let i = 0, I = el.childNodes.length; i < I; i++) {
        let node = el.childNodes[i];
        if (node.nodeType == Node.TEXT_NODE) {
            value += node.nodeValue;
        }
        if (node.nodeType == Node.ELEMENT_NODE
            && node.tagName.toLowerCase() == "var"
            && node.hasAttribute("data-name"))
        {
            value += node.getAttribute("data-name");
        }
        if (node.nodeType == Node.ELEMENT_NODE
            && node.tagName.toLowerCase() == "input"
            && node.value)
        {
            value += node.value;
        }
    }
    return value;
};



const IManager = function(model) {
    this.model = model;
    this.outlets = {};
    this.tokens = {};
};

IManager.prototype.initElements = function(root) {
    var elements = root.getElementsByTagName("*");
    var interestingElements = [];
    var regexp = /^data-[\w\-]+$/;

    for (var i = 0, L = elements.length; i < L; i++) {
        var element = elements[i];
        var attributes = element.attributes;
        var options = {};
        var hasDataAttribute = false;

        for (var j = 0, length = attributes.length; j < length; j++) {
            var attr = attributes[j];
            var attrName = attr.name;
            if (!attrName || !regexp.test(attrName)) { continue; }

            hasDataAttribute = true;
            options[attrName.substr(5)] = attr.value;
        }
        if (hasDataAttribute) {
            interestingElements.push([element, options]);
        }
    }

    // initialize interesting elements in this list.  (Can't traverse "elements"
    // directly, because elements is "live", and views that change the node tree
    // will change elements mid-traversal.)
    for (let i = 0, length = interestingElements.length; i < length; i++) {
        let element = interestingElements[i][0];
        let options = interestingElements[i][1];

        if (options["name"] && element.tagName == "VAR") {
            element.innerHTML = options["name"];
            $.addClass(element, "token");
            if (this.tokens[options["name"]] === undefined) {
                this.tokens[options["name"]] = [];
            }
            this.tokens[options["name"]].push(element);
        }

        if (options["role"] == "select")
        {
            new SelectionNode(element, model);
        }

        if (options["id"]) {
            if (this.outlets[options["id"]] === undefined) {
                this.outlets[options["id"]] = [];
            }
            let node;
            if ($.parents(element).has("table")) {
                node = new TableINode(element);
            } else {
                node = new INode(element);
            }
            this.outlets[options["id"]].push(node);
        }

        if (options["plot"]) {
            let node = new PlotINode(element);
            let variables = node.getVariables();
            for (let i = 0, I = variables.length; i < I; i++) {
                let variable = variables[i];
                if (this.outlets[variable] === undefined) {
                    this.outlets[variable] = [];
                }
                this.outlets[variable].push(node);
            }
        }
    }
};

IManager.prototype.draw = function() {
    for (let variable in this.outlets) {
        for (let i = 0, I = this.outlets[variable].length; i < I; i++) {
            let outlet = this.outlets[variable][i];
            outlet.draw(this.model);
        }
    }
};

IManager.prototype.update = function() {
    for (let variable in this.outlets) {
        for (let i = 0, I = this.outlets[variable].length; i < I; i++) {
            let outlet = this.outlets[variable][i];
            outlet.update(this.model);
        }
    }
};

IManager.prototype.setVariableHovering = function(variable, idx, status) {
    for (let i = 0, I = this.outlets[variable].length; i < I; i++) {
        let outlet = this.outlets[variable][i];
        if (idx !== null && outlet.idx !== null && idx != outlet.idx) {
            continue;
        }
        outlet.updateStyle(status, variable, idx);
    }
    if (this.tokens[variable] === undefined) {
        return;
    }
    for (let i = 0, I = this.tokens[variable].length; i < I; i++) {
        let token = this.tokens[variable][i];
        if (status) {
            $.addClass(token, "hovering");
        } else {
            $.removeClass(token, "hovering");
        }
    }
};

const Model = function(data, formulae) {
    this.data = data;
    this.formulae = formulae;
    this.compiledFormulae = {};
};

Model.prototype.get = function(variable) {
    if (this.data[variable] !== undefined) {
        return this.data[variable];
    }
    if (this.formulae[variable] !== undefined) {
        return this.compute(this.formulae[variable]);
    }
};

Model.prototype.compute = function(formula) {
    // "reads_no / cells_no"
    if (this.compiledFormulae[formula] === undefined) {
        // compile
        let text = "var compiled = function(model) {\n";
        text += "return " + formula
            .replace(/max\((.+)\)/g, "$1.max()")
            .replace(/min\((.+)\)/g, "$1.min()")
            .replace(/sum\((.+)\)/g, "$1.sum()")
            .replace(/\w{5,}/g, "$$A(model.get(\"$&\"))")
            .replace(/\/(.+)$/g, ".div($1)")
            .replace(/\*(.+)$/g, ".mul($1)");
        text += "\n};";
        eval(text);
        this.compiledFormulae[formula] = compiled;
    }
    return this.compiledFormulae[formula](this);
};
