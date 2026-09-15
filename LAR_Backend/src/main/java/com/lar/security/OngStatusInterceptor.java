package com.lar.security;

import com.lar.entities.Ong;
import com.lar.exceptions.AcessoNegadoException;
import com.lar.exceptions.RecursoNaoEncontradoException;
import com.lar.repositories.OngRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class OngStatusInterceptor implements HandlerInterceptor {

    @Autowired
    private OngRepository ongRepository;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            return true; 
        }

        boolean isOng = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ONG"));

        if (!isOng) {
            return true;
        }

        Ong ong = ongRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException("ONG autenticada não encontrada."));

        switch (ong.getStatus()) {
            case PENDENTE -> throw new AcessoNegadoException(
                    "Sua ONG está com cadastro pendente de aprovação. Aguarde a análise do administrador.");
            case RECUSADA -> throw new AcessoNegadoException(
                    "O cadastro da sua ONG foi recusado. Entre em contato com o suporte.");
            case APROVADA -> {
                
            }
        }

        return true;
    }
}