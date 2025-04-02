package com.nguyenlonq23.job4userver.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    @Value("${spring.mail.username}")
    private String userName;


    public void sendEmail(String email, String subject, String body) throws Exception {
        MimeMessage message = emailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        String htmlContent = "<h1>" + body + "<h1/>";
        helper.setFrom(userName);
        helper.setTo(email);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        emailSender.send(message);
    }

}