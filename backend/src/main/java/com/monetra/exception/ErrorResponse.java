package com.monetra.exception;

import java.time.LocalDateTime;
import java.util.Map;

public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private LocalDateTime timestamp;
    private String path;
    private Map<String, String> validationErrors;

    public ErrorResponse() {}

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private final ErrorResponse obj = new ErrorResponse();
        public Builder status(int v) { obj.status = v; return this; }
        public Builder error(String v) { obj.error = v; return this; }
        public Builder message(String v) { obj.message = v; return this; }
        public Builder timestamp(LocalDateTime v) { obj.timestamp = v; return this; }
        public Builder path(String v) { obj.path = v; return this; }
        public Builder validationErrors(Map<String, String> v) { obj.validationErrors = v; return this; }
        public ErrorResponse build() { return obj; }
    }

    public int getStatus() { return status; }
    public String getError() { return error; }
    public String getMessage() { return message; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public String getPath() { return path; }
    public Map<String, String> getValidationErrors() { return validationErrors; }
}
