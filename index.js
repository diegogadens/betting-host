var bettinghost = require("./bettinghost"),
	readline = require('readline'),
	lineReader = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false
	}); //An interface to read data from stdin

lineReader.on('line', function(line){

	//For each line, tokenize it splitting by a collon (:) character
	var tokens = bettinghost.tokenizeLine(line);

	/*
	If the generated tokens are from a Result line, closes the lineReader,
	compute the results and then get and print the dividends for the bets made
	*/
	if(bettinghost.processInputTokens(tokens) === "Result"){ //Process the input line, it can be a Bet or a Result line.
		lineReader.close(); //Closes the stdin reader
		bettinghost.computeResults(); //Compute the results
		var dividends = bettinghost.getDividends(); //Get the results (aka the dividends)
		console.log(dividends.win); //Print the dividends for the Win product
		console.log(dividends.place); //Print the dividends for the Place product
		console.log(dividends.exacta); //Print the dividends for the Exacta product
	}

});