package org.c07.movie_booking.controller;

import lombok.RequiredArgsConstructor;
import org.c07.movie_booking.dto.request.LoginRequestDTO;
import org.c07.movie_booking.dto.request.UserRequestDTO;
import org.c07.movie_booking.dto.response.ResponseData;
import org.c07.movie_booking.dto.response.UserResponseDTO;
import org.c07.movie_booking.service.IUserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {
    private final IUserService userService;
    @PostMapping(value = "/register")
    public ResponseData<?>  createUser(@RequestBody UserRequestDTO userRequestDTO) {
        try {
            long id = userService.createUser(userRequestDTO);
            return new ResponseData<>(HttpStatus.OK.value(), "User created successfully", id);
        } catch (Exception e) {
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "user creation failed");
        }
    }

    @PostMapping(value="/login")
    public ResponseData<?> login(@RequestBody LoginRequestDTO loginRequestDTO) {
        UserResponseDTO userResponseDTO = userService.login(loginRequestDTO);
        if (userResponseDTO == null) {
            return new ResponseData<>(HttpStatus.UNAUTHORIZED.value(), "user login failed");
        }
        return new ResponseData<>(HttpStatus.OK.value(), "User logged in successfully", userResponseDTO);
    }
}
