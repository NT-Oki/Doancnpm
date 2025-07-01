package com.example.movie_booking.dto;

import com.example.movie_booking.model.Promotion;
import lombok.Data;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class PromotionCreateDto {
    
    @NotBlank(message = "Mã khuyến mãi không được để trống")
    @Size(min = 3, max = 50, message = "Mã khuyến mãi phải từ 3-50 ký tự")
    private String code;
    
    @NotBlank(message = "Tên khuyến mãi không được để trống")
    @Size(max = 255, message = "Tên khuyến mãi không được vượt quá 255 ký tự")
    private String name;
    
    private String description;
    
    @NotNull(message = "Loại giảm giá không được để trống")
    private Promotion.DiscountType discountType;
    
    @NotNull(message = "Giá trị giảm giá không được để trống")
    @DecimalMin(value = "0.01", message = "Giá trị giảm giá phải lớn hơn 0")
    private BigDecimal discountValue;
    
    @NotNull(message = "Giá trị đơn hàng tối thiểu không được để trống")
    @DecimalMin(value = "0", message = "Giá trị đơn hàng tối thiểu không được âm")
    private BigDecimal minOrderAmount = BigDecimal.ZERO;
    
    @DecimalMin(value = "0", message = "Số tiền giảm tối đa không được âm")
    private BigDecimal maxDiscountAmount;
    
    @NotNull(message = "Số lần sử dụng không được để trống")
    @Min(value = 1, message = "Số lần sử dụng phải lớn hơn 0")
    private Integer usageLimit;
    
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDateTime startDate;
    
    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDateTime endDate;
    
    private Boolean isActive = true;
    
    @AssertTrue(message = "Ngày kết thúc phải sau ngày bắt đầu")
    public boolean isEndDateAfterStartDate() {
        if (startDate == null || endDate == null) {
            return true; // Let @NotNull handle null validation
        }
        return endDate.isAfter(startDate);
    }
    
    @AssertTrue(message = "Với loại giảm theo phần trăm, giá trị không được vượt quá 100")
    public boolean isValidPercentage() {
        if (discountType == null || discountValue == null) {
            return true; // Let @NotNull handle null validation
        }
        if (discountType == Promotion.DiscountType.PERCENTAGE) {
            return discountValue.compareTo(BigDecimal.valueOf(100)) <= 0;
        }
        return true;
    }
}
