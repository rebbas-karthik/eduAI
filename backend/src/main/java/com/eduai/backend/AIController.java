
package com.eduai.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIController {

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/evaluate")
    public Map<String, Object> evaluate(
            @RequestBody Map<String, String> request) {

        String answer = request.getOrDefault("answer", "");

        return askOllama(
            "Evaluate this student's answer. Explain what is correct, " +
            "what is missing, and how to improve it. Give a score out of 10.\n\n" +
            "Student answer: " + answer
        );
    }

    @PostMapping("/summarize")
    public Map<String, Object> summarize(
            @RequestBody Map<String, String> request) {

        String answer = request.getOrDefault("answer", "");

        return askOllama(
            "Summarize the following text into clear, concise study notes " +
            "for a college student. Use bullet points where appropriate.\n\n" +
            "Text: " + answer
        );
    }

    private Map<String, Object> askOllama(String prompt) {
        String url = "http://localhost:11434/api/generate";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "model", "llama3.2:3b",
            "prompt", prompt,
            "stream", false
        );

        HttpEntity<Map<String, Object>> entity =
                new HttpEntity<>(body, headers);

        Map response = restTemplate.postForObject(
                url, entity, Map.class);

        String result = response == null
                ? "No response received from Ollama."
                : String.valueOf(response.get("response"));

        return Map.of("result", result);
    }
}
