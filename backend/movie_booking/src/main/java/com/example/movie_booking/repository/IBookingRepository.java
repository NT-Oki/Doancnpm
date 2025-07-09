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
    List<Booking> findByBookingStatusIdNot( long bookingStatusId);
    @Query("SELECT b FROM Booking b " +
            "JOIN b.showTime st " +       // Tên thuộc tính trong Booking Entity trỏ đến Showtime
            "JOIN st.movie m " +         // Tên thuộc tính trong Showtime Entity trỏ đến Movie
            "JOIN st.room r " +          // Tên thuộc tính trong Showtime Entity trỏ đến Room
            "JOIN b.user u " +           // Tên thuộc tính trong Booking Entity trỏ đến User
            "WHERE LOWER(m.nameMovie) LIKE :searchTerm OR " +      // Tên thuộc tính trong Movie Entity
            "LOWER(r.roomName) LIKE :searchTerm OR " +       // Tên thuộc tính trong Room Entity
            "LOWER(u.name) LIKE :searchTerm OR " +           // Tên thuộc tính trong User Entity
            "LOWER(b.codeBooking) LIKE :searchTerm")         // Tên thuộc tính trong Booking Entity
    Page<Booking> searchBookings(@Param("searchTerm") String searchTerm, Pageable pageable);


}
