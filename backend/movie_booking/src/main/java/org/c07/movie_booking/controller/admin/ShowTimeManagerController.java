package org.c07.movie_booking.controller.admin;

import org.c07.movie_booking.model.Showtime;
import org.c07.movie_booking.service.ShowTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("admin/showtimes")
public class ShowTimeManagerController {
    @Autowired
    ShowTimeService showTimeService;

    @GetMapping("/")
    public ResponseEntity<List<Showtime>> getAllShowTimes() {
            List<Showtime> showtimes=showTimeService.getAllShowtimes();
            return ResponseEntity.ok(showtimes);
    }

}
