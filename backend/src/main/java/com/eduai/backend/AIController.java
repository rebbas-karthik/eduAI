
package com.eduai.backend;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://edu-ai-steel.vercel.app"
})
public class AIController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/evaluate")
    public Map<String, Object> evaluate(
            @RequestBody Map<String, String> request) {

        String answer = request.getOrDefault("answer", "");

        return askAI(
            "Evaluate this student's answer. Explain what is correct, " +
            "what is missing, and how to improve it. Give a score out of 10.\n\n" +
            "Student answer: " + answer
        );
    }

    @PostMapping("/summarize")
    public Map<String, Object> summarize(
            @RequestBody Map<String, String> request) {

        String answer = request.getOrDefault("answer", "");

        return askAI(
            "Summarize the following text into clear, concise study notes " +
            "for a college student. Use bullet points where appropriate.\n\n" +
            "Text: " + answer
        );
    }

    private Map<String, Object> askAI(String prompt) {

        String token = System.getenv("GROQ_API_KEY");

        if (token == null || token.isBlank()) {
            throw new IllegalStateException(
                "GROQ_API_KEY is missing from the backend environment."
            );
        }

        String url = "https://api.groq.com/openai/v1/chat/completions";

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> message = Map.of(
            "role", "user",
            "content", prompt
        );

        Map<String, Object> body = new HashMap<>();
        body.put("model", "llama-3.3-70b-versatile");
        body.put("messages", List.of(message));
        body.put("stream", false);
        body.put("max_tokens", 700);

        HttpEntity<Map<String, Object>> entity =
            new HttpEntity<>(body, headers);

        ResponseEntity<Map> response = restTemplate.exchange(
            url,
            HttpMethod.POST,
            entity,
            Map.class
        );

        Map responseBody = response.getBody();

        if (responseBody == null) {
            throw new IllegalStateException(
                "No response received from Groq."
            );
        }

        List choices = (List) responseBody.get("choices");

        if (choices == null || choices.isEmpty()) {
            throw new IllegalStateException(
                "Groq returned no answer."
            );
        }

        Map choice = (Map) choices.get(0);
        Map messageResponse = (Map) choice.get("message");
        String result = String.valueOf(messageResponse.get("content"));

        return Map.of("result", result);
    }
}
