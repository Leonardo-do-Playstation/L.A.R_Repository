package com.lar.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.regex.Pattern;

public class SenhaForteConstraintValidator implements ConstraintValidator<SenhaForte, String> {

    public static final int TAMANHO_MINIMO = 8;
    public static final int TAMANHO_MAXIMO = 72;

    private static final Pattern MAIUSCULA = Pattern.compile("\\p{Lu}");
    private static final Pattern MINUSCULA = Pattern.compile("\\p{Ll}");
    private static final Pattern NUMERO = Pattern.compile("\\p{Nd}");
    private static final Pattern ESPECIAL = Pattern.compile("[^\\p{L}\\p{N}\\s]");

    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || value.isBlank()) {
            return true;
        }

        return value.length() >= TAMANHO_MINIMO
                && value.length() <= TAMANHO_MAXIMO
                && MAIUSCULA.matcher(value).find()
                && MINUSCULA.matcher(value).find()
                && NUMERO.matcher(value).find()
                && ESPECIAL.matcher(value).find();
    }
}