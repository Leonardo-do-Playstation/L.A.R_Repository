package com.lar.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.lar.entities.RegistroAuditoria;

public interface RegistroAuditoriaRepository extends JpaRepository<RegistroAuditoria, Long> {
   List<RegistroAuditoria> findAllByOrderByDataHoraDesc();
}
