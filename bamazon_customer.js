// require mysql package and inquirer package to direct flow of program
var mysql = require('mysql');
var inquirer = require('inquirer');
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
    show_products();
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
        connection.query(
            'SELECT * FROM product_list WHERE ?',
            {
                id: user_input.product_id
            },
            function(err,res){
                if(err) throw err;
                console.log(res);
            }
        )
    })
})

function show_products(){
    connection.query('SELECT * FROM product_list',function(err,res){
        if(err) throw err;
        console.log(res);
    })
}