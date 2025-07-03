package com.example.movie_booking.service;

import com.example.movie_booking.dto.promotion.PromotionValidationResult;
import com.example.movie_booking.dto.*;
import com.example.movie_booking.model.Promotion;
import com.example.movie_booking.repository.PromotionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PromotionService {

    @Autowired
    private PromotionRepository promotionRepository;

    /**
     * Validate promotion for booking
     */
    public PromotionValidationResult validatePromotion(String code, BigDecimal orderAmount) {
        if (code == null || code.trim().isEmpty()) {
            return PromotionValidationResult.invalid("Mã khuyến mãi không được để trống");
        }

        Optional<Promotion> promotionOpt = promotionRepository.findValidPromotionByCode(
                code.trim().toUpperCase(), LocalDateTime.now());

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

    /**
     * Calculate discount amount
     */
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

    /**
     * Increment usage count when promotion is applied
     */
    @Transactional
    public void incrementUsageCount(Promotion promotion) {
        if (promotion.getUsageLimit() != null) {
            promotion.setUsedCount(promotion.getUsedCount() + 1);
            promotionRepository.save(promotion);
        }
    }

    // ...existing code...
    public Page<PromotionDTO> getAllPromotions(boolean showDeletedOnly, Pageable pageable) {
        try {
            System.out.println("=== PromotionService.getAllPromotions ===");
            System.out.println("showDeletedOnly: " + showDeletedOnly);

            Page<Promotion> promotions;

            if (showDeletedOnly) {
                // CHỈ lấy khuyến mãi đã xóa
                promotions = promotionRepository.findDeletedPromotionsOnly(pageable);
                System.out.println("Using findDeletedPromotionsOnly - showing ONLY deleted promotions");
            } else {
                // CHỈ lấy khuyến mãi chưa bị xóa
                promotions = promotionRepository.findActivePromotionsForAdmin(pageable);
                System.out.println("Using findActivePromotionsForAdmin - showing ONLY not-deleted promotions");
            }

            System.out.println("Found " + promotions.getContent().size() + " promotions");
            System.out.println("Total elements: " + promotions.getTotalElements());

            // Log chi tiết để debug
            promotions.getContent().forEach(p -> {
                System.out.println("Promotion: " + p.getCode() +
                        ", isDeleted: " + p.getIsDeleted() +
                        ", isActive: " + p.getIsActive() +
                        ", createdAt: " + p.getCreatedAt());
            });

            return promotions.map(PromotionDTO::fromEntity);
        } catch (Exception e) {
            e.printStackTrace();
            System.err.println("Error in getAllPromotions: " + e.getMessage());
            throw new RuntimeException("Lỗi khi lấy danh sách khuyến mãi: " + e.getMessage());
        }
    }

    public List<PromotionDTO> getActivePromotions() {
        List<Promotion> activePromotions = promotionRepository.findActivePromotions(LocalDateTime.now());
        return activePromotions.stream()
                .map(PromotionDTO::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get promotion by ID
     */
    public Optional<PromotionDTO> getPromotionById(Long id) {
        return promotionRepository.findById(id)
                .map(PromotionDTO::fromEntity);
    }

    /**
     * Create new promotion
     */
    @Transactional
    public PromotionDTO createPromotion(PromotionRequestDTO requestDTO) {
        // Validate business rules
        validatePromotionRequest(requestDTO);

        // Check if code already exists
        if (promotionRepository.existsByCodeAndIsDeletedFalse(requestDTO.getCode().toUpperCase())) {
            throw new RuntimeException("Mã khuyến mãi đã tồn tại: " + requestDTO.getCode());
        }

        // Validate dates
        if (requestDTO.getStartDate().isAfter(requestDTO.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // Validate discount value for percentage type
        if (requestDTO.getDiscountType() == Promotion.DiscountType.PERCENTAGE
                && requestDTO.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("Phần trăm giảm giá không được vượt quá 100%");
        }

        Promotion promotion = requestDTO.toEntity();
        promotion = promotionRepository.save(promotion);

        return PromotionDTO.fromEntity(promotion);
    }

    /**
     * Update promotion
     */
    @Transactional
    public PromotionDTO updatePromotion(Long id, PromotionRequestDTO requestDTO) {
        Promotion existingPromotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi với ID: " + id));

        // Validate business rules
        validatePromotionRequest(requestDTO);

        // Check if code already exists (excluding current promotion)
        if (promotionRepository.existsByCodeAndIdNot(requestDTO.getCode().toUpperCase(), id)) {
            throw new RuntimeException("Mã khuyến mãi đã tồn tại: " + requestDTO.getCode());
        }

        // Validate dates
        if (requestDTO.getStartDate().isAfter(requestDTO.getEndDate())) {
            throw new RuntimeException("Ngày bắt đầu phải trước ngày kết thúc");
        }

        // Validate discount value for percentage type
        if (requestDTO.getDiscountType() == Promotion.DiscountType.PERCENTAGE
                && requestDTO.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new RuntimeException("Phần trăm giảm giá không được vượt quá 100%");
        }

        // Update fields
        existingPromotion.setCode(requestDTO.getCode().toUpperCase());
        existingPromotion.setName(requestDTO.getName());
        existingPromotion.setDescription(requestDTO.getDescription());
        existingPromotion.setDiscountType(requestDTO.getDiscountType());
        existingPromotion.setDiscountValue(requestDTO.getDiscountValue());
        existingPromotion.setMinOrderAmount(requestDTO.getMinOrderAmount());
        existingPromotion.setMaxDiscountAmount(requestDTO.getMaxDiscountAmount());
        existingPromotion.setUsageLimit(requestDTO.getUsageLimit());
        existingPromotion.setStartDate(requestDTO.getStartDate());
        existingPromotion.setEndDate(requestDTO.getEndDate());
        existingPromotion.setIsActive(requestDTO.getIsActive());

        existingPromotion = promotionRepository.save(existingPromotion);

        return PromotionDTO.fromEntity(existingPromotion);
    }

    /**
     * Soft delete promotion
     */
    @Transactional
    public void softDeletePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi với ID: " + id));

        promotion.setIsDeleted(true);
        promotion.setIsActive(false);
        promotionRepository.save(promotion);
    }

    /**
     * Restore deleted promotion
     */
    @Transactional
    public void restorePromotion(Long id) {
        Promotion promotion = promotionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khuyến mãi với ID: " + id));

        promotion.setIsDeleted(false);
        promotionRepository.save(promotion);
    }

    /**
     * Validate promotion request data
     */
    private void validatePromotionRequest(PromotionRequestDTO requestDTO) {
        if (requestDTO.getCode() == null || requestDTO.getCode().trim().isEmpty()) {
            throw new RuntimeException("Mã khuyến mãi không được để trống");
        }

        if (requestDTO.getName() == null || requestDTO.getName().trim().isEmpty()) {
            throw new RuntimeException("Tên khuyến mãi không được để trống");
        }

        if (requestDTO.getDiscountValue() == null || requestDTO.getDiscountValue().compareTo(BigDecimal.ZERO) <= 0) {
            throw new RuntimeException("Giá trị giảm giá phải lớn hơn 0");
        }

        if (requestDTO.getUsageLimit() == null || requestDTO.getUsageLimit() <= 0) {
            throw new RuntimeException("Số lần sử dụng phải lớn hơn 0");
        }

        if (requestDTO.getStartDate() == null) {
            throw new RuntimeException("Ngày bắt đầu không được để trống");
        }

        if (requestDTO.getEndDate() == null) {
            throw new RuntimeException("Ngày kết thúc không được để trống");
        }
    }

    /**
     * Format money for display
     */
    private String formatMoney(BigDecimal amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(Locale.forLanguageTag("vi-VN"));
        return formatter.format(amount);
    }
}
