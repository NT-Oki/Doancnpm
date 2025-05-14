package org.c07.movie_booking.service.implement;

import lombok.RequiredArgsConstructor;
import org.c07.movie_booking.dto.request.UserRequestDTO;
import org.c07.movie_booking.model.User;
import org.c07.movie_booking.repository.IUserRepository;
import org.c07.movie_booking.service.IUserService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final IUserRepository userRepository;
    @Override
    public long createUser(UserRequestDTO userRequestDTO) {
        User user = User.builder()
                .name(userRequestDTO.getName())
                .password(userRequestDTO.getPassword())
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
}
