package com.lar.config;

import com.lar.security.OngStatusInterceptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Autowired
    private OngStatusInterceptor ongStatusInterceptor;

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(ongStatusInterceptor)
                .addPathPatterns("/ong/**")
                .excludePathPatterns("/ong/perfil", "/ong/perfil/**");
    }
}