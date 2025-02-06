// data structure to store information from csv for bar graph (graph 1)
let bg_data = [];

// data stuctures to ghold state names and assign colors for dot plot
let state_list = [];
let state_colors = {};

// gists for additional data
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



// set bar graph dimensions
let bg_width = 1000;
let bg_height = 600;

// graph x - y coordinates (start/ end)
let gx = 90;  
let gy = 900;
let by = 1500;
let hy = 2100;
let ly = 3000;


// data structure to store dot plot information from csv for dot plot (graph 2)
let dp_data = [];

// set bar graph dimensions
let dp_width = 1000;
let dp_height = 600;

// set bar graph dimensions
let hm_width = 1050;
let hm_height = 600;

let tableau;

// preload images and csv
function preload(){
  // load csv (commented version is for faster loading locally for debugging purposes)
  //table = loadTable('./data/cod2.csv', 'csv', 'header')
  table = loadTable(gist, 'csv', 'header')
  tableau = loadImage("https://gist.githubusercontent.com/sanjanarattan/c58a759ab66a594c802aafbeb066f46a/raw/4a6e17430ceed7cdde894b5c3a9c4b56da076632/t.png")
}

// setup data structures and canvas
function setup() {
  // standard aspect ratio
  createCanvas(1600, 5000);

  textFont('Courier New');

  link = createA('https://vizhub.com/sanjanarattan/c7acb2743ec24d3899482985c0054452?mode=embed', 'Link to Vizhub','_blank');
  link.position(10,4900);

  // white background
  background(255);

  // bar graph data = {2017 U all_states U deaths}
  // dot plot data = {all_years U stroke U rate U states}

  for (let i = 0; i < table.getRowCount(); i++) {
    let year = table.getString(i, "Year");
    let rate = table.getNum(i, "Age-adjusted Death Rate");
    let state = table.getString(i, "State");
    let deaths = table.getNum(i, "Deaths");
    let disease = table.getString(i, "Cause Name");

    // select specified parameters for data
    if (disease == "Stroke" && year == "2017" && state != "United States" && state != "District of Columbia") {
      bg_data.push({ state, deaths });
    }

    if (disease == "Stroke" && state != "United States" && state != "District of Columbia") {
      dp_data.push({ year, state, rate})
    }

    for (let i = 0; i < dp_data.length; i++) {

      // assign random colors to states for dot plot
      if (!state_list[dp_data[i].state]) {
        state_colors[dp_data[i].state] = color(random(50, 255), random(50, 255), random(50,255));
        state_list.push(dp_data[i].state)
      }
    }

  }
  // sort data by deaths
  bg_data.sort((a, b) => b.deaths - a.deaths);

}

// main title
function title(){
  textSize(25);
  text("Visualizing the Number of Deaths due to Cerebrovascular Diseases in the USA (1999 - 2017)", 30,100); 
  line(0 + 10 , height/40, width -200, height/40);
}

// bar graph function
function bg(){

  // scale width and height of bars based on bar graph length, number of states, and max deaths
  let bar_width = bg_width / bg_data.length;
  let x_scale = max(bg_data.map(d => d.deaths));  
  let r_scale = 0

  // bar logic
  for (let i = 0; i < bg_data.length; i++) {
    // map bar height
    let bar_height = map(bg_data[i].deaths, 0, x_scale, 0, bg_height);  
    
    // gradient scale for bars
    fill(256, r_scale - 180, r_scale + 10);
    r_scale = r_scale + 10
    rect(gx + i * bar_width, gy - bar_height, bar_width - 5, bar_height);

    // label bars with state names
    fill(0);
    textSize(15);
    push();
    translate(gx +i *bar_width + bar_width / 2-  10, gy+ 6);
    rotate(PI /2); 
    text(bg_data[i].state, 0, 0);
    pop();

    // mouse hover logic
    let bar_left = gx + i * bar_width;
    let bar_right = bar_left + bar_width - 5;
    let bar_top = gy - bar_height;
    let bar_bottom = gy;

    // fluctuate between white / black based on mouse position
    let text_color = (mouseX >bar_left && mouseX < bar_right && mouseY > bar_top && mouseY <bar_bottom) ? 0 :255;

    //slightly shift text to prevent overlaps 
    let y_shift = (i % 2 == 0) ? -1 : -7;   
    fill(text_color); 
    textSize(16);
    text(bg_data[i].deaths, gx + i * bar_width + bar_width / 2 , gy - bar_height - 5 + y_shift); 
  }


  // axes
  line(gx , gy, gx+ bg_width, gy);  
  line(gx , gy, gx, gy - bg_height); 

  // y ticks
  let num_ticks= 20;
  let tick_interval = bg_height / num_ticks;  

  for (let i = 0; i <= num_ticks; i++) {
    let y_pos = gy - i * tick_interval;  

    line(gx - 10, y_pos, gx, y_pos);  

    let death_label = Math.round(map(i, 0, num_ticks, 0, x_scale));  
    fill(0);
    text(death_label, gx - 45, y_pos);  
    textSize(12);
  }

  
  // annotations
  textSize(15);
  noFill();

  circle(gx + 30, gy / 2 - 100, 10);
  rect( gx + gx - 10, gy/2 - 130, gx * 4.4, gy/5, 20);
  rect( gx + gx - 10, gy/2 - 130, gx * 4.43, gy/5, 20);



  line(gx + 35, gy / 2 - 100, gx + 30 + 50, gy / 2 - 100);
    

  fill (0)
  text("Although this graph gives us useful data", gx + gx, gy / 2 - 105);
  text("on death counts by state, it can't be used ", gx + gx, gy / 2 - 85);
  text("as a good point of reference to compare  ", gx + gx, gy / 2 - 65);
  text("deaths within states. Naturally, states ", gx + gx, gy / 2 - 45);
  text("with larger populations, such as CA and", gx + gx, gy / 2 - 25);
  text("TEX will have larger death counts." ,gx + gx, gy / 2 - 5);
  text("Hover over bars to see exact death counts!" ,gx + gx, gy / 2 + 35);

  // axis labels
  textSize(20);
  text("1. Number of Deaths from Cerebrovascular Diseases in 2017 (by State)", gx / 2, gy - 650);

  textSize(20);
  text("State", gx + 500, gy + 150); 



}

// dot plot function
function dp() {
  // labels
  fill(0);
  textSize(20);
  text('Years', gx + 500, by + 500);
  text('2. Rate of Death from Cerebrovascular Diseases per State from 1999 - 2017',gx / 2,by - 250);

  // axes
  line(gx, by + 400, gx + bg_width, by + 400);
  line(gx, by + 400, gx, by - 200);

  // y-axis labels - for rates
  let num_ticks = 10;
  let min_rate = 24;
  let max_rate = max(dp_data.map((d) => d.rate));
  let tick_interval = (max_rate - min_rate) / num_ticks;

  for (let i = 0; i <= num_ticks; i++) {
    let rate_value = min_rate + i * tick_interval;
    let y_pos = map(rate_value,min_rate,max_rate,by + 400,by - 200);
    line(gx - 10, y_pos, gx, y_pos);
    fill(0);
    textSize(12);
    text(round(rate_value, 1), 40, y_pos + 5);
  }

  // x - axis labels - skip over every other year
  let years = [1999, 2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015,2017];
  for (let i = 0; i < years.length; i++) {
    let x_pos = map(years[i],1999,2017,gx,gx + bg_width,);
    line(x_pos, by + 400, x_pos, by + 410);
    fill(0);
    textSize(12);
    text(years[i], x_pos, by + 425);
  }

  // plotting logic - map the x and y of each dot based on the value, min and mac
  for (let i = 0; i < dp_data.length; i++) {
    let dot_y = map(dp_data[i].rate,min_rate,max_rate,by + 400,by - 200);
    let dot_x = map(dp_data[i].year,1999,2017,gx,gx + bg_width,);
    //lookup the assigned state color to color dot
    let dot_color = state_colors[dp_data[i].state];
    fill(dot_color);
    ellipse(dot_x, dot_y, 10, 10);

    push();
    // hover logic - check distance with inbuilt moouse x/ y position 

    let text_color = dist(mouseX, mouseY, dot_x, dot_y) < 6 ? 0: 255;
    fill(text_color)
    textSize(14);
    text(abbrevs[dp_data[i].state], dot_x + 15, dot_y - 10);

    pop();
  }

}

// heat map logic
function hm() {
  // convert abbreviations to accessible array to only lookup the state names
  let abbrev_array = Object.values(abbrevs);
  let years = [1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008,2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017];
  let num_states = abbrev_array.length;
  let num_years = years.length;

  fill(0);
  textSize(20);
  text("3. Rate of Death from Cerebrovascular Diseases per State from 1999 - 2017", gx / 2, hy - 30);
  text("Years", gx +500, hy+ 700);

  line(gx, hy + 600, gx + hm_width, hy + 600); // x-axis
  line(gx, hy + 600, gx, hy); // y-axis
  // square width and length logic
  let s_width = hm_width / num_years;
  let s_height = hm_height / num_states;
  // min and max for scaling
  let min_rate = min(dp_data.map(d => d.rate));
  let max_rate = max(dp_data.map(d => d.rate));

  for (let i = 0; i < num_states; i++) {
    let y = hy + i * s_height + s_height / 2;
    fill(0);
    textSize(12);
    text(abbrev_array[i], gx - 30, y);
  }
  let x_step = hm_width / years.length+1; 
  //
  for (let i = 0; i < years.length; i++) {
    let x_pos = gx + i * x_step; 
    fill(0);
    textSize(12);
    text(years[i], x_pos, hy + 625);
  }

  for (let i = 0; i < dp_data.length; i++) {
    let state_i = abbrev_array.indexOf(abbrevs[dp_data[i].state]);
    let year_i = years.indexOf(int(dp_data[i].year));

    if (state_i != -1 && year_i != -1) {
      let x = gx +year_i * s_width;
      let y = hy +state_i*s_height;

  
    push();  
    let rate_value =dp_data[i].rate;
    let color =map(rate_value, min_rate, max_rate, 255, 50); 
    fill(color, 50, 50);


    rect(x, y, s_width, s_height);

    if(mouseX > x&& mouseX < x + s_width && mouseY > y&& mouseY< y + s_height){
      fill(255);
    }else{
      noFill();
    }
    textSize(14);
    text(rate_value, x, y + 10);

    pop();

    }
  }

  let legend_x = gx +hm_width+ 50;  
  let legend_y = hy;
  let l_height =50 ; 
  let l_width= 30;  

  let c1 = color(256, 0, 0); 
  let c2 = color(0, 0, 0);     

  let steps= 50;  
  let step_size =l_height/steps;

  push();  
  noStroke();
  for (let i= 0; i < steps; i++) {
    let inter= map(i, 0, steps, 0, 1);
    let c=lerpColor(c2, c1, inter);  
    fill(c);
    rect(legend_x, legend_y + i *step_size, l_width,step_size); 
  }
  pop();  

  fill(0);
  textSize(14);
  text('90', legend_x + 40,legend_y + 5); 
  text('20',legend_x + 40, legend_y +l_height); 
  textSize(16);
  text("Death Rate", legend_x -10,legend_y -20);

}


function ls() {
  fill(0);
  textSize(20);
  text("4. Log Scale Rate of Death from Cerebrovascular Diseases in South Carolina from 1999 - 2017", gx /2, ly-40);
  text("Years", gx +500, ly + 700);

  line(gx, ly + 600, gx + hm_width, ly + 600); // x-axis
  line(gx, ly + 600, gx, ly); // y-axis

  let years = [1999, 2000, 2001, 2002, 2003,2004,2005, 2006, 2007, 2008, 2009,2010,2011,2012, 2013 , 2014, 2015, 2016 ,2017]
  let x_step = hm_width / years.length +1;

  for (let i = 0; i < years.length; i++) {
    let x_pos = gx + i * x_step;
    fill(0);
    textSize(12);
    text(years[i], x_pos, ly + 625);
    line(x_pos, ly + 600, x_pos, ly + 610);
  }

  let sc_data = dp_data.filter(d => d.state === "South Carolina");
  
  let log_min_rate =0
  let log_max_rate =5;


  for (let i = 0; i < sc_data.length; i++) {
    let year = sc_data[i].year;
    let rate = sc_data[i].rate;
    let log_rate = Math.log10(rate);  

  
    let dot_y = map(log_rate, log_min_rate, log_max_rate, ly + 600, ly);
    let dot_x = map(year, 1999, 2017, gx, gx + hm_width);
    push();
    noFill();
    ellipse(dot_x, dot_y, 10, 10);

    let text_color = dist(mouseX, mouseY, dot_x, dot_y) < 6 ? 0: 255;
    fill(text_color)
    textSize(14);
    text(rate, dot_x + 15, dot_y - 10);
  
    pop();
  }

  let num_ticks = 3;
  let tick_interval = (log_max_rate - log_min_rate) / num_ticks;

  logs = [0, 1, 10, 100]
  for (let i = 0; i <= num_ticks; i++) {
    let log_value = log_min_rate + i * tick_interval;  
    let y_pos = map(log_value, log_min_rate, log_max_rate, ly + 600, ly);
    line(gx - 10, y_pos, gx, y_pos);
    textSize(12);
    fill(0);
    text(logs[i], gx - 45, y_pos);  
  }



  
}

function images(){
  fill(0);
  textSize(20);
  text("5. Recreating Graphs in Tableau", gx / 2, 4000);
  image(tableau, 90,4100);
}

function annotations(){

  pop();

  noFill();
  circle(gx + 300, (gy/ 4) + 40, 10);
  line(gx + 305, (gy/4) + 40, gx + 305 + 600, (gy/4) + 40);
  line(gx + 905, (gy/4) + 40, gx + 905, (gy/4) + 40 + 200);
  rect(gx + 790, (gy/4) + 40 + 200, gx * 5.3, gy/9, 20);
  rect(gx + 790, (gy/4) + 40 + 200, gx * 5.33, gy/9, 20);

  fill(0);
  textSize(15);
  text("Cerebrovascular diseases are a group of conditions", gx + 800, 500);
  text("that affect the blood vessels of the brain.", gx + 800, 515);
  text("These diseases include strokes and aneurysms.", gx + 800, 530);

  noFill();
  circle(gx, (by - 200), 15);
  line(gx + 5, by - 200, gx + 325, by - 200);
  line(gx + 325, by - 200, gx + 325, by - 180);
  rect(gx + 300, by - 180, gx * 5.8, by/10, 20);
  rect(gx + 300, by - 180, gx * 5.83, by/10, 20);

  fill(0);
  text("When we analyze the Age Related Rate of Death", gx + 310, by - 150);
  text("(the rate at which risk of death increases with age)", gx + 310, by + 15 - 150);
  text("we see that South Carolina has one of the bigger RODs. ", gx + 310, by + 30- 150);
  text("This is interesting because on graph 1 SC was shown", gx + 310, by + 45- 150);
  text("to have one of the smaller death counts, demonstrating ", gx + 310, by + 60- 150);
  text("how it is important to investigate different measures ", gx + 310, by + 75- 150);
  text("for different types of values before drawing conclusions", gx + 310, by + 90- 150);


  noFill();
  circle(gx + 1000, (by + 395), 15);
  line(gx + 1005, by + 395, gx + 1005 + 100, by + 395);
  line(gx + 1005 + 100, by + 395, gx + 1005 + 100, by + 270);
  rect(gx + 1030, by + 120, gx*3.9, by/10, 20);
  rect(gx + 1030, by + 120, gx*3.93, by/10, 20);

  fill(0);
  text("Vice Versa, we notice that New York,",gx + 1050, by + 150);
  text("one of the states with the top", gx + 1050, by + 15 + 150);
  text(" 10 most death counts, actually", gx + 1050, by + 30 + 150);
  text("has one of the lowest death rate", gx + 1050, by + 45 + 150);
  text("consistently for the past 20 years.", gx + 1050, by + 60 + 150);
  text(" Hover over dots to check which", gx + 1050, by + 75 + 150);
  text(" one coresponds to which state!", gx + 1050, by + 90+ 150);

  noFill();
  rect(gx + 1090, hy + 100 , gx + (10 * 10), hy/11, 20);
  rect(gx + 1090, hy + 100 , gx + (10 * 10.3), hy/11, 20);

  fill(0);
  text("This heatmap makes",gx + 1100, hy + 120);
  text("it a little easier", gx + 1100, hy + 120 + 15);
  text("to visualize all", gx + 1100, hy + 120 + 30);
  text("the data from graph", gx + 1100, hy + 120 + 45);
  text("2. We notice that", gx + 1100, hy + 120 + 60);
  text("there has been a", gx + 1100, hy + 120 + 75);
  text("decline in ARRODs ", gx + 1100, hy + 120 + 90);
  text("across all states.", gx + 1100, hy + 120 + 105);
  text("Hover over to see.", gx + 1100, hy + 120 + 120);
  text("exact ARRODs.", gx + 1100, hy + 120 + 135);




  push();





}



function draw() {
  title()
  bg()
  dp()
  hm()
  ls()
  images()
  annotations()

  // transformed text (y - axis labels)
  textSize(20); 
  fill(0)
  translate(90 - 510, 900 - bg_height / 2 ) ; 
  rotate(-PI/2);      
  text("Number of Deaths", 0, gy / 2);
  text("Rate of Death", 0 - 1100, gy / 2);
  text("States", 0 - 1800, gy / 2);
  text("Rate of Death", 0 - 2750, gy / 2);

}