package com.tu.sofia.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String token;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false)
    private LocalDateTime expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    public Long getId() {
        return id;
    }

    public VerificationToken setId(Long id) {
        this.id = id;
        return this;
    }

    public String getToken() {
        return token;
    }

    public VerificationToken setToken(String token) {
        this.token = token;
        return this;
    }

    public UserEntity getUser() {
        return user;
    }

    public VerificationToken setUser(UserEntity user) {
        this.user = user;
        return this;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public VerificationToken setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
        return this;
    }

    public boolean isUsed() {
        return used;
    }

    public VerificationToken setUsed(boolean used) {
        this.used = used;
        return this;
    }
}