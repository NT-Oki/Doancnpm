package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.request.LoginRequestDTO;
import org.c07.movie_booking.dto.request.UserRequestDTO;
import org.c07.movie_booking.dto.response.UserResponseDTO;

public interface IUserService {

    long createUser(UserRequestDTO userRequestDTO);

    void updateUser(int id ,UserRequestDTO userRequestDTO);

    void deleteUser(int id);

    UserResponseDTO login(LoginRequestDTO loginRequestDTO);

}
