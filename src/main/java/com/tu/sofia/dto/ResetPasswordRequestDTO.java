package com.tu.sofia.dto;

public class ResetPasswordRequestDTO {
    private String token;
    private String newPassword;

    public String getToken() {
        return token;
    }

    public ResetPasswordRequestDTO setToken(String token) {
        this.token = token;
        return this;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public ResetPasswordRequestDTO setNewPassword(String newPassword) {
        this.newPassword = newPassword;
        return this;
    }
}
