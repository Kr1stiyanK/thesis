package com.tu.sofia.dto;

public class ForgottenPasswordRequestDTO {
    private String email;

    public String getEmail() {
        return email;
    }

    public ForgottenPasswordRequestDTO setEmail(String email) {
        this.email = email;
        return this;
    }
}
