﻿/// <reference path="../../../../Framework/Signum.Web/Signum/Scripts/globals.ts"/>
/// <reference path="../../../../Framework/Signum.Web/Signum/Headers/d3/d3.d.ts"/>
/// <reference path="ChartUtils.ts"/>

import Entities = require("Framework/Signum.Web/Signum/Scripts/Entities")
import Lines = require("Framework/Signum.Web/Signum/Scripts/Lines")
import Finder = require("Framework/Signum.Web/Signum/Scripts/Finder")
import Validator = require("Framework/Signum.Web/Signum/Scripts/Validator")
import Operations = require("Framework/Signum.Web/Signum/Scripts/Operations")

import ChartUtils = require("ChartUtils"); ChartUtils;
import d3 = require("d3")

export function openChart(prefix: string, url: string) {
    Finder.getFor(prefix).then(sc=>
        SF.submit(url, sc.requestDataForSearch()));
}

export function attachShowCurrentEntity(el: Lines.EntityLine) {
    var showOnEntity = function () {
        el.element.nextAll("p.messageEntity").toggle(!!el.runtimeInfoHiddenElement().value());
    };

    showOnEntity();

    el.entityChanged = showOnEntity;
}

export function deleteUserChart(options: Operations.EntityOperationOptions, url: string) {
    options.avoidReturnRedirect = true;
    if (!Operations.confirmIfNecessary(options))
        return;

    Operations.deleteAjax(options).then(a=> {
        if (!options.prefix)
            location.href = url; 
    }); 
}

export function createUserChart(prefix: string, url: string) {
    getFor(prefix).then(cb=>
        SF.submit(url, cb.requestProcessedData()));
}

export function exportData(prefix: string, validateUrl: string, exportUrl: string) {
    getFor(prefix).then(cb=> cb.exportData(validateUrl, exportUrl)); 
}



export function getFor(prefix: string): Promise<ChartBuilder> {
    return $("#" + SF.compose(prefix, "sfChartBuilderContainer")).SFControl<ChartBuilder>();
};

export class ChartBuilder extends Finder.SearchControl {
    exceptionLine: number;
    $chartControl: JQuery;
    reDrawOnUpdateBuilder: boolean;

    public _create() {
        var self = this;
        this.$chartControl = self.element.closest(".sf-chart-control");
        $(document).on("click", ".sf-chart-img", function () {
            var $this = $(this);
            $this.closest(".sf-chart-type").find(".ui-widget-header .sf-chart-type-value").val($this.attr("data-related"));


            var $resultsContainer = self.$chartControl.find(".sf-search-results-container");
            if ($this.hasClass("sf-chart-img-equiv")) {
                if ($resultsContainer.find("svg").length > 0) {
                    self.reDrawOnUpdateBuilder = true;
                }
            }
            else {
                $resultsContainer.html("");
            }

            self.updateChartBuilder();
        });

        $(document).on("change", ".sf-chart-group-trigger", function () {
            self.element.find(".sf-chart-group-results").val($(this).is(":checked").toString());
            self.updateChartBuilder();
        });

        $(document).on("click", ".sf-chart-token-config-trigger", function () {
            $(this).closest(".sf-chart-token").next().toggle();
        });

        $(document).on("change", ".sf-query-token select", function () {
            var $this = $(this);
            var id = $this.attr("id"); 
            Finder.QueryTokenBuilder.clearChildSubtokenCombos($this, id.before("_ddlTokens_"), parseInt(id.after("_ddlTokens_")));
            self.updateChartBuilder($this.closest("tr").attr("data-token"));
        });

        $(this.$chartControl).on("change", ".sf-chart-redraw-onchange", function () {
            self.reDraw();
        });

        $(document).on("click", ".sf-chart-draw", function (e) {
            e.preventDefault();
            var $this = $(this);
            $.ajax({
                url: $this.attr("data-url"),
                data: self.requestData(),
                success: function (result) {
                    if (typeof result === "object") {
                        if (typeof result.ModelState != "undefined") {
                            var modelState = result.ModelState;
                            Validator.showErrors({}, modelState);
                            SF.Notify.error(lang.signum.error, 2000);
                        }
                    }
                    else {
                        Validator.showErrors({}, null);
                        self.$chartControl.find(".sf-search-results-container").html(result);
                        SF.triggerNewContent(self.$chartControl.find(".sf-search-results-container"));
                        self.initOrders();
                        self.reDraw();
                    }
                }
            });
        });


        window.changeTextArea = function (value, runtimeInfo) {
            if ($("#ChartScript_sfRuntimeInfo").val() == runtimeInfo) {
                var $textArea = self.element.find("textarea.sf-chart-currentScript");

                $textArea.val(value);
                self.reDraw();
            }
        };

        window.getExceptionNumber = function () {
            if (self.exceptionLine == null || self.exceptionLine == undefined)
                return null;

            var temp = self.exceptionLine;
            self.exceptionLine = null;
            return temp;
        };

        $(document).on("click", ".sf-chart-script-edit", function (e) {
            e.preventDefault();

            var $textArea = self.element.find("textarea.sf-chart-currentScript");

            var win = window.open($textArea.data("url"));
        });

        $(document).on("mousedown", this.pf("sfFullScreen"), function (e) {
            e.preventDefault();
            self.fullScreen(e);
        });

        this.$chartControl.on("sf-new-subtokens-combo", function (event, ...args) {
            self.newSubTokensComboAdded($("#" + args[0] /*idSelectedCombo*/));
        });
    }

    requestData(): FormObject {

        var result = this.$chartControl.find(":input:not(#webQueryName)").serializeObject();

        result["webQueryName"] = this.options.webQueryName;
        result["filters"] = this.serializeFilters();
        result["orders"] = this.serializeOrders();

        return result;
    }

    updateChartBuilder(tokenChanged?: string) {
        var $chartBuilder = this.$chartControl.find(".sf-chart-builder");
        var data = this.requestData();
        if (!SF.isEmpty(tokenChanged)) {
            data["lastTokenChanged"] = tokenChanged;
        }
        var self = this;
        $.ajax({
            url: $chartBuilder.attr("data-url"),
            data: data,
            success: function (result) {
                $chartBuilder.replaceWith(result);
                SF.triggerNewContent(self.$chartControl.find(".sf-chart-builder"));
                if (self.reDrawOnUpdateBuilder) {
                    self.reDraw();
                    self.reDrawOnUpdateBuilder = false;
                }

            }
        });
    }


    addFilter() {
        var $addFilter = $(this.pf("btnAddFilter"));
        if ($addFilter.closest(".sf-chart-builder").length == 0) {
            if (this.$chartControl.find(".sf-chart-group-trigger:checked").length > 0) {
                var url = this.$chartControl.attr("data-add-filter-url");
                super.addFilter(url);
            }
            else {
                super.addFilter();
            }
        }
    }

    showError(e, __baseLineNumber__, chart) {
        var message = e.toString();

        var regex = /(DrawChart.*@.*:(.*))|(DrawChart .*:(.*):.*\)\))|(DrawChart .*:(.*):.*\))/;
        var match;
        if (e.stack != undefined && (match = regex.exec(e.stack)) != null) {
            var lineNumber = parseInt(match[2] || match[4] || match[6]) - __baseLineNumber__;
            if (isNaN(lineNumber))
                lineNumber = 1;
            this.exceptionLine = lineNumber;
            message = "Line " + lineNumber + ": " + message;
        } else {
            this.exceptionLine = 1;
        }

        chart.select(".sf-chart-error").remove();
        chart.append('svg:rect').attr('class', 'sf-chart-error').attr("y", (chart.attr("height") / 2) - 10).attr("fill", "#FBEFFB").attr("stroke", "#FAC0DB").attr("width", chart.attr("width") - 1).attr("height", 20);
        chart.append('svg:text').attr('class', 'sf-chart-error').attr("y", chart.attr("height") / 2).attr("fill", "red").attr("dy", 5).attr("dx", 4).text(message);
    }

    reDraw() {
        var $chartContainer = this.$chartControl.find(".sf-chart-container");

        $chartContainer.html("");

        var data = $chartContainer.data("json");
        ChartUtils.fillAllTokenValueFuntions(data);

        var self = this;
        $(".sf-chart-redraw-onchange", this.$chartControl).each(function (i, element) {
            var $element = $(element);
            var name = $element.attr("id");
            if (!SF.isEmpty(self.options.prefix)) {
                name = name.substring(self.options.prefix.length + 1, name.length);
            }
            var nameParts = name.split('_');
            if (nameParts.length == 3 && nameParts[0] == "Columns") {
                var column = data.columns["c" + nameParts[1]];
                switch (nameParts[2]) {
                    case "DisplayName": column.title = $element.val(); break;
                    case "Parameter1": column.parameter1 = $element.val(); break;
                    case "Parameter2": column.parameter2 = $element.val(); break;
                    case "Parameter3": column.parameter3 = $element.val(); break;
                    default: break;
                }
            }
        });

        var width = $chartContainer.width();
        var height = $chartContainer.height();

        var code = "(" + this.$chartControl.find('textarea.sf-chart-currentScript').val() + ")";

        var chart = d3.select('#' + this.$chartControl.attr("id") + " .sf-chart-container")
            .append('svg:svg').attr('width', width).attr('height', height);



        var func;
        var __baseLineNumber__: number;
        try {
            var getClickKeys = ChartUtils.getClickKeys;
            var translate = ChartUtils.translate;
            var scale = ChartUtils.scale;
            var rotate = ChartUtils.rotate;
            var skewX = ChartUtils.skewX;
            var skewY = ChartUtils.skewY;
            var matrix = ChartUtils.matrix;
            var scaleFor = ChartUtils.scaleFor;
            var rule = ChartUtils.rule;
            __baseLineNumber__ = new Error().lineNumber;
            func = eval(code);
        } catch (e) {
            this.showError(e, __baseLineNumber__, chart);
            return;
        }

        try {
            func(chart, data);
            this.bindMouseClick($chartContainer);
        } catch (e) {
            this.showError(e, __baseLineNumber__, chart);
        }

        if (this.exceptionLine == null)
            this.exceptionLine = -1;
    }

    exportData(validateUrl, exportUrl) {
        var data = this.requestData();

        if (Validator.entityIsValid({ prefix: this.options.prefix, controllerUrl: validateUrl, requestExtraJsonData: data}))
            SF.submitOnly(exportUrl, data);
    }

    requestProcessedData() {
        return {
            webQueryName: this.options.webQueryName,
            filters: this.serializeFilters(),
            orders: this.serializeOrders()
        };
    }

    fullScreen(evt) {
        evt.preventDefault();

        var url = this.$chartControl.find(".sf-chart-container").attr("data-fullscreen-url") ||
            this.$chartControl.attr("data-fullscreen-url");

        url += (url.indexOf("?") < 0 ? "?" : "&") + $.param(this.requestData());

        if (evt.ctrlKey || evt.which == 2) {
            window.open(url);
        }
        else if (evt.which == 1) {
            window.location.href = url;
        }
    }

    initOrders() {
        var self = this;
        $(this.pf("tblResults") + " th").mousedown(function (e) {
            this.onselectstart = function () { return false };
            return false;
        })
            .click(function (e) {
                self.newSortOrder($(e.target), e.shiftKey);
                self.$chartControl.find(".sf-chart-draw").click();
                return false;
            });
    }

    bindMouseClick($chartContainer: JQuery) {

        $chartContainer.find('[data-click]').click(function () {

            var url = $chartContainer.attr('data-open-url');

            var win = window.open("about:blank");

            var $chartControl = $chartContainer.closest(".sf-chart-control");
            getFor($chartControl.attr("data-prefix")).then(cb=> {
                var options = $chartControl.find(":input").not($chartControl.find(".sf-filters-list :input")).serialize();
                options += "&webQueryName=" + cb.options.webQueryName;
                options += "&orders=" + cb.serializeOrders();
                options += "&filters=" + cb.serializeFilters();
                options += $(this).data("click");

                win.location.href = (url + (url.indexOf("?") >= 0 ? "&" : "?") + options);
            }); 
        });
    }
}

