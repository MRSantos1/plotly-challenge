function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(response){
    var data = response;
    var PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    Object.entries(data).forEach(([key, value]) => {
      PANEL.append("p")
      .text(`${key}:${value}`);
  });

    // BONUS: Building gauge chart
    buildGauge(data.wfreq);
    var level = data.WFREQ;

        // Trig to calc meter point
        var degrees = 180 - (level*20),
             radius = .7;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.025 L .0 0.025 L ',
             pathX = String(x),
             space = ' ',
             pathY = String(y),
             pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'scatter',
           x: [0], y:[0],
            marker: {size: 28, color:'850000'},
            showlegend: false,
            name: 'speed',
            text: level,
            hoverinfo: 'text+name'},
          { values: [45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 45/8, 50],
          rotation: 90,
          text: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
                    '1-2', '0-1', ''],
          textinfo: 'text',
          textposition:'inside',
          marker: {colors:['#84B589','rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                                 'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                                 'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                                 '#F4F1E4','#F8F3EC', 'rgba(255, 255, 255, 0)',]},
          labels: ['8-9','7-8','6-7','5-6', '4-5', '3-4', '2-3',
          '1-2', '0-1', ''],
          hoverinfo: 'label',
          hole: .5,
          type: 'pie',
          showlegend: false
        }];

        var layout = {
          shapes:[{
              type: 'path',
              path: path,
              fillcolor: '850000',
              line: {
                color: '850000'
              }
            }],

          title: 'Belly Button Wash Frequency',
          xaxis: {zeroline:false, showticklabels:false,
                     showgrid: false, range: [-1, 1]},
          yaxis: {zeroline:false, showticklabels:false,
                     showgrid: false, range: [-1, 1]}
        };
        Plotly.newPlot('gauge', data, layout);
      })
    }

function buildCharts(sample) {
  var url = `/samples/${sample}`;
  d3.json(url).then(function (response){
    var x_value = response["otu_ids"];
    var y_value = response["sample_values"];
    var size_value = response["sample_values"];
    var label = response["otu_labels"];
    // @TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: x_value,
      y: y_value,
      mode:"markers",
      marker:{
        size: size_value,
        color: x_value,
        colorscale: "Rainbow",
        labels: label,
        type: 'scatter',
        opacity: 0.3
      }
    };

    var data1 = [trace1];

    var layout = {
      title: 'Marker Size',
      xaxis: { title: 'OTU ID' },
      showlegend: true
    };
    Plotly.newPlot("bubble", data1, layout);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var data = [{
      values: size_value.splice(0, 10),
      labels: x_value.splice(0, 10),
      text: y_value.splice(0,10),
      type: 'pie'
    }];
    Plotly.newPlot('pie', data);
  });
  }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
