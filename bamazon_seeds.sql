-- delete database if it already exists to prevent doubling up on products
DROP DATABASE IF EXISTS bamazon;
-- create fresh database
CREATE DATABASE bamazon;
-- using the new database...
USE bamazon; 
-- create table with columns for product id, name, department, price, and stock
CREATE TABLE product_list(
    id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NULL,
    department_name VARCHAR(30) NULL,
    price INTEGER(255) NULL,
    stock_quantity INTEGER(255) NULL,
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

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'