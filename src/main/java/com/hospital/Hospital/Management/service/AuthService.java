package com.hospital.Hospital.Management.service;

import com.hospital.Hospital.Management.dto.AuthenticationRequest;
import com.hospital.Hospital.Management.dto.AuthenticationResponse;
import com.hospital.Hospital.Management.dto.RegisterRequest;
import com.hospital.Hospital.Management.dto.ResetPasswordRequest;
import com.hospital.Hospital.Management.exception.InvalidTokenException;
import com.hospital.Hospital.Management.exception.UserAlreadyExistsException;
import com.hospital.Hospital.Management.model.Role;
import com.hospital.Hospital.Management.model.TokenType;
import com.hospital.Hospital.Management.model.User;
import com.hospital.Hospital.Management.model.VerificationToken;
import com.hospital.Hospital.Management.repository.UserRepository;
import com.hospital.Hospital.Management.repository.VerificationTokenRepository;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    @Transactional
    public void register(RegisterRequest request) {
        // Check if user already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException("User with email " + request.getEmail() + " already exists");
        }

        // Create user entity with appropriate role
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .roles(Collections.singleton(mapRole(request.getRole())))
                .enabled(false)
                .build();

        User savedUser = userRepository.save(user);

        // Create verification token
        VerificationToken verificationToken = VerificationToken.generateToken(savedUser, TokenType.EMAIL_VERIFICATION);
        tokenRepository.save(verificationToken);

        // Send verification email
        try {
            emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken.getToken());
        } catch (MessagingException e) {
            // Log error and continue. User can request a new verification token.
            System.err.println("Failed to send verification email: " + e.getMessage());
        }
    }

    @Transactional
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = jwtService.generateToken(userDetails);
        String refreshToken = jwtService.generateRefreshToken(userDetails);

        return AuthenticationResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public ResponseEntity<Map<String, String>> verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid verification token"));

        if (verificationToken.isExpired()) {
            throw new InvalidTokenException("Token expired");
        }

        if (verificationToken.isUsed()) {
            throw new InvalidTokenException("Token already used");
        }

        if (verificationToken.getTokenType() != TokenType.EMAIL_VERIFICATION) {
            throw new InvalidTokenException("Invalid token type");
        }

        User user = verificationToken.getUser();
        user.setEnabled(true);
        userRepository.save(user);

        verificationToken.setUsed(true);
        tokenRepository.save(verificationToken);
//for json message
        return ResponseEntity.ok(Map.of("message", "Email successfully verified. You can now log in."));
    }

    @Transactional
    public ResponseEntity<Map<String, String>> requestPasswordReset(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        // Check for existing token and invalidate if exists
        Optional<VerificationToken> existingToken = tokenRepository.findByUserAndTokenType(user, TokenType.PASSWORD_RESET);
        existingToken.ifPresent(token -> {
            token.setUsed(true);
            tokenRepository.save(token);
        });

        // Create new password reset token
        VerificationToken resetToken = VerificationToken.generateToken(user, TokenType.PASSWORD_RESET);
        tokenRepository.save(resetToken);

        // Send password reset email
        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken.getToken());
        } catch (MessagingException e) {
            System.err.println("Failed to send password reset email: " + e.getMessage());
        }
//for json message instead of void i used Response entity and returned it
        return ResponseEntity.ok(Map.of("message", "Password reset link has been sent to your email"));
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        VerificationToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid reset token"));

        if (resetToken.isExpired()) {
            throw new InvalidTokenException("Token expired");
        }

        if (resetToken.isUsed()) {
            throw new InvalidTokenException("Token already used");
        }

        if (resetToken.getTokenType() != TokenType.PASSWORD_RESET) {
            throw new InvalidTokenException("Invalid token type");
        }

        User user = resetToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        resetToken.setUsed(true);
        tokenRepository.save(resetToken);
    }

    private Role mapRole(String role) {
        return switch (role.toUpperCase()) {
            case "ADMIN" -> Role.ROLE_ADMIN;
            case "DOCTOR" -> Role.ROLE_DOCTOR;
            case "PATIENT" -> Role.ROLE_PATIENT;
            default -> throw new IllegalArgumentException("Invalid role: " + role);
        };
    }
}
