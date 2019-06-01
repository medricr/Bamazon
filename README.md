# Bamazon
A basic inventory management application using SQL

## Description
The app is made up of three files

  * bamazon_customer.js
  * bamazon_manager.js
  * bamazon_supervisor.js
  
Each of which handles a different aspect of inventory management.
 
#### Customer Side
bamazon_customer.js treats the user like a customer, allowing them to select a product based on ID, and purchase a number of that product up to the amount that is in stock. If the user tries to make a purchase larger than the inventory can accomodate, they will be informed that their order cannot be filled, and the program will terminate. Alternitavely, the user can view the current inventory. 

#### Manager Side
bamazon_manager.js treats the user like a manager, allowing them to view inventory, restock current items in the inventory, view which items have a stock lower than 5, and create an entirely new item to add to the inventory. When a new item is created by the manager, they are prompted for an item name, department, price, and current stock, all of which are inserted into a SQL database.

#### Supervisor Side
bamazon_supervisor.js treats the user like a supervisor, allowing them to view sales by department, or create a new department. 

   * When viewing sales, the program takes all departments in the database, and left joins them with items that share those departments.        Then, it takes the total sales from that department, and subtracts the overhead cost of department maintenance from them, producing a      net sales figure.
   
   * when creating a department, the user is prompted to enter the new departments name, as well as the overhead cost of maintaing that department. Then, they can choose to create a new item for that department, using the same item creation function from bamazon_manager.js, or, a placeholder item with a generic name & arbitraty attributes will be inserted into the product list. This last step (populating the new department with an item) helps to prevent run-time errors, as the program will not be attempting to display and preform calculations with null values. 

