package org.c07.movie_booking.repository;

import org.c07.movie_booking.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IRoleRepository extends JpaRepository<Role, Long> {
    Role findByName(String name);
}
