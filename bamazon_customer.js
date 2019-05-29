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
// establish connection with mySQL server
connection.connect(function(err){
    if(err) throw err;
    // display products
    show_products();
    user_propmt();
})

function show_products(){
    connection.query('SELECT * FROM product_list',function(err,res){
        if(err) throw err;
        console.log(res);
    })
}

function user_propmt(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'Please enter the ID of the product you would like to purchase',
            name: 'product_id'
        },
        {
            type: 'input',
            message: 'Please enter the quantity of this product that you would like to purchase',
            name: 'number_purchased'
        }
    ]).then(function(user_input){
        update_db(user_input.product_id,user_input.number_purchased);
    })
}

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
                            product_sales: res[0].product_sales + res[0].price * num_purchased
                        },
                        {
                            id: res[0].id
                        }
                    ],
                    function(err,res){
                        if(err) throw err;
                        console.log(res);
                        show_products();
                        connection.end();
                    }
                )
            }
        }
    )
}