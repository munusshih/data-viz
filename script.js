$(document).ready(function () {
    $("#curtainer").fadeOut(2000);
    $("#curtain").fadeOut(4000);
});

var selectedOption = "BayRidge-And-DykerHeights"

// set the dimensions and margins of the graph
var margin = {
        top: 50,
        right: 0,
        bottom: 100,
        left: 0
    },
    width = 960 - margin.left - margin.right,
    height = 1000 - margin.top - margin.bottom;
barHeight = height / 2 - 40;

let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip');

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("viewBox", `0 0 ` + width + ` ` + height)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var formatNumber = d3.format("s");

var color = d3.scale.ordinal()
    .range(["#FFA585", "#FFAD88", "#FFB58B", "#FFBD8E", "#FFC591", "#FFCD94", "#FFD597", "#FFDD9A", "#FFE59D", "#FFEDA0", "#211F2F", "#2D2B3D", "#3A374A", "#464358", "#534F65", "#5F5C73", "#6C6880", "#78748E", "#85809B", "#918CA9"]);

d3.csv("Air_Quality2.csv", function (error, data) {

    var allGroup = ["BayRidge-And-DykerHeights", "Bayside-LittleNeck", "BaysideLittleNeck-FreshMeadows", "BedfordStuyvesant-CrownHeights", "Belmont-And-EastTremont", "Bensonhurst-BayRidge", "BoroughPark", "Bronx", "Brooklyn", "Brownsville", "Bushwick", "CentralHarlem", "Chelsea-Clinton", "Chelsea-Village", "Clinton-And-Chelsea", "Coneyisl-And-", "Crotona-Tremont", "Downtown-Heights-Slope", "EastFlatbush", "EastHarlem", "EastNewYork", "Elmhurst-And-Corona", "FinancialDistrict", "Flatbush-And-Midwood", "Flatl-And-s-And-Canarsie", "Flushing-Clearview", "Flushing-And-Whitestone", "Fordham-BronxPk", "Fordham-And-UniversityHeights", "FortGreene-And-BrooklynHeights", "FreshMeadows", "GramercyPark-MurrayHill", "Greenpoint", "Greenpoint-And-Williamsburg", "GreenwichVillage-And-Soho", "HighBridge-Morrisania", "Highbridge-And-Concourse", "Hillcrest-And-FreshMeadows", "HuntsPoint-MottHaven", "HuntsPoint-And-Longwood", "JacksonHeights", "Jamaica", "Jamaica-And-Hollis", "KewGardens-And-Woodhaven", "Kingsbridge-Riverdale", "KingsbridgeHeights-And-Bedford", "Longisl-And-City-Astoria", "Longisl-And-City-And-Astoria", "LowerEastSide-And-Chinatown", "LowerManhattan", "Manhattan", "Midtown", "MorningsideHeights-And-HamiltonHeights", "MorrisPark-And-Bronxdale", "Morrisania-And-Crotona", "MottHaven-And-Melrose-And-", "NewYorkCity", "NortheastBronx", "NorthernSI", "ParkSlope-And-CarrollGardens", "Parkchester-And-Soundview", "Pelham-ThrogsNeck", "PortRichmond", "Queens", "QueensVillage", "RegoPark-And-ForestHills", "Ridgewood-ForestHills", "Ridgewood-And-Maspeth", "Riverdale-And-Fieldston", "Rockaway-And-BroadChannel-And-", "Rockaways", "SheepsheadBay-And-", "SouthBeach-Tottenville", "SouthBeach-And-Willowbrook-And-", "SouthBronx", "SouthCrownHeights-And-LeffertsGardens", "SouthOzonePark-And-HowardBeach", "SoutheastQueens", "SouthernSI", "SouthwestQueens", "St.George-And-Stapleton-And-", "Stapleton-St.George", "Statenisl-And-", "StuyvesantTown-And-TurtleBay", "SunsetPark", "ThrogsNeck-And-Co-opCity", "Tottenville-And-GreatKills-And-", "UnionSquare-LowerEastSide", "UnionSquare-LowerManhattan", "UpperEastSide", "UpperEastSide", "UpperEastSide-Gramercy", "UpperWestSide", "UpperWestSide", "WashingtonHeights", "WashingtonHeights-And-Inwood-And-", "WestQueens", "Williamsbridge-And-Baychester", "Williamsburg-Bushwick", "Willowbrook", "Woodside-And-Sunnyside"]; // add the options to the button

    d3.select("#selectButton")
        .selectAll('myOptions')
        .data(allGroup)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
        }) // text showed in the menu
        .attr("value", function (d) {
            return d;
        }) // corresponding value returned by the button

    var maxv = d3.max(data, function (d) {
        return Number(d[selectedOption]);
        // parseInt
    });

    var minv = d3.min(data, function (d) {
        return Math.floor(d[selectedOption]);
    });

    var extent = [minv, maxv]

    var barScale = d3.scale.linear()
        .domain(extent)
        .range([30, barHeight]);

    var keys = data.map(function (d, i) {
        return d.year;
    });

    var numBars = keys.length;

    var x = d3.scale.linear()
        .domain(extent) // X axis goes from 0 to 2pi = all around the circle. If I stop at 1Pi, it will be around a half circle
        .range([0, -barHeight]);

    var xAxis = d3.svg.axis()
        .scale(x).orient("left")
        .ticks(3)
        .tickFormat(formatNumber);

    var circles = svg.selectAll("circle")
        .data(x.ticks(3))
        .enter().append("circle")
        .attr("r", function (d) {
            return barScale(d);
        })
        .style("fill", "none")
        .style("stroke", "white")
        .style("stroke-dasharray", "2,2")
        .style("stroke-width", ".5px");

    var arc = d3.svg.arc()
        .startAngle(function (d, i) {
            return (i * 2 * Math.PI) / numBars;
        })
        .endAngle(function (d, i) {
            return ((i + 1) * 2 * Math.PI) / numBars;
        })
        .innerRadius(0);

    var segments = svg.selectAll("path")
        .data(data).enter().append("path")
        .each(function (d) {
            d.outerRadius = 0;
        })
        .style("fill", function (d) {
            return color(d.year);
        })
        .attr("d", arc);

    segments.transition().ease("elastic").duration(1000).delay(function (d, i) {
            return (25 - i) * 100;
        })
        .attrTween("d", function (d, index) {
            var i = d3.interpolate(d.outerRadius, barScale(d[selectedOption]));
            return function (t) {
                d.outerRadius = i(t);
                return arc(d, index);
            };
        });

    segments.on('mousemove', showTooltip)
    segments.on('mouseout', hideTooltip)

    function showTooltip(d) {
        tooltip.style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(d[selectedOption] + " parts per billion (ppb) NO2" + "<br> Mean of " + d.year)
    }

    function hideTooltip() {
        tooltip.style('display', 'none');
    }


    function update() {

        var maxv = d3.max(data, function (d) {
            return Math.ceil(d[selectedOption]);
        });

        var minv = d3.min(data, function (d) {
            return Math.floor(d[selectedOption]);
        });

        var extent = [minv, maxv]

        barScale = d3.scale.linear()
            .domain(extent)
            .range([30, barHeight]);

        x = d3.scale.linear()
            .domain(extent)
            .range([0, -barHeight]);

        xAxis = d3.svg.axis()
            .scale(x).orient("left")
            .ticks(3)
            .tickFormat(formatNumber);

        circles = svg.selectAll("circle")
            .data(x.ticks(3))
            .enter().append("circle")
            .attr("r", function (d) {
                return barScale(d);
            })
            .style("fill", "none")
            .style("stroke", "white")
            .style("stroke-dasharray", "2,2")
            .style("stroke-width", ".5px");


        segments.transition().ease("elastic").duration(1000).delay(function (d, i) {
                return (25 - i) * 20;
            })
            .attrTween("d", function (d, index) {
                var i = d3.interpolate(d.outerRadius, barScale(d[selectedOption]));
                console.log(barScale(d[selectedOption]))
                return function (t) {
                    d.outerRadius = i(t);
                    return arc(d, index);
                };
            });

        svg.selectAll("g").remove();

        svg.append("g")
            .attr("class", "x axis")
            .style("fill", function (d, i) {
                return "#fff";
            })
            .call(xAxis);

        // Labels
        labelRadius = barHeight * 1.025;

        labels = svg.append("g")
            .classed("labels", true);

        labels.append("def")
            .append("path")
            .attr("id", "label-path")
            .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

        labels.selectAll("text")
            .data(keys)
            .enter().append("text")
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .style("fill", function (d, i) {
                return "#fff";
            })
            .append("textPath")
            .attr("xlink:href", "#label-path")
            .attr("startOffset", function (d, i) {
                return i * 100 / numBars + 50 / numBars + '%';
            })
            .text(function (d) {
                return d.toUpperCase();
            });

    }

    // ----------------------------------------------------------------------

    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function (d) {
        // recover the option that has been chosen
        selectedOption = d3.select(this).property("value")
        console.log(selectedOption)
        update()
    })

    // ----------------------------------------------------------------------
    svg.append("circle")
        .attr("r", barHeight)
        .classed("outer", true)
        .style("fill", "none")
        .style("stroke", "white")
        .style("stroke-width", "1.5px");

    var lines = svg.selectAll("line")
        .data(keys)
        .enter().append("line")
        .attr("y2", -barHeight - 20)
        .style("stroke", "white")
        .style("stroke-width", ".5px")
        .attr("transform", function (d, i) {
            return "rotate(" + (i * 360 / numBars) + ")";
        });

    svg.append("g")
        .attr("class", "x axis")
        .style("fill", function (d, i) {
            return "#fff";
        })
        .call(xAxis);

    // Labels
    var labelRadius = barHeight * 1.025;

    var labels = svg.append("g")
        .classed("labels", true);

    labels.append("def")
        .append("path")
        .attr("id", "label-path")
        .attr("d", "m0 " + -labelRadius + " a" + labelRadius + " " + labelRadius + " 0 1,1 -0.01 0");

    labels.selectAll("text")
        .data(keys)
        .enter().append("text")
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .style("fill", function (d, i) {
            return "#fff";
        })
        .append("textPath")
        .attr("xlink:href", "#label-path")
        .attr("startOffset", function (d, i) {
            return i * 100 / numBars + 50 / numBars + '%';
        })
        .text(function (d) {
            return d.toUpperCase();
        });

});