// Đặt thời gian mặc định là tuần này
function setDefaultDateRange() {
    // Lấy ngày bắt đầu và kết thúc của tuần này
    var startOfWeek = moment().startOf('isoWeek');
    var endOfWeek = moment().endOf('isoWeek');

    // Thiết lập ngày bắt đầu và kết thúc cho date range picker
    $("#date_range_picker").data('daterangepicker').setStartDate(startOfWeek);
    $("#date_range_picker").data('daterangepicker').setEndDate(endOfWeek);

    // Gọi hàm updateDateRange để cập nhật giao diện
    updateDateRange(startOfWeek, endOfWeek);
}

function widget_week_income_chart(dataAnalytics){
    var e = document.getElementById("widget_week_income_chart");
    e.innerHTML = ''
    if (e) {
        var t = {
            size: e.getAttribute("data-kt-size") ? parseInt(e.getAttribute("data-kt-size")) : 70,
            lineWidth: e.getAttribute("data-kt-line") ? parseInt(e.getAttribute("data-kt-line")) : 11,
            rotate: e.getAttribute("data-kt-rotate") ? parseInt(e.getAttribute("data-kt-rotate")) : 145
        }
          , a = document.createElement("canvas")
          , l = document.createElement("span");
        "undefined" != typeof G_vmlCanvasManager && G_vmlCanvasManager.initElement(a);
        var r = a.getContext("2d");
        a.width = a.height = t.size,
        e.appendChild(l),
        e.appendChild(a),
        r.translate(t.size / 2, t.size / 2),
        r.rotate((t.rotate / 180 - .5) * Math.PI);
        var o = (t.size - t.lineWidth) / 2
          , i = function(e, t, a) {
            a = Math.min(Math.max(0, a || 1), 1),
            r.beginPath(),
            r.arc(0, 0, o, 0, 2 * Math.PI * a, !1),
            r.strokeStyle = e,
            r.lineCap = "round",
            r.lineWidth = t,
            r.stroke()
        };


        var total = dataAnalytics.earning + (dataAnalytics.bonus.week.currentBonus + dataAnalytics.bonus.peakHours) + dataAnalytics.bonus.day;
        var salesPercentage = dataAnalytics.earning / total;
        var weekBonusPercentage = (dataAnalytics.bonus.week.currentBonus + dataAnalytics.bonus.peakHours) / total;

        let weekly_earning_total = document.getElementById('weekly_earning_total');
        let weekly_earning_sales = document.getElementById('weekly_earning_sales');
        let weekly_earning_bonus_week = document.getElementById('weekly_earning_bonus_week');
        let weekly_earning_bonus_day = document.getElementById('weekly_earning_bonus_day');
    
        weekly_earning_total.innerText = formatCurrency(dataAnalytics.earning + dataAnalytics.bonus.week.currentBonus + dataAnalytics.bonus.peakHours + dataAnalytics.bonus.day);
        weekly_earning_sales.innerText = formatCurrency(dataAnalytics.earning) + "₫";
        weekly_earning_bonus_week.innerText = formatCurrency(dataAnalytics.bonus.week.currentBonus + dataAnalytics.bonus.peakHours) + "₫";
        weekly_earning_bonus_day.innerText = formatCurrency(dataAnalytics.bonus.day) + "₫";

        i("#E4E6EF", t.lineWidth, 1);
        if (salesPercentage > 0) {
            i(KTUtil.getCssVariableValue("--bs-danger"), t.lineWidth, salesPercentage);
        }
        if (weekBonusPercentage > 0) {
            i(KTUtil.getCssVariableValue("--bs-primary"), t.lineWidth, weekBonusPercentage);
        }
    }
}

function widget_week_bonus_day_chart(startDate, endDate, dataAnalytics){
    var e = document.getElementById("widget_week_bonus_day_chart");
    e.innerHTML = ''
    if (e) {
        const dateArrays = generateDateArray(startDate, endDate)
        let series_data = [];
        for (let date of dateArrays) {
            const dailyAnalytics = filterDailyAnalytics(date)
            series_data.push(dailyAnalytics.bonus.day)
        };

        var t = parseInt(KTUtil.css(e, "height"))
          , a = KTUtil.getCssVariableValue("--bs-gray-500")
          , l = KTUtil.getCssVariableValue("--bs-border-dashed-color")
          , r = KTUtil.getCssVariableValue("--bs-primary")
          , o = KTUtil.getCssVariableValue("--bs-gray-300")
          , i = new ApexCharts(e,{
            series: [{
                name: "Tiền Thưởng",
                data: series_data
            }],
            chart: {
                fontFamily: "inherit",
                type: "bar",
                height: t,
                toolbar: {
                    show: !1
                },
                sparkline: {
                    enabled: !0
                }
            },
            plotOptions: {
                bar: {
                    horizontal: !1,
                    columnWidth: ["55%"],
                    borderRadius: 6
                }
            },
            legend: {
                show: !1
            },
            dataLabels: {
                enabled: !1
            },
            stroke: {
                show: !0,
                width: 9,
                colors: ["transparent"]
            },
            xaxis: {
                categories: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"],
                axisBorder: {
                    show: !1
                },
                axisTicks: {
                    show: !1,
                    tickPlacement: "between"
                },
                labels: {
                    show: !1,
                    style: {
                        colors: a,
                        fontSize: "12px"
                    }
                },
                crosshairs: {
                    show: !1
                }
            },
            yaxis: {
                labels: {
                    show: 1,
                    style: {
                        colors: a,
                        fontSize: "12px"
                    }
                }
            },
            fill: {
                type: "solid"
            },
            states: {
                normal: {
                    filter: {
                        type: "none",
                        value: 0
                    }
                },
                hover: {
                    filter: {
                        type: "none",
                        value: 0
                    }
                },
                active: {
                    allowMultipleDataPointsSelection: !1,
                    filter: {
                        type: "none",
                        value: 0
                    }
                }
            },
            tooltip: {
                style: {
                    fontSize: "12px"
                },
                x: {
                    formatter: function(e) {
                        return e;
                    }
                },
                y: {
                    formatter: function(e) {
                        return formatCurrency(e) + "₫"
                    }
                }
            },
            colors: [r, o],
            grid: {
                padding: {
                    left: 10,
                    right: 10
                },
                borderColor: l,
                strokeDashArray: 4,
                yaxis: {
                    lines: {
                        show: !0
                    }
                }
            }
        });
        let weekly_point_reward = document.getElementById('weekly_point_reward');
        let weekly_point_missing = document.getElementById('weekly_point_missing');
        let weekly_point_percent = document.getElementById('weekly_point_percent');
        let weekly_point_progress = document.getElementById('weekly_point_progress');
    
        weekly_point_reward.innerText = formatCurrency(dataAnalytics.bonus.week.currentBonus);
        weekly_point_missing.innerText = "Thiếu " + dataAnalytics.bonus.week.missingPoint + " điểm nhận " + formatCurrency(dataAnalytics.bonus.week.nextBonus) + "₫";
        weekly_point_percent.innerText = dataAnalytics.bonus.week.percentPoint + "%";
        weekly_point_progress.innerHTML = `<div class="bg-success rounded h-8px" role="progressbar" style="width: ${dataAnalytics.bonus.week.percentPoint}%;" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>`
    
        let weekly_bonus_day = document.getElementById('weekly_bonus_day');
        weekly_bonus_day.innerText = formatCurrency(dataAnalytics.bonus.day);
        setTimeout((function() {
            i.render()
        }), 300)
    }
}

// Sự kiện khi thay đổi khung thời gian tuần
function updateDateRange(start, end) {
    $("#date_range_picker").html(start.format("MMMM D, YYYY") + " - " + end.format("MMMM D, YYYY"));

    // Lấy giá trị start và end sau khi người dùng chọn phạm vi ngày
    var startDate = new Date(start.format("YYYY-MM-DD"));
    var endDate = new Date(end.format("YYYY-MM-DD"));

    const dataAnalytics = getRangeAnalytics(dataTrips, startDate, endDate)

    widget_week_income_chart(dataAnalytics)
    widget_week_bonus_day_chart(startDate, endDate, dataAnalytics)

    let week_avg_sales = document.getElementById('week_avg_sales');
    let week_avg_km = document.getElementById('week_avg_km');
    let week_avg_trip = document.getElementById('week_avg_trip');
    let week_avg_point = document.getElementById('week_avg_point');

    week_avg_sales.innerHTML = `
    <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>
    <span class="text-gray-800 fw-bold fs-6">${formatCurrency(dataAnalytics.avgs.earning)}<small class="text-gray-500">/h</small></span>
    `
    week_avg_km.innerHTML = `
    <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
    <span class="text-gray-800 fw-bold fs-6">${dataAnalytics.avgs.kilometer}<small class="text-gray-500">/h</small></span>
    `
    week_avg_trip.innerHTML = `
    <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
    <span class="text-gray-800 fw-bold fs-6">${dataAnalytics.avgs.trip}<small class="text-gray-500">/h</small></span>
    `
    week_avg_point.innerHTML = `
    <i class="ki-duotone ki-arrow-up-right fs-2 text-success me-2"><span class="path1"></span><span class="path2"></span></i>  
    <span class="text-gray-800 fw-bold fs-6">${dataAnalytics.avgs.point}<small class="text-gray-500">/h</small></span>
    `
}

$(document).ready(function() {
    // Lấy dữ liệu tuần
    var defaultStartDate = moment().subtract(29, "days");
    var defaultEndDate = moment();
    // Lựa chọn ngày tháng
    $("#date_range_picker").daterangepicker({
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        showCustomRangeLabel: false,
        ranges: {
            "Tuần Này": [moment().isoWeekday(1), moment().isoWeekday(7)],
            "Tuần Trước": [moment().subtract(1, "week").isoWeekday(1),moment().subtract(1, "week").isoWeekday(7)],
            "Hai Tuần Trước": [moment().subtract(2, "week").isoWeekday(1),moment().subtract(2, "week").isoWeekday(7)],
            "Ba Tuần Trước": [moment().subtract(3, "week").isoWeekday(1),moment().subtract(3, "week").isoWeekday(7)]
        }
    }, updateDateRange);
    setDefaultDateRange();

});


var KTChartsWidget3 = function() {
    var e = {
        self: null,
        rendered: !1
    }
      , t = function(e) {
        var t = document.getElementById("kt_charts_widget_3");
        t.innerHTML = '';
        if (t) {


            const getData = dataTrips.slice(0, 15).reverse();
            let series_data = [], xCategories = [], month_sales = 0;

            for (let dayData of getData) {
                const dailyAnalytics = filterDailyAnalytics(dayData.d)
                series_data.push(dailyAnalytics.earning)
                xCategories.push(dayData.d)
                month_sales += dailyAnalytics.earning
            };
            const month_sales_show = document.getElementById('month_sales_show');
            const month_sales_missing = document.getElementById('month_sales_missing');
            month_sales_show.innerText = formatCurrency(month_sales) + '₫'
            month_sales_missing.innerText = 'Thiếu ' + formatCurrency(10000000 - month_sales) + '₫ đến mục tiêu 12 triệu.'

            // const dateArrays = getRecentDates(30).reverse();
            // let series_data = [];
            // for (let date of dateArrays) {
            //     const dailyAnalytics = filterDailyAnalytics(date)
            //     series_data.push(dailyAnalytics.earning)
            // };

            var a = parseInt(KTUtil.css(t, "height"))
              , l = KTUtil.getCssVariableValue("--bs-gray-500")
              , r = KTUtil.getCssVariableValue("--bs-border-dashed-color")
              , o = KTUtil.getCssVariableValue("--bs-success")
              , i = {
                series: [{
                    name: "Doanh Số",
                    data: series_data
                }],
                chart: {
                    fontFamily: "inherit",
                    type: "area",
                    height: a,
                    toolbar: {
                        show: !1
                    }
                },
                plotOptions: {},
                legend: {
                    show: !1
                },
                dataLabels: {
                    enabled: !1
                },
                fill: {
                    type: "gradient",
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: .5,
                        opacityTo: .5,
                        stops: [0, 80, 100]
                    }
                },
                stroke: {
                    curve: "smooth",
                    show: !0,
                    width: 3,
                    colors: [o]
                },
                xaxis: {
                    categories: xCategories,
                    axisBorder: {
                        show: !1
                    },
                    axisTicks: {
                        show: !1
                    },
                    tickAmount: 6,
                    labels: {
                        show: !1,
                        rotate: 0,
                        rotateAlways: !0,
                        style: {
                            colors: l,
                            fontSize: "12px"
                        }
                    },
                    crosshairs: {
                        position: "front",
                        stroke: {
                            color: o,
                            width: 1,
                            dashArray: 3
                        }
                    },
                    tooltip: {
                        enabled: !0,
                        formatter: void 0,
                        offsetY: 0,
                        style: {
                            fontSize: "12px"
                        }
                    }
                },
                yaxis: {
                    tickAmount: 4,
                    max: findMinMax(series_data).max * 1.2,
                    min: findMinMax(series_data).min * 0.7,
                    labels: {
                        show: !1,
                        style: {
                            colors: l,
                            fontSize: "12px"
                        },
                        formatter: function(e) {
                            return formatCurrency(e) + "₫"
                        }
                    }
                },
                states: {
                    normal: {
                        filter: {
                            type: "none",
                            value: 0
                        }
                    },
                    hover: {
                        filter: {
                            type: "none",
                            value: 0
                        }
                    },
                    active: {
                        allowMultipleDataPointsSelection: !1,
                        filter: {
                            type: "none",
                            value: 0
                        }
                    }
                },
                tooltip: {
                    style: {
                        fontSize: "12px"
                    },
                    y: {
                        formatter: function(e) {
                            return formatCurrency(e) + "₫"
                        }
                    }
                },
                colors: [KTUtil.getCssVariableValue("--bs-success")],
                grid: {
                    borderColor: r,
                    strokeDashArray: 4,
                    yaxis: {
                        lines: {
                            show: !0
                        }
                    }
                },
                markers: {
                    strokeColor: o,
                    strokeWidth: 3
                }
            };
            e.self = new ApexCharts(t,i),
            setTimeout((function() {
                e.self.render(),
                e.rendered = !0
            }
            ), 200)
        }
    };
    return {
        init: function() {
            t(e),
            KTThemeMode.on("kt.thememode.change", (function() {
                e.rendered && e.self.destroy(),
                t(e)
            }
            ))
        }
    }
}();
"undefined" != typeof module && (module.exports = KTChartsWidget3),
KTUtil.onDOMContentLoaded((function() {
    KTChartsWidget3.init()
}
));