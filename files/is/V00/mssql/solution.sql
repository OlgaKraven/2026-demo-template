SELECT oi.order_id,
       ROUND(SUM(oi.quantity * r.norm * m.price), 2) AS total_cost
FROM order_items AS oi
JOIN recipes AS r ON r.product_id = oi.product_id
JOIN materials AS m ON m.id = r.material_id
GROUP BY oi.order_id
ORDER BY oi.order_id;
