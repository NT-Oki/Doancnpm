package org.c07.movie_booking.repository;

import org.c07.movie_booking.model.Room;
import org.c07.movie_booking.model.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ISeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByRoom(Room room);
}