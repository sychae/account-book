var mongoose = require('mongoose');
exports.open = function (callBack) {
    
    mongoose.connect(
        'mongodb://sychae:yerin!23@localhost/fstdb'
    ,   {useMongoClient:true}
    ,   function (err) {
            console.log(mongoose);
            if (err) {
                console.log('mongoose connection error :' + err);
                throw err;
            }
            callBack.call(null);
        }
    );
};