package org.c07.movie_booking.dto.request;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Getter
@Setter
@Builder
public class LoginRequestDTO implements Serializable {
    private String email;
    private String password;
}
