const uploadFile = function (req, res) {
    var sampleFile

    if (!req.files) {
        res.send('No files were uploaded.')
        return
    }
    sampleFile = req.files.sampleFile
    // Use the mv() method to place the file somewhere on your server
    var fileName = req.body.fileUploadName
    sampleFile.mv('public/upload/' + fileName + '.jpg', function (err) {
        if (err) {
            res.status(500).send(err)
        } else {
            res.send('File uploaded!')
        }
    })
}

module.exports = uploadFile