package com.tu.sofia.service;

import com.tu.sofia.dto.UserRegistrationDTO;
import com.tu.sofia.enums.UserRoleEnum;
import com.tu.sofia.model.PasswordResetToken;
import com.tu.sofia.model.UserEntity;
import com.tu.sofia.model.UserRoleEntity;
import com.tu.sofia.model.VerificationToken;
import com.tu.sofia.repositories.PasswordResetTokenRepository;
import com.tu.sofia.repositories.UserEntityRepository;
import com.tu.sofia.repositories.UserRoleRepository;
import com.tu.sofia.repositories.VerificationTokenRepository;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collector;

@Service
@Lazy
public class UserEntityService implements UserDetailsService {

    private final UserEntityRepository userRepo;

    private final UserRoleRepository roleRepo;

    private final PasswordEncoder passwordEncoder;

    private final VerificationTokenRepository tokenRepo;

    private final MailService mailService;

    private final PasswordResetTokenRepository passwordResetTokenRepo;

    public UserEntityService(UserEntityRepository userRepo, UserRoleRepository roleRepo, PasswordEncoder passwordEncoder, VerificationTokenRepository tokenRepo, MailService mailService, PasswordResetTokenRepository passwordResetTokenRepo) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepo = tokenRepo;
        this.mailService = mailService;
        this.passwordResetTokenRepo = passwordResetTokenRepo;
    }

    @Transactional
    public UserEntity createCustomer(UserRegistrationDTO signupRequest) {
        if (userRepo.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already taken");
        }

        UserRoleEntity role = roleRepo.findByRole(UserRoleEnum.USER);
        if (role == null) {
            role = new UserRoleEntity().setRole(UserRoleEnum.USER);
            role = roleRepo.save(role);
        }

        UserEntity customer = new UserEntity()
                .setEmail(signupRequest.getEmail())
                .setName(signupRequest.getName())
                .setPassword(passwordEncoder.encode(signupRequest.getPassword()))
                .setRole(role);

        userRepo.save(customer);
        String tokenValue = UUID.randomUUID().toString();
        VerificationToken token = new VerificationToken()
                .setToken(tokenValue)
                .setUser(customer)
                .setExpiresAt(LocalDateTime.now().plusMinutes(3))
                .setUsed(false);

        tokenRepo.save(token);

        mailService.sendVerificationEmail(customer, tokenValue);

        return customer;
    }


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        UserEntity user = this.userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Customer not found with email: " + email));

//        return new User(user.getEmail(), user.getPassword(), Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getRole().name())));
        return User
                .withUsername(user.getEmail())
                .password(user.getPassword())
                .authorities(Collections.singletonList(new SimpleGrantedAuthority(user.getRole().getRole().name())))
                .disabled(!user.isEnabled())
                .accountExpired(false)
                .accountLocked(false)
                .credentialsExpired(false)
                .build();
    }

    public UserEntity getUserById(Long id) {
        return userRepo.findById(id).orElse(null);
    }

    public UserEntity loadByUsername(String email) {
        return this.userRepo.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Customer not found with email: " + email));
    }

    public void updateUsername(UserEntity userEntity) {
        this.userRepo.save(userEntity);
    }

    public void updatePassword(UserEntity userEntity) {
        this.userRepo.save(userEntity);
    }

    public List<UserEntity> findAllNonAdminUsers() {
        return this.userRepo.findAllNonAdminUsers();
    }

    public void requestPasswordReset(String email) {
        userRepo.findByEmail(email).ifPresent(user -> {
            String token = UUID.randomUUID().toString();

            PasswordResetToken prt = new PasswordResetToken()
                    .setToken(token)
                    .setUser(user)
                    .setExpiresAt(LocalDateTime.now().plusMinutes(15))
                    .setUsed(false);

            passwordResetTokenRepo.save(prt);
            mailService.sendPasswordResetEmail(user, token);
        });

        // ако няма такъв user → мълчаливо нищо не правим
        // (не искаме да кажем "няма такъв имейл" към клиента)
    }

    public void resetPassword(String token, String newPassword) {
        PasswordResetToken prt = passwordResetTokenRepo.findByToken(token)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "Невалиден линк за смяна на парола."));

        if (prt.isUsed()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Този линк вече е използван.");
        }

        if (prt.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Линкът е изтекъл.");
        }

        UserEntity user = prt.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepo.save(user);

        prt.setUsed(true);
        passwordResetTokenRepo.save(prt);
    }
}
