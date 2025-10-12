let table;   //conterrà i dati CSV
let stats = {};  //oggetto per salvare i risultati
let statsTable; //nuova tabella per la seconda rappresentazione testuale

function preload() //serve a caricare risorse
{
  table = loadTable("dataset_corretto.csv", "csv", "header");
}

function setup() {
  createCanvas(1000, 1200); //crea il canvas più alto per accomodare la tabella
  textFont("monospace"); //imposta il font del testo
  textSize(14);


  //funzione per ottenere ogni colonna come array di numeri
  let col1 = getNumericColumn(0);
  let col2 = getNumericColumn(1);
  let col3 = getNumericColumn(2);
  let col4 = getNumericColumn(3);
  let col5 = getNumericColumn(4);

  //calcoli statistici
  stats.mean1 = meanManual(col1); //funzione media aritmetica
  stats.std2 = stddevManual(col2); //calcola la deviazione standard
  stats.mode3 = modeManual(col3); //calcola la moda
  stats.median4 = medianManual(col4); //calcola la mediana
  stats.mean5 = meanManual(col5); //funzione media aritmetica
  stats.std5 = stddevManual(col5); //calcola la deviazione standard

  //creo la seconda rappresentazione testuale: tabella con i risultati
  statsTable = new p5.Table(); //crea una nuova tabella vuota
  statsTable.addColumn("Statistic"); //aggiunge la colonna per il nome della statistica
  statsTable.addColumn("Column"); //aggiunge la colonna per il nome della colonna del dataset
  statsTable.addColumn("Value"); //aggiunge la colonna per il valore calcolato

  //aggiungo le righe con i risultati calcolati
  addRow("Mean", "Column 1", nf(stats.mean1, 1, 2)); //media colonna 1
  addRow("Std Dev", "Column 2", nf(stats.std2, 1, 2)); //deviazione colonna 2
  addRow("Mode", "Column 3", stats.mode3.join(", ")); //moda colonna 3 (lista di valori)
  addRow("Median", "Column 4", nf(stats.median4, 1, 2)); //mediana colonna 4
  addRow("Mean", "Column 5", nf(stats.mean5, 1, 2)); //media colonna 5
  addRow("Std Dev", "Column 5", nf(stats.std5, 1, 2)); //deviazione colonna 5

  noLoop(); //per fare in modo che la funzione draw venga eseguita solo una volta
}


//FUNZIONE draw PRINCIPALE
function draw() {
  background(245); //colore di sfondo chiaro per il canvas
  fill(0); //colore del testo nero
  textAlign(LEFT); //allineamento del testo a sinistra

  //intestazione e prima rappresentazione testuale
  textStyle(BOLD); //grassetto per il titolo
  text("STATISTICAL RESULTS", width / 3.5, 40); //titolo centrato
  textStyle(NORMAL); //per tornare a testo normale
  //mostra i valori statistici calcolati
  text(`Mean (Column 1):            ${nf(stats.mean1, 1, 2)}`, width / 3.5, 80); 
  text(`Standard Deviation (Col 2): ${nf(stats.std2, 1, 2)}`, width / 3.5, 100); 
  text(`Mode (Column 3):             ${stats.mode3}`, width / 3.5, 120); 
  text(`Median (Column 4):           ${nf(stats.median4, 1, 2)}`, width / 3.5, 140); 
  text(`Mean (Column 5):             ${nf(stats.mean5, 1, 2)}`, width / 3.5, 160); 
  text(`Std Dev (Column 5):          ${nf(stats.std5, 1, 2)}`, width / 3.5, 180); 

  //seconda rappresentazione testuale: tabella
  let tableWidth = 450; //larghezza totale della tabella
  let tableX = (width - tableWidth) / 3; //posizione X centrata orizzontalmente
  drawStatsTable(tableX, 220); 

  //rappresentazione grafica: istogramma media colonna 1
  let histWidth = 800; //larghezza istogramma
  let histX = (width - histWidth) / 2; //posizione centrata
  drawMeanHistogram(histX, 500, histWidth, 200); //disegno l'istogramma

//rappresentazione grafica: moda colonna 3
let modeChartWidth = 800; //larghezza grafico moda
let modeX = (width - modeChartWidth) / 2; //centrato orizzontalmente
drawModeChart(modeX, 800, modeChartWidth, 250);

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

//FUNZIONE PER DISEGNARE LA TABELLA SUL CANVAS
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
  text("Graphical Representation 1: Mean - Column 1", x, y - 15);
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
  text("Graphical Representation 2: Mode - Column 3", x, y - 15);
  textStyle(NORMAL);
  textSize(12);
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
}
