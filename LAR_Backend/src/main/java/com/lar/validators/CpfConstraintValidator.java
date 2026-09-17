package com.lar.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CpfConstraintValidator implements ConstraintValidator<CpfValido, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return DocumentoValidator.cpfValido(value);
    }
}