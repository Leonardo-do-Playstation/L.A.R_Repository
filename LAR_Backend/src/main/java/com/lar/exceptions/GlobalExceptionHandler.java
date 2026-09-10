package com.lar.exceptions;

import com.lar.dtos.ErroResponseDTO;
import com.lar.dtos.ErroValidacaoResponseDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<ErroResponseDTO> handleNaoEncontrado(RecursoNaoEncontradoException ex,
                                                                 HttpServletRequest request) {
        return construirResposta(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(AcessoNegadoException.class)
    public ResponseEntity<ErroResponseDTO> handleAcessoNegado(AcessoNegadoException ex,
                                                                 HttpServletRequest request) {
        return construirResposta(HttpStatus.FORBIDDEN, ex.getMessage(), request);
    }

    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<ErroResponseDTO> handleRegraDeNegocio(RegraDeNegocioException ex,
                                                                    HttpServletRequest request) {
        return construirResposta(HttpStatus.CONFLICT, ex.getMessage(), request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErroResponseDTO> handleCredenciaisInvalidas(BadCredentialsException ex,
                                                                         HttpServletRequest request) {
        return construirResposta(HttpStatus.UNAUTHORIZED, "E-mail ou senha inválidos.", request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErroValidacaoResponseDTO> handleValidacao(MethodArgumentNotValidException ex,
                                                                        HttpServletRequest request) {
        Map<String, String> campos = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(erro ->
                campos.put(erro.getField(), erro.getDefaultMessage())
        );

        ErroValidacaoResponseDTO corpo = new ErroValidacaoResponseDTO(
                HttpStatus.BAD_REQUEST.value(),
                "Erro de validação",
                campos,
                request.getRequestURI()
        );
        return ResponseEntity.badRequest().body(corpo);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErroResponseDTO> handleGenerico(RuntimeException ex, HttpServletRequest request) {
        return construirResposta(HttpStatus.BAD_REQUEST, ex.getMessage(), request);
    }

    private ResponseEntity<ErroResponseDTO> construirResposta(HttpStatus status, String mensagem,
                                                                 HttpServletRequest request) {
        ErroResponseDTO corpo = new ErroResponseDTO(
                status.value(),
                status.getReasonPhrase(),
                mensagem,
                request.getRequestURI()
        );
        return ResponseEntity.status(status).body(corpo);
    }
}