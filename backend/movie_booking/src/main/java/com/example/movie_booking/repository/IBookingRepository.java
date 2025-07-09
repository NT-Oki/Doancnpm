package com.example.movie_booking.repository;

import com.example.movie_booking.model.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IBookingRepository extends JpaRepository<Booking,Long> {
    Booking findByPaymentId(String paymentId);
    Page<Booking> findByCodeBookingIsNotNull(Pageable pageable);
    List<Booking> findByUserId(Long userId);
    List<Booking> findByBookingStatus_Name(String status);
    boolean existsByUserIdAndBookingStatus_Id(Long userId, Long bookingStatusId);
    List<Booking> findByBookingStatusIdNot( long bookingStatusId);
    @Query("SELECT b FROM Booking b " +
            "JOIN b.showTime st " +
            "JOIN st.movie m " +
            "JOIN st.room r " +
            "JOIN b.user u " +
            "WHERE (LOWER(m.nameMovie) LIKE :searchTerm OR " +
            "LOWER(r.roomName) LIKE :searchTerm OR " +
            "LOWER(u.name) LIKE :searchTerm OR " +
            "LOWER(u.email) LIKE :searchTerm OR " +
            "LOWER(b.codeBooking) LIKE :searchTerm) " +
            "AND b.codeBooking IS NOT NULL")
    Page<Booking> searchBookings(@Param("searchTerm") String searchTerm, Pageable pageable);
    // Thêm điều kiện status vào query hiện có
    @Query("SELECT b FROM Booking b " +
            "JOIN b.showTime st " +
            "JOIN st.movie m " +
            "JOIN st.room r " +
            "JOIN b.user u " +
            "WHERE (LOWER(m.nameMovie) LIKE :searchTerm OR " +
            "LOWER(r.roomName) LIKE :searchTerm OR " +
            "LOWER(u.name) LIKE :searchTerm OR " +
            "LOWER(u.email) LIKE :searchTerm OR " +
            "LOWER(b.codeBooking) LIKE :searchTerm) " +
            "AND b.codeBooking IS NOT NULL " +
            "AND (:status IS NULL OR b.bookingStatus = :status)")
    Page<Booking> searchBookingsByTermAndStatus(@Param("searchTerm") String searchTerm, @Param("status") Long status, Pageable pageable);
    // 3. Tìm kiếm chỉ theo status
    Page<Booking> findByBookingStatusIdAndCodeBookingIsNotNull(@Param("status") Long status, Pageable pageable);
}
