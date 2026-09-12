-- Авторские учебные данные. Выполнять только в новой пустой учебной базе.
-- Не содержит запроса-решения. Для повторного запуска создайте другую пустую базу.
CREATE TABLE products (id INTEGER PRIMARY KEY, name VARCHAR(160) NOT NULL);
CREATE TABLE materials (id INTEGER PRIMARY KEY, name VARCHAR(160) NOT NULL, price DECIMAL(12,2) NOT NULL);
CREATE TABLE recipes (product_id INTEGER NOT NULL REFERENCES products(id), material_id INTEGER NOT NULL REFERENCES materials(id), norm DECIMAL(12,4) NOT NULL, PRIMARY KEY (product_id, material_id));
CREATE TABLE order_items (order_id INTEGER NOT NULL, product_id INTEGER NOT NULL REFERENCES products(id), quantity INTEGER NOT NULL, PRIMARY KEY (order_id, product_id));

INSERT INTO products (id, name) VALUES
(1, 'Настенная полка'),
(2, 'Декоративная панель');

INSERT INTO materials (id, name, price) VALUES
(1, 'Щит, м²', 1200),
(2, 'Кронштейн, шт.', 180),
(3, 'Масло, л', 1600);

INSERT INTO recipes (product_id, material_id, norm) VALUES
(1, 1, 0.6),
(1, 2, 2),
(2, 1, 1.2),
(2, 3, 0.15);

INSERT INTO order_items (order_id, product_id, quantity) VALUES
(1001, 1, 3),
(1001, 2, 2),
(1002, 1, 1);
