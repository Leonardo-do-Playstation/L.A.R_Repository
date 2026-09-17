package com.lar.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CnpjConstraintValidator implements ConstraintValidator<CnpjValido, String> {
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        return DocumentoValidator.cnpjValido(value);
    }
}