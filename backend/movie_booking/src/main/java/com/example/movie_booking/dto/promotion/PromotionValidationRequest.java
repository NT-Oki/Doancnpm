package com.example.movie_booking.dto.promotion;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionValidationRequest {
    private String code;
    private BigDecimal orderAmount;
}
