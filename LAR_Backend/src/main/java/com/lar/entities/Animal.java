package com.lar.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table (name = "tbl_animais")
public class Animal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    public String nome;
    public String especie;
    public Integer idade;
    public String raca;
    public String sexo;
    public String porte;
    @ManyToOne
    @JoinColumn(name = "id_ong", nullable = false)
    public Ong ong;


    public Animal() {
    }

   
}
