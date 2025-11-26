package com.tu.sofia.service;

import com.tu.sofia.model.UserEntity;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
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

    public void sendPasswordResetEmail(UserEntity user, String token) {
        String resetLink = frontEndBaseUrl + "/reset-password?token=" + token;

        String subject = "Смяна на парола в ParkWise";
        String text = String.format(
                """
                        Здравей, %s,
                        
                        Получихме заявка за смяна на паролата в ParkWise.
                        За да зададеш нова парола, отвори този линк (валиден е 15 минути):
                        
                        %s
                        
                        Ако ти не си направил тази заявка, игнорирай този имейл.
                        """,
                user.getName(), resetLink
        );

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(user.getEmail());
            helper.setSubject(subject);
            helper.setText(text, false);
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Неуспешно изпращане на имейл за смяна на парола.", e);
        }
    }
}
