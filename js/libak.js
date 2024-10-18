var proto_file;
_loadProtoFile();

// loads and parses the `main.proto` file
async function _loadProtoFile() {
  return await protobuf
    .load("main.proto")
    .then((x) => {
      proto_file = x.nested.lithium_extractor.Root;
    })
    .catch((err) => {
      console.error(err);
      alert("Error loading the app. ");
    });
}

// returns the data stored in the `.libak` file
async function libakOpen(file) {
  // unzip the file and get the binary
  const bin = await _getBinaryFromZip(file);
  if (bin === undefined) throw new Error("Error reading the file. ");

  // decode the data
  const decoded = _decodeBinary(bin, proto_file);
  if (decoded === undefined) throw new Error("Error decoding the file. ");

  return decoded;
}

// unzips the file and returns the binary data
// returns undefined on error
async function _getBinaryFromZip(file) {
  try {
    const jszip = new JSZip();
    const unzipped = await jszip.loadAsync(file);
    const data = unzipped.files["data"];
    const bin = await data.async("uint8array");
    return bin;
  } catch (e) {
    console.error(e);
    return;
  }
}

// decodes the binary to the proto_file structure
// returns undefined on error
async function _decodeBinary(bin, proto_file) {
  try {
    return proto_file.decode(bin);
  } catch (e) {
    console.error(e);
    return;
  }
}

// exports the payload as a .libak file
async function libakExport(payload) {
  // create a message from the payload
  const mes = _createMessage(payload);
  if (mes === undefined) throw new Error("Error exporting the file. ");

  // encode the message
  const bin = await _encodeToBinary(mes, proto_file);
  if (bin === undefined) throw new Error("Error exporting the file. ");

  // unzip the file and get the binary
  const zip = await _getZipFromBinary(bin);
  if (zip === undefined) throw new Error("Error exporting the file. ");

  return zip;
}

// create a message from the payload
// returns undefined on error
function _createMessage(payload) {
  try {
    var message = proto_file.create(payload);
    return message;
  } catch (e) {
    console.error(e);
    return;
  }
}

// encodes the message to binary
// returns undefined on error
async function _encodeToBinary(decoded, proto_file) {
  try {
    return proto_file.encode(decoded).finish();
  } catch (e) {
    console.error(e);
    return;
  }
}

// zips the binary
// returns undefined on error
async function _getZipFromBinary(bin) {
  try {
    const jszip = new JSZip();
    jszip.file("data", bin, { binary: true });
    const zip = await jszip.generateAsync({
      type: "uint8array",
      compression: "DEFLATE",
    });
    return zip;
  } catch (e) {
    console.error(e);
    return;
  }
}
