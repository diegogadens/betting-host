var betsWin = [], //Array to store the bets on the Win product
    betsPlace = [], //Array to store the bets on the Place product
    betsExacta = [], //Array to store the bets on the Exacta product
    pools = {
        win: 0,
        place: 0,
        exacta: 0
    }, //Object to store the value of each pool of bets
    result = 0, //Var to store the final result, eg: Result:2:4:7
    dividends = {
        win: '',
        place: '',
        exacta: ''
    }; //Object used to store the calculated dividends for each product after all the bets are made

function tokenizeLine(line) {
    //Receives a line from stdin an return an array with 4 elements, splitting the line using the collon character
    //Example: Bet:W:2:4 will return an array ["Bet", "W", 2, 4]
    //Example: Result:1:2:4 will return an array ["Result", 1, 2, 4]
    var tokens = line.split(":");
    if (tokens.length == 4)
        return tokens;
    else
        return false;
}

function processInputTokens(tokens) {
    //Receives an array of tokens already processed and do specific things with them
     if (tokens[0] === "Bet") {
        //If it is a bet array, Register a new bet
        registerBet(tokens);
        return "Bet";
    } else if (tokens[0] === "Result") {
        //If it is a result array, set the result
        result = {
            first: tokens[1],
            second: tokens[2],
            third: tokens[3],
        };
        return "Result";
    } else
        return false; //Will return false if index 0 tokens is malformed
}

function registerBet(tokens) {
    //Here a generic bet is created with the received tokens
    var bet = {
        product: tokens[1],
        selection: tokens[2],
        stake: tokens[3],
    };

    //Here we made optinal adjustments on the bet, following each product rule 
    //This program covers 3 types of Bets Win, Place and Exacta. Each one identified
    //by its first letter in capital form W, P or E
    switch (tokens[1]) {
        case "W":
            betsWin.push(bet); //Then we add this bet to the correct Array of bets.
            pools.win += Number(tokens[3]); //We also take the amount of the bet and place it in a pool with all the bets of the same type
            return bet;
            break;

        case "P":
            betsPlace.push(bet); //Register the bet
            pools.place += Number(tokens[3]); //Increase the pool total amount
            return bet;
            break;

        case "E":
            //The exacta bet differs a little from the other 2. The punter chooses 2 horses at the same time
            //and must predict the first and second horse, in correct order.
            var horses = bet.selection.split(","); //We receive the data as a String with 2 horse numbers separated by a comma
            bet.selection = [horses[0], horses[1]]; //This string is split and converted in an array with two positions, one for each horse
            betsExacta.push(bet); //We register the bet
            pools.exacta += Number(tokens[3]); //And increase the pool total amount
            return bet;
            break;

        default:
            return false; //returns false to anything but W, P or E in the first index of the tokens array
            break;
    }
}

function computeResults() {
    //call individual methods to compute the results. Each one follows a different rule
    var resultWin = computeWinDividends();
    var resultPlace = computePlaceDividends();
    var resultExacta = computeExactaDividends();

    if (resultWin && resultPlace && resultExacta) { // If all the calculations are done right we set final values to the dividends object
        dividends.win = resultWin; //Set the dividends for the win product
        dividends.place = resultPlace; //Set the dividends for the place product
        dividends.exacta = resultExacta; //Set the dividends for the exacta product
        return true;
    } else
        return false; //returns false if any of the results computaion fail
}

function computeWinDividends() {

    var stakesOfCorrectBets = 0, //Used to count all the stakes of punters who guessed right
        comission = 0.15, //The comission of 15% that tabcorp takes from the pool after splitting betweent the winners
        poolAfterComission = 0, //The remaining pool after tabcorp takes its comission
        dividends = 0; //The total dividends for the WIN product

    if(result != 0){ //Execute computation only if the result is set
        betsWin.forEach(function(bet) { //Iterates the array of bets of type WIN
            if (bet.selection == result.first) //If the punter guessed right
                stakesOfCorrectBets += Number(bet.stake); //increase the amount of correct stakes that will be used latter
        });

        poolAfterComission = pools.win * (1 - comission); //Calculates the value of the pool after a comission is applied

        if (stakesOfCorrectBets > 0) //This if is to avoi division by zero
            dividends = (poolAfterComission / stakesOfCorrectBets).toFixed(2); //Split the remaining pool proportionally to stake. round the result to the near $0.01

        resultString = "Win:" + result.first + ":$" + dividends; //build the result string 
        return resultString; //return the result string
    }
    else 
        return false; //There is a problem with the result data set
}

function computePlaceDividends() {
    //In this type of bet, the user chooses one horse, and he wins if that horse finish 1st, 2nd or 3rd.
    //The pool is divided evenly by 3, and after that, the stakes are divided proportionally

    var stakesOfCorrectBetsOnFirst = 0, //Counts the stakes of punters which bet finished in first
        stakesOfCorrectBetsOnSecond = 0, //Counts the stakes of punters which bet finished in second
        stakesOfCorrectBetsOnThird = 0, //Counts the stakes of punters which bet finished in third
        comission = 0.12, //Set the comission of 12%
        poolAfterComission = 0, //The remaining pool after tabcorp takes its comission
        dividends = {  //The total dividends for the WIN product
            first: 0,
            second: 0,
            third: 0
        };

    if(result != 0){ //Execute computation only if the result is set
        betsPlace.forEach(function(bet) { //For each bet made in the PLACE product do:
            //Check if the bet is right, (it is considered right when the horse finished in 1st, 2nd or 3rd position)
            if (bet.selection == result.first) //If the bet finished first
                stakesOfCorrectBetsOnFirst += Number(bet.stake); //increase the amount of correct stakes that will be used latter
            if (bet.selection == result.second) 
                stakesOfCorrectBetsOnSecond += Number(bet.stake);
            if (bet.selection == result.third)
                stakesOfCorrectBetsOnThird += Number(bet.stake);
        });

        poolAfterComission = pools.place * (1 - comission); //Takes the comission

        //Divide the pool equally by three
        //And then the remaining amount is split again proportionally to the stakes
        if (stakesOfCorrectBetsOnFirst > 0) //To prevent division by zero
            dividends.first = (1 / 3 * poolAfterComission / stakesOfCorrectBetsOnFirst).toFixed(2); //Split and round the result to the near $0.01
        if (stakesOfCorrectBetsOnSecond > 0)
            dividends.second = (1 / 3 * poolAfterComission / stakesOfCorrectBetsOnSecond).toFixed(2);
        if (stakesOfCorrectBetsOnThird > 0)
            dividends.third = (1 / 3 * poolAfterComission / stakesOfCorrectBetsOnThird).toFixed(2);

        //Build and return the result string
        var resultString = "Place:" + result.first + ":$" + dividends.first + "\n";
        resultString += "Place:" + result.second + ":$" + dividends.second + "\n";
        resultString += "Place:" + result.third + ":$" + dividends.third;
        return resultString;
    }
    else
        return false;
}


function computeExactaDividends() {
    //In this type of bet, the punter must choose 2 horses. The one who he thinks is going to finish first, 
    //and the one he thinks is going to finish second
    //In order to win this bet, he must predict correctly both the horses in the exact same order
    var stakesOfCorrectBets = 0, //Used to count all the stakes of punters who guessed right
        comission = 0.18, //The comission of 18%
        poolAfterComission = 0,
        dividends = 0;

    if(result != 0){ //If the result is set
        betsExacta.forEach(function(bet) { //For each bet of type Exactada, do:
            if (bet.selection[0] == result.first && bet.selection[1] == result.second) //Checks if the punter guessed right both the first and second horses 
                stakesOfCorrectBets += Number(bet.stake); //If he did, increase the amount of correct stakes
        });

        poolAfterComission = pools.exacta * (1 - comission); //Takes the comission

        if (stakesOfCorrectBets > 0) //To prevent division by zero
            dividends = (poolAfterComission / stakesOfCorrectBets).toFixed(2); //Split the remaining pool proportionally to stake and round the result to the near $0.01

        var resultString = "Exacta:" + result.first + "," + result.second + ":$" + dividends; //Build and return the result string
        return resultString;
    }
    else
        return false;
}

function getResult() {
    return result;
}

function getPools() {
    return pools;
}

function getDividends() {
    return dividends;
}

function getBetsWin() {
    return betsWin;
}

function getBetsPlace() {
    return betsPlace;
}

function getBetsExacta() {
    return betsExacta;
}

function resetData() {
    betsWin = [],
        betsPlace = [],
        betsExacta = [],
        pools = {
            win: 0,
            place: 0,
            exacta: 0
        }
    result = 0;

    return true;
}

exportFunctions();

function exportFunctions() {
    module.exports.processInputTokens = processInputTokens;
    module.exports.tokenizeLine = tokenizeLine;
    module.exports.registerBet = registerBet;
    module.exports.computeResults = computeResults;
    module.exports.computeWinDividends = computeWinDividends;
    module.exports.computePlaceDividends = computePlaceDividends;
    module.exports.computeExactaDividends = computeExactaDividends;
    module.exports.getResult = getResult;
    module.exports.getPools = getPools;
    module.exports.getDividends = getDividends;
    module.exports.getBetsWin = getBetsWin;
    module.exports.getBetsPlace = getBetsPlace;
    module.exports.getBetsExacta = getBetsExacta;
    module.exports.resetData = resetData;
    module.exports.exportFunctions = exportFunctions;
    return true;
}