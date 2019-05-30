-- delete database if it already exists to prevent doubling up on products
DROP DATABASE IF EXISTS bamazon;
-- create fresh database
CREATE DATABASE bamazon;
-- using the new database...
USE bamazon; 
-- create table with columns for product id, name, department, price, and stock
CREATE TABLE product_list(
    id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NOT NULL DEFAULT 'Item',
    department_name VARCHAR(30) NOT NULL DEFAULT 'Department',
    price INTEGER(255) NOT NULL DEFAULT '1',
    stock_quantity INTEGER(255) NOT NULL DEFAULT '1',
    product_sales INTEGER(255) NOT NULL DEFAULT '0',
    PRIMARY KEY (id)
);
-- populate product_list with some mock products
INSERT INTO product_list (`product_name`,`department_name`,`price`,`stock_quantity`)
VALUES
('Athletic Socks','Clothing',15,100),
('Acoustic Guitar','Recreation',150,20),
('Micro USB Charger','Technology',30,150),
('Physics Textbook','Education',300,10),
('Scythe (Board Game)','Recreation',70,30),
('Betrayal at House on the Hill','Recreation',50,30),
('Levis 502 Jeans','Clothing',50,100),
('Calculus Flash Cards','Education',25,30),
('Tarot Cards','Recreation',25,40),
('Ipad Stylus','Technology',50,100);
-- create table with columns for department id, name, and overhead costs
CREATE TABLE department_list(
    id INTEGER NOT NULL AUTO_INCREMENT,
    dept_name VARCHAR(30) NULL,
    overhead_costs INTEGER(255) NULL,
    PRIMARY KEY (id)
);
-- populate department_list with some mock variables
INSERT INTO department_list (`dept_name`,`overhead_costs`)
VALUES
('Clothing',1500),
('Technology',3000),
('Recreation',1250),
('Education',5400);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'