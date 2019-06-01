// require mysql package and inquirer package to direct flow of program
var mysql = require('mysql');
var inquirer = require('inquirer');
// require cli-table to represent data to user more effectively
var table = require('cli-table');
// initialize server connection
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon' 
});
// establish connection with mySQL server
connection.connect(function(err){
    if(err) throw err;
    // display products
    show_products();
})

function show_products(){
    connection.query('SELECT * FROM product_list',function(err,res){
        if(err) throw err;
        // create blank cli table
        var product_table = new table({
            head: ['ID','Product','Department','Price','Current Stock']
        });
        // populate cli table with its respective entries
        for(item in res){
            product_table.push(
                [res[item].id, res[item].product_name,res[item].department_name,res[item].price,res[item].stock_quantity]
            )
        }
        // show user the cli table
        console.log(product_table.toString());
        // prompt the user with the two possible actions
        user_propmt();
    })
}

function user_propmt(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the ID of the product you would like to purchase',
            name: 'product_id',
            validate: function(value){
                if(isNaN(value) || value % 1 != 0){
                    console.log('\nPlease enter a valid ID....\n');
                }
            }
        },
        {
            type: 'input',
            message: 'Please enter the quantity of this product that you would like to purchase',
            name: 'number_purchased',
            validate: function(value){
                if(isNaN(value) || value % 1 != 0){
                    console.log('\nPlease enter an integer....\n');
                }
            }
        }
    ]).then(function(user_input){
        update_db(user_input.product_id,user_input.number_purchased);
    })
}
// update database to reflect the items purchased by the user
function update_db(product_id,num_purchased){
    connection.query(
        'SELECT * FROM product_list WHERE ?',
        {
            id: product_id
        },
        function(err,res){
            if(err) throw err;
            if(res[0].stock_quantity < num_purchased){
                console.log("Insufficient quantity of requested item...")
            }else{
                // display the total cost of the purchase to the user & update the product stock
                var updated_quantity = res[0].stock_quantity - num_purchased;
                console.log("-----Total Order Cost-----\n");
                console.log("  " + res[0].product_name);
                console.log("X " + res[0].price);
                console.log("--------------------------");
                console.log("= " + res[0].price * num_purchased);
                connection.query(
                    'UPDATE product_list SET ? WHERE ?',
                    [
                        {
                            stock_quantity: updated_quantity,
                            product_sales: res[0].product_sales + (res[0].price * num_purchased)
                        },
                        {
                            id: res[0].id
                        }
                    ],
                    function(err){
                        if(err) throw err;
                        connection.end();
                    }
                )
            }
        }
    )
}