package com.example.movie_booking.dto;

import com.example.movie_booking.model.Promotion;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRequestDTO {
    
    @NotBlank(message = "Mã khuyến mãi không được để trống")
    @Size(min = 3, max = 50, message = "Mã khuyến mãi phải từ 3-50 ký tự")
    @Pattern(regexp = "^[A-Z0-9]+$", message = "Mã khuyến mãi chỉ được chứa chữ hoa và số")
    private String code;
    
    @NotBlank(message = "Tên khuyến mãi không được để trống")
    @Size(max = 255, message = "Tên khuyến mãi không được vượt quá 255 ký tự")
    private String name;
    
    @Size(max = 1000, message = "Mô tả không được vượt quá 1000 ký tự")
    private String description;
    
    @NotNull(message = "Loại giảm giá không được để trống")
    private Promotion.DiscountType discountType;
    
    @NotNull(message = "Giá trị giảm giá không được để trống")
    @DecimalMin(value = "0.01", message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal discountValue;
    
    @DecimalMin(value = "0", message = "Giá trị đơn hàng tối thiểu không được âm")
    private BigDecimal minOrderAmount = BigDecimal.ZERO;
    
    @DecimalMin(value = "0", message = "Số tiền giảm tối đa không được âm")
    private BigDecimal maxDiscountAmount;
    
    @NotNull(message = "Số lần sử dụng tối đa không được để trống")
    @Min(value = 1, message = "Số lần sử dụng phải ít nhất là 1")
    private Integer usageLimit;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;
    
    private Boolean isActive = true;

    public Promotion toEntity() {
        Promotion promotion = new Promotion();
        promotion.setCode(this.code.toUpperCase());
        promotion.setName(this.name);
        promotion.setDescription(this.description);
        promotion.setDiscountType(this.discountType);
        promotion.setDiscountValue(this.discountValue);
        promotion.setMinOrderAmount(this.minOrderAmount);
        promotion.setMaxDiscountAmount(this.maxDiscountAmount);
        promotion.setUsageLimit(this.usageLimit);
        promotion.setStartDate(this.startDate);
        promotion.setEndDate(this.endDate);
        promotion.setIsActive(this.isActive);
        promotion.setIsDeleted(false);
        promotion.setUsedCount(0);
        return promotion;
    }
}
