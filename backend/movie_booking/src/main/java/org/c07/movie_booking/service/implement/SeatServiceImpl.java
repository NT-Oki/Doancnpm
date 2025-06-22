package org.c07.movie_booking.service.implement;

import org.c07.movie_booking.dto.SeatResponse;
import org.c07.movie_booking.dto.request.SeatCreateRequest;
import org.c07.movie_booking.mapper.SeatMapper;
import org.c07.movie_booking.model.Room;
import org.c07.movie_booking.model.Seat;
import org.c07.movie_booking.repository.IRoomRepository;
import org.c07.movie_booking.repository.ISeatRepository;
import org.c07.movie_booking.service.ISeatService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatServiceImpl implements ISeatService {

    ISeatRepository seatRepository;
    SeatMapper seatMapper;
    IRoomRepository roomRepository;

    @Override
    public SeatResponse createSeat(SeatCreateRequest request) {
        Room room = roomRepository.findById(request.getRoom_id())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        Seat seat = seatMapper.toSeat(request);
        seat.setRoom(room);
        return seatMapper.toSeatResponse(seatRepository.save(seat));
    }

    @Override
    public List<SeatResponse> getAllSeats() {
        return seatRepository.findAll()
                .stream().map(seatMapper::toSeatResponse)
                .collect(Collectors.toList());
    }
}
