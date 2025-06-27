    -- Script to add Promotion functionality to movie booking system
    -- Run this script to add the promotion table and update booking table

    USE movie_booking;

    -- Create promotion table
    CREATE TABLE IF NOT EXISTS `promotion` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT,
    `code` varchar(50) NOT NULL UNIQUE,
    `name` varchar(255) NOT NULL,
    `description` text,
    `discount_type` enum('PERCENTAGE', 'FIXED_AMOUNT') NOT NULL,
    `discount_value` decimal(10,2) NOT NULL,
    `min_order_amount` decimal(10,2) DEFAULT 0,
    `max_discount_amount` decimal(10,2) DEFAULT NULL,
    `usage_limit` int DEFAULT NULL,
    `used_count` int DEFAULT 0,
    `start_date` datetime NOT NULL,
    `end_date` datetime NOT NULL,
    `is_active` boolean DEFAULT true,
    `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
    `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    INDEX `idx_code` (`code`),
    INDEX `idx_active_dates` (`is_active`, `start_date`, `end_date`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

    -- Update booking table to add promotion support (with checks to avoid duplicate columns)
    -- Check and add promotion_id column if it doesn't exist
    SET @column_exists = (SELECT count(*) FROM information_schema.columns WHERE table_schema=database() AND table_name='booking' AND column_name='promotion_id');
    SET @sql = IF(@column_exists = 0, 'ALTER TABLE `booking` ADD COLUMN `promotion_id` bigint(20) DEFAULT NULL', 'SELECT "Column promotion_id already exists"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Check and add original_amount column if it doesn't exist
    SET @column_exists = (SELECT count(*) FROM information_schema.columns WHERE table_schema=database() AND table_name='booking' AND column_name='original_amount');
    SET @sql = IF(@column_exists = 0, 'ALTER TABLE `booking` ADD COLUMN `original_amount` int(11) DEFAULT NULL', 'SELECT "Column original_amount already exists"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Check and add discount_amount column if it doesn't exist
    SET @column_exists = (SELECT count(*) FROM information_schema.columns WHERE table_schema=database() AND table_name='booking' AND column_name='discount_amount');
    SET @sql = IF(@column_exists = 0, 'ALTER TABLE `booking` ADD COLUMN `discount_amount` int(11) DEFAULT NULL', 'SELECT "Column discount_amount already exists"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Add foreign key constraint (check if it doesn't exist first)
    SET @fk_exists = (SELECT count(*) FROM information_schema.table_constraints WHERE table_schema=database() AND table_name='booking' AND constraint_name='FK_booking_promotion');
    SET @sql = IF(@fk_exists = 0, 'ALTER TABLE `booking` ADD CONSTRAINT `FK_booking_promotion` FOREIGN KEY (`promotion_id`) REFERENCES `promotion` (`id`)', 'SELECT "Foreign key FK_booking_promotion already exists"');
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;

    -- Insert sample promotion data for testing (only if not exists)
    INSERT IGNORE INTO `promotion` (
        `code`, `name`, `description`, `discount_type`, `discount_value`, 
        `min_order_amount`, `max_discount_amount`, `usage_limit`, `used_count`,
        `start_date`, `end_date`, `is_active`
    ) VALUES 
    ('WELCOME10', 'Chào mừng khách hàng mới', 'Giảm 10% cho đơn hàng đầu tiên', 'PERCENTAGE', 10.00, 50000, 30000, 100, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', true),
    ('SAVE50K', 'Giảm 50K', 'Giảm 50,000 VND cho đơn hàng từ 200,000 VND', 'FIXED_AMOUNT', 50000.00, 200000, NULL, 50, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', true),
    ('STUDENT20', 'Ưu đãi sinh viên', 'Giảm 20% dành cho sinh viên', 'PERCENTAGE', 20.00, 100000, 50000, 200, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', true),
    ('WEEKEND15', 'Cuối tuần vui vẻ', 'Giảm 15% cho vé cuối tuần', 'PERCENTAGE', 15.00, 80000, 40000, NULL, 0, '2025-01-01 00:00:00', '2025-12-31 23:59:59', true);

    -- Verify tables and data
    SELECT 'Promotion table created successfully' as Status;
    SELECT COUNT(*) as 'Total Promotions' FROM promotion;
    SELECT 'Booking table updated successfully' as Status;
    DESCRIBE booking;
