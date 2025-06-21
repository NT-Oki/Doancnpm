package org.c07.movie_booking.service.implement;

import org.c07.movie_booking.dto.AdminRegisterDto;
import org.c07.movie_booking.dto.RegisterDto;
import org.c07.movie_booking.model.Role;
import org.c07.movie_booking.model.User;
import org.c07.movie_booking.repository.IRoleRepository;
import org.c07.movie_booking.repository.IUserRepository;
import org.c07.movie_booking.service.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.apache.commons.lang3.RandomStringUtils;

import java.util.List;

@Service
public class UserService implements IUserService {
    @Autowired
    private IRoleRepository roleRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User convertToUser(RegisterDto dto, String roleName) {
        Role role = roleRepository.findByName(roleName);
        if (role == null) {
            role = new Role();
            role.setName(roleName);
            roleRepository.save(role);
        }
        return User.builder()
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .cardId(dto.getCardId())
                .phoneNumber(dto.getPhoneNumber())
                .gender(dto.isGender())
                .address(dto.getAddress())
                .avatar(dto.getAvatar())
                .status(true) // Mặc định active
                .code(RandomStringUtils.randomAlphanumeric(5))
                .role(role) // Gán role mặc định
                .build();
    }

    // cho phương thức add của admin
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
    public void save(User user) {
        userRepository.save(user);
    }

    // save cho phương thức add của admin
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