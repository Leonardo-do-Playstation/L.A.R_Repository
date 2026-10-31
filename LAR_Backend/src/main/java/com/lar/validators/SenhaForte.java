package com.lar.validators;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = SenhaForteConstraintValidator.class)
public @interface SenhaForte {
    String message() default "A senha deve ter de 8 a 72 caracteres, com letra maiúscula, minúscula, número e caractere especial.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}