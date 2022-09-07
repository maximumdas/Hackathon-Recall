// import BoxplotData from "./boxplot_data_ipm";
let CLUSTERS = 4;
let SHAPDATA = [];
window.onload = () => {
  // Place urls for cvs files here
  var url1 = "./../csv/treemap_all.csv";

  var url2 = "./../csv/boxplot_data_ipm.csv";

  var urlSHAP = "./../csv/SHAP Values - All Data.csv";
  var urlSHAPClust = [
    "./../csv/SHAP Values - Cluster 1.csv",
    "./../csv/SHAP Values - Cluster 2.csv",
    "./../csv/SHAP Values - Cluster 3.csv",
    "./../csv/SHAP Values - Cluster 4.csv",
  ];

  //var url3 = 'XXXX';
  //var url4 = 'XXXX';
  //var url5 = 'XXXX';

  // Next piece of code deals with responsiveness
  var d3 = Plotly.d3;
  var WIDTH_IN_PERCENT_OF_PARENT = 100,
    HEIGHT_IN_PERCENT_OF_PARENT = 97;

  var gd3_div1 = d3.select("div[id='treemap']");

  var gd3_div2 = d3.select("div[id='boxplot']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });

  var gd3_div3 = d3.select("div[id='shap_all']").style({});

  var gd3_div3_2 = d3.select("div[id='shap_cluster']").style({});

  var my_Div1 = gd3_div1.node();
  var my_Div2 = gd3_div2.node();
  var shapAll = gd3_div3.node();
  var shapCluster = gd3_div3_2.node();

  //URL1 and URL2
  function makeplot() {
    Plotly.d3.csv(url1, function (data) {
      processData(data, "treemap");
    });
    Plotly.d3.csv(url2, function (data) {
      createBoxPlot(data, "boxplot");
    });
    Plotly.d3.csv(urlSHAP, function (data) {
      createShapPlot(data, "shap_all");
    });

    // shap cluster
    urlSHAPClust.forEach((source) => {
      Plotly.d3.csv(source, (data) => {
        injectShapData(data);
      });
    });
  }

  function injectShapData(data) {
    SHAPDATA.push(data);
    if (SHAPDATA.length == 4) {
      createShapPlot(SHAPDATA, "shap_cluster", false);
      SHAPDATA = [];
    }
  }

  function pickGroup(allRow, group) {
    const result = [];
    allRow.filter((elem) => {
      if (elem.cluster == group) return result.push(elem.ipm);
    });
    return result;
  }

  // Shap value
  function createShapPlot(data, divName, all = true) {
    var layout = {
      // title: "Bar Chart",
      yaxis: {
        automargin: true,
      },
    };
    if (all) {
      let xlabel = [],
        yPosValues = [];
      yNegValues = [];
      barColors = [];
      for (var i = 0; i < data.length; i++) {
        xlabel.push(data[i].Variable);
        yPosValues.push(data[i].SHAP_abs);
        barColors.push(data[i].Sign);
      }
      var data = [
        {
          type: "bar",
          x: yPosValues,
          y: xlabel,
          base: 0,
          hovertemplate: "%{value}",
          orientation: "h",
          marker: {
            color: barColors,
          },
          name: "SHAP Value",
        },
      ];
    } else {
      let traces = [];
      for (var i = 0; i < data.length; i++) {
        let xlab = [],
          yval = [],
          barcol = [];
        for (var j = 0; j < data[i].length; j++) {
          xlab.push(data[i][j].Variable);
          yval.push(data[i][j].SHAP_abs);
          barcol.push(data[i][j].Sign);
        }
        traces.push({
          type: "bar",
          x: yval,
          y: xlab,
          base: 0,
          hovertemplate: "%{value}",
          orientation: "h",
          marker: {
            color: barcol,
          },
          yaxis: "y" + (i + 1),
          xaxis: "x" + (i + 1),
          name: "SHAP Value Cluster " + (i + 1),
        });
      }

      layout["grid"] = { rows: 4, columns: 1, pattern: "independent" };
      layout["showlegend"] = false;
      data = traces;
    }
    Plotly.newPlot(divName, data, layout);
  }

  // Boxplot
  function createBoxPlot(data, divName) {
    let clusts = [];
    for (var i = 0; i < CLUSTERS; i++) {
      clusts.push({
        y: pickGroup(data, i),
        type: "box",
        name: "Cluster " + (i + 1),
      });
    }
    Plotly.newPlot(divName, clusts);
  }

  // Treemap
  function processData(data, divName) {
    let labels = [],
      parents = [],
      values = [];
    for (var i = 0; i < data.length; i++) {
      labels.push(data[i].label);
      parents.push("APBD");
      values.push(data[i].alokasi);
    }
    var data = [
      {
        type: "treemap",
        labels: labels,
        parents: parents,
        values: values,
        textinfo: "label+value+percent entry",
        domain: { x: [0, 1] },
        outsidetextfont: { size: 20, color: "#377eb8" },
        marker: { line: { width: 2 } },
        pathbar: { visible: false },
      },
    ];

    var layout = {
      annotations: [
        {
          showarrow: false,
          text: "Alokasi APBD Berdasarkan Kegiatan",
          x: 0.5,
          xanchor: "center",
          y: 1.1,
          yanchor: "bottom",
        },
      ],
    };
    Plotly.newPlot(divName, data, layout);
  }

  makeplot();

  //instruction resizes plot
  window.onresize = function () {
    Plotly.Plots.resize(my_Div1);
    Plotly.Plots.resize(my_Div2);
    Plotly.Plots.resize(shapAll);
  };

  shapSelect = window.document.getElementById("shapSelect");
  shapSelect.addEventListener("change", function (e) {
    if (shapSelect.value == 0) {
      window.document
        .getElementById("shap-all-container")
        .classList.remove("hidden");
      window.document
        .getElementById("shap-per-cluster")
        .classList.add("hidden");
    } else if (shapSelect.value == 1) {
      window.document
        .getElementById("shap-all-container")
        .classList.add("hidden");
      window.document
        .getElementById("shap-per-cluster")
        .classList.remove("hidden");
    }
  });
};
