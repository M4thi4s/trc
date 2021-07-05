function print_graph(graph,indice,ohlc,volume,type,otherSeriesFormatted){

  var series=[ {tooltip:{ valueDecimals: 2 } } ];

  if(typeof indice!="undefined")
    if(indice!=0)
      series[0].name=indice;

  if(typeof type!="undefined")
    if(type!=0)
      series[0].type=type;

  if(typeof data!="undefined")
    if(data!=0)
      series[0].data=data;

  if(typeof otherSeriesFormatted!="undefined"){
    if(otherSeriesFormatted!=0)
      series=otherSeriesFormatted;
  }

  console.log(volume);

  Highcharts.setOptions({
      colors: ['#f5a25d', '#389393', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4']
  });

  Highcharts.stockChart(graph, {

    tooltip: {
      shape: 'square',
      headerShape: 'callout',
      borderWidth: 0,
      shadow: false,
      positioner: function (width, height, point) {
        var chart = this.chart,
        position;

        if (point.isHeader) {
          position = {
          x: Math.max(
              // Left side limit
              chart.plotLeft,
              Math.min(
                point.plotX + chart.plotLeft - width / 2,
                // Right side limit
                chart.chartWidth - width - chart.marginRight
              )
            ),
            y: point.plotY
          };
        } else {
          position = {
            x: point.series.chart.plotLeft,
            y: point.series.yAxis.top - chart.plotTop
          };
        }

        return position;
      }
    },

    chart: {
      backgroundColor: '#f8f1f1',
      style: {
        color: "#389393"
      }
    },

    rangeSelector: {
        selected: 2
    },

    xAxis: {
      gridLineWidth: 1,
      labels: {
         style: {
            color: '#389393',
         }
      },
      title: {
         style: {
            color: '#389393',
         }
      }
    },

    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    exporting: {
      enabled: false
    },
    scrollbar: {
      enabled: true
    },
    rangeSelector: {
      selected: 4,
      inputEnabled: true
    },

    title: {
      text: indice,
      style: {
        color: '#ec524b',
      },
      y:25
    },

    yAxis: [{
      labels: {
        style: {
          color: '#389393',
        },
        align: 'right',
        x: -3
      },
      title: {
        text: ''
      },
      height: '80%',
      lineWidth: 2
    }, {
      labels: {
        style: {
          color: '#f5a25d',
        },
        align: 'right',
        x: -3
      },
      title: {
        text: ''
      },
      top: '65%',
      height: '35%',
      offset: 0,
      lineWidth: 2
    }],

    series: [{
      id: "mainSeries",
      type: 'candlestick',
      name: indice,
      data: ohlc,
    }, {
      type: 'column',
      name: 'Volume',
      data: volume,
      yAxis: 1,
    }, {
        type: 'sma',
        linkedTo: 'mainSeries'
    }, {
      type: 'bb',
      linkedTo: 'mainSeries'
    }],
  });

}

function onDataReceive() {
  var data=JSON.parse(this.responseText);

  var ohlc=[]

  for(var a=0; a<data.length; a++){
    if(parseFloat(data[a][data[a].length-1])!=0){
      ohlc.push([]);
      ohlc[ohlc.length-1].push(parseInt(data[a][0])*1000);
      for(var b=1; b<data[a].length-1; b++){
        ohlc[ohlc.length-1].push();
        ohlc[ohlc.length-1][b]=parseFloat(data[a][b]);
      }
    }
  }
  console.log(ohlc);
  var volume=[]

  for(var a=0; a<data.length; a++)
    if(parseFloat(data[a][data[a].length-1])!=0)
      volume.push([parseInt(data[a][0])*1000,parseFloat(data[a][data[a].length-1])]);

  console.log(volume);

  print_graph(document.getElementById("chart_div"),"AAPL - Real Time Quotation - refresh every minute", ohlc, volume, "candlestick");            // indice,data,type,otherSeriesFormatted
  setTimeout(function(){
    askForData();
  }, 30000);
}

function resize() {
  document.getElementById("chart_div").style.height=document.documentElement.clientHeight+"px";
  document.getElementById("chart_div").style.width=document.documentElement.clientWidth+"px";
}

function askForData(){
  var oReq = new XMLHttpRequest();
  oReq.onload = onDataReceive;
  oReq.open("get", "/json/data.json", true);
  oReq.send();
}

document.addEventListener("DOMContentLoaded", function(){
  document.getElementById("chart_div").style.height=document.documentElement.clientHeight+"px";
  document.getElementById("chart_div").style.width=document.documentElement.clientWidth+"px";
  window.onresize = resize;
  askForData();
}, false);
