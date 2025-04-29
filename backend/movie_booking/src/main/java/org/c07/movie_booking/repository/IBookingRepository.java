package org.c07.movie_booking.repository;

import org.c07.movie_booking.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IBookingRepository extends JpaRepository<Booking,Long> {
}
