package com.example.movie_booking.dto;

import com.example.movie_booking.model.Promotion;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class PromotionValidationResponse {
    private boolean valid;
    private PromotionInfo promotion;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String message;

    @Data
    public static class PromotionInfo {
        private Long id;
        private String code;
        private String name;
        private Promotion.DiscountType discountType;
        private BigDecimal discountValue;

        public static PromotionInfo fromEntity(Promotion promotion) {
            PromotionInfo info = new PromotionInfo();
            info.setId(promotion.getId());
            info.setCode(promotion.getCode());
            info.setName(promotion.getName());
            info.setDiscountType(promotion.getDiscountType());
            info.setDiscountValue(promotion.getDiscountValue());
            return info;
        }
    }

    public static PromotionValidationResponse success(Promotion promotion, BigDecimal orderAmount) {
        PromotionValidationResponse response = new PromotionValidationResponse();
        response.setValid(true);
        response.setPromotion(PromotionInfo.fromEntity(promotion));
        
        BigDecimal discountAmount = promotion.calculateDiscount(orderAmount);
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(orderAmount.subtract(discountAmount));
        response.setMessage("Áp dụng mã khuyến mãi thành công");
        
        return response;
    }

    public static PromotionValidationResponse error(String message) {
        PromotionValidationResponse response = new PromotionValidationResponse();
        response.setValid(false);
        response.setMessage(message);
        return response;
    }
}
