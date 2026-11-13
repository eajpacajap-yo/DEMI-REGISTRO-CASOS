package com.administracion.administracion.service;
import org.springframework.stereotype.Service;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import org.springframework.beans.factory.annotation.Value;
@Service
public class EmailService {

    // Clave
    @Value("${resend.api.key:}")
        private String resendApiKey;

    public void enviarCodigoRecuperacion(String destinatario, String codigo) {
        try {
            // Remitente 
            String remitente = "DEMI Soporte <soporte@demitotonicapan.org>";

            String jsonPayload = """
            {
              "from": "%s",
              "to": ["%s"],
              "subject": "Código de Recuperación - DEMI Totonicapán",
              "text": "Estimada usuaria,\\n\\nSe ha solicitado el restablecimiento de contraseña para su cuenta en el Sistema de Control de Expedientes DEMI.\\n\\nSu código de seguridad temporal es: %s\\n\\nEste código es personal, de un solo uso y caduca en 10 minutos.\\nSi usted no realizó esta solicitud, puede ignorar este mensaje.\\n\\nDefensoría de la Mujer Indígena - Sede Totonicapán"
            }
            """.formatted(remitente, destinatario, codigo);

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 400) {
                System.err.println(">>> Error devuelto por Resend API: " + response.body());
                throw new RuntimeException("Resend API devolvió código: " + response.statusCode());
            }

            System.out.println(">>> CORREO ENVIADO CON ÉXITO A: " + destinatario);
            

        } catch (Exception e) {
            System.err.println(">>> Error al despachar correo por HTTPS: " + e.getMessage());
            throw new RuntimeException("No fue posible enviar el correo de recuperación. Verifique la conexión.");
        }
    }
}