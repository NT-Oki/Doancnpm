package org.c07.movie_booking.controller;

import jakarta.validation.Valid;
import org.c07.movie_booking.dto.SeatResponse;
import org.c07.movie_booking.dto.request.SeatCreateRequest;
import org.c07.movie_booking.dto.response.ResponseData;
import org.c07.movie_booking.service.ISeatService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/seat")
public class SeatController {

    private ISeatService seatService;

    @PostMapping
    ResponseData<SeatResponse> createSeat(@RequestBody @Valid SeatCreateRequest request) {
        return ResponseData.<SeatResponse>builder()
                .data(seatService.createSeat(request))
                .message("Successful")
                .build();
    }
}
