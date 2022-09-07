// import BoxplotData from "./boxplot_data_ipm";
let CLUSTERS = 4;
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
  // .style({
  //   width: WIDTH_IN_PERCENT_OF_PARENT + "%",
  //   "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
  //   height: HEIGHT_IN_PERCENT_OF_PARENT + "vh",
  //   "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  // });

  var gd3_div2 = d3.select("div[id='boxplot']").style({
    width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });

  var gd3_div3 = d3.select("div[id='shap_all']").style({
    // width: WIDTH_IN_PERCENT_OF_PARENT + "%",
    // "margin-left": (100 - WIDTH_IN_PERCENT_OF_PARENT) / 2 + "%",
    // height: HEIGHT_IN_PERCENT_OF_PARENT + "vh",
    // "margin-top": (100 - HEIGHT_IN_PERCENT_OF_PARENT) / 2 + "vh",
  });

  var my_Div1 = gd3_div1.node();
  var my_Div2 = gd3_div2.node();
  var shapAll = gd3_div3.node();

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
    if (all) {
      let xlabel = [],
        yPosValues = [];
      yNegValues = [];
      baseNeg = [];
      for (var i = 0; i < data.length; i++) {
        xlabel.push(data[i].Variable);
        if (data[i].Sign == "red") {
          yPosValues.push(data[i].SHAP_abs);
        } else {
          yNegValues.push(data[i].SHAP_abs);
          baseNeg.push(-1 * data[i].SHAP_abs);
        }
      }
      var data = [
        {
          type: "bar",
          x: xlabel,
          y: yNegValues,
          base: baseNeg,
          hovertemplate: "%{base}",
          marker: {
            color: "red",
          },
          name: "Negative SHAP",
        },
        {
          type: "bar",
          x: xlabel,
          y: yPosValues,
          base: 0,
          hovertemplate: "%{value}",
          marker: {
            color: "blue",
          },
          name: "Possitive SHAP",
        },
      ];

      Plotly.newPlot(divName, data);
    }
  }

  // Boxplot
  function createBoxPlot(data, divName) {
    let clusts = [];
    for (var i = 0; i < CLUSTERS; i++) {
      clusts.push({
        y: pickGroup(data, i),
        type: "box",
        name: "Cluster " + i,
      });
    }
    Plotly.newPlot(divName, clusts);
  }

  // Treemap
  function processData(data, divName) {
    let labels = [],
      parents = [],
      values = [];
    console.log(data);
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
};
