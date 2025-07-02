package com.example.movie_booking.controller;

import com.example.movie_booking.dto.promotion.PromotionValidationRequest;
import com.example.movie_booking.dto.promotion.PromotionValidationResult;
import com.example.movie_booking.service.PromotionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/promotion")
@CrossOrigin(origins = "http://localhost:5173")
public class PromotionController {

    @Autowired
    private PromotionService promotionService;

   
    // ===== PUBLIC ENDPOINTS =====
    
    /**
     * Validate promotion for booking (Public)
     */
    @PostMapping("/validate")
    public ResponseEntity<?> validatePromotion(@RequestBody PromotionValidationRequest request,
            Locale locale) {
        try {
            PromotionValidationResult result = promotionService.validatePromotion(
                    request.getCode(), request.getOrderAmount());

            Map<String, Object> response = new HashMap<>();
            response.put("valid", result.isValid());

            if (result.isValid()) {
                Map<String, Object> promotionData = new HashMap<>();
                promotionData.put("id", result.getPromotion().getId());
                promotionData.put("code", result.getPromotion().getCode());
                promotionData.put("name", result.getPromotion().getName());
                promotionData.put("discountType", result.getPromotion().getDiscountType());
                promotionData.put("discountValue", result.getPromotion().getDiscountValue());

                response.put("promotion", promotionData);
                response.put("discountAmount", result.getDiscountAmount().intValue());
                response.put("finalAmount", result.getFinalAmount().intValue());
                response.put("message", "Áp dụng mã khuyến mãi thành công");
            } else {
                response.put("message", result.getErrorMessage());
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("valid", false);
            errorResponse.put("message", "Có lỗi xảy ra khi kiểm tra mã khuyến mãi");
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
