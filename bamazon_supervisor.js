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
        'SELECT department_list.id,department_list.dept_name,department_list.overhead_costs,product_list.product_sales FROM department_list INNER JOIN product_list ON department_list.dept_name = product_list.department_name GROUP BY department_name',
        function(err,res){
            if(err) throw err;
            console.log(res);
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