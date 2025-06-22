package org.c07.movie_booking.service;

import org.c07.movie_booking.model.Showtime;
import org.c07.movie_booking.repository.IShowtimeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ShowTimeService {
    @Autowired
    IShowtimeRepository showTimeRepository;
    public Showtime getShowtime(long id) {
        return showTimeRepository.getReferenceById(id);
    }
    public List<Showtime> getAllShowtimes() {
        return showTimeRepository.findAll();
    }
}
