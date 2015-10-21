# Betting host

This program calculates de dividends for a simplified form of Tote betting. As requested, you don't need to download anything for this program to work. All the necessary files are included in this repository. Just download and run.

It uses:
* Mocha for testing
* Istanbul for code coverage

Both are included in node_modules folder so no extra downloads are required.


### Steps to run the program

1. Clone the repository `git clone git@github.com:diegogadens/betting-host`

2. Enter the folder `cd betting-host`

3. Run it: (the commands below assume you are in a unix like terminal, linux or macOS)

    You have 2 options to enter data (it reads data from stdin).

     * Option 1 (Easier and faster)
        * Edit the `input.txt` file. It is in the root directory of the application. This file already have an input dataset to run the tests.
        * To run the program with this input use the following command in the root directory of the application
            **ATENTION: If you edit the file, be sure to keep the empty line after the result line (the last data line)**  
        ```
        node index.js < input.txt [Enter]
        ```
        If you use the provided input.txt file, you should see the following result for the dividends:
        ```
        Win:2:$2.61
        Place:2:$1.06
        Place:3:$1.27
        Place:1:$2.13
        Exacta:2,3:$2.43
        ```

    * Option 2: 
        * Run `node index.js [Enter]`, and:
        * Insert lines of data directly in the terminal, followed by an [Enter] after each line
        ```
        user@host$ node index.js [Enter]
        > Bet:W:1:1 [Enter]
        > Bet:W:1:3 [Enter]
        > Bet:W:2:4 [Enter]
        > Bet:W:3:5 [Enter]
        > Bet:P:1:31 [Enter]
        > Bet:P:2:89 [Enter]
        > Bet:P:3:28 [Enter]
        > Bet:P:4:72 [Enter]
        > Bet:E:1,2:13 [Enter]
        > Bet:E:2,3:98 [Enter]
        > Bet:E:1,3:82 [Enter]
        > Result:2:3:1 [Enter]
        
        ```
        When you insert a Result line (always the last one). The program closes de stdin lineReader and calculates the results. For the dataset above, the results are the following:
      
        ```
        Win:2:$2.55
        Place:2:$0.73
        Place:3:$2.30
        Place:1:$2.08
        Exacta:2,3:$1.61
        ```

### Running the tests
This program contains some automated tests. Everything it needs to test itself is included in the repository, to run the automated tests, run the following command:
````
npm test
````
You should see something like that:
````
> bettinghost@1.0.0 test /Users/diegogadens/Projetos/betting-host
> ./node_modules/mocha/bin/mocha test

  Input lines test
    ✓ Should return Bet when a Bet line is passed
    ✓ Should return Result when a Result line is passed
    ✓ Should return false when an incorrect option is passed
    ✓ Should return result object with 3 attributes
    ✓ Should return Bet when a Bet line is passed

  Input line tokenizer
    ✓ Should return array of lenght 4 when a correct formatted line is passed
    ✓ Should return false when an incorrect formated line is passed

  Bet registration
    ✓ Should return Bet of tipe Win when product (index 1) of array is 'W'
    ✓ Should return Bet of tipe Place when product (index 1) of array is 'P'
    ✓ Should return Bet of tipe Exacta when product (index 1) of array is 'E'
    ✓ Should return false when product (index 1) is anything but W, E or P
    ✓ Should return pool object with 3 attributes
    ✓ Should increment pool size of Win when a bet is made on Win product
    ✓ Should increment Win bet array size when a bet is made on Win product
    ✓ Should increment pool size of Place when a bet is made on Place product
    ✓ Should increment Place bet array size when a bet is made on Place product
    ✓ Should increment pool size of Exacta when a bet is made on Exacta product
    ✓ Should increment Exacta bet array size when a bet is made on Exacta product
    ✓ Should reset bets, pools and result

  Result computation
    ✓ Should complete result computation for all three products
    ✓ Should complete result computation for Win product
    ✓ Should complete result computation for Place product
    ✓ Should complete result computation for Exacta product
    ✓ Shoukd return false when trying to compute Win results without entering result line
    ✓ Shoukd return false when trying to compute Place results without entering result line
    ✓ Shoukd return false when trying to compute Exacta results without entering result line
    ✓ Should return correct dividends object

  export functions
    ✓ Should export all functions

  28 passing (19ms)
````

### Running the code coverage tool
This program also contains a code coverage tool. To see it in action, ruin the following command:
```
npm run coverage
```
You should see something like this:
```
=============================================================================
Writing coverage object [/Users/diegogadens/Projetos/betting-host/coverage/coverage.json]
Writing coverage reports at [/Users/diegogadens/Projetos/betting-host/coverage]
=============================================================================

=============================== Coverage summary ===============================
Statements   : 92.74% ( 115/124 )
Branches     : 89.58% ( 43/48 )
Functions    : 100% ( 18/18 )
Lines        : 92.74% ( 115/124 )
================================================================================
```