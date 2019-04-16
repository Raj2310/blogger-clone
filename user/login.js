const mongo = require('mongodb')
const MongoClient = mongo.MongoClient
const database_url = "mongodb://admin:saajansaajan@ds139072.mlab.com:39072/testing"

exports.login = function (req, res) {
    if (req.session.id) {
        res.send({
            status: 2
        })
    } else {
        const email = req.body.email
        const password = req.body.password
        MongoClient.connect(database_url, function (err, db) {
            db.collection('users', function (err, collection) {
                if (err) {
                    res.send({
                        status: 0,
                        msg: 'An error occured'
                    })
                } else {
                    collection.findOne({
                        email: email,
                        password: password
                    }, function (err, item) {
                        if (item) {
                            req.session.email = item.email
                            req.session.password = item.password
                            req.session.firstName = item.firstName
                            req.session.lastName = item.lastName
                            req.session.id = item._id
                            res.send({
                                status: 1
                            })
                        } else {
                            res.send({
                                status: 0,
                                msg: "Email and password Do no match"
                            })
                        }
                    })
                }
            })
            db.close()
        })
    }
}    