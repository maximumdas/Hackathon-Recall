// import BoxplotData from "./boxplot_data_ipm";
function pickGroup(group) {
  const result = [];
  BoxplotData.filter((elem) => {
    if (elem.cluster == group) return result.push(elem.ipm);
  });
  return result;
}

var cluster0 = {
  y: pickGroup(0),
  type: "box",
  name: "Cluster 0",
};

var cluster1 = {
  y: pickGroup(1),
  type: "box",
  name: "Cluster 1",
};

var cluster2 = {
  y: pickGroup(2),
  type: "box",
  name: "Cluster 2",
};

var cluster3 = {
  y: pickGroup(3),
  type: "box",
  name: "Cluster 3",
};

window.onload = () => {
  var data = [cluster0, cluster1, cluster2, cluster3];
  Plotly.newPlot("boxplot", data);
};
