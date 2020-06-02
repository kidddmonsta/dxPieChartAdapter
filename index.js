function render(blockSelector) {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var wid = urlParams.get('wid');
    wid = '0fce3f58-af6d-45fa-9e4c-f1137a908d26';


    $.getJSON(IP_TO_WIDGET_CORE + wid).then(function (widgetData) {
        widgetJson = widgetData;
        console.log(widgetData);
        settings = widgetJson.widgetOptions;
        $.getJSON(IP_TO_ANALYT_QUERY_CORE + widgetJson.analytQueryID + '/result').then(function (resultList) {
            console.log(resultList);
            resultId = resultList.resultIdFinal;

            // !!!!!!!! Метод отвечающий за формирование данных необходимых конкретному компоненту
            $.getJSON(IP_TO_RESULT_ANALYT_QUERY_CORE + resultId).then(function (resultAnalytData) {
                console.log(resultAnalytData);
                $.getJSON('widgetOptions.json').then(function (widgetOptions) {
                    settings = widgetOptions;
                    console.log(settings);
                    $(blockSelector).dxPieChart({
                        size: {
                            width: settings.width,
                        },
                        palette: settings.palette,
                        dataSource: resultAnalytData.tableData.series,
                        series: [
                            {
                                argumentField: "YearOfRealisation",
                                valueField: "AmountOfApps",
                                label: {
                                    visible: settings.labelVisible,
                                    format: settings.labelFormat,
                                    font: {
                                        size: settings.labelFontSize,
                                        family: settings.labelFontFamily,
                                        style: settings.labelFontStyle,
                                        weight: settings.labelFontWeight,
                                        color: settings.labelFontColor
                                    },
                                    connector: {
                                        visible: settings.labelConnectorVisible,
                                        width: settings.labelConnectorWidth
                                    }
                                }
                            }
                        ],
                        legend: {
                            visible: settings.legendVisible,
                            orientation: settings.legendOrientation,
                            verticalAlignment: settings.legendVerticalAlignment,
                            horizontalAlignment: settings.legendHorizontalAlignment,
                            itemTextPosition: settings.legendItemTextPosition,
                            rowCount: settings.legendRowCount,
                            font: {
                                size: settings.legendFontSize,
                                family: settings.legendFontFamily,
                                style: settings.legendFontStyle,
                                weight: settings.legendFontWeight,
                                color: settings.legendFontColor
                            },
                        },
                        title: {
                            text: settings.title,
                            font: {
                                size: settings.titleFontSize,
                                family: settings.titleFontFamily,
                                style: settings.titleFontStyle,
                                weight: settings.titleFontWeight,
                                color: settings.titleFontColor
                            }
                        },

                        tooltip: {
                            enabled: settings.tooltipEnabled,
                            format: settings.tooltipFormat,
                            customizeTooltip: function () {
                                return {text: this.argumentText + ": " + this.valueText};
                            }
                        },


                        "export": {
                            enabled: settings.exportEnabled
                        },
                        onPointClick: function (e) {
                            var point = e.target;

                            toggleVisibility(point);
                        },
                        onLegendClick: function (e) {
                            var arg = e.target;

                            toggleVisibility(this.getAllSeries()[0].getPointsByArg(arg)[0]);
                        }
                    });

                    function toggleVisibility(item) {
                        if (item.isVisible()) {
                            item.hide();
                        } else {
                            item.show();
                        }
                    }
                });
            });
        });
    });
}

