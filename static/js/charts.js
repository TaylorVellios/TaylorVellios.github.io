function init() {
    var selector = d3.select('#selDataset');    
    d3.json('samples.json').then((data) => {
        console.log(data);
        var sampleNames = data.names;
        sampleNames.forEach((sample) => {
            selector
                .append('option')
                .text(sample)
                .property('value', sample)
        });

        buildCharts(sampleNames[0]);
        buildMetadata(sampleNames[0]);
    });
};

init();

function optionChanged(newSample) {
    console.log(newSample);
    buildMetadata(newSample);
    buildCharts(newSample);

};

function buildMetadata(sample) {
    d3.json('samples.json').then((data) => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
        var result = resultArray[0];
        var PANEL = d3.select('#sample-metadata');

        PANEL.html("");
        PANEL.append('h6').text(`ID: ${result.id}`);
        PANEL.append('h6').text(`Ethnicity: ${result.ethnicity}`);
        PANEL.append('h6').text(`Gender: ${result.gender}`);
        PANEL.append('h6').text(`Age: ${result.age}`);
        PANEL.append('h6').text(`Location: ${result.location}`);
        PANEL.append('h6').text(`BBTYPE: ${result.bbtype}`);
        PANEL.append('h6').text(`WFREQ: ${result.wfreq}`);
    });
};

function buildCharts(input) {
// Deliverable 1 - Bar Chart - Plotting to 'bar' <div>
    d3.json("samples.json").then((data) => {
        // 3. Create a variable that holds the samples array. 
        var samples = data.samples;
        // 4. Create a variable that filters the samples for the object with the desired sample number.
        var target = samples.filter(i => i.id === input);
        //  5. Create a variable that holds the first sample in the array.
        var sample_toPlot = target[0];
    
        // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
        let otu_ids = sample_toPlot.otu_ids;
        let otu_labels = sample_toPlot.otu_labels;
        let sample_values = sample_toPlot.sample_values;
    
        let bar_data = {};
        let x = 0;
        while (x < otu_ids.length) {
            bar_data[x] = {id: otu_ids[x], 
                label: otu_labels[x],
                samples: sample_values[x]};
            x += 1;
        };
        
        let bar_vals = Object.entries(bar_data).sort((a,b) => b.samples - a.samples).map(i => i[1]).slice(0,10);
        // 7. Create the yticks for the bar chart.
        console.log(bar_vals);
        // Hint: Get the the top 10 otu_ids and map them in descending order  
        //  so the otu_ids with the most bacteria are last. 
        
        var yticks = bar_vals.map(i => `OTU ${i.id}`);
        console.log(yticks);

        var hovertext = bar_vals.map(i => i.label);
        // 8. Create the trace for the bar chart. 
        var barData = [{
            x: bar_vals.map(i => i.samples),
            y: yticks,
            type: "bar",
            orientation: 'h',
            hoverinfo: 'text',
            text: hovertext,
            marker: {
                width: 1
            },
            transforms: [{type: 'sort', target: 'y', order: 'descending'}]
        }];
        // 9. Create the layout for the bar chart. 
        var barLayout = {
            xaxis: {title: 'Number of Samples', type:'trace'},
            title: `Top 10 Cultures Found in Subject ${input}`,
        };
        // 10. Use Plotly to plot the data with the layout. 
        Plotly.newPlot('bar', barData, barLayout);


        console.log(hovertext);
//Deliverable 2 - Scatter Plot
        var scat_trace = {
            x: otu_ids,
            y: sample_values,
            mode: 'markers',
            text: hovertext,
            hovertemplate: `(%{x}, %{y})<br>%{text}`,

            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'Earth'
            },
            type: 'scatter'
        };

        var scat_layout = {
            title: 'Bacteria Cultures Per Sample',
            xaxis: {title: 'OTU ID', zeroline: false},
        };

       Plotly.newPlot('bubble', [scat_trace], scat_layout);




//Deliverable 3 - Gauge Chart
        var washes = data.metadata.filter(i => i.id == input)[0].wfreq;
        var gauge_data = [{
            type: 'indicator',
            mode: "gauge+number",
            value: washes,
            gauge: {
                axis: {range: [null,10], tickwidth: 1},
                steps: [
                    {range: [0,2], color: 'red'},
                    {range: [2,4], color:'orange'},
                    {range: [4,6], color:'yellow'},
                    {range: [6,8], color:'lightgreen'},
                    {range: [8,10], color:'green'}
                    ],
                bar: {color: 'black'}
                }
        }];

        var gauge_layout = {
            title: '<b>Belly Button Washing Frequency</b><br>Scrubs per Week'
        };

        Plotly.newPlot('gauge', gauge_data, gauge_layout);


















      });

};


