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
    
    // Tìm khuyến mãi theo mã code (không bao gồm đã xóa)
    Optional<Promotion> findByCodeAndIsDeletedFalse(String code);
    
    // Tìm tất cả khuyến mãi chưa bị xóa
    List<Promotion> findByIsDeletedFalse();
    
    // Tìm khuyến mãi với phân trang
    Page<Promotion> findByIsDeletedFalse(Pageable pageable);
    
    // Tìm tất cả khuyến mãi kể cả đã xóa (cho admin)
    @Query("SELECT p FROM Promotion p WHERE (:includeDeleted = true OR p.isDeleted = false) ORDER BY p.createdAt DESC")
    Page<Promotion> findAllPromotions(@Param("includeDeleted") boolean includeDeleted, Pageable pageable);
    
    // Tìm khuyến mãi đang hoạt động
    @Query("SELECT p FROM Promotion p WHERE p.isDeleted = false AND p.isActive = true " +
           "AND p.startDate <= :now AND p.endDate >= :now AND p.usedCount < p.usageLimit")
    List<Promotion> findActivePromotions(@Param("now") LocalDateTime now);
    
    // Tìm khuyến mãi hợp lệ theo code
    @Query("SELECT p FROM Promotion p WHERE p.code = :code AND p.isDeleted = false " +
           "AND p.isActive = true AND p.startDate <= :now AND p.endDate >= :now " +
           "AND p.usedCount < p.usageLimit")
    Optional<Promotion> findValidPromotionByCode(@Param("code") String code, @Param("now") LocalDateTime now);
    
    // Kiểm tra mã code đã tồn tại chưa (trừ khuyến mãi hiện tại khi update)
    @Query("SELECT COUNT(p) > 0 FROM Promotion p WHERE p.code = :code AND p.id != :excludeId AND p.isDeleted = false")
    boolean existsByCodeAndIdNot(@Param("code") String code, @Param("excludeId") Long excludeId);
    
    // Kiểm tra mã code đã tồn tại chưa (khi tạo mới)
    boolean existsByCodeAndIsDeletedFalse(String code);
}
