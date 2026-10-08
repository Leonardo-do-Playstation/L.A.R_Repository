package com.lar.storage;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Service
public class MinioStorageService implements StorageService {

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.access-key}")
    private String accessKey;

    @Value("${minio.secret-key}")
    private String secretKey;

    @Value("${minio.bucket}")
    private String bucket;

    private MinioClient buildClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }

    @Override
    public String upload(MultipartFile arquivo) {
        try {
            MinioClient client = buildClient();
            String nomeArquivo = UUID.randomUUID() + "-" + arquivo.getOriginalFilename();

            client.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(nomeArquivo)
                            .stream(arquivo.getInputStream(), arquivo.getSize(), -1)
                            .contentType(arquivo.getContentType())
                            .build());

            return endpoint + "/" + bucket + "/" + nomeArquivo;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar imagem: " + e.getMessage(), e);
        }
    }

    @Override
    public void delete(String urlArquivo) {
        if (urlArquivo == null || urlArquivo.isBlank()) {
            return;
        }
        try {
            String nomeArquivo = urlArquivo.substring(urlArquivo.lastIndexOf("/") + 1);
            MinioClient client = buildClient();

            client.removeObject(
                    RemoveObjectArgs.builder()
                            .bucket(bucket)
                            .object(nomeArquivo)
                            .build());
        } catch (Exception e) {
            // Sout apenas para registrar erro ao remover imagem, porém executa o delete no
            // banco
            System.err.println("Falha ao remover imagem do storage: " + e.getMessage());
        }
    }
}