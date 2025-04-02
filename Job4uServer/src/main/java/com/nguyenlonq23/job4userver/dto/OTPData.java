package com.nguyenlonq23.job4userver.dto;

public class OTPData {
    private final String otp;
    private final long createdAt;
    private final int failedAttempts;

    public OTPData(String otp, long createdAt, int failedAttempts) {
        this.otp = otp;
        this.createdAt = createdAt;
        this.failedAttempts = failedAttempts;
    }

    public String getOtp() { return otp; }
    public long getCreatedAt() { return createdAt; }
    public int getFailedAttempts() { return failedAttempts; }
}