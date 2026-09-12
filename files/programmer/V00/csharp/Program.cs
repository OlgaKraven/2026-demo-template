using System.Globalization;

static decimal PriceAfterDiscount(decimal price, int discount)
{
    if (price < 0 || discount < 0 || discount > 100)
        throw new ArgumentOutOfRangeException();
    return decimal.Round(price * (100m - discount) / 100m, 2, MidpointRounding.AwayFromZero);
}
var rows = new (string Id, decimal Price, int Discount, int Stock)[] {
    ("T1", 1999.00m, 15, 4),
    ("T2", 1250.00m, 20, 7),
    ("T3", 4000.00m, 0, 0),
    ("T4", 640.00m, 25, 2)
};
foreach (var r in rows)
    Console.WriteLine($"{r.Id} {PriceAfterDiscount(r.Price, r.Discount).ToString("F2", CultureInfo.InvariantCulture)} {r.Discount > 15} {r.Stock == 0}");
