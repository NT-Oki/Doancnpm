package org.c07.movie_booking.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class UserResponseDTO {
    private String email;
    private String name;
    private boolean gender;
    private boolean status;
    private String phoneNumber;
}
