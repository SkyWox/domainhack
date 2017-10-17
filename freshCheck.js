//to start server run ./mongod --dbpath C:\data\db
//in C:\Program Files\MongoDB\Server\3.4\bin
var MongoClient = require('mongodb').MongoClient;
//Create a database named "mydb":
var url = "mongodb://127.0.0.1:27017/mydb";

/*    db.createCollection("powerball", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    })*/

//var freshCheck = function(numbers, mint){

  var success = false;
  var lottoObj = { number: 696969696825, mint : true}
  var query = { number: lottoObj.number, mint : lottoObj.mint}
  var impossible = { number: 48, mint: true }
  var mintquery = { number: lottoObj.number }
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    console.log("Connected to DB!");
    if(lottoObj.mint){
      db.collection("powerball").find(impossible).toArray(function(err, res){
        if (err) throw err;
        console.log(res)
        db.close();
        if (res.length > 0){
          console.log('result exists')
          success = false
        }else{
          console.log('result does not exist')
          db.collection("powerball").insertOne(lottoObj, function(err, res) {
            if (err) throw err;
            console.log('1 document inserted')
            db.close();
          success = true
          })
        }
      })
    }else{
      db.collection("powerball").find(impossible).toArray(function(err, res){
        if (err) throw err;
        console.log(res)
        db.close()
        if(res.mint){
          console.log('number reserved for mint')
          success = false
        }else{
          console.log('number ok for non-mint use')
          db.collection("powerball").insertOne(lottoObj, function(err, res) {
            if (err) throw err;
            console.log('1 document inserted')
            db.close();
            success = true
          })
        }
      })
    }
});
