# HƯỚNG DẪN TRIỂN KHAI CHỨC NĂNG "ÁP DỤNG MÃ KHUYẾN MÃI" - MOVIE BOOKING SYSTEM

## I. TỔNG QUAN THIẾT KẾ

### 1. Mục tiêu
- Cho phép user áp dụng mã khuyến mãi/giảm giá trước khi thanh toán VNPay
- Tích hợp liền mạch vào flow booking hiện tại mà không ảnh hưởng code xung quanh
- Thiết kế modular, dễ mở rộng và bảo trì

### 2. Flow tích hợp
```
[Chọn ghế] → [Checkout Page + Promotion Code] → [VNPay Payment] → [Success]
                     ↑
               Validation real-time
```

### 3. Nguyên tắc thiết kế
- **Minimal Impact**: Không thay đổi logic core của booking/payment
- **Security First**: Validate promotion ở cả FE và BE
- **User Experience**: Real-time validation, clear feedback
- **Backwards Compatible**: Hệ thống cũ vẫn hoạt động bình thường

## II. CẤU TRÚC DATABASE

### 1. Bảng `promotion` (MỚI)
```sql
CREATE TABLE IF NOT EXISTS `promotion` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL UNIQUE,           -- Mã khuyến mãi
  `name` varchar(255) NOT NULL,                 -- Tên chương trình
  `description` text,                           -- Mô tả chi tiết
  `discount_type` enum('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,      -- Giá trị giảm
  `min_order_amount` decimal(10,2) DEFAULT 0,   -- Đơn hàng tối thiểu
  `max_discount_amount` decimal(10,2) DEFAULT NULL, -- Giảm tối đa
  `usage_limit` int DEFAULT NULL,               -- Giới hạn lượt dùng
  `used_count` int DEFAULT 0,                   -- Đã sử dụng
  `start_date` datetime NOT NULL,               -- Ngày bắt đầu
  `end_date` datetime NOT NULL,                 -- Ngày kết thúc
  `is_active` boolean DEFAULT true,             -- Trạng thái
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_code` (`code`),
  INDEX `idx_active_dates` (`is_active`, `start_date`, `end_date`)
);
```

### 2. Cập nhật bảng `booking`
```sql
ALTER TABLE `booking` 
ADD COLUMN `promotion_id` bigint(20) DEFAULT NULL,
ADD COLUMN `original_amount` int(11) DEFAULT NULL,    -- Giá gốc
ADD COLUMN `discount_amount` int(11) DEFAULT NULL,    -- Số tiền giảm
ADD CONSTRAINT `FK_booking_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`);
```

## III. BACKEND IMPLEMENTATION

### 1. Model Layer
- **Promotion.java**: Entity cho bảng promotion
- **Booking.java**: Thêm fields promotion_id, original_amount, discount_amount

### 2. Repository Layer
- **IPromotionRepository.java**: Query promotion theo code, validate tính hợp lệ

### 3. Service Layer
- **PromotionService.java**: Logic validate, calculate discount
- **BookingService.java**: Thêm method applyPromotionToBooking()

### 4. Controller Layer
- **PromotionController.java**: Endpoint `/booking/promotion/validate`
- **BookingController.java**: Endpoint `/booking/choose-seat/{id}/apply-promotion`

### 5. DTO Layer
- **PromotionValidationRequest.java**
- **PromotionValidationResult.java**
- **ApplyPromotionRequest.java**
- **BookingCheckoutDto.java**: Thêm promotion fields

## IV. FRONTEND IMPLEMENTATION

### 1. Component Structure
```
src/components/
├── PromotionCode.tsx (MỚI)     - Component xử lý nhập/validate mã
├── Checkout.tsx (CẬP NHẬT)     - Tích hợp PromotionCode component
└── ...
```

### 2. Features
- **Real-time validation**: Debounce input, API call validation
- **User feedback**: Success/error states, loading indicators
- **Price calculation**: Original → Discount → Final amount
- **State management**: Applied promotion state

### 3. API Integration
- **Validation API**: POST `/booking/promotion/validate`
- **Apply API**: PUT `/booking/choose-seat/{id}/apply-promotion`
- **Payment API**: Sử dụng final amount sau giảm giá

## V. LUỒNG HOẠT ĐỘNG CHI TIẾT

### 1. User Experience Flow
```
1. User chọn ghế → Chuyển đến Checkout page
2. Checkout page hiển thị tóm tắt đơn hàng
3. User click "Áp dụng mã khuyến mãi" (optional)
4. Nhập mã → Real-time validation
5. Nếu hợp lệ → Hiển thị giảm giá, cập nhật tổng tiền
6. User click "Xác nhận" → Apply promotion to booking
7. Redirect to VNPay với final amount
8. Payment success → Booking confirmed
```

### 2. Backend Processing Flow
```
1. Validate promotion code:
   - Check existence & active status
   - Check date range (start_date <= now <= end_date)
   - Check usage limit (used_count < usage_limit)
   - Check minimum order amount
   
2. Calculate discount:
   - PERCENTAGE: orderAmount * discountValue / 100
   - FIXED_AMOUNT: discountValue
   - Apply max_discount_amount limit
   
3. Apply to booking:
   - Save original_amount (if not set)
   - Set promotion_id, discount_amount
   - Update total_amount = original_amount - discount_amount
   - Increment promotion.used_count
```

## VI. SECURITY & VALIDATION

### 1. Frontend Validation
- Input sanitization (uppercase, trim)
- Client-side validation feedback
- Loading states prevent multiple submissions

### 2. Backend Validation
- **Double validation**: Validate again when applying to booking
- **Race condition protection**: Transactional operations
- **Usage limit enforcement**: Atomic increment of used_count
- **Business rule validation**: Min order, expiry dates, etc.

### 3. Error Handling
- Graceful degradation: System works without promotion
- Clear error messages: User-friendly feedback
- Logging: Track validation attempts and failures

## VII. TESTING SCENARIOS

### 1. Valid Cases
- Valid code with PERCENTAGE discount
- Valid code with FIXED_AMOUNT discount
- Code with minimum order requirement (met)
- Code with usage limit (not exceeded)

### 2. Invalid Cases
- Non-existent promotion code
- Expired promotion (past end_date)
- Not yet active promotion (before start_date)
- Usage limit exceeded
- Minimum order not met
- Inactive promotion (is_active = false)

### 3. Edge Cases
- Empty/null promotion code
- Very large discount (exceeds order amount)
- Concurrent usage of limited promotions
- Network errors during validation

## VIII. DEPLOYMENT STEPS

### 1. Database Setup
```sql
-- Run the database_promotion_update.sql script
-- Insert sample promotion data for testing
```

### 2. Backend Deployment
```bash
# Compile and run Spring Boot application
cd backend/movie_booking
./gradlew build
./gradlew bootRun
```

### 3. Frontend Deployment
```bash
# Install dependencies and run frontend
cd frontend
npm install
npm run dev
```

### 4. Testing
- Test promotion validation API
- Test complete booking flow with promotions
- Verify VNPay integration with discounted amounts
- Test error scenarios

## IX. MONITORING & MAINTENANCE

### 1. Metrics to Track
- Promotion usage rates
- Discount amounts applied
- Failed validation attempts
- User engagement with promotion feature

### 2. Regular Maintenance
- Clean up expired promotions
- Monitor usage limits
- Update discount rules as needed
- Performance optimization

## X. FUTURE ENHANCEMENTS

### 1. Advanced Features
- User-specific promotions
- Category-specific discounts (by movie, showtime)
- Stackable promotions
- Automatic promotion suggestions

### 2. Admin Features
- Promotion management interface
- Usage analytics dashboard
- Dynamic promotion creation
- A/B testing for promotions

---

**Lưu ý**: Thiết kế này đảm bảo tính modular và minimal impact. Tất cả các chức năng hiện tại sẽ tiếp tục hoạt động bình thường ngay cả khi không sử dụng promotion.
