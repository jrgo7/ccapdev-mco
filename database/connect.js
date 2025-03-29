const mongoose = require('mongoose');

function connect() {
    mongoose.connect(process.env.MONGO_URI);
        // .then(() => {
        //     app.listen(process.env.PORT, () => {
        //         console.log("Listening on port ", process.env.PORT);
        //     })
        // }).catch((error) => {
        //     console.log(error);
        // })
        // ;
}

module.exports = connect;