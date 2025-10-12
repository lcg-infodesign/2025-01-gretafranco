let table;   // conterrà i dati CSV
let stats = {};  // oggetto per salvare i risultati
let statsTable; // nuova tabella per la seconda rappresentazione testuale


function preload() //serve a caricare risorse
{
  table = loadTable("dataset_corretto.csv", "csv", "header");
}

function setup() {
  createCanvas(1000, 1900);
  textFont("Inter"); // font principale
  textSize(14);

  //funzione per ottenere ogni colonna come array di numeri
  let col1 = getNumericColumn(0);
  let col2 = getNumericColumn(1);
  let col3 = getNumericColumn(2);
  let col4 = getNumericColumn(3);
  let col5 = getNumericColumn(4);

  //calcoli statistici
  stats.mean1 = meanManual(col1);
  stats.std2 = stddevManual(col2);
  stats.mode3 = modeManual(col3);
  stats.median4 = medianManual(col4);
  stats.mean5 = meanManual(col5);
  stats.std5 = stddevManual(col5);

  //creo la seconda rappresentazione testuale: tabella con i risultati
  statsTable = new p5.Table();
  statsTable.addColumn("Statistic");
  statsTable.addColumn("Column");
  statsTable.addColumn("Value");

  addRow("Mean", "Column 1", nf(stats.mean1, 1, 2));
  addRow("Std Dev", "Column 2", nf(stats.std2, 1, 2));
  addRow("Mode", "Column 3", stats.mode3.join(", "));
  addRow("Median", "Column 4", nf(stats.median4, 1, 2));
  addRow("Mean", "Column 5", nf(stats.mean5, 1, 2));
  addRow("Std Dev", "Column 5", nf(stats.std5, 1, 2));

  noLoop();
}

function draw() {
  background(245);
  fill(0);
  textAlign(LEFT);

  //intestazione e prima rappresentazione testuale
  textFont("Poppins"); // titolo grande
  textStyle(BOLD);
  textSize(26);
  textAlign(CENTER);
  text("STATISTICAL RESULTS", width / 2, 50);
  textStyle(NORMAL);

  textFont("Inter"); // corpo del testo
  textAlign(LEFT);
  textSize(14);

  text(`Mean (Column 1):            ${nf(stats.mean1, 1, 2)}`, width / 3.5, 90); 
  text(`Standard Deviation (Col 2): ${nf(stats.std2, 1, 2)}`, width / 3.5, 110); 
  text(`Mode (Column 3):             ${stats.mode3}`, width / 3.5, 130); 
  text(`Median (Column 4):           ${nf(stats.median4, 1, 2)}`, width / 3.5, 150); 
  text(`Mean (Column 5):             ${nf(stats.mean5, 1, 2)}`, width / 3.5, 170); 
  text(`Std Dev (Column 5):          ${nf(stats.std5, 1, 2)}`, width / 3.5, 190); 

  //seconda rappresentazione testuale: tabella
  let tableWidth = 450;
  let tableX = (width - tableWidth) / 3;
  drawStatsTable(tableX, 230); 

  //GRAFICO 1: MEDIA
  drawGraphTitle("Graphical Representation 1: Mean - Column 1", 500);
  let histWidth = 800; 
  let histX = (width - histWidth) / 2;
  drawMeanHistogram(histX, 540, histWidth, 200); 

  //GRAFICO 2: MODA
  drawGraphTitle("Graphical Representation 2: Mode - Column 3", 850);
  let modeChartWidth = 800;
  let modeX = (width - modeChartWidth) / 2;
  drawModeChart(modeX, 880, modeChartWidth, 250);

  //GRAFICO 3: DEVIAZIONE STANDARD
  drawGraphTitle("Graphical Representation 3: Standard Deviation - Column 5", 1250);
  let stdChartWidth = 800;
  let stdX = (width - stdChartWidth) / 2;
  drawStdDevChart(stdX, 1290, stdChartWidth, 300);
}

// 🔹 FUNZIONE PER I TITOLI GRAFICI COERENTI
function drawGraphTitle(titleText, y) {
  textFont("Poppins");
  textStyle(BOLD);
  textAlign(CENTER);
  textSize(20);
  fill(0);
  text(titleText, width / 2, y);
  textFont("Inter");
  textStyle(NORMAL);
  textAlign(LEFT);
  textSize(14);
}



//estrae una colonna numerica dal CSV
function getNumericColumn(index) {
  let arr = []; //crea array vuoto
  for (let r = 0; r < table.getRowCount(); r++) { //scorre tutte le righe
    let val = parseFloat(table.getString(r, index)); //prende il valore e lo converte in numero
    if (!isNaN(val)) {
      arr.push(val);
    }
  }
  return arr;
}

//MEDIA 
function meanManual(arr) {
  let sum = 0; //inizializza somma
  for (let i = 0; i < arr.length; i++) {
    sum += arr[i]; //somma tutti i valori
  }
  return sum / arr.length; //divide per la lunghezza per ottenere la media
}

//MEDIANA
function medianManual(arr) {
  let sorted = arr.slice(); //copia l’array per non modificarlo
  sorted.sort((a, b) => a - b); //ordina i valori in modo crescente
  let mid = Math.floor(sorted.length / 2); //trova posizione centrale
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2; //fa la media dei due centrali se pari
  } else {
    return sorted[mid]; //valore centrale se dispari
  }
}

//MODA
function modeManual(arr) {
  let counts = {}; //per contare le frequenze
  let maxCount = 0; //frequenza massima trovata
  for (let num of arr) {
    counts[num] = (counts[num] || 0) + 1; //conta quante volte appare
    if (counts[num] > maxCount) maxCount = counts[num]; //aggiorna max se necessario
  }

  let modes = []; //array per valori moda
  for (let num in counts) {
    if (counts[num] === maxCount) modes.push(num); //aggiunge tutti i valori con freq max
  }

  return modes; //restituisce un array
}


// DEVIAZIONE STANDARD
function stddevManual(arr) {
  let sum = 0; 
  for (let i = 0; i < arr.length; i++) sum += arr[i];
  let mean = sum / arr.length; //media

  let diffSum = 0; 
  for (let i = 0; i < arr.length; i++) {
    let diff = arr[i] - mean; //scarto dalla media
    diffSum += diff * diff; //somma quadrati scarti
  }

  let variance = diffSum / arr.length; 
  return Math.sqrt(variance); //radice quadrata = dev std
}

//FUNZIONE PER AGGIUNGERE UNA RIGA ALLA TABELLA
function addRow(statName, colName, value) {
  let row = statsTable.addRow(); //crea una nuova riga
  row.setString("Statistic", statName); //imposta il nome
  row.setString("Column", colName); //imposta la colonna
  row.setString("Value", value); //imposta il valore
}

//FUNZIONE PER DISEGNARE LA TABELA SUL CANVAS
function drawStatsTable(x, y) {
  let rowHeight = 25; //altezza riga
  let colWidths = [150, 150, 300]; //larghezza colonne

  //disegna l'intestazione della tabella
  fill(200); 
  rect(x, y, colWidths[0] + colWidths[1] + colWidths[2], rowHeight); 
  fill(0); 
  textStyle(BOLD);
  text("Statistic", x + 10, y + 18); 
  text("Column", x + colWidths[0] + 10, y + 18); 
  text("Value", x + colWidths[0] + colWidths[1] + 10, y + 18); 
  textStyle(NORMAL);

  //scorre tutte le righe della tabella e le disegna
  for (let r = 0; r < statsTable.getRowCount(); r++) {
    let row = statsTable.getRow(r); 
    let yPos = y + rowHeight * (r + 1); 

    if (r % 2 === 0) fill(245); //colore alternato per righe pari
    else fill(230); //e dispari
    rect(x, yPos, colWidths[0] + colWidths[1] + colWidths[2], rowHeight); //rettangolo riga

    fill(0); 
    text(row.getString("Statistic"), x + 10, yPos + 18); 
    text(row.getString("Column"), x + colWidths[0] + 10, yPos + 18); 
    text(row.getString("Value"), x + colWidths[0] + colWidths[1] + 10, yPos + 18); 
  }
}

//GRAFICO MEDIA COLONNA 1
//disegno l'istogramma per la media della colonna 1
function drawMeanHistogram(x, y, w, h) {
  let col1 = getNumericColumn(0); //prende i dati della colonna 1
  let bins = 10; //numero di colonne dell'istogramma
  let counts = new Array(bins).fill(0); //array per contare frequenze
  let minVal = min(col1); 
  let maxVal = max(col1);
  let meanVal = meanManual(col1); //media

  //smista i valori nei rispettivi bin
  for (let v of col1) {
    let binIndex = int(map(v, minVal, maxVal, 0, bins)); //trova il bin giusto per ogni valore
    binIndex = constrain(binIndex, 0, bins - 1); //evita che sfori i limiti
    counts[binIndex]++; //aggiunge 1 a quel bin
  }

  //titolo del grafico 1
  fill(0);
  textSize(16);
  textAlign(LEFT);
  textStyle(BOLD);
  textStyle(NORMAL);
  textSize(12);
  fill(255, 60, 60);
  text("Red line = Mean", x + 250, y + 20);

  //impostazioni di base per margini e dimensioni
  let margin = 40; 
  let histWidth = w - margin * 2; 
  let histHeight = h - 60; 
  let binWidth = histWidth / bins;
  let maxCount = max(counts); //questo serve per scalare l’altezza delle barre

  //disegna gli assi X e Y
  stroke(180);
  strokeWeight(1);
  line(x + margin, y + h - 40, x + w - margin, y + h - 40); 
  line(x + margin, y + h - 40, x + margin, y + h - 40 - histHeight); 

  //disegna le barre dell'istogramma
  noStroke(); 
  for (let i = 0; i < bins; i++) {
    let bh = map(counts[i], 0, maxCount, 0, histHeight); //altezza barra proporzionale
    let bx = x + margin + i * binWidth; //posizione X
    let by = y + h - 40 - bh; //posizione Y
    fill(160, 130, 255, 160); //colore lilla 
    rect(bx + 2, by, binWidth - 4, bh, 8); //disegna barra arrotondata
  }

  //linea rossa della media
  stroke(255, 60, 60);
  strokeWeight(3);
  let meanY = map(meanVal, minVal, maxVal, y + h - 40, y + h - 40 - histHeight);
  line(x + margin, meanY, x + w - margin, meanY);

  //scritta con il valore medio
  noStroke();
  fill(255, 60, 60);
  textAlign(LEFT);
  text("Mean = " + nf(meanVal, 1, 2), x + 20, meanY - 10);

  //etichetta verticale "Frequency"
  push();
  fill(0);
  textAlign(CENTER);
  translate(x + margin - 30, y + h / 2); 
  rotate(-HALF_PI); 
  text("Frequency", 0, 0);
  pop();

  // etichette orizzontali (valori sotto le barre)
  fill(0);
  textAlign(CENTER);
  for (let i = 0; i <= bins; i++) {
    let label = nf(map(i, 0, bins, minVal, maxVal), 1, 1);
    text(label, x + margin + i * binWidth, y + h - 25); 
  }
}

//estrae una colonna come array di stringhe (per la moda)
function getColumnStrings(index) {
  let arr = [];
  for (let r = 0; r < table.getRowCount(); r++) {
    let val = table.getString(r, index);
    if (val !== "") {
      arr.push(val);
    }
  }
  return arr;
}

//GRAFICO MODA COLONNA 3
function drawModeChart(x, y, w, h) {
  let col3 = getColumnStrings(2); //prendo tutti i valori della colonna 3
  let modeVals = modeManual(col3); //calcolo la moda (può essere più di un valore)
  let modeLabel = modeVals.join(", "); //li unisco in una stringa separata da virgole

  //conto quante volte compare ogni valore
  let freq = {}; 
  for (let v of col3) {
    if (freq[v] === undefined) freq[v] = 1;
    else freq[v]++;
  }

  //estraggo i valori unici e li ordino
  let uniqueVals = Object.keys(freq); 
  uniqueVals.sort(); 
  let counts = uniqueVals.map(v => freq[v]); 
  let maxCount = max(counts); //serve per l'altezza massima delle barre

  //titolo e legenda
  fill(0);
  textSize(16);
  textAlign(LEFT);
  textStyle(BOLD);
  textSize(12);
  textStyle(NORMAL);
  fill(255, 60, 60);
  text("Red bar = Mode", x + 150, y + 10);

  //dimensioni e margini
  let margin = 40; 
  let chartWidth = w - margin * 2;
  let chartHeight = h - 60;
  let barWidth = chartWidth / uniqueVals.length; 

  //disegno assi X e Y
  stroke(180);
  strokeWeight(1);
  line(x + margin, y + h - 40, x + w - margin, y + h - 40); // asse X
  line(x + margin, y + h - 40, x + margin, y + h - 40 - chartHeight); // asse Y

  //tacche e numeri sull'asse Y 
  fill(0);
  textSize(10);
  textAlign(RIGHT, CENTER);
  noStroke();
  let tickCount = maxCount;
  for (let i = 0; i <= tickCount; i++) {
    let ty = map(i, 0, maxCount, y + h - 40, y + h - 40 - chartHeight);
    stroke(200);
    line(x + margin - 4, ty, x + margin + 4, ty); // piccola tacca
    noStroke();
    text(i, x + margin - 8, ty); // valore numerico
  }

  //disegno barre
  noStroke(); //rimuovo il bordo delle barre
  for (let i = 0; i < uniqueVals.length; i++) {
    let val = uniqueVals[i]; //valore unico della colonna
    let count = freq[val]; //frequenza del valore

    //calcolo altezza barra proporzionale alla frequenza
    let bh = map(count, 0, maxCount, 0, chartHeight); //altezza barra

    //saturazione proporzionale alla frequenza (da 80 a 255)
    let sat = map(count, 1, maxCount, 80, 255); 

    //posizione X della barra, calcolo in modo che le barre siano distribuite correttamente
    let bx = x + margin + i * barWidth; 

    //posizione Y della barra (parte superiore della barra)
    let by = y + h - 40 - bh; 

    //colore: se è la moda lo faccio rosso, altrimenti lilla con saturazione variabile
    if (modeVals.includes(val)) fill(255, 60, 60, 230);
    else fill(160, 130, 255, sat);

    //disegno barra arrotondata con larghezza e altezza calcolate
    rect(bx + 2, by, barWidth - 4, bh, 6); 
  }

  //etichetta sotto il grafico con tutti i valori della moda
  noStroke();
  fill(255, 60, 60);
  textAlign(LEFT);
  textSize (12);
  text("Mode = " + modeLabel, x + 20, y + h + 25);


  //etichetta verticale “Frequency”
  push();
  fill(0);
  textAlign(CENTER);
  translate(x + margin - 30, y + h / 2 + 20); 
  rotate(-HALF_PI);
  text("Frequency", 0, 0);
  pop();

  //etichette sull'asse X (valori della colonna)
  fill(0);
  textAlign(CENTER);
  textSize(6);
  for (let i = 0; i < uniqueVals.length; i++) {
    text(uniqueVals[i], x + margin + i * barWidth + barWidth / 2, y + h - 25);
  }
} // chiusura di drawModeChart


//GRAFICO DEVIAZIONE STANDARD COLONNA 5
function drawStdDevChart(x, y, w, h) {
  let col5 = getNumericColumn(4); //prendo i valori della colonna 5
  let stdVal = stddevManual(col5); //deviazione standard
  let meanVal = meanManual(col5);

  //se tutti i valori sono uguali (stdVal = 0) evito divisione per zero
  if (stdVal === 0 || isNaN(stdVal)) {
    //mostro solo un messaggio e una linea orizzontale
    textAlign(CENTER);
    textStyle(BOLD);
    textSize(18);
    fill(0);
    text("Deviazione standard nulla (tutti i valori uguali)", width / 2, y + h / 2);
    return;
  }

  //creo curva a campana per visualizzazione
  let points = [];
  let dataMin = min(col5);
  let dataMax = max(col5);
  let step = (dataMax - dataMin) / 80; //densità punti (più punti = curva più liscia)
  if (step === 0) step = 1;

  //formula della curva gaussiana
  for (let v = dataMin; v <= dataMax; v += step) {
    let exponent = -0.5 * pow((v - meanVal) / stdVal, 2);
    let yVal = exp(exponent);
    points.push({x: v, y: yVal});
  }

  //normalizzo i valori Y per adattarli all’altezza disponibile
  let maxY = 0;
  for (let p of points) if (p.y > maxY) maxY = p.y;
  for (let p of points) {
    p.y = map(p.y, 0, maxY, 0, h - 80);
  }

  //titolo
  textAlign(CENTER);
  textStyle(BOLD);
  textSize(20);
  fill(0);
  textStyle(NORMAL);

  //disegno le barre verticali 
  noStroke();
  for (let p of points) {
    let px = map(p.x, dataMin, dataMax, x + 20, x + w - 20);
    let py = y + h - p.y; // p.y è altezza
    let t = map(p.x, dataMin, dataMax, 0, 1);
    let c = lerpColor(color(255, 150, 180, 200), color(170, 130, 255, 200), t);
    fill(c);
    rect(px - 4, py, 8, p.y, 20);
  }

  //linea arancione sopra le barre
  noFill();
  stroke(255, 60, 60);
  strokeWeight(3);
  beginShape();
  for (let p of points) {
    let px = map(p.x, dataMin, dataMax, x + 20, x + w - 20);
    let py = y + h - p.y;
    vertex(px, py);
  }
  endShape();

  //scritta con il valore della deviazione standard sotto il grafico
  noStroke();
  fill(0);
  textSize(16);
  textStyle(BOLD);
  fill(255, 60, 60);
  textStyle(NORMAL);
  textSize(12);
  text(`Deviazione standard colonna 5: ${nf(stdVal, 1, 2)}`, width / 2, y + h + 35);

}
