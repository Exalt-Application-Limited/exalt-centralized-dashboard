package com.exalt.centralizeddashboard.core.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ConstraintViolationException;
import java.util.Objects;

/**
 * Global exception handler for REST controllers.
 * Provides consistent error responses across all APIs.
 * 
 * Note: This implementation does not extend ResponseEntityExceptionHandler
 * to avoid Spring Boot 3.x compatibility issues with method signatures.
 */
@Order(Ordered.HIGHEST_PRECEDENCE)
@ControllerAdvice
@Slf4j
public class RestExceptionHandler {
    
    /**
     * Handle MissingServletRequestParameterException. Triggered when a 'required' request parameter is missing.
     *
     * @param ex the HttpMessageNotReadableException
     * @param headers HttpHeaders
     * @param status HttpStatus
     * @param request WebRequest
     * @return a ResponseEntity with an ApiError
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex, WebRequest request) {
        
        String error = "Malformed JSON request";
        log.error(error, ex);
        return buildResponseEntity(new ApiError(HttpStatus.BAD_REQUEST, error, ex));
    }

    /**
     * Handle MethodArgumentNotValidException. Triggered when an object fails @Valid validation.
     *
     * @param ex the MethodArgumentNotValidException
     * @param headers HttpHeaders
     * @param status HttpStatus
     * @param request WebRequest
     * @return a ResponseEntity with an ApiError
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex, WebRequest request) {
        
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
        apiError.setMessage("Validation error");
        apiError.setDebugMessage(ex.getLocalizedMessage());
        
        // Add validation errors
        ex.getBindingResult().getFieldErrors().forEach(fieldError -> {
            apiError.addSubError(new ApiValidationError(
                    fieldError.getObjectName(),
                    fieldError.getField(),
                    fieldError.getRejectedValue(),
                    fieldError.getDefaultMessage()));
        });
        
        ex.getBindingResult().getGlobalErrors().forEach(objectError -> {
            apiError.addSubError(new ApiValidationError(
                    objectError.getObjectName(),
                    objectError.getDefaultMessage()));
        });
        
        log.error("Validation error", ex);
        return buildResponseEntity(apiError);
    }

    /**
     * Handle NoHandlerFoundException. Triggered when no handler is found for the requested URL.
     *
     * @param ex the NoHandlerFoundException
     * @param headers HttpHeaders
     * @param status HttpStatus
     * @param request WebRequest
     * @return a ResponseEntity with an ApiError
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    protected ResponseEntity<Object> handleNoHandlerFoundException(
            NoHandlerFoundException ex, WebRequest request) {
        
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND);
        apiError.setMessage(String.format("Could not find the %s method for URL %s", ex.getHttpMethod(), ex.getRequestURL()));
        apiError.setDebugMessage(ex.getMessage());
        
        log.error("No handler found", ex);
        return buildResponseEntity(apiError);
    }

    /**
     * Handle EntityNotFoundException. Triggered when a requested entity is not found.
     *
     * @param ex the EntityNotFoundException
     * @return a ResponseEntity with an ApiError
     */
    @ExceptionHandler(EntityNotFoundException.class)
    protected ResponseEntity<Object> handleEntityNotFound(EntityNotFoundException ex) {
        ApiError apiError = new ApiError(HttpStatus.NOT_FOUND);
        apiError.setMessage(ex.getMessage());
        
        log.error("Entity not found", ex);
        return buildResponseEntity(apiError);
    }

    /**
     * Handle MethodArgumentTypeMismatchException. Triggered when a method argument is not the expected type.
     *
     * @param ex the MethodArgumentTypeMismatchException
     * @return a ResponseEntity with an ApiError
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<Object> handleMethodArgumentTypeMismatch(MethodArgumentTypeMismatchException ex) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
        apiError.setMessage(String.format("The parameter '%s' of value '%s' could not be converted to type '%s'",
                ex.getName(), ex.getValue(), Objects.requireNonNull(ex.getRequiredType()).getSimpleName()));
        apiError.setDebugMessage(ex.getMessage());
        
        log.error("Method argument type mismatch", ex);
        return buildResponseEntity(apiError);
    }

    /**
     * Handle ConstraintViolationException. Triggered when a validation constraint is violated.
     *
     * @param ex the ConstraintViolationException
     * @return a ResponseEntity with an ApiError
     */
    @ExceptionHandler(ConstraintViolationException.class)
    protected ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException ex) {
        ApiError apiError = new ApiError(HttpStatus.BAD_REQUEST);
        apiError.setMessage("Validation error");
        apiError.setDebugMessage(ex.getMessage());
        
        ex.getConstraintViolations().forEach(violation -> {
            apiError.addSubError(new ApiValidationError(
                    violation.getRootBeanClass().getName(),
                    violation.getPropertyPath().toString(),
                    violation.getInvalidValue(),
                    violation.getMessage()));
        });
        
        log.error("Constraint violation", ex);
        return buildResponseEntity(apiError);
    }

    /**
     * Handle all other exceptions. Triggered by any exception not handled by other methods.
     *
     * @param ex the Exception
     * @return a ResponseEntity with an ApiError
     */
    @ExceptionHandler(Exception.class)
    protected ResponseEntity<Object> handleAllExceptions(Exception ex) {
        ApiError apiError = new ApiError(HttpStatus.INTERNAL_SERVER_ERROR);
        apiError.setMessage("An unexpected error occurred");
        apiError.setDebugMessage(ex.getLocalizedMessage());
        
        log.error("Internal server error", ex);
        return buildResponseEntity(apiError);
    }

    /**
     * Build a ResponseEntity with an ApiError.
     *
     * @param apiError the ApiError
     * @return a ResponseEntity with the ApiError
     */
    private ResponseEntity<Object> buildResponseEntity(ApiError apiError) {
        return new ResponseEntity<>(apiError, apiError.getStatus());
    }
}