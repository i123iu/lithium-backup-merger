const table_rows_parent = document.getElementById("table-rows-parent");
const table_headers_parent = document.getElementById("table-headers-parent");
const table_headers_parent_2 = document.getElementById(
  "table-headers-parent-2"
);

// book_hash -> row_element
var table_rows = {};

var table_columns_count = 0;

function tableAddBackup(file_name, backup) {
  // Add all new books to table
  backup.books.forEach((book) => {
    _tableEnsureRow(book.hash, table_columns_count);
  });

  // get header text from file_name
  _tableAddHeader(file_name);

  // fill new column
  for (const [book_hash, book_row] of Object.entries(table_rows)) {
    // check if the book is in the backup
    const found = backup.books.find((book) => book.hash === book_hash);

    if (found === undefined) {
      // add empty cell
      const td = _tableCreateCellEmpty();
      book_row.appendChild(td);
    } else {
      // add full cell
      const td = _tableCreateCellFull(found, file_name);
      book_row.appendChild(td);
    }
  }

  table_columns_count++;
}

function tableGetBackupForRow(book_hash) {
  const radio = document.querySelector(
    'input[name="backup-' + book_hash + '"]:checked'
  );
  if (radio === null) return null;

  return radio.id.substring("backup-".length + 32 + 1);
}

function tableUpdateRowName(book_hash) {
  const row = table_rows[book_hash];
  if (row === undefined) return;
  row.querySelector("th").innerText = _tableGetRowName(book_hash);
}

function tableGetMainBackup() {
  const radio = document.querySelector(
    'input[name="table-main-backup"]:checked'
  );
  if (radio === null) return null;

  return radio.id.substring("table-main-backup-".length);
}

function _tableGetRowName(book_hash) {
  const book_name = mainBookGetName(book_hash) ?? "unknown name";
  return book_name + "\n(" + book_hash.substring(0, 8) + "...)";
}

function _tableAddHeader(file_name) {
  // Get header text from filename
  const split = file_name.split("_");
  const date = split[0].replaceAll("-", ".");
  const time = split[1].replaceAll("-", ":").replaceAll(".libak", "");

  const span = document.createElement("span");
  span.innerText = date + "\n" + time;

  const th = document.createElement("th");
  th.appendChild(span);
  table_headers_parent.appendChild(th);

  // Second row
  const radio = _tableCreateRadio(
    "table-main-backup",
    "table-main-backup-" + file_name,
    tableGetMainBackup() === null
  );
  th.appendChild(radio);

  const td = document.createElement("td");
  td.appendChild(radio);
  td.onclick = () => {
    radio.checked = true;
    mainSetDirty(true);
  };

  table_headers_parent_2.appendChild(td);
}

function _tableEnsureRow(book_hash, empty_columns) {
  if (book_hash in table_rows) return;

  // create row
  const row = _tableCreateRow(book_hash);

  // create empty cells for existing columns
  for (let i = 0; i < empty_columns; i++) {
    const cell = _tableCreateCellEmpty();
    row.appendChild(cell);
  }

  table_rows_parent.append(row);
  table_rows[book_hash] = row;
}

function _tableCreateRow(book_hash) {
  const th = document.createElement("th");
  th.id = "table-row-" + book_hash;
  th.innerText = _tableGetRowName(book_hash);

  const tr = document.createElement("tr");
  tr.appendChild(th);
  return tr;
}

function _tableCreateCell(content) {
  const td = document.createElement("td");
  //td.classList.add("");
  td.style = "text-wrap: nowrap";
  return td;
}

function _tableCreateCellFull(book, backup_filename) {
  const td = _tableCreateCell();

  // annotations
  const text_1 = document.createElement("span");
  text_1.innerText = book.annotations.length + " annotations";
  td.appendChild(text_1);

  // separation
  td.appendChild(document.createElement("br"));

  // bookmarks
  const text_2 = document.createElement("span");
  text_2.innerText = book.bookmarks.length + " bookmarks";
  td.appendChild(text_2);

  // separation
  td.appendChild(document.createElement("br"));

  // radio button
  const radio = _tableCreateRadio(
    "backup-" + book.hash,
    "backup-" + book.hash + "-" + backup_filename,
    tableGetBackupForRow(book.hash) === null
  );
  td.appendChild(radio);

  td.onclick = () => {
    radio.checked = true;
    mainSetDirty(true);
  };
  return td;
}

function _tableCreateCellEmpty() {
  const td = _tableCreateCell();

  const span = document.createElement("span");
  span.innerText = "x";

  td.appendChild(span);
  return td;
}

function _tableCreateRadio(name, id, check) {
  const radio = document.createElement("input");
  radio.classList.add("form-check-input");
  radio.type = "radio";
  radio.name = name;
  radio.id = id;
  if (check) radio.checked = true;

  radio.addEventListener("change", () => mainSetDirty(true));
  return radio;
}
