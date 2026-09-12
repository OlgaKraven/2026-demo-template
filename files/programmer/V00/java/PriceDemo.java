import java.math.BigDecimal;
import java.math.RoundingMode;

public class PriceDemo {
    static BigDecimal priceAfterDiscount(String price, int discount) {
        BigDecimal p = new BigDecimal(price);
        if (p.signum() < 0 || discount < 0 || discount > 100)
            throw new IllegalArgumentException("Недопустимые цена или скидка");
        return p.multiply(BigDecimal.valueOf(100 - discount))
                .divide(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP);
    }
    public static void main(String[] args) {
        String[] ids = {"T1", "T2", "T3", "T4"};
        String[] prices = {"1999.00", "1250.00", "4000.00", "640.00"};
        int[] discounts = {15, 20, 0, 25};
        int[] stocks = {4, 7, 0, 2};
        for (int i = 0; i < ids.length; i++)
            System.out.println(ids[i] + " " + priceAfterDiscount(prices[i], discounts[i]) + " " + (discounts[i] > 15) + " " + (stocks[i] == 0));
    }
}
