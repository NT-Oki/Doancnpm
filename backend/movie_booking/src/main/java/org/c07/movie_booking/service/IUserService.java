package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.request.UserRequestDTO;

public interface IUserService {

    long createUser(UserRequestDTO userRequestDTO);

    void updateUser(int id ,UserRequestDTO userRequestDTO);

    void deleteUser(int id);

}
