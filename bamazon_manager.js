// require mysql package and inquirer package to direct flow of program
var mysql = require('mysql');
var inquirer = require('inquirer');
// initialize server connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon' 
});
// main function to run the manager program
connection.connect(function(err){
    if(err) throw err;
    console.log("manager test fire");
    // connection.end();
    manager_prompt();
})
// main prompt function
function manager_prompt(){
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which action would you like to preform?',
            choices: ['View Products for Sale','View Low Inventory','Add to Inventory','Add New Product'],
            name: 'manager_input'
        }
    ]).then(function(user_input){
        switch(user_input.manager_input){
            case 'View Products for Sale':
                show_items();
                break;
            case 'View Low Inventory':
                show_low();
                break;
            case 'Add to Inventory':
                add_inventory(); //TODO
                break;
            case 'Add New Product':
                add_item();
                break;
            default:
                connection.end();
                break;
        }

    })
}
// function to show inventory
function show_items(){
    connection.query(
        'SELECT * FROM product_list',function(err,res){
            if(err) throw err;
            console.log(res);
            connection.end();
        }
    )
}
// function to show all items of which there are 5 or less
function show_low(){
    connection.query(
        'SELECT * FROM product_list WHERE stock_quantity<= 5',function(err,res){
            if(err) throw err;
            console.log(res);
            connection.end();
        }
    )
}
// function to add a number to any inventory item
function add_inventory(){
    // some code
}
// function to add a new product to the inventory
function add_item(){
    // some code
}