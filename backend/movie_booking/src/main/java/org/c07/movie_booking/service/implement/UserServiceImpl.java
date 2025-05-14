package org.c07.movie_booking.service.implement;

import lombok.RequiredArgsConstructor;
import org.c07.movie_booking.dto.request.LoginRequestDTO;
import org.c07.movie_booking.dto.request.UserRequestDTO;
import org.c07.movie_booking.dto.response.UserResponseDTO;
import org.c07.movie_booking.model.User;
import org.c07.movie_booking.repository.IUserRepository;
import org.c07.movie_booking.service.IUserService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final IUserRepository userRepository;
    @Override
    public long createUser(UserRequestDTO userRequestDTO) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User user = User.builder()
                .name(userRequestDTO.getName())
                .password(encoder.encode(userRequestDTO.getPassword()))
                .email(userRequestDTO.getEmail())
                .gender(userRequestDTO.isGender())
                .phoneNumber(userRequestDTO.getPhoneNumber())
                .status(true)
                .build();
        userRepository.save(user);
        return user.getId();
    }

    @Override
    public void updateUser(int id, UserRequestDTO userRequestDTO) {

    }

    @Override
    public void deleteUser(int id) {

    }

    @Override
    public UserResponseDTO login(LoginRequestDTO loginRequestDTO) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        User user = userRepository.findByEmailAndPassword(loginRequestDTO.getEmail(), encoder.encode(loginRequestDTO.getPassword()));
        if (user != null) {
            return UserResponseDTO.builder()
                    .email(user.getEmail())
                    .name(user.getName())
                    .phoneNumber(user.getPhoneNumber())
                    .status(user.isStatus())
                    .email(user.getEmail())
                    .gender(user.isGender())
                    .build();
        }
        return null;
    }
}
