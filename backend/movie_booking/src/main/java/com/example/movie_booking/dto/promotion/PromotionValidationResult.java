package com.example.movie_booking.dto.promotion;

import com.example.movie_booking.model.Promotion;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationResult {
    private boolean valid;
    private Promotion promotion;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String errorMessage;

    public static PromotionValidationResult valid(Promotion promotion, BigDecimal discountAmount,
            BigDecimal finalAmount) {
        return new PromotionValidationResult(true, promotion, discountAmount, finalAmount, null);
    }

    public static PromotionValidationResult invalid(String errorMessage) {
        return new PromotionValidationResult(false, null, null, null, errorMessage);
    }
}
