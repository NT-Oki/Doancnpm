package com.example.movie_booking.service.ai;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class ChatRunner implements CommandLineRunner {

    private final ChatService chatService;

    @Override
    public void run(String... args) {
//        String reviewContent = "phim như cục cứt, dở vãi cả lz";
//
//        String prompt = """
//        Phân tích cảm xúc của đoạn review phim sau và trả về JSON:
//        {
//          "sentiment": "positive | neutral | negative",
//          "score": số từ 0 đến 1
//        }
//
//        Chỉ trả về JSON, không cần giải thích.
//
//        Review:
//        "%s"
//        """.formatted(reviewContent);

        String result = chatService.chat("bạn có phải Gemini không");

        System.out.println("AI trả lời: " + result);
    }

}
