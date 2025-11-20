package com.tu.sofia.service;

import com.tu.sofia.model.UserEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    private final String frontEndBaseUrl = "http://localhost:4200";

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(UserEntity user, String token) {

        String activationLink = frontEndBaseUrl + "/activate-account?token=" + token;

        String text = """
                Здравей, %s,
                
                Благодарим ти за регистрацията в ParkWise.
                За да активираш профила си, отвори този линк (валиден е 15 минути):
                
                %s
                
                Ако ти не си направил регистрацията, игнорирай този имейл.
                """.formatted(user.getName(), activationLink);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(user.getEmail());
        message.setSubject("Активирай профила си в ParkWise");
        message.setText(text);

        mailSender.send(message);
    }
}
