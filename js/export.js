const export_button = document.getElementById("export-button");
const export_status = document.getElementById("export-status");

export_button.addEventListener("click", async () => {
  exportStatusReset();

  const books = [];
  const all_book_hashes = mainGetAllBookHashes();

  if (all_book_hashes.size === 0) {
    exportStatusSet("Nothing to export. ", "danger");
    return;
  }

  for (book_hash of all_book_hashes) {
    const backup_file_name = tableGetBackupForRow(book_hash);
    if (backup_file_name === null) {
      exportStatusSet("Error while exporting. ", "danger");
      return;
    }

    const book = main_backups[backup_file_name].books.find(
      (book) => book.hash == book_hash
    );
    if (book == null) {
      exportStatusSet("Error while exporting. ", "danger");
      return;
    }

    books.push(book);
  }

  const main_backup_file_name = tableGetMainBackup();
  const main_backup = main_backups[main_backup_file_name];
  if (main_backup === null) {
    exportStatusSet("Error while exporting. ", "danger");
    return;
  }

  let payload = {
    versionCode: main_backup.versionCode,
    versionName: main_backup.versionName,
    books: books,
    themes: main_backup.themes,
    categories: main_backup.categories,
  };

  try {
    const libak = await libakExport(payload);
    const blob = new Blob([libak]);

    // Create a temporary <a> element
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = _exportGetFileName();
    link.click();

    // Clean up by revoking the object URL
    URL.revokeObjectURL(link.href);

    exportStatusSet("Exported. ", "success");
    mainSetDirty(false);
  } catch (e) {
    exportStatusSet(e.message, "danger");
  }
});

function _exportGetFileName() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}-merged.libak`;
}

function exportStatusReset() {
  export_status.classList.add("d-none");
  export_status.classList.remove("text-danger", "text-success", "text-warning");
  export_status.innerText = "";
}

// type - success / warning / danger
function exportStatusSet(text, type) {
  export_status.classList.remove("d-none");
  export_status.classList.add("text-" + type);
  export_status.innerText = text;
}
