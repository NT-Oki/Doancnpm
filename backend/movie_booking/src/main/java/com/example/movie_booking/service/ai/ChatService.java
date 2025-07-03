package com.example.movie_booking.service.ai;

import com.example.movie_booking.dto.SentimentResponseDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

@Service
public class ChatService {
    private ChatClient chatClient ;
    private final ObjectMapper objectMapper = new ObjectMapper();
    public ChatService(ChatClient.Builder builder) {
        chatClient = builder.build();
    }

    public String chat(String request) {
        return chatClient
                .prompt(request)
                .call()
                .content();
    }
    public SentimentResponseDTO getSentimentAssessment(String review, int rating) {
        String prompt = """
        Phân tích cảm xúc của đoạn review phim sau, kết hợp với rating người dùng cung cấp, và trả về JSON:
        {
          "sentiment": "positive | neutral | negative",
          "score": số từ 0 đến 1
        }

        Chỉ trả về JSON, không cần giải thích.

        Review:
        "%s"

        Rating: %d sao
        """.formatted(review, rating);
        String result = chat(prompt);

        if (result.startsWith("```")) {
            result = result.replaceAll("(?s)```json\\s*", "")
                    .replaceAll("(?s)```", "")
                    .trim();
        }
        System.out.println("AI trả lời: " + result);

        try {
            return objectMapper.readValue(result, SentimentResponseDTO.class);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi parse JSON từ AI: " + result, e);
        }
    }

}