package com.example.movie_booking.repository;

import com.example.movie_booking.model.BookingSeat;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface IBookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    @Modifying
    @Transactional
    void deleteByBookingId(Long bookingId);

    @Query("SELECT COUNT(bs) FROM BookingSeat bs " +
            "JOIN bs.booking b " +
            "WHERE DATE(b.dateBooking) = :date")
    long countSeatsSoldByDate(@Param("date") LocalDate date);

    @Query("SELECT m.nameMovie, COUNT(bs.id) " +
            "FROM BookingSeat bs " +
            "JOIN bs.booking b " +
            "JOIN b.showTime st " +
            "JOIN st.movie m " +
            "GROUP BY m.id, m.nameMovie " +
            "ORDER BY COUNT(bs.id) DESC")
    List<Object[]> findTop5MostWatchedMovies(Pageable pageable);
}
