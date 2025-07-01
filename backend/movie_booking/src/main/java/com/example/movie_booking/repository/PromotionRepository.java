package com.example.movie_booking.repository;

import com.example.movie_booking.model.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

       // ===== METHODS FOR USER (từ IPromotionRepository cũ) =====

       Optional<Promotion> findByCodeAndIsActiveTrue(String code);

       @Query("SELECT p FROM Promotion p WHERE p.code = :code AND p.isActive = true " +
                     "AND p.startDate <= CURRENT_TIMESTAMP AND p.endDate >= CURRENT_TIMESTAMP " +
                     "AND (p.usageLimit IS NULL OR p.usedCount < p.usageLimit)")
       Optional<Promotion> findValidPromotionByCodeForUser(@Param("code") String code);

       @Query("SELECT p FROM Promotion p WHERE p.isActive = true " +
                     "AND p.startDate <= CURRENT_TIMESTAMP AND p.endDate >= CURRENT_TIMESTAMP " +
                     "AND (p.usageLimit IS NULL OR p.usedCount < p.usageLimit)")
       List<Promotion> findAllValidPromotions();

       // ===== METHODS FOR ADMIN =====

       // Tìm khuyến mãi theo mã code (không bao gồm đã xóa)
       Optional<Promotion> findByCodeAndIsDeletedFalse(String code);

       // Tìm tất cả khuyến mãi chưa bị xóa
       List<Promotion> findByIsDeletedFalse();

       // Tìm khuyến mãi với phân trang (chỉ chưa bị xóa)
       @Query("SELECT p FROM Promotion p WHERE p.isDeleted = false ORDER BY p.createdAt DESC")
       Page<Promotion> findActivePromotionsForAdmin(Pageable pageable);

       // Tìm tất cả khuyến mãi kể cả đã xóa (cho admin)
       @Query("SELECT p FROM Promotion p ORDER BY p.createdAt DESC")
       Page<Promotion> findAllPromotionsForAdmin(Pageable pageable);

       // Method tổng hợp cho admin với includeDeleted parameter
       @Query("SELECT p FROM Promotion p WHERE " +
                     "CASE WHEN :includeDeleted = true THEN 1=1 " +
                     "ELSE p.isDeleted = false END " +
                     "ORDER BY p.createdAt DESC")
       Page<Promotion> findAllPromotions(@Param("includeDeleted") boolean includeDeleted, Pageable pageable);

       // Tìm khuyến mãi đang hoạt động
       @Query("SELECT p FROM Promotion p WHERE p.isDeleted = false AND p.isActive = true " +
                     "AND p.startDate <= :now AND p.endDate >= :now AND p.usedCount < p.usageLimit")
       List<Promotion> findActivePromotions(@Param("now") LocalDateTime now);

       // Tìm khuyến mãi hợp lệ theo code (cho validation)
       @Query("SELECT p FROM Promotion p WHERE p.code = :code AND p.isDeleted = false " +
                     "AND p.isActive = true AND p.startDate <= :now AND p.endDate >= :now " +
                     "AND p.usedCount < p.usageLimit")
       Optional<Promotion> findValidPromotionByCode(@Param("code") String code, @Param("now") LocalDateTime now);

       // Kiểm tra mã code đã tồn tại chưa (trừ khuyến mãi hiện tại khi update)
       @Query("SELECT COUNT(p) > 0 FROM Promotion p WHERE p.code = :code AND p.id != :excludeId AND p.isDeleted = false")
       boolean existsByCodeAndIdNot(@Param("code") String code, @Param("excludeId") Long excludeId);

       // Kiểm tra mã code đã tồn tại chưa (khi tạo mới)
       boolean existsByCodeAndIsDeletedFalse(String code);

       // ...existing code...

       // Thêm method mới để chỉ lấy khuyến mãi đã xóa
       @Query("SELECT p FROM Promotion p WHERE p.isDeleted = true ORDER BY p.createdAt DESC")
       Page<Promotion> findDeletedPromotionsOnly(Pageable pageable);

       // Cập nhật method tổng hợp để xử lý 3 trường hợp
       @Query("SELECT p FROM Promotion p WHERE " +
                     "CASE " +
                     "  WHEN :showType = 'DELETED_ONLY' THEN p.isDeleted = true " +
                     "  WHEN :showType = 'NOT_DELETED_ONLY' THEN p.isDeleted = false " +
                     "  ELSE 1=1 " + // ALL
                     "END " +
                     "ORDER BY p.createdAt DESC")
       Page<Promotion> findPromotionsByType(@Param("showType") String showType, Pageable pageable);
       // ...existing code...
}