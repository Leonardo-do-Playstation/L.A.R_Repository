package com.lar.storage;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
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

    @Override
    public String upload(MultipartFile arquivo) {
        try {
            MinioClient client = MinioClient.builder()
                    .endpoint(endpoint)
                    .credentials(accessKey, secretKey)
                    .build();

            String nomeArquivo = UUID.randomUUID() + "-" + arquivo.getOriginalFilename();

            client.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(nomeArquivo)
                            .stream(arquivo.getInputStream(), arquivo.getSize(), -1)
                            .contentType(arquivo.getContentType())
                            .build()
            );

            return endpoint + "/" + bucket + "/" + nomeArquivo;

        } catch (Exception e) {
            throw new RuntimeException("Erro ao enviar imagem: " + e.getMessage(), e);
        }
    }
}