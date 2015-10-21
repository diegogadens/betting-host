var assert = require('assert');
var bettinghost = require('../bettinghost');


describe('Input lines test', function() {
    //first attribute of tokenize must be bet when bet

    //first attribute of tokenize must be result when result

    it('Should return Bet when a Bet line is passed', function () {
      var input = "Bet:W:3:7";
      var tokens = bettinghost.tokenizeLine(input);
      assert.equal("Bet", bettinghost.processInputTokens(tokens));
    });

    it('Should return Result when a Result line is passed', function () {
      var input = "Result:2:3:5";
      var tokens = bettinghost.tokenizeLine(input);
      assert.equal("Result", bettinghost.processInputTokens(tokens));
    });

    it('Should return false when an incorrect option is passed', function () {
      var input = "Guess:2:3:5";
      var tokens = bettinghost.tokenizeLine(input);
      assert.equal(false, bettinghost.processInputTokens(tokens));
    });

    it('Should return result object with 3 attributes', function(){
      var object = bettinghost.getResult();
      var count = Object.keys(object).length;
      assert.equal(3, count);
    });

    it('Should return Bet when a Bet line is passed', function () {
      input = "Bet:W:3:7";
      tokens = bettinghost.tokenizeLine(input);
      assert.equal("Bet", bettinghost.processInputTokens(tokens));
    });
});

describe('Input line tokenizer', function() {
   it("Should return array of lenght 4 when a correct formatted line is passed", function () {
      var input = "Bet:W:1:1";
      assert.equal(4, bettinghost.tokenizeLine(input).length);

      input = "Bet:P:1:1";
      assert.equal(4, bettinghost.tokenizeLine(input).length);

      input = "Bet:E:1,2:1";
      assert.equal(4, bettinghost.tokenizeLine(input).length);

      input = "Result:3:8:2";
      assert.equal(4, bettinghost.tokenizeLine(input).length);
    });

   it('Should return false when an incorrect formated line is passed', function () {
      var input = "Bet:W:1:1:1";
      assert.equal(false, bettinghost.tokenizeLine(input));

      input = "Bet:P:1";
      assert.equal(false, bettinghost.tokenizeLine(input));

      input = "Bet:";
      assert.equal(false, bettinghost.tokenizeLine(input));

      input = "Some wrong line";
      assert.equal(false, bettinghost.tokenizeLine(input));
    });
});

describe('Bet registration', function() {
  it("Should return Bet of tipe Win when product (index 1) of array is 'W'" , function () {
    var betArray = ["Bet", "W", 1, 1];
    var bet = bettinghost.registerBet(betArray);
    assert.equal("W", bet.product)
  });

  it("Should return Bet of tipe Place when product (index 1) of array is 'P'" , function () {
    var betArray = ["Bet", "P", 1, 1];
    var bet = bettinghost.registerBet(betArray);
    assert.equal("P", bet.product)
  });

  it("Should return Bet of tipe Exacta when product (index 1) of array is 'E'" , function () {
    var betArray = ["Bet", "E", "1,2", 1];
    var bet = bettinghost.registerBet(betArray);
    assert.equal("E", bet.product)
  });

  it("Should return false when product (index 1) is anything but W, E or P" , function () {
    var betArray = ["Bet", "X", "1,2", 1];
    var bet = bettinghost.registerBet(betArray);
    assert.equal(false, bet)
  });

  it('Should return pool object with 3 attributes', function(){
      var object = bettinghost.getPools();
      var count = Object.keys(object).length;
      assert.equal(3, count);
    });

  it("Should increment pool size of Win when a bet is made on Win product" , function () {
    var oldWinPool = bettinghost.getPools().win;
    var betArray = ["Bet", "W", 1, 1];
    bettinghost.registerBet(betArray);
    var newWinPool = bettinghost.getPools().win;
    assert.equal(true, oldWinPool < newWinPool);
  });

  it("Should increment Win bet array size when a bet is made on Win product" , function () {
    var oldWinArraySize = bettinghost.getBetsWin().length;
    var betArray = ["Bet", "W", 1, 1];
    bettinghost.registerBet(betArray);
    var newWinArraySize = bettinghost.getBetsWin().length;
    assert.equal(true, oldWinArraySize < newWinArraySize);
  });

  it("Should increment pool size of Place when a bet is made on Place product" , function () {
    var oldPlacePool = bettinghost.getPools().place;
    var betArray = ["Bet", "P", 1, 1];
    bettinghost.registerBet(betArray);
    var newPlacePool = bettinghost.getPools().place;
    assert.equal(true, oldPlacePool < newPlacePool);
  });

  it("Should increment Place bet array size when a bet is made on Place product" , function () {
    var oldPlaceArraySize = bettinghost.getBetsPlace().length;
    var betArray = ["Bet", "P", 2, 10];
    bettinghost.registerBet(betArray);
    var newPlaceArraySize = bettinghost.getBetsPlace().length;
    assert.equal(true, oldPlaceArraySize < newPlaceArraySize);
  });

  it("Should increment pool size of Exacta when a bet is made on Exacta product" , function () {
    var oldExactaPool = bettinghost.getPools().exacta;
    var betArray = ["Bet", "E", "1,2", 1];
    bettinghost.registerBet(betArray);
    var newExactaPool = bettinghost.getPools().exacta;
    assert.equal(true, oldExactaPool < newExactaPool);
  });

  it("Should increment Exacta bet array size when a bet is made on Exacta product" , function () {
    var oldExactaArraySize = bettinghost.getBetsExacta().length;
    var betArray = ["Bet", "E", "1,2", 10];
    bettinghost.registerBet(betArray);
    var newExactaArraySize = bettinghost.getBetsExacta().length;
    assert.equal(true, oldExactaArraySize < newExactaArraySize);
  });

  it("Should reset bets, pools and result" , function () {
    assert.equal(true, bettinghost.resetData());
  });

});

describe('Result computation', function() {
  it('Should complete result computation for all three products', function () {
    bettinghost.resetData();

    var betArray = ["Bet", "W", 1, 1];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "W", 2, 9];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 1, 30];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 4, 70];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 5, 200];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "E", "1,2", 2];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "E", "2,3", 8];
    bettinghost.registerBet(betArray);

    var input = "Result:1:2:3";
    var tokens = bettinghost.tokenizeLine(input);
    bettinghost.processInputTokens(tokens);  

    assert.equal(true, bettinghost.computeResults());
  });

  it('Should complete result computation for Win product', function () {
    bettinghost.resetData();

    var betArray = ["Bet", "W", 1, 1];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "W", 2, 9];
    bettinghost.registerBet(betArray);

    var input = "Result:1:2:3";
    var tokens = bettinghost.tokenizeLine(input);
    bettinghost.processInputTokens(tokens);

    var result = bettinghost.computeWinDividends();
    assert.equal("Win:1:$8.50", result);
  });


  it('Should complete result computation for Place product', function () {
    bettinghost.resetData();

    var betArray = ["Bet", "P", 1, 30];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 4, 70];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 5, 200];
    bettinghost.registerBet(betArray);

    var input = "Result:1:2:3";
    var tokens = bettinghost.tokenizeLine(input);
    bettinghost.processInputTokens(tokens);

    var result = bettinghost.computePlaceDividends();
    assert.equal("Place:1:$2.93\nPlace:2:$0\nPlace:3:$0", result);
  });
  
  it('Should complete result computation for Exacta product', function () {
    bettinghost.resetData();

    var betArray = ["Bet", "E", "1,2", 2];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "E", "2,3", 8];
    bettinghost.registerBet(betArray);

    var input = "Result:1:2:3";
    var tokens = bettinghost.tokenizeLine(input);
    bettinghost.processInputTokens(tokens);

    var result = bettinghost.computeExactaDividends();
    assert.equal("Exacta:1,2:$4.10", result);
  });

  it('Should return false when trying to compute Win results without entering result line', function() {
    bettinghost.resetData();
    result = bettinghost.computeWinDividends();
    assert.equal(false, result);    
  });

  it('Should return false when trying to compute Place results without entering result line', function() {
    bettinghost.resetData();
    result = bettinghost.computePlaceDividends();
    assert.equal(false, result);    
  });

  it('Should return false when trying to compute Exacta results without entering result line', function() {
    bettinghost.resetData();
    result = bettinghost.computeExactaDividends();
    assert.equal(false, result);    
  });

  it('Should return correct dividends object', function(){
    bettinghost.resetData();

    var betArray = ["Bet", "W", 1, 1];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "W", 2, 9];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 1, 30];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 4, 70];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "P", 5, 200];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "E", "1,2", 2];
    bettinghost.registerBet(betArray);

    var betArray = ["Bet", "E", "2,3", 8];
    bettinghost.registerBet(betArray);

    var input = "Result:1:2:3";
    var tokens = bettinghost.tokenizeLine(input);
    bettinghost.processInputTokens(tokens);
    if(bettinghost.computeResults())
      var dividends = bettinghost.getDividends();
    else
      dividends = false;

    assert.equal("Win:1:$8.50", dividends.win);
    assert.equal("Place:1:$2.93\nPlace:2:$0\nPlace:3:$0", dividends.place);
    assert.equal("Exacta:1,2:$4.10", dividends.exacta);
  });
});

describe('export functions', function() {
  it('Should export all functions', function () {
    assert.equal(true, bettinghost.exportFunctions())
  });
});