package org.c07.movie_booking.dto.admin;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminMovieDTO {

    private Long id;

    @NotBlank(message = "validation.movie.name.empty")
    private String nameMovie;

    private String releaseDate;

    private String durationMovie;

    private String actor;

    private String director;

    private String studio;

    private String content;

    private String trailer;

    private String avatar;

    private Long statusFilmId; // Id của trạng thái phim
}
