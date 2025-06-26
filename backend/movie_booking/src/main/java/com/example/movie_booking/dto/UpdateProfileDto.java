package com.example.movie_booking.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileDto {
    private String name;
    private String phoneNumber;
    private Boolean gender;
    private String address;
    private String avatar;
}