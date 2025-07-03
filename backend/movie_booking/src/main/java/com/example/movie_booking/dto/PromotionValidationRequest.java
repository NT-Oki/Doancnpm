package com.example.movie_booking.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PromotionValidationRequest {
    private String code;
    private BigDecimal orderAmount;
}
