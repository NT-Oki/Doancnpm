package org.c07.movie_booking.service.implement;

import org.c07.movie_booking.dto.admin.AdminMovieDTO;
import org.c07.movie_booking.dto.MovieDTO;
import org.c07.movie_booking.model.Movie;
import org.c07.movie_booking.model.StatusFilm;
import org.c07.movie_booking.repository.IMovieRepository;
import org.c07.movie_booking.repository.IStatusFilmRepository;
import org.c07.movie_booking.service.IMovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.c07.movie_booking.mapper.MovieMapper;
import org.c07.movie_booking.dto.request.MovieCreateRequest;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MovieService implements IMovieService {
    @Autowired
    private IMovieRepository movieRepository;

    @Autowired
    private IStatusFilmRepository statusFilmRepository;

    private MovieMapper movieMapper;

    @Override
    public MovieDTO crateMovie(MovieCreateRequest request) {
        Movie movie = movieMapper.toMovie(request);
        return movieMapper.toMovieDTO(movieRepository.save(movie));
    }

    @Override
    public List<MovieDTO> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(movieMapper::toMovieDTO)
                .collect(Collectors.toList());
    }

// dành cho admin
    @Override
    public List<Movie> findAll() {
        return movieRepository.findAll();
    }

    @Override
    public Optional<Movie> findById(Long id) {
        return movieRepository.findById(id);
    }

    @Override
    public List<Movie> findActiveMovies() {
        return movieRepository.findByStatusFilmId_Id(1);
    }

    @Override
    public Movie findByIdAndStatus(Long id, int statusId) {
        return movieRepository.findByIdAndStatusFilmId_Id(id, statusId);
    }

    @Override
    public Movie save(AdminMovieDTO dto) {
        Movie movie = convertToEntity(dto);
        return movieRepository.save(movie);
    }

    @Override
    public void delete(Movie movie) {
        movieRepository.delete(movie);
    }

    @Override
    public Movie convertToEntity(AdminMovieDTO dto) {
        StatusFilm statusFilm = null;
        if (dto.getStatusFilmId() != null) {
            statusFilm = statusFilmRepository.findById(dto.getStatusFilmId()).orElse(null);
        }

        return Movie.builder()
                .id(dto.getId())
                .nameMovie(dto.getNameMovie())
                .releaseDate(dto.getReleaseDate())
                .durationMovie(dto.getDurationMovie())
                .actor(dto.getActor())
                .director(dto.getDirector())
                .studio(dto.getStudio())
                .content(dto.getContent())
                .trailer(dto.getTrailer())
                .avatar(dto.getAvatar())
                .statusFilmId(statusFilm)
                .build();
    }
}
