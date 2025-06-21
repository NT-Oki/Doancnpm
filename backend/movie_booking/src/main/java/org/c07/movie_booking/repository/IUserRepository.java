package org.c07.movie_booking.repository;

import org.c07.movie_booking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IUserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);
}
