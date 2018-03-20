CREATE DATABASE bamazon_db;

USE  bamazon_db;

DROP TABLE products;

CREATE TABLE products (
 id INT NOT NULL AUTO_INCREMENT,
 product_name VARCHAR (10) NOT NULL,
 department_name varchar (15) NOT NULL,
 price INT NOT NULL,
 inventory INT NOT NULL,
 PRIMARY KEY (id)
 );
 
INSERT INTO products (product_name, department_name, price, inventory)
VALUES  ('Watch', 'Jewelry', 100, 10),
 		('TV', 'Electronics', 800, 5),
 		('Guitar', 'Music', 1200, 5),
 		('Clock', 'Electronics', 20, 100),
 		('XBox', 'Electronics', 200, 20),
 		('DVD', 'Electronics', 25, 50),
 		('Bike', 'Sports', 500, 10),
 		('Skates', 'Sports', 250, 5),
 		('Helmet', 'Sports', 35, 15),
 		('IPhone', 'Electronics', 700,48);
 		
SELECT * FROM products;