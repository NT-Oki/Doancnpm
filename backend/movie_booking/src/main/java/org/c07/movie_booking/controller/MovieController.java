package org.c07.movie_booking.controller;


import io.swagger.v3.oas.annotations.parameters.RequestBody;
import jakarta.validation.Valid;
import org.c07.movie_booking.dto.MovieDTO;
import org.c07.movie_booking.dto.request.MovieCreateRequest;
import org.c07.movie_booking.dto.response.ResponseData;
import org.c07.movie_booking.model.Movie;
import org.c07.movie_booking.repository.IMovieRepository;
import org.c07.movie_booking.service.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/movie")
public class MovieController {
    @Autowired
    private IMovieService iMovieService;
    @Autowired
    private IMovieRepository movieRepository;

    private IMovieRepository movieRepository;

    @PostMapping
    ResponseData<MovieDTO> createMovie(@RequestBody @Valid MovieCreateRequest request) {
        return ResponseData.<MovieDTO>builder()
                .data(iMovieService.crateMovie(request))
                .message("Create Movie")
                .build();

    }

    @GetMapping("/movies")
    public ResponseData<List<MovieDTO>> getAllMovies() {
        return ResponseData.<List<MovieDTO>>builder()
                .data(iMovieService.getAllMovies())
                .message("Get All Movies")
                .build();
    }

    
//   @Override
    public List<MovieDTO> getFindAll() {
        List<Movie> movieEntity = movieRepository.findAll();
        List<MovieDTO> movieDTOList = new ArrayList<>();
        for (Movie movie : movieEntity) {
            MovieDTO dto = new MovieDTO();
            dto.setId(movie.getId());
            dto.setNameMovie(movie.getNameMovie());
            dto.setReleaseDate(movie.getReleaseDate());
            dto.setDurationMovie(movie.getDurationMovie());
            dto.setActor(movie.getActor());
            dto.setDirector(movie.getDirector());
            dto.setStudio(movie.getStudio());
            dto.setContent(movie.getContent());
            dto.setTrailer(movie.getTrailer());
            dto.setAvatar(movie.getAvatar());
            movieDTOList.add(dto);
        }
        return movieDTOList;
    }
}
