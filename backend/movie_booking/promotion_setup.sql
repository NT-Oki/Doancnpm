-- Create promotion table
CREATE TABLE IF NOT EXISTS promotion (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    discount_type ENUM('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0.00,
    max_discount_amount DECIMAL(10,2),
    usage_limit INT,
    used_count INT DEFAULT 0,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample promotions
INSERT INTO promotion (code, name, description, discount_type, discount_value, min_order_amount, max_discount_amount, usage_limit, start_date, end_date, is_active) VALUES
('WELCOME10', 'Chào mừng khách hàng mới', 'Giảm 10% cho khách hàng mới đăng ký', 'PERCENTAGE', 10.00, 100000.00, 50000.00, 100, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE),
('SUMMER50K', 'Khuyến mãi mùa hè', 'Giảm 50,000 vnđ cho đơn hàng từ 300,000 vnđ', 'FIXED_AMOUNT', 50000.00, 300000.00, NULL, 50, '2024-06-01 00:00:00', '2024-08-31 23:59:59', TRUE),
('VIP20', 'Khuyến mãi VIP', 'Giảm 20% cho thành viên VIP', 'PERCENTAGE', 20.00, 200000.00, 100000.00, 200, '2024-01-01 00:00:00', '2024-12-31 23:59:59', TRUE);

-- Create index for better performance
CREATE INDEX idx_promotion_code ON promotion(code);
CREATE INDEX idx_promotion_active ON promotion(is_active, is_deleted);
CREATE INDEX idx_promotion_dates ON promotion(start_date, end_date);
