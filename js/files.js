const files_input = document.getElementById("files-input");
const files_clear_log = document.getElementById("files-log-clear");
const files_logs_parent = document.getElementById("files-logs-parent");

files_input.addEventListener("change", () => {
  // get files from the input
  const files = files_input.files;

  // check empty files
  if (files.length == 0) {
    filesLogsAdd("No files selected", "danger");
    return;
  }

  // process all files
  for (let file of files) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const file_data = e.target.result;
      filesProcessFile(file.name, file_data);
    };
    reader.readAsArrayBuffer(file);
  }

  // clear files
  files_input.value = "";
});

// processes a file based on its extension
function filesProcessFile(file_name, file_data) {
  const file_ext = file_name.substring(file_name.lastIndexOf(".") + 1);

  switch (file_ext) {
    case "epub":
      filesProcessEpub(file_name, file_data);
      break;
    case "libak":
      filesProcessBackup(file_name, file_data);
      break;
    default:
      filesLogsAddFile(file_name, "Incorrect file extension. ", "danger");
      break;
  }
}

// processes an epub file
// calculates its hash and saves the value
function filesProcessEpub(file_name, file_data) {
  // calculate md5 hash
  try {
    const spark = new SparkMD5.ArrayBuffer();
    spark.append(file_data);
    const book_hash = spark.end();

    if (mainBookExists(book_hash)) {
      filesLogsAddFile(file_name, "Book file already added. ", "danger");
      return;
    }

    mainAddBook(file_name, book_hash);

    filesLogsAddFile(file_name, "Book added. ", "success");
  } catch (e) {
    filesLogsAddFile(file_name, "Couldn't process this file. ", "danger");
    console.error(e);
    return;
  }
}

// processes an backup file
// checks the filename
// parses the zipped .libak file and saves the value
async function filesProcessBackup(file_name, file_data) {
  if (!verifyBackupFileName(file_name)) {
    filesLogsAddFile(
      file_name,
      "Backup file has invalid file name. ",
      "danger"
    );
    return;
  }

  if (mainBackupExists(file_name)) {
    filesLogsAddFile(file_name, "Backup file already added. ", "danger");
    return;
  }

  var decoded;
  try {
    decoded = await libakOpen(file_data);
  } catch (e) {
    filesLogsAddFile(file_name, e.message, "danger");
    return;
  }

  if (decoded.versionCode !== 94) {
    let mes =
      "Unsupported version code, exported file might not work correctly. ";
    if (decoded.versionCode > 94) {
      mes += "Contact author please. ";
    }
    filesLogsAddFile(file_name, mes, "warning");
  } else {
    filesLogsAddFile(file_name, "Backup added. ", "success");
  }

  mainAddBackup(file_name, decoded);
}

function verifyBackupFileName(file_name) {
  const re = new RegExp(
    "^[0-9]{4}-[0-9]{2}-[0-9]{2}_[0-9]{2}-[0-9]{2}-[0-9]{2}.libak$"
  );
  return re.test(file_name);
}

files_clear_log.addEventListener("click", fileLogsClear);

// clears all the logs
function fileLogsClear() {
  files_logs_parent.replaceChildren();
}

// adds one log
// type - success / warning / danger
function filesLogsAdd(text, type) {
  const li = document.createElement("li");
  li.classList.add("list-group-item");
  li.classList.add("text-" + type);
  li.innerText = text;

  files_logs_parent.appendChild(li);
}

// adds one log with a file name
// type - success / warning / danger
function filesLogsAddFile(file, text, type) {
  filesLogsAdd('"' + file + '" - ' + text, type);
}
