var mysql = require('mysql');
var inquirer = require('inquirer');

// Setup connection to SQL server
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

// Require NPM packages
var mysql = require('mysql');
var inquirer = require('inquirer');

// Setup connection to SQL server
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bamazon_db'
});

// Items in counter
var counter = 0;
var cartItems

// Connect to DB
connection.connect(function(err) {
    // Throw error if it errors
    if (err) throw err;
    // New promise that selects all data from the table
    new Promise(function(resolve, reject) {
        connection.query('SELECT * FROM products', function(err, res) {
            if (err) reject(err);
            resolve(res);
            console.log(' ')
            console.log('         Welcome to          ')
            console.log('! ! ! ! B A M A Z O N ! ! ! !')
            console.log(' ')
        });
        // Console log each item and increment the number of products
    }).then(function(result) {
        result.forEach(function(item) {
            counter++;
            console.log('Item ID:   ' + item.item_id + '    ||  Product Name:   ' + item.product_name + '   ||  Price: ' + item.price + '   ||  Inventory:  ' + item.inventory);
        });
        // Enter the store
    }).then(function() {
        return enterStore();
        // catch errors
    }).catch(function(err) {
        console.log(err);
    });
});

// Function to enter the store
function enterStore() {
    console.log(' ');
    inquirer.prompt([{
        name: 'entrance',
        message: 'What would you like to do?',
        type: 'list',
        choices: ['Shop Bamazon', 'Leave Bamazon',]
    }]).then(function(answer) {
        // Go to the customer shopping menu if Yes
        if (answer.entrance === 'Shop Bamazon') {
            menu();
        } else {
            // Exist CLI if No
            console.log('Thanks for coming to BAMAZON! See you next time!');
            connection.destroy();
            return;
        }
    });
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function for the menu options for the customer
function menu() {
    return inquirer.prompt([{
        name: 'item',
        message: 'Enter the "Item ID" of the product you want to buy.',
        type: 'input',
        // Validator to ensure the product number is a number and it exists
        validate: function(value) {
            if ((isNaN(value) === false) && (value <= counter)) {
                return true;
            } else {
                console.log('\nPlease enter a valid ID.');
                return false;
            }
        }
    }, {
        name: 'quantity',
        message: 'How many would you like to buy?',
        type: 'input',
        // Validator to ensure it is number
        validate: function(value) {
            if (isNaN(value) === false) {
                return true;
            } else {
                console.log('\nPlease enter a valid quantity.');
                return false;
            }
        }
        // new promise to pull all data from SQL
    }]).then(function(answer) {
        return new Promise(function(resolve, reject) {
            connection.query('SELECT * FROM products WHERE ?', { item_id: answer.item }, function(err, res) {
                if (err) reject(err);
                resolve(res);
            });
            // Then if selected quanitity is valid, save to a local object, else console log error
        }).then(function(result) {
            var savedData = {};

            if (parseInt(answer.quantity) <= parseInt(result[0].inventory)) {
                savedData.answer = answer;
                savedData.result = result;
            } else if (parseInt(answer.quantity) > parseInt(result[0].inventory)) {
                console.log('Sorry, not enough inventory!');
            } else {
                console.log('An error occurred, exiting Bamazon, your order is not complete.');
            }
            
            return savedData;
            // Update the SQL DB and console log messages for completion.
        }).then(function(savedData) {
            if (savedData.answer) {
                var updatedQuantity = parseInt(savedData.result[0].inventory) - parseInt(savedData.answer.quantity);
                var itemId = savedData.answer.item;
                var total = parseInt(savedData.result[0].price) * parseInt(savedData.answer.quantity);
                connection.query('UPDATE products SET ? WHERE ?', [{
                    inventory: updatedQuantity
                }, {
                    item_id: itemId
                }], function(err, res) {
                    if (err) throw err;
                    console.log('Your order total is $' + total + '. Thank you for shopping with Bamazon!');
                    enterStore();
                });
            } else {
                // Recursion to re-enter store
                enterStore();
            }
            // catch errors
        }).catch(function(err) {
            console.log(err);
            connection.destroy();
        });
        // catch errors
    }).catch(function(err) {
        console.log(err);
        connection.destroy();
    });
}

