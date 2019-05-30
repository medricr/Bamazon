// require mysql package and inquirer package to direct flow of program
var mysql = require('mysql');
var inquirer = require('inquirer');
// require cli-table package to better present data to the user
var table = require('cli-table');
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
            var product_table = new table({
                head: ['ID','Product','Department','Price','Current Stock']
            });
            for(item in res){
                product_table.push(
                    [res[item].id, res[item].product_name,res[item].department_name,res[item].price,res[item].stock_quantity]
                )
            }
            console.log(product_table.toString());
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
    console.clear();
    connection.query(
        'SELECT * FROM product_list',function(err,res){
            if(err) throw err;
            console.log(res);
            var product_array = [];
            for(item in res){
                product_array.push(res[item].product_name)
            }
            inquirer.prompt([
                {
                    // type: 'input',
                    // message: "which item's stock would you like to increase?",
                    // name: 'chosen_item'
                    type: 'list',
                    message: "Which item's inventory would you like to increase?",
                    choices: product_array,
                    // choices: [1,2,3,4,5,6,7,8,9,10],
                    name: 'chosen_item'
                },
                {
                    type: 'input',
                    message: 'How many more units would you like to order?',
                    name: 'increase_number'
                }
            ]).then(function(input){
                var current_num = 0;// res[input.chosen_item-1].stock_quantity += parseInt(input.increase_number,10);
                for(let i = 0; i < product_array.length; i++){
                    if(input.chosen_item == product_array[i]){
                        current_num = res[i].stock_quantity += parseInt(input.increase_number,10);
                    }
                }
                console.log()
                connection.query(
                    'UPDATE product_list SET ? WHERE ?',
                    [
                        {
                            stock_quantity: current_num
                        },
                        {
                            product_name: input.chosen_item
                        },
                    ],
                    function(err,res){
                        if(err) throw err;
                        console.log(res);
                        show_items();

                    }
                )
            })
        }
    )
    
}
// function to add a new product to the inventory
function add_item(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'What new product would you like to add to the inventory?',
            name: 'new_name'
        },
        {
            type: 'input',
            message: 'Which department will this item be filed under?',
            name: 'new_dept'
        },
        {
            type: 'input',
            message: "What is the cost-per-unit of this new item?",
            name: "new_price"
        },
        {
            type: 'input',
            message: 'How many of this item will we initially have in stock?',
            name: 'new_count'
        }
    ]).then(function(new_input){
        connection.query(
            'INSERT INTO product_list SET ?',
            {
                product_name: new_input.new_name,
                department_name: new_input.new_dept,
                price: new_input.new_price,
                stock_quantity: new_input.new_count

            },
            function(err,res){
                if(err) throw err;
                show_items();
            }
            // show_items()
        )
    })
}