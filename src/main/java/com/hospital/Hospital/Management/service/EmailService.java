package com.hospital.Hospital.Management.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    public void sendVerificationEmail(String to, String token) throws MessagingException {
        logger.info("Preparing verification email for: {}", to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Verify Your Hospital Management System Account");
        
        String verificationUrl = baseUrl + "/api/auth/verify-email?token=" + token;
        
        String htmlContent = """
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #4CAF50; color: white; padding: 10px; text-align: center; }
                        .content { padding: 20px; }
                        .button { background-color: #4CAF50; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Email Verification</h1>
                        </div>
                        <div class="content">
                            <h2>Hello,</h2>
                            <p>Thank you for registering with our Hospital Management System. 
                               Please verify your email address by clicking the button below:</p>
                            <p><a class="button" href="%s">Verify Email</a></p>
                            <p>Or copy and paste the following link in your browser:</p>
                            <p>%s</p>
                            <p>This link will expire in 24 hours.</p>
                            <p>If you did not register on our platform, please ignore this email.</p>
                            <p>Best regards,<br/>Hospital Management Team</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(verificationUrl, verificationUrl);
        
        helper.setText(htmlContent, true);
        mailSender.send(message);

        logger.info("Verification email sent to: {}", to);
    }

    @Async
    public void sendPasswordResetEmail(String to, String token) throws MessagingException {
        logger.info("Preparing password reset email for: {}", to);
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Reset Your Hospital Management System Password");
        
        String resetUrl = baseUrl + "/api/auth/reset-password?token=" + token;
        
        String htmlContent = """
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; }
                        .container { width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background-color: #2196F3; color: white; padding: 10px; text-align: center; }
                        .content { padding: 20px; }
                        .button { background-color: #2196F3; color: white; padding: 10px 20px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset</h1>
                        </div>
                        <div class="content">
                            <h2>Hello,</h2>
                            <p>You have requested to reset your password for the Hospital Management System. 
                               Please click the button below to set a new password:</p>
                            <p><a class="button" href="%s">Reset Password</a></p>
                            <p>Or copy and paste the following link in your browser:</p>
                            <p>%s</p>
                            <p>This link will expire in 24 hours.</p>
                            <p>If you did not request a password reset, please ignore this email or contact support.</p>
                            <p>Best regards,<br/>Hospital Management Team</p>
                        </div>
                    </div>
                </body>
                </html>
                """.formatted(resetUrl, resetUrl);
        
        helper.setText(htmlContent, true);
        mailSender.send(message);


        logger.info("Password reset email sent to: {}", to);

    }
}
