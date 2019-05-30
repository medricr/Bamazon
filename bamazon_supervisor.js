// require mysql package and inquirer package to direct flow of program
var mysql = require('mysql');
var inquirer = require('inquirer');
// require cli table package to better present information to the user
var table = require('cli-table');
// initialize server connection
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
                // console.log('product view test');
                view_sales();
                break;
            case 'Create a new Department':
                console.log('department create test');
                create_dept();
                break;
            default:
                break;
        }
    })
}

function view_sales(){
    connection.query(
        // 'SELECT * FROM department_list',
        // function(err,res){
        //     if(err) throw err;
        //     console.log(res);
        //     connection.end();
        // }
        'SELECT department_list.id,department_list.dept_name,department_list.overhead_costs,SUM(product_list.product_sales) AS sales, COUNT(product_list.id) FROM department_list INNER JOIN product_list ON department_list.dept_name = product_list.department_name GROUP BY department_name',
        // 'SELECT * FROM department_list',
        function(err,res){
            if(err) throw err;
            var sales_table = new table({
                head: ['ID','Department Name','Overhead Costs','Product Sales','Total Profit']
                // colWidths: 100
            });
            for(let i = 0; i < res.length; i++){
                var profits = (res[i].sales - res[i].overhead_costs);
                sales_table.push(
                    [res[i].id,res[i].dept_name,res[i].overhead_costs]//,res[i].sales,profits]
                )
            }
            console.log(sales_table.toString());
            connection.end();
        }
    )
}

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
                connection.end();
            }
        )
    })
}