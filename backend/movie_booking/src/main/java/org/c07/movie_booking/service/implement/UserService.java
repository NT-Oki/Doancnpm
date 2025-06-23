package org.c07.movie_booking.service.implement;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.c07.movie_booking.dto.admin.AdminRegisterDto;
import org.c07.movie_booking.dto.request.LoginRequestDTO;
import org.c07.movie_booking.dto.request.UserRequestDTO;
import org.c07.movie_booking.dto.response.UserResponseDTO;
import org.c07.movie_booking.model.Role;
import org.c07.movie_booking.model.User;
import org.c07.movie_booking.repository.IRoleRepository;
import org.c07.movie_booking.repository.IUserRepository;
import org.c07.movie_booking.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    @Autowired
    private final IUserRepository userRepository;

    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

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

//    dành cho admin
    @Override
    public User convertToUser(AdminRegisterDto dto) {
        Role role = roleRepository.findByName(dto.getRole());
        if (role == null) {
            throw new IllegalArgumentException("Vai trò không hợp lệ: " + dto.getRole());
        }

        return User.builder()
                .id(dto.getId())
                .email(dto.getEmail().trim().toLowerCase())
                .name(dto.getName())
                .cardId(dto.getCardId())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.isGender())
                .address(dto.getAddress())
                .avatar(dto.getAvatar())
                .role(role)
                .build();
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User save(AdminRegisterDto dto) {
        User existingUser = null;
        if (dto.getId() != null) {
            existingUser = userRepository.findById(dto.getId()).orElse(null);
            if (existingUser == null) {
                throw new IllegalArgumentException("Không tìm thấy người dùng với ID: " + dto.getId());
            }
        }

        User user = convertToUser(dto);

        if (dto.getId() == null) {
            user.setStatus(true);
            user.setCode(RandomStringUtils.randomAlphanumeric(5));
        } else {
            user.setStatus(existingUser.isStatus());
            user.setCode(existingUser.getCode());
        }

        if (dto.getId() == null) {
            if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
                throw new IllegalArgumentException("Mật khẩu không được để trống");
            }
            if (dto.getPassword().length() < 8) {
                throw new IllegalArgumentException("Mật khẩu phải có ít nhất 8 ký tự");
            }
            user.setPassword(passwordEncoder.encode(dto.getPassword()));
        } else {
            if (dto.getPassword() != null && !dto.getPassword().isEmpty()) {
                user.setPassword(passwordEncoder.encode(dto.getPassword()));
            } else {
                user.setPassword(existingUser.getPassword());
            }
        }

        return userRepository.save(user);
    }

    @Override
    public List<User> findAllMembers() {
        return userRepository.findAll();
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    @Override
    public void delete(User user) {
        userRepository.delete(user);
    }
}
