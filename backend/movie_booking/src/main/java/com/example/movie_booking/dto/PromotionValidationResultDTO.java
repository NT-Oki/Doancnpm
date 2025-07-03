package com.example.movie_booking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationResultDTO {
    private boolean valid;
    private PromotionDTO promotion;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String message;

    public static PromotionValidationResultDTO success(PromotionDTO promotion, BigDecimal discountAmount, BigDecimal finalAmount) {
        return new PromotionValidationResultDTO(true, promotion, discountAmount, finalAmount, "Mã khuyến mãi hợp lệ");
    }

    public static PromotionValidationResultDTO error(String message) {
        return new PromotionValidationResultDTO(false, null, null, null, message);
    }
}
