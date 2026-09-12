from decimal import Decimal, ROUND_HALF_UP

def price_after_discount(price: str, discount: int) -> Decimal:
    p = Decimal(price)
    if not p.is_finite() or p < 0 or not 0 <= discount <= 100:
        raise ValueError("Недопустимые цена или скидка")
    return (p * (100 - discount) / 100).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

rows = [["T1","1999.00",15,4],["T2","1250.00",20,7],["T3","4000.00",0,0],["T4","640.00",25,2]]
if __name__ == "__main__":
    for item_id, price, discount, stock in rows:
        print(item_id, price_after_discount(price, discount), discount > 15, stock == 0)
