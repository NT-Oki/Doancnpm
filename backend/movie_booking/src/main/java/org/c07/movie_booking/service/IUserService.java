package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.admin.AdminRegisterDto;
import org.c07.movie_booking.model.User;

import java.util.List;

public interface IUserService {
    public User convertToUser(RegisterDto dto, String roleName);

    public User convertToUser(AdminRegisterDto dto);

    public User findByEmail(String email);

    public void save(User user);

    public User save(AdminRegisterDto dto);

    public List<User> findAllMembers();

    public User findById(Long id);

    public void delete(User user);
}
