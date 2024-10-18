# Lithium Backup Merger
This simple web app allows for the merging of annotations and bookmarks from multiple Lithium app backups. It provides a way to recover lost annotations and bookmarks by selecting which data to keep from each backup.

## Lithium
Lithium ("Lithium: EPUB Reader") is an Android e-book reader that supports text highlighting and bookmarks. It is available on [Google Play](https://play.google.com/store/apps/details?id=com.faultexception.reader).

## Disclaimer
I cannot guarantee that this app will work every time, so you should create a backup before using it.
To create a backup, go to Settings > Backups > Create new backup
This app is not affiliated with the original Lithium EPUB Reader app.

## Possible use case
This app is useful when annotations or bookmarks are missing from a book but are still saved in an earlier backup.
This situation can happen if you accidentally delete a book and only discover the loss after some time.

## Libraries

- [Bootstrap](https://getbootstrap.com/) - graphics
- [protobuf.js](https://github.com/protobufjs/protobuf.js/) - decoding and encoding the backup files
- [JSZip](https://github.com/Stuk/jszip) - unzipping and zipping the backup files
- [SparkMD5](https://github.com/satazor/js-spark-md5) - hashing e-book files
