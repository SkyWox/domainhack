//http://data.iana.org/TLD/tlds-alpha-by-domain.txt
const fs = require("fs");

var text = fs.readFileSync("TLDsource.txt", 'utf-8');
var TLDbyLine = text.split("\n");

var file = fs.createWriteStream("TLD.js")
file.write("var TLD = [")
TLDbyLine.forEach(function(item){file.write("\'" + item + "\', ")})
file.write('] \n module.exports= TLD')
file.end
