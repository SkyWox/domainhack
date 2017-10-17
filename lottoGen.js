lottoGen = function(specs) {
  var lottoNums = {
    vanilla : [],
    special : 0,
  }

  for (i=0; i < specs.numVanilla; i++){
    lottoNums.vanilla[i] = Math.ceil(Math.random() * specs.vanillaMax);
  }

  if (specs.numSpecial > 0){
    lottoNums.special = Math.ceil(Math.random() * specs.specialMax);
  }

  return lottoNums;

}

module.exports = lottoGen;
