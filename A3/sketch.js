let gx = 10;
let gy = 10;
let hx = gx;
let hy = gy + 140;
let slider;
let f1;

let gist = "https://gist.githubusercontent.com/sanjanarattan/fb4a5813ec52f72e693b75d4083fa700/raw/000bdd0150cceb737bfdf8c84bf48b809191a14e/cod.csv"


let data = [];

// Preload images and csv
function preload(){
  // load csv (commented version is for faster loading locally for debugging purposes)
  //table = loadTable('./data/cod2.csv', 'csv', 'header')
  table = loadTable(gist, 'csv', 'header')
  // TODO maybe put in gist
  f1 = loadImage("./images/Figure_1.png")
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


function title(){
  push();
  fill(0);
  textSize(20);
  text("Visualizing Cerebrovascular Diseases in the USA from 1999 - 2017", gx, gy + 50);
  line(gx, gy + 60, gx + 800, gy + 60);
  pop();
}

function subtitle(x, y, z){
  push();
  fill(0);
  textSize(15);
  text(z, x, y);
  pop();
}




// Histogram - ROD freqs
function hist(y){


  // graph title
  push();
  fill(0);
  textSize(17);
  text(`1. Distribution of Age Related Rate of Death due to Cerebrovascular Diseases in the USA (${y})`, hx, hy);
  pop()
  let year = `${y}`
  let data_fi = data.filter((d) => d.year == year)

  // scales
  let min_rate = min(data_fi.map((d) => d.rate));
  let max_rate = max(data_fi.map((d) => d.rate));

  //console.log(data_fi.length)
  //console.log(min_rate);      // 42.2        
  //console.log(max_rate);      // 83.4    

  // choosing bin size (based on an article i found online)
  // 1) Round bin sizes up or down. 
  let min_round = Math.floor(min_rate);
  let max_round = Math.ceil(max_rate);
  //console.log(min_round);        // 24
  //console.log(max_round);        // 84
  // 2) Based on the dot plot from A1, 6 is a good range for the bins
  let bin_sz = 10;

  let bin_size = 6;
  let num_bins = Math.ceil((max_rate - min_rate) / bin_size);
  // 3) get number of data points ( 50 states from 2017 - 1999)
  let point_sum = 50 * (2017 - 1999)
  // 4) divide number of points by 100
  let ticks = Math.ceil(100 / point_sum) * 10// 900+max=980
  //console.log(point_sum)
  //console.log(ticks) // ~ 10%
  let bar_width = Math.floor(980 / num_bins); 
  let bar_spacing = 0; 

  let bin_counts = new Array(num_bins).fill(0)
  for (let i = 0; i < data_fi.length; i++) {
    let rate = data_fi[i].rate;
    let bin_index = Math.floor((rate - min_rate) / bin_size)
    bin_counts[bin_index]++;
  }
  let max_count = max(bin_counts);
  // x - axes
  line(hx + 60, hy + 500, hx + 60 + 980, hy + 500);
  let x_ticks_scale = 980 / num_bins;  
  let x_start = hx + 60;
  let death_label = min_rate;

  //console.log(x_ticks_scale);

  subtitle((840) / 2 + 80, hy + 550, "Rate of Death");

  // x ticks and labelling
  for (let i = 0; i < num_bins; i++) {
    push();
    fill(0);
    textSize(10);
    text(death_label.toFixed(1), x_start - 5, hy + 520);
    line(x_start, hy + 500, x_start, hy + 505);
    x_start = x_start+x_ticks_scale
    death_label= death_label+ bin_size
    pop();
  }

  // y axes
  let y_start = hy + 500;
  let freq_label = 0
  let y_ticks_scale = (500) / 10
  line(hx + 60, hy + 500, hx + 60, hy + 50)
  let max_freq_label = Math.ceil(max_count / 10) * 10
  for (let i = 0; i <= 9; i++) {
    push();
    fill(0)
    textSize(10)
    text((i * max_freq_label) / 10, hx + 40, y_start);
    line(hx + 58, y_start, hx + 60, y_start);
    y_start = y_start- y_ticks_scale
  }
  //baars
  let bar_x = hx + 60;
  for (let i = 0; i < num_bins; i++) {
    let bin_count = bin_counts[i];
    let bar_height = map(bin_count, 0, max_count, 0, 400);
    push();
    fill("pink");
    rect(bar_x, hy + 500 -bar_height, bar_width, bar_height);
    pop();
    bar_x = bar_x+bar_width;  
  }
  // kernel density
  let smoothed_values =[]
  let bandwidth = bin_size / 2; 
  let rates =data_fi.map(d => d.rate)

  for (let i = 0; i <= 100; i++) {
    let x = min_rate + ((max_rate - min_rate) * (i / 100))
    let weight_sum = 0
    let density = 0;
    for (let rate of rates) {
      let weight = exp(-0.5 * pow((x - rate) / bandwidth, 2))
      density = density + weight;
      weight_sum = weight_sum +1
    }
    density = density/weight_sum;
    smoothed_values.push({ x ,density});
  }
  let max_density = max(smoothed_values.map(d =>d.density));
  push();
  noFill()
  beginShape();
  for (let point of smoothed_values) {
    let x_pos = map(point.x, min_rate, max_rate, hx + 60, hx + 60 + 980);
    let y_pos = hy + 500 - map(point.density, 0, max_density, 0, 400);
    circle(x_pos, y_pos, 0.5); ;
  }
  endShape()
  pop()
}

function setup() {
  createCanvas(1200, 5000);
  textFont('Courier New');
  background(255);
  slider = createSlider(1999, 2017, 1999, 1);
  slider.position(hx + 1100, hy + 500);
  slider.size(50)
  read_data()
}

function draw() {
  background(256)
  title();
  let y = slider.value();
  hist(y);
  push()
  textSize(15)
  text("2. Distribution of RODS in the USA (Seaborn Version)", hx, hy + 600);
  push()
  image(f1, hx, hy + 700, hx+ 1000, hy + 800);


  
}
