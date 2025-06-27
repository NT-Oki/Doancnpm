package com.example.movie_booking.repository;

import com.example.movie_booking.model.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface IPromotionRepository extends JpaRepository<Promotion, Long> {

    Optional<Promotion> findByCodeAndIsActiveTrue(String code);

    @Query("SELECT p FROM Promotion p WHERE p.code = :code AND p.isActive = true " +
            "AND p.startDate <= CURRENT_TIMESTAMP AND p.endDate >= CURRENT_TIMESTAMP " +
            "AND (p.usageLimit IS NULL OR p.usedCount < p.usageLimit)")
    Optional<Promotion> findValidPromotionByCode(@Param("code") String code);

    @Query("SELECT p FROM Promotion p WHERE p.isActive = true " +
            "AND p.startDate <= CURRENT_TIMESTAMP AND p.endDate >= CURRENT_TIMESTAMP " +
            "AND (p.usageLimit IS NULL OR p.usedCount < p.usageLimit)")
    java.util.List<Promotion> findAllValidPromotions();
}
