users = {
    'get': function (req, res) {
        res.setHeader("Content-Type", "application/json");
        res.send({status: "success", other: {mewo: Date()}});
    }
};

module.exports = users;