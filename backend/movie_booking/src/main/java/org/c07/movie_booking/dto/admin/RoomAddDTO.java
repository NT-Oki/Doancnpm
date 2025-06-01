package org.c07.movie_booking.dto.admin;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class RoomAddDTO {
    private String roomName;
    private int quantitySeat;
    private String status;
    private String description;
}
