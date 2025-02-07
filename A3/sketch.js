let gx = 10;
let gy = 10;
let hx = gx;
let hy = gy + 140;
let slider;

let gist = "https://gist.githubusercontent.com/sanjanarattan/fb4a5813ec52f72e693b75d4083fa700/raw/000bdd0150cceb737bfdf8c84bf48b809191a14e/cod.csv"


let data = [];

// Preload images and csv
function preload(){
  // load csv (commented version is for faster loading locally for debugging purposes)
  //table = loadTable('./data/cod2.csv', 'csv', 'header')
  table = loadTable(gist, 'csv', 'header')
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


// Main title
function title(){
  push();
  fill(0);
  textSize(30);
  text("Visualizing Cerebrovascular Diseases in the USA from 1999 - 2017", gx, gy + 50);
  line(gx, gy + 60, gx + 1150, gy + 60);
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
function hist(y){


  // graph title
  push();
  fill(0);
  textSize(20);
  text(`1. Distribution of Age Related Rate of Death due to Cerebrovascular Diseases in the USA (${y})`, hx, hy);
  pop()
  let year = `${y}`
  let data_fi = data.filter((d) => d.year == year);

  // scales
  let min_rate = min(data_fi.map((d) => d.rate));
  let max_rate = max(data_fi.map((d) => d.rate));
  //console.log(data_fi.length)
  //console.log(min_rate);      // 42.2        
  //console.log(max_rate);      // 83.4    

  // choosing bin size
  // 1) Round bin sizes up or down. 
  let min_round = Math.floor(min_rate);
  let max_round = Math.ceil(max_rate);
  //console.log(min_round);        // 24
  //console.log(max_round);        // 84
  // 2) Based on the dot plot from A1, 6 is a good range for the bins
  let bin_sz = 10;
  // 3) Get number of data points ( 50 states from 2017 - 1999)
  let point_sum = 50 * (2017 - 1999)
  // 4) Divide number of points by 100
  let ticks = Math.ceil(100 / point_sum) * 10// 900
  //console.log(point_sum)
  //console.log(ticks) // ~ 10%

  // x - axes
  line(hx + 60, hy + 500,hx + 60 + 980,hy + 500);
  let x_ticks_scale = ((hx + 760 + hx + 60) / 6);
  //console.log(x_ticks_scale);

  let x_start = hx + 60
  let death_label = min_round
  subtitle(((840)/2) + 80,hy + 550,"Rate of Death");

  // x ticks and labelling
  for(i = 0; i < 8; i ++){

    push();
    fill(0);
    textSize(10);
    text(death_label, x_start - 5, hy + 520);
    line(x_start, hy + 500, x_start, hy + 505);
    x_start = x_start + x_ticks_scale;
    death_label = death_label + 6;
    pop();
  }

  // y axes
  let y_start = hy + 500; // start from bottom and work out way up
  let freq_label = 0 ;     

  line(hx + 60, hy + 500, hx + 60, hy + 50);
  for(i = 0; i < 6; i ++){

    push();
    fill(0);
    textSize(10);
    text(freq_label, hx + 40, y_start);
    line(hx + 58, y_start, hx + 60, y_start);
    y_start = y_start - x_ticks_scale - 60;
    freq_label = freq_label + ticks;
    pop();
  }

  for (i = 0; i < 7; i++) {
    let bin_start = min_rate + (6 * i);
    let bin_end = min_rate + (6 * (i + 1));
    let bin_data = data_fi.filter((d) => d.rate > bin_start && d.rate <= bin_end);
    let bin_count = bin_data.length;
    console.log(bin_count)
    let bar_height = map(bin_count, 0, data_fi.length, 0, 900);  

    let bar_start = hx + 60 + (x_ticks_scale * i);  

    push();
    stroke(0);
    fill("pink");
    rect(bar_start, hy + 500 - bar_height, 140, bar_height); 
    pop();
  }


  
}




function setup() {
  createCanvas(1600, 5000);
  textFont('Courier New');
  background(255);
  slider = createSlider(1999, 2017, 1999, 1);
  slider.position(hx + 1100, hy + 500);
  slider.size(50);
  read_data();


}


function draw() {
  background(256)
  title();
  let y = slider.value();
  hist(y);

  
}
