package com.example.movie_booking.service;

import com.example.movie_booking.dto.promotion.PromotionValidationResult;
import com.example.movie_booking.model.Promotion;
import com.example.movie_booking.repository.IPromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Optional;

@Service
public class PromotionService {

    @Autowired
    private IPromotionRepository promotionRepository;

    public PromotionValidationResult validatePromotion(String code, BigDecimal orderAmount) {
        if (code == null || code.trim().isEmpty()) {
            return PromotionValidationResult.invalid("Mã khuyến mãi không được để trống");
        }

        Optional<Promotion> promotionOpt = promotionRepository.findValidPromotionByCode(code.trim().toUpperCase());

        if (promotionOpt.isEmpty()) {
            return PromotionValidationResult.invalid("Mã khuyến mãi không hợp lệ hoặc đã hết hạn");
        }

        Promotion promotion = promotionOpt.get();

        // Check minimum order amount
        if (promotion.getMinOrderAmount() != null &&
                orderAmount.compareTo(promotion.getMinOrderAmount()) < 0) {
            return PromotionValidationResult.invalid(
                    String.format("Đơn hàng tối thiểu %s để áp dụng mã này",
                            formatMoney(promotion.getMinOrderAmount())));
        }

        BigDecimal discountAmount = calculateDiscount(promotion, orderAmount);
        BigDecimal finalAmount = orderAmount.subtract(discountAmount);

        // Ensure final amount is not negative
        if (finalAmount.compareTo(BigDecimal.ZERO) < 0) {
            finalAmount = BigDecimal.ZERO;
            discountAmount = orderAmount;
        }

        return PromotionValidationResult.valid(promotion, discountAmount, finalAmount);
    }

    private BigDecimal calculateDiscount(Promotion promotion, BigDecimal orderAmount) {
        BigDecimal discount;

        if (promotion.getDiscountType() == Promotion.DiscountType.PERCENTAGE) {
            discount = orderAmount.multiply(promotion.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discount = promotion.getDiscountValue();
        }

        // Apply maximum discount limit if set
        if (promotion.getMaxDiscountAmount() != null &&
                discount.compareTo(promotion.getMaxDiscountAmount()) > 0) {
            discount = promotion.getMaxDiscountAmount();
        }

        // Ensure discount doesn't exceed order amount
        if (discount.compareTo(orderAmount) > 0) {
            discount = orderAmount;
        }

        return discount;
    }

    public void incrementUsageCount(Promotion promotion) {
        if (promotion.getUsageLimit() != null) {
            promotion.setUsedCount(promotion.getUsedCount() + 1);
            promotionRepository.save(promotion);
        }
    }

    private String formatMoney(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(amount);
    }
}
