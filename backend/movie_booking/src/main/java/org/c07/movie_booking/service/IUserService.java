package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.admin.AdminRegisterDto;
import org.c07.movie_booking.dto.request.LoginRequestDTO;
import org.c07.movie_booking.dto.request.UserRequestDTO;
import org.c07.movie_booking.dto.response.UserResponseDTO;
import org.c07.movie_booking.model.User;

import java.util.List;

public interface IUserService {

    long createUser(UserRequestDTO userRequestDTO);

    void updateUser(int id ,UserRequestDTO userRequestDTO);

    void deleteUser(int id);

    UserResponseDTO login(LoginRequestDTO loginRequestDTO);

    User convertToUser(AdminRegisterDto dto);

    User findByEmail(String email);

    User save(AdminRegisterDto dto);

    List<User> findAllMembers();

    User findById(Long id);

    void delete(User user);

}
