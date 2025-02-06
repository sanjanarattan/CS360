let gx = 10;
let gy = 10;
let hx = gx;
let hy = gy + 140;

let gist = "https://gist.githubusercontent.com/sanjanarattan/fb4a5813ec52f72e693b75d4083fa700/raw/000bdd0150cceb737bfdf8c84bf48b809191a14e/cod.csv"


let data = [];

// Preload images and csv
function preload(){
  // load csv (commented version is for faster loading locally for debugging purposes)
  table = loadTable('./data/cod2.csv', 'csv', 'header')
  //table = loadTable(gist, 'csv', 'header')
}

function read_data(){
  for (let i = 0; i < table.getRowCount(); i++) {
    let year = table.getString(i, "Year");
    let rate = table.getNum(i, "Age-adjusted Death Rate");
    let state = table.getString(i,"State");
    let deaths = table.getNum(i,"Deaths");
    let disease = table.getString(i, "Cause Name");

    if (disease == "Stroke" && state != "United States" && state != "District of Columbia") {
      data.push({ year, state, deaths, rate});
    }
  }
  // sort data by deaths
  data.sort((a, b) => b.deaths - a.deaths);

}

// Dotted notebook look
function dots(j) {
  push();
  for (let i = gx; i < 1600; i += 20) {
    fill(158);
    noStroke()
    circle(i, j, 1.5, 1.5); 
  }
  pop();
}

// Main title
function title(){
  push();
  fill(0);
  textSize(30);
  text("Visualizing Cerebrovascular Diseases in the USA from 1999 - 2017", gx, gy + 50);
  line(gx, gy + 60, gx + 1000, gy + 60);
  pop();
}

function subtitle(x, y, z){
  push();
  fill(0);
  textSize(20);
  text(z, x, y);
  pop();
}


// Histogram - ROD freqs
function hist(){
  // graph title
  subtitle(hx, hy, "1. Frequency Distribution of Age Related Rate of Death due to Cerebrovascular Diseases in the USA from 1999 - 2017")
  
  // scales
  let min_rate = min(data.map((d) => d.rate));
  let max_rate = max(data.map((d) => d.rate));
  console.log(min_rate);        // 24.6
  console.log(max_rate);        // 83.4

  // choosing bin size
  // 1) Round bin sizes up or down. 
  let min_round = Math.floor(min_rate);
  let max_round = Math.ceil(max_rate);
  console.log(min_round);        // 24
  console.log(max_round);        // 84
  // 2) Based on the dot plot from A1, 6 is a good range for the bins
  let bin_sz = 10;
  // 3) Get number of data points ( 50 states from 2017 - 1999)
  let point_sum = 50 * (2017 - 1999)
  // 4) Divide number of points by 100
  let x_ticks = 100 / point_sum // 900
  console.log(point_sum)
  console.log(x_ticks) // ~ 10%

  // x - axes
  line(hx + 60, hy + 500,hx + 60 + 840,hy + 500);
  let x_ticks_scale = ((hx + 760 + hx + 60) / 6) - 56;
  console.log(x_ticks_scale);

  let x_start = hx + 60
  let death_label = min_round
  subtitle((840)/2,hy + 540,"Rate of Death");

  // x ticks and labelling
  for(i = 0; i < bin_sz + 1; i ++){

    push();
    fill(0);
    textSize = 10;
    stroke(0)
    text(death_label, x_start, hy + 510);
    line(x_start, hy + 500, x_start, hy + 505);
    x_start = x_start + x_ticks_scale;
    death_label = death_label + 6;
    pop();
  }

  // y axes
  line(hx + 60, hy + 500,hx + 60,hy + 10);
  for(i = 0; i < bin_sz + 1; i ++){

    push();
    fill(0);
    textSize = 10;
    stroke(0)
    text(death_label, x_start, hy + 510);
    line(x_start, hy + 500, x_start, hy + 505);
    x_start = x_start + x_ticks_scale;
    death_label = death_label + 6;
    pop();
  }
  


}

function setup() {
  createCanvas(1600, 5000);
  textFont('Courier New');
  background(255);

  read_data();
  title();
  hist();

  let j = gy;
  for (let i = gy; i < 5000; i += 10) {
    dots(j);
    j += 20;
  }
}




function draw() {

}
