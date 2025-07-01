package com.example.movie_booking.dto;

import com.example.movie_booking.model.Promotion;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDTO {
    private Long id;
    private String code;
    private String name;
    private String description;
    private Promotion.DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderAmount;
    private BigDecimal maxDiscountAmount;
    private Integer usageLimit;
    private Integer usedCount;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Boolean isActive;
    private Boolean isDeleted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PromotionDTO fromEntity(Promotion promotion) {
        return new PromotionDTO(
            promotion.getId(),
            promotion.getCode(),
            promotion.getName(),
            promotion.getDescription(),
            promotion.getDiscountType(),
            promotion.getDiscountValue(),
            promotion.getMinOrderAmount(),
            promotion.getMaxDiscountAmount(),
            promotion.getUsageLimit(),
            promotion.getUsedCount(),
            promotion.getStartDate(),
            promotion.getEndDate(),
            promotion.getIsActive(),
            promotion.getIsDeleted(),
            promotion.getCreatedAt(),
            promotion.getUpdatedAt()
        );
    }
}
