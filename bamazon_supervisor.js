// require mysql package and inquirer package to direct flow of program
var mysql = require('mysql');
var inquirer = require('inquirer');
// require cli table package to better present information to the user
var table = require('cli-table');
// initialize server connection
// import {add_item} from './bamazon_manager.js';
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'bamazon' 
});
connection.connect(function(err){
    if(err) throw err;
    // console.log('supervisor connection test');
    supervisor_prompt();
    // connection.end();
})
// funciton to prompt supervisor functions
function supervisor_prompt(){
    inquirer.prompt([
        {
            type: 'list',
            message: 'Which action would you like to preform?',
            choices: ['View Product Sales by Department','Create a new Department'],
            name: 'supervisor_choice'
        }
    ]).then(function(supervisor_input){
        console.log(supervisor_input.supervisor_choice);
        switch(supervisor_input.supervisor_choice){
            case 'View Product Sales by Department':
                view_sales();
                break;
            case 'Create a new Department':
                create_dept();
                break;
            default:
                break;
        }
    })
}

// A function which allows the user to see the sales by department where sold items 
function view_sales(){
    connection.query(
        // the following query selects all existing departments, as well as the products in them, and links them together by department name
        'SELECT department_list.id,department_list.dept_name,department_list.overhead_costs,SUM(product_list.product_sales) AS sales, COUNT(product_list.id) FROM department_list LEFT JOIN product_list ON department_list.dept_name = product_list.department_name GROUP BY dept_name',
        function(err,res){
            if(err) throw err;
            var sales_table = new table({
                head: ['ID','Department Name','Overhead Costs','Product Sales','Total Profit']
            });
            for(let i = 0; i < res.length; i++){
                var profits = (res[i].sales - res[i].overhead_costs);
                sales_table.push(
                    [res[i].id,res[i].dept_name,res[i].overhead_costs,res[i].sales,profits]
                )
            }
            console.log(sales_table.toString());
            connection.end();
        }
    )
}
// allows the user to create a department
function create_dept(){
    inquirer.prompt([
        {
            type: 'input',
            message: 'What would you like to name the new department?',
            name: 'dept_name'
        },
        {
            type: 'input',
            message: 'What is the overhead cost of maintaining this department?',
            name: 'o_costs'
        },
        {
            type: 'confirm',
            message: 'Would you like to add a product to this new deparment? (if you elect not to, a placeholder product will be created...)',
            name: 'new_item'

        }
    ]).then(function(input){ 
        connection.query(
            'INSERT INTO department_list SET ?',
            {
                dept_name: input.dept_name,
                overhead_costs: input.o_costs
            },
            function(err,res){
                if(err) throw err;
                console.log(res);
                if(input.new_item){add_item(input.dept_name);}
                else{add_default(input.dept_name);}
            }
        )
    })
}

function add_item(new_dept){
    inquirer.prompt([
        {
            type: 'input',
            message: 'What new product would you like to add to the inventory?',
            name: 'new_name'
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
                department_name: new_dept,
                price: new_input.new_price,
                stock_quantity: new_input.new_count,
                product_sales: 0

            },
            function(err,res){
                if(err) throw err;
                // show_items();
                connection.end();
            }
        )
    })
}

function add_default(new_dept){
        connection.query(
            'INSERT INTO product_list SET ?',
            {
                product_name: 'Product',
                department_name: new_dept,
                price: 1,
                stock_quantity: 1,
                product_sales: 0

            },
            function(err,res){
                if(err) throw err;
                // show_items();
                connection.end();
            }
        )
    }
