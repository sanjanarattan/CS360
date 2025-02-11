let gx = 10;
let gy = 10;
let hx = gx;
let hy = gy + 140;
let by = hy + 2000;
let dy = by + 1500;
let slider;
let f1;

let gist = "https://gist.githubusercontent.com/sanjanarattan/fb4a5813ec52f72e693b75d4083fa700/raw/000bdd0150cceb737bfdf8c84bf48b809191a14e/cod.csv"


// dictionary of abbreviations to prevent overlaps
let abbrevs = {
  "Alabama": "AL",
  "Alaska": "AK",
  "Arizona": "AZ",
  "Arkansas": "AR",
  "California": "CA",
  "Colorado": "CO",
  "Connecticut": "CT",
  "Delaware": "DE",
  "Florida": "FL",
  "Georgia": "GA",
  "Hawaii": "HI",
  "Idaho": "ID",
  "Illinois": "IL",
  "Indiana": "IN",
  "Iowa": "IA",
  "Kansas": "KS",
  "Kentucky": "KY",
  "Louisiana": "LA",
  "Maine": "ME",
  "Maryland": "MD",
  "Massachusetts": "MA",
  "Michigan": "MI",
  "Minnesota": "MN",
  "Mississippi": "MS",
  "Missouri": "MO",
  "Montana": "MT",
  "Nebraska": "NE",
  "Nevada": "NV",
  "New Hampshire": "NH",
  "New Jersey": "NJ",
  "New Mexico": "NM",
  "New York": "NY",
  "North Carolina": "NC",
  "North Dakota": "ND",
  "Ohio": "OH",
  "Oklahoma": "OK",
  "Oregon": "OR",
  "Pennsylvania": "PA",
  "Rhode Island": "RI",
  "South Carolina": "SC",
  "South Dakota": "SD",
  "Tennessee": "TN",
  "Texas": "TX",
  "Utah": "UT",
  "Vermont": "VT",
  "Virginia": "VA",
  "Washington": "WA",
  "West Virginia": "WV",
  "Wisconsin": "WI",
  "Wyoming": "WY"
};

let state_list = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware","Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", 
  "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", 
  "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", 
  "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", 
  "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
  "West Virginia", "Wisconsin", "Wyoming"];



let data = [];
//let state_list = [];
let state_colors = {};

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

  for (let i = 0; i < state_list.length; i++) {
    push();
    state_colors[state_list[i]] = color(random(50, 255), random(50, 255), random(50, 255));;  
    pop();
  }  

}

// Preload images and csv
function preload(){
  // load csv (commented version is for faster loading locally for debugging purposes)
  //table = loadTable('./data/cod2.csv', 'csv', 'header')
  table = loadTable(gist, 'csv', 'header')
  // TODO maybe put in gist
  f1 = loadImage("./images/Figure_1.png");
  bg = loadImage("./images/dn.png");
  f2 = loadImage("./images/Figure_6.png");
  f3 = loadImage("./images/Figure_4.png");
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
    pop()
  }
  //baars
  let bar_x = hx + 60;
  for (let i = 0; i < num_bins; i++) {
    let bin_count = bin_counts[i];
    let bar_height = map(bin_count, 0, max_count, 0, 400);
    push();
    fill("pink");
    rect(bar_x, hy + 500 -bar_height, bar_width, bar_height);
    bar_x = bar_x+bar_width; 
    pop() 
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

function s_hist(){
  push();
  textSize(17)
  text("2. Distribution of RODS in the USA (Seaborn Version)", hx, hy + 650);
  image(f1, hx, hy + 700, hx+ 1100);
  pop();
}

function s_bw(){
  push();
  textSize(17)
  text("4. Distribution of RODS in the USA (Seaborn Version)", hx, by + 600);
  image(f2, hx, hy + 2400, hx+ 1100);
  pop();
}

function s_dp(){
  push();
  textSize(17)
  text("7. Rate of Death in the USA (Seaborn Version)", hx, dy + 900);
  image(f3, hx, dy + 900);
  pop();
}



// box whiker 
function bw(y){
  // graph title
  push();
  fill(0);
  textSize(17);
  text(`3. Distribution of Age Related Rate of Death due to Cerebrovascular Diseases in the USA (${y})`, hx, by - 250);
  pop();

  let year = `${y}`;
  let data_fi = data.filter((d) => d.year == year);
  //console.log(data_fi)

  
  data_fi.sort((a, b) => a.rate - b.rate); 
  //console.log(data_fi)

  let median = (data_fi[24].rate + data_fi[25].rate) / 2;
  let q1 = ((data_fi[12].rate + data_fi[13].rate)) / 2;  
  let q3 = ((data_fi[36].rate + data_fi[37].rate)) / 2; 
  let iqr = Math.abs(q1 - q3);
  let min = q1 - (1.5 * iqr);
  let max = q3 + (1.5 * iqr);

  //console.log("median:", median, "q1:", q1, "q3:", q3, "min:", min, "max", max);
  
  let x_start = gx + 60;
  let x_end = x_start + 1000;
  let box_height = 100;

  push();
  stroke(0);
  line(x_start, by + box_height + 20, x_end, by + box_height + 20);
  pop();

  let tick_count = 6; 
  let x_ticks_scale = (x_end - x_start) / (tick_count - 1);

  push();
  textSize(14);
  text("Rate of Death", ((x_start + x_end) / 2) - 40, by + box_height + 80);
  pop();

  let labels = ["0", "20", "40", "60", "80", "100"]
  for (let i = 0; i < tick_count; i++) {
    push();
    fill(0);
    textSize(10);
    text(labels[i], x_start + i * x_ticks_scale, by + box_height + 30);
    line(x_start + i * x_ticks_scale, by + box_height + 20 , x_start + i * x_ticks_scale, by + box_height + 25);
    pop();
  }



  let x_min = map(min, 0, 100, x_start, x_end); 
  let x_q1 = map(q1, 0, 100, x_start, x_end);   
  ellipse(x_min, by - 100, 1.5);
  ellipse(x_q1, by - 100, 1.5);
  line(x_min, by - 100, x_q1, by - 100);

  let x_max = map(max, 0, 100, x_start, x_end); 
  let x_q3 = map(q3, 0, 100, x_start, x_end);   
  ellipse(x_max, by - 100, 1.5);
  ellipse(x_q3, by - 100, 1.5);
  line(x_q3, by - 100, x_max, by - 100);

  push();
  fill(230, 230, 250);
  rect(x_q1, by - 200, x_q3 - x_q1 , 200);
  pop();

  let x_med = map(median, 0, 100, x_start, x_end); 
  ellipse(x_med, by - 100, 1.5);
  line(x_med, by - 200, x_med, by);


 
  let arr = data_fi.map(d => d.rate);

  for (let d of arr) {
    if (d < min || d > max) {
      //console.log(d);  
      let o_scale = map(d, 0, 100, x_start, x_end); 
      push();
      noFill();
      ellipse(o_scale, by - 100, 5); 
      if (dist(mouseX, mouseY, o_scale, by - 100) < 7) {
        fill(0);
        textSize(10);
        x_rand = random(1, 3)
        text(d.toFixed(1), o_scale + x_rand, by - 110); 
      } 
      pop();
    }
  }

}


// dot plot function
function dp() {
  // labels
  fill(0);
  textSize(20);
  text('Years', gx + 500, dy + 800);
  text('5. Rate of Death from Cerebrovascular Diseases per State from 1999 - 2017', gx / 2, dy - 250);

  bg_width = 1000;
  // axes
  line(70, dy + 700, 70 + bg_width, dy + 700);
  line(70, dy + 700, 70, dy - 200);

  // y-axis labels - for rates
  let num_ticks = 10;
  let min_rate = 24;
  let max_rate = max(data.map((d) => d.rate));
  let tick_interval = (max_rate - min_rate) / num_ticks;

  for (let i = 0; i <= num_ticks; i++) {
    let rate_value = min_rate + i * tick_interval;
    let y_pos = map(rate_value, min_rate, max_rate, dy + 700, dy - 200);
    line(70 - 10, y_pos, 70, y_pos);
    fill(0);
    textSize(12);
    text(round(rate_value, 1), 40, y_pos + 5);
  }


  // x-axis labels - plot only every 3 years
  let years = [1999, 2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015, 2017];
  for (let i = 0; i < years.length; i++) {
    let x_pos = map(years[i], 1999, 2017, 70, 70 + bg_width);
    line(x_pos, dy + 710, x_pos, dy + 700);
    fill(0);
    textSize(12);
    text(years[i], x_pos, dy + 710);
  }

  // plotting logic - map the x and y of each dot based on the value, min and max
  for (let i = 0; i < data.length; i++) {
    let dot_y = map(data[i].rate, min_rate, max_rate, dy + 700, dy - 200);
    let dot_x = map(data[i].year, 1999, 2017, 70, 70 + bg_width);

    let jitter_x = random(-0.5, 0.5); 
    let jitter_y = random(-1, 1); 

    // lookup the assigned state color to color dot
    let dot_color = state_colors[data[i].state];
    push();
    fill(dot_color);
    ellipse(dot_x + jitter_x, dot_y + jitter_y, 5, 5);
    // hover logic - check distance with inbuilt mouse x/y position
    let text_color = dist(mouseX, mouseY, dot_x + jitter_x, dot_y + jitter_y) < 6 ? 0 : 255;
    fill(text_color);
    textSize(14);
    text(abbrevs[data[i].state], dot_x + jitter_x + 15, dot_y + jitter_y - 10);

    pop();
    
  }
}



function setup() {
  createCanvas(1600, 7000);
  textFont('Courier New');
  background(255);
  slider = createSlider(1999, 2017, 1999, 1);
  slider.position(hx + 1100, hy + 500);
  slider.size(50);

  slider2 = createSlider(1999, 2017, 1999, 1);
  slider2.position(hx + 1100, by + 100);
  slider2.size(50);

  read_data();

}

function draw() {
  background(256);
  image(bg, 0, 0, 1600, 10000);
  title();
  let y = slider.value();
  hist(y);
  let z = slider2.value();
  bw(z); 
  dp();
  s_hist();
  s_bw();
  s_dp();
}
