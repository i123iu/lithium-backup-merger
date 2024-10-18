// file_name -> backup
var main_backups = {};

// book_hash -> file_name
var main_books = {};

function mainBackupExists(file_name) {
  return file_name in main_backups;
}

function mainAddBackup(file_name, backup) {
  if (mainBackupExists(file_name)) return;
  main_backups[file_name] = backup;

  mainSetDirty(true);
  tableAddBackup(file_name, backup);
}

function mainBookExists(book_hash) {
  return book_hash in main_books;
}

function mainBookGetName(book_hash) {
  return main_books[book_hash];
}

function mainAddBook(file_name, book_hash) {
  if (mainBookExists(book_hash)) return;

  mainSetDirty(true);
  main_books[book_hash] = file_name;
  tableUpdateRowName(book_hash);
}

function mainGetAllBookHashes() {
  const hashes = new Set();
  for (let backup of Object.values(main_backups)) {
    for (let book of backup.books) {
      hashes.add(book.hash);
    }
  }
  return hashes;
}

var _main_dirty = false;

function mainSetDirty(value) {
  _main_dirty = value;
}

window.addEventListener("beforeunload", (e) => {
  if (_main_dirty) e.preventDefault();
});

///// COLOR THEME

function updateTheme() {
  const colorMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  document.querySelector("html").setAttribute("data-bs-theme", colorMode);
}

updateTheme();

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", updateTheme);
