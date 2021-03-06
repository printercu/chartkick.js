// Generated by CoffeeScript 1.8.0
(function() {
  'use strict';
  var Chartkick, merge;

  Chartkick = window.Chartkick;

  merge = Chartkick.utils.merge;

  Chartkick.adapters.push(new function() {
    var callbacks, createDataTable, defaultOptions, hideLegend, jsOptions, loaded, resize, runCallbacks, setBarMax, setBarMin, setMax, setMin, setStacked, waitForLoaded;
    this.name = 'google';
    loaded = {};
    callbacks = [];
    runCallbacks = function() {
      var cb, i, _results;
      i = 0;
      _results = [];
      while (i < callbacks.length) {
        cb = callbacks[i];
        if (google.visualization && ((cb.pack === 'corechart' && google.visualization.LineChart) || (cb.pack === 'timeline' && google.visualization.Timeline))) {
          cb.callback();
          _results.push(callbacks.splice(i, 1));
        } else {
          _results.push(i += 1);
        }
      }
      return _results;
    };
    waitForLoaded = function(pack, callback) {
      var loadOptions;
      if (!callback) {
        callback = pack;
        pack = 'corechart';
      }
      callbacks.push({
        pack: pack,
        callback: callback
      });
      if (loaded[pack]) {
        return runCallbacks();
      } else {
        loaded[pack] = true;
        loadOptions = {
          packages: [pack],
          callback: runCallbacks
        };
        if (Chartkick.config.language) {
          loadOptions.language = config.language;
        }
        return google.load('visualization', '1', loadOptions);
      }
    };
    defaultOptions = {
      chartArea: {},
      fontName: "'Lucida Grande', 'Lucida Sans Unicode', Verdana, Arial, Helvetica, sans-serif",
      pointSize: 6,
      legend: {
        textStyle: {
          fontSize: 12,
          color: '#444'
        },
        alignment: 'center',
        position: 'right'
      },
      curveType: 'function',
      hAxis: {
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        gridlines: {
          color: 'transparent'
        },
        baselineColor: '#ccc',
        viewWindow: {}
      },
      vAxis: {
        textStyle: {
          color: '#666',
          fontSize: 12
        },
        baselineColor: '#ccc',
        viewWindow: {}
      },
      tooltip: {
        textStyle: {
          color: '#666',
          fontSize: 12
        }
      }
    };
    hideLegend = function(options) {
      return options.legend.position = 'none';
    };
    setMin = function(options, min) {
      return options.vAxis.viewWindow.min = min;
    };
    setMax = function(options, max) {
      return options.vAxis.viewWindow.max = max;
    };
    setBarMin = function(options, min) {
      return options.hAxis.viewWindow.min = min;
    };
    setBarMax = function(options, max) {
      return options.hAxis.viewWindow.max = max;
    };
    setStacked = function(options) {
      return options.isStacked = true;
    };
    jsOptions = Chartkick.utils.jsOptionsFunc(defaultOptions, hideLegend, setMin, setMax, setStacked);
    createDataTable = function(series, columnType) {
      var d, data, i, is_datetime, key, rows, rows2, s, _i, _j, _len, _len1, _ref;
      data = new google.visualization.DataTable();
      data.addColumn(columnType, '');
      is_datetime = columnType === 'datetime';
      rows = [];
      for (i = _i = 0, _len = series.length; _i < _len; i = ++_i) {
        s = series[i];
        data.addColumn('number', s.name);
        _ref = s.data;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          d = _ref[_j];
          key = is_datetime ? d[0].getTime() : d[0];
          rows[key] || (rows[key] = new Array(series.length));
          rows[key][i] = parseFloat(d[1]);
        }
      }
      rows2 = (function() {
        var _results;
        _results = [];
        for (i in rows) {
          if (rows.hasOwnProperty(i)) {
            _results.push([is_datetime ? new Date(parseFloat(i)) : i].concat(rows[i]));
          }
        }
        return _results;
      })();
      if (is_datetime) {
        rows2.sort(Chartkick.utils.sortByTime);
      }
      data.addRows(rows2);
      return data;
    };
    resize = function(callback) {
      if (window.attachEvent) {
        window.attachEvent('onresize', callback);
      } else if (window.addEventListener) {
        window.addEventListener('resize', callback, true);
      }
      return callback();
    };
    this.renderLineChart = function(chart) {
      return waitForLoaded(function() {
        var data, options, type;
        options = jsOptions(chart.data, chart.options);
        type = chart.options.discrete ? 'string' : 'datetime';
        data = createDataTable(chart.data, type);
        chart.chart = new google.visualization.LineChart(chart.element);
        return resize(function() {
          return chart.chart.draw(data, options);
        });
      });
    };
    this.renderPieChart = function(chart) {
      return waitForLoaded(function() {
        var chartOptions, data, options;
        chartOptions = {
          chartArea: {
            top: '10%',
            height: '80%'
          }
        };
        if (chart.options.colors) {
          chartOptions.colors = chart.options.colors;
        }
        options = merge(merge(defaultOptions, chartOptions), chart.options.library || {});
        data = new google.visualization.DataTable();
        data.addColumn('string', '');
        data.addColumn('number', 'Value');
        data.addRows(chart.data);
        chart.chart = new google.visualization.PieChart(chart.element);
        return resize(function() {
          return chart.chart.draw(data, options);
        });
      });
    };
    this.renderColumnChart = function(chart) {
      return waitForLoaded(function() {
        var data, options;
        options = jsOptions(chart.data, chart.options);
        data = createDataTable(chart.data, 'string');
        chart.chart = new google.visualization.ColumnChart(chart.element);
        return resize(function() {
          return chart.chart.draw(data, options);
        });
      });
    };
    this.renderBarChart = function(chart) {
      return waitForLoaded(function() {
        var chartOptions, data, options;
        chartOptions = {
          hAxis: {
            gridlines: {
              color: '#ccc'
            }
          }
        };
        options = Chartkick.utils.jsOptionsFunc(defaultOptions, hideLegend, setBarMin, setBarMax, setStacked)(chart.data, chart.options, chartOptions);
        data = createDataTable(chart.data, 'string');
        chart.chart = new google.visualization.BarChart(chart.element);
        return resize(function() {
          return chart.chart.draw(data, options);
        });
      });
    };
    this.renderAreaChart = function(chart) {
      return waitForLoaded(function() {
        var chartOptions, data, options, type;
        chartOptions = {
          isStacked: true,
          pointSize: 0,
          areaOpacity: 0.5
        };
        options = jsOptions(chart.data, chart.options, chartOptions);
        type = chart.options.discrete ? 'string' : 'datetime';
        data = createDataTable(chart.data, type);
        chart.chart = new google.visualization.AreaChart(chart.element);
        return resize(function() {
          return chart.chart.draw(data, options);
        });
      });
    };
    this.renderGeoChart = function(chart) {
      return waitForLoaded(function() {
        var chartOptions, data, options;
        chartOptions = {
          legend: 'none',
          colorAxis: {
            colors: chart.options.colors || ['#f6c7b6', '#ce502d']
          }
        };
        options = merge(merge(defaultOptions, chartOptions), chart.options.library || {});
        data = new google.visualization.DataTable();
        data.addColumn('string', '');
        data.addColumn('number', 'Value');
        data.addRows(chart.data);
        chart.chart = new google.visualization.GeoChart(chart.element);
        return resize(function() {
          return chart.chart.draw(data, options);
        });
      });
    };
    this.renderTimeline = function(chart) {
      return waitForLoaded('timeline', function() {
        var chartOptions, data, options;
        chartOptions = {
          legend: 'none'
        };
        if (chart.options.colors) {
          chartOptions.colorAxis.colors = chart.options.colors;
        }
        options = merge(merge(defaultOptions, chartOptions), chart.options.library || {});
        data = new google.visualization.DataTable();
        data.addColumn({
          type: 'string',
          id: 'Name'
        });
        data.addColumn({
          type: 'date',
          id: 'Start'
        });
        data.addColumn({
          type: 'date',
          id: 'End'
        });
        data.addRows(chart.data);
        chart.chart = new google.visualization.Timeline(chart.element);
        return resize(function() {
          return chart.chart.draw(data, options);
        });
      });
    };
    return this;
  });

}).call(this);
