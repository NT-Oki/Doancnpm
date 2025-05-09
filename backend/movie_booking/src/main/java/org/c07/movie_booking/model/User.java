package org.c07.movie_booking.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class User  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String code;

    private String name;

    private String cardId;

    private String email;
    private String password;

    private boolean gender;

    private boolean status;

    private String phoneNumber;
    private String avatar;
    private String address;
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

}
