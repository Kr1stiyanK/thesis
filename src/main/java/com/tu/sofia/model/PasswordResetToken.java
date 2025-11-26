package com.tu.sofia.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "password_reset_tokens")
public class PasswordResetToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @ManyToOne(optional = false)
    private UserEntity user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used;

    public Long getId() {
        return id;
    }

    public PasswordResetToken setId(Long id) {
        this.id = id;
        return this;
    }

    public String getToken() {
        return token;
    }

    public PasswordResetToken setToken(String token) {
        this.token = token;
        return this;
    }

    public UserEntity getUser() {
        return user;
    }

    public PasswordResetToken setUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public PasswordResetToken setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
        return this;
    }

    public boolean isUsed() {
        return used;
    }

    public PasswordResetToken setUsed(boolean used) {
        this.used = used;
        return this;
    }
}
