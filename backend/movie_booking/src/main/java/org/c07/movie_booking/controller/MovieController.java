package org.c07.movie_booking.controller;


import org.c07.movie_booking.dto.MovieDTO;
import org.c07.movie_booking.service.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class MovieController {
    @Autowired
    private IMovieService iMovieService;



    
    @GetMapping("/movies")
    public List<MovieDTO> getAllMovies() {
        return iMovieService.getFindAll();
    }

    
   @Override
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
