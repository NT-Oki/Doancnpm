# QUICK START - PROMOTION FEATURE TESTING

## 1. Database Setup
Chạy script SQL để tạo bảng và dữ liệu mẫu:
```sql
-- Run file: database_promotion_update.sql
```

## 2. Sample Promotion Codes for Testing
- **WELCOME10**: Giảm 10% (tối thiểu 50K, giảm tối đa 30K)
- **SAVE50K**: Giảm 50K (tối thiểu 200K)
- **STUDENT20**: Giảm 20% (tối thiểu 100K, giảm tối đa 50K)
- **WEEKEND15**: Giảm 15% (tối thiểu 80K, giảm tối đa 40K)

## 3. Testing Flow
1. Start backend: `./gradlew bootRun`
2. Start frontend: `npm run dev`
3. Go through booking flow:
   - Select movie & showtime
   - Choose seats
   - In checkout page, click "Áp dụng mã khuyến mãi"
   - Enter one of the sample codes above
   - See real-time validation and discount calculation
   - Proceed to payment with discounted amount

## 4. API Endpoints
- **Validate Promotion**: `POST /booking/promotion/validate`
- **Apply Promotion**: `PUT /booking/choose-seat/{bookingId}/apply-promotion`

## 5. Test Scenarios
✅ Valid promotion code
✅ Invalid/expired code
✅ Minimum order not met
✅ Usage limit exceeded
✅ Real-time validation
✅ Price calculation accuracy
✅ VNPay integration with final amount
