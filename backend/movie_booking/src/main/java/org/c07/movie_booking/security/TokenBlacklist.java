package org.c07.movie_booking.security;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklist {
    private final Map<String, Long> blacklist = new ConcurrentHashMap<>();

    public void blacklistToken(String token, long expirationTime) {
        blacklist.put(token, expirationTime);
    }

    public boolean isTokenBlacklisted(String token) {
        Long expiration = blacklist.get(token);
        if (expiration == null) return false;
        if (System.currentTimeMillis() > expiration) {
            blacklist.remove(token);
            return false;
        }
        return true;
    }
}
