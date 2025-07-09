package com.example.movie_booking.service;

import com.example.movie_booking.dto.BookingDTO;
import com.example.movie_booking.dto.MovieViewCountDTO;
import com.example.movie_booking.dto.booking.*;
import com.example.movie_booking.dto.payment.PaymentRequestDTO;
import com.example.movie_booking.model.*;
import com.example.movie_booking.repository.*;
import com.example.movie_booking.util.BookingStatusJob;
import com.example.movie_booking.util.CodeGenerator;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.transaction.Transactional;
import org.quartz.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class BookingService {
    @Autowired
    IBookingRepository bookingRepository;
    @Autowired
    IBookingStatusRepository bookingStatusRepository;
    @Autowired
    IUserRepository userRepository;
    @Autowired
    IShowTimeRepository showTimeRepository;
    @Autowired
    IBookingSeatRepository bookingSeatRepository;
    @Autowired
    ISeatRepository seatRepository;
    @Autowired
    IShowTimeSeatRepository showTimeSeatRepository;

    @Autowired
    private PromotionService promotionService;

    @Autowired
    private PromotionRepository promotionRepository;
    @Autowired
    private Scheduler scheduler;

    public Booking save(Booking booking) {
        return bookingRepository.save(booking);
    }

    @Transactional
    public Booking createBooking(BookingDTO dto) {
        Booking booking = new Booking();
        BookingStatus bookingStatus = bookingStatusRepository.getReferenceById(1l);
        Showtime showtime = showTimeRepository.getReferenceById(dto.getShowtimeId());
        User user = userRepository.getReferenceById(dto.getUserId());
        booking.setUser(user);
        booking.setShowTime(showtime);
        booking.setDateBooking(LocalDate.now());
        booking.setBookingStatus(bookingStatus);
        bookingRepository.save(booking);
        return booking;
    }

    public Booking getBooking(Long id) {
        return bookingRepository.getReferenceById(id);
    }

    public BookingCheckoutDto addSeats(BookingDTO dto) {
        Booking booking = bookingRepository.findById(dto.getBookingId()).orElse(null);
        if (booking == null) {
            return null;
        }
        List<BookingSeat> seatList = new ArrayList<>();

        for (Long l : dto.getShowtimeSeats()) {
            BookingSeat bookingSeat = new BookingSeat();
            ShowTimeSeat showTimeSeat = showTimeSeatRepository.findById(l).orElse(null);
            if (showTimeSeat == null) {
                return null;
            }
            showTimeSeat.setStatus(2);
            showTimeSeat.setBookingId(booking.getId());
            showTimeSeat.setLocked_by_user_id(booking.getUser().getId());
            showTimeSeat.setLockedAt(LocalDateTime.now());
            Seat seat = showTimeSeat.getSeat();
            bookingSeat.setBooking(booking);
            bookingSeat.setSeat(seat);
            bookingSeat.setPrice(showTimeSeat.getPrice());
            seatList.add(bookingSeat);
            showTimeSeatRepository.save(showTimeSeat);
        }
        bookingSeatRepository.deleteByBookingId(booking.getId());
        bookingSeatRepository.saveAll(seatList);
        booking.setTotalAmount(dto.getTotalAmount());
        bookingRepository.save(booking);
        BookingCheckoutDto bookingCheckoutDto = new BookingCheckoutDto(booking);
        return bookingCheckoutDto;
    }

    public Booking updateTotalAmount(long id) {
        Booking booking = bookingRepository.getReferenceById(id);
        List<BookingSeat> bookingSeats = booking.getBookingSeats();
        int total = 0;
        for (BookingSeat bookingSeat : bookingSeats) {
            total += bookingSeat.getPrice();
        }
        booking.setTotalAmount(total);
        bookingRepository.save(booking);
        return booking;
    }

    public ChooseSeatResponseDTO getInformationForChooseSeat(long showtimeId) {
        Showtime showtime = showTimeRepository.findById(showtimeId).orElse(null);
        if (showtime == null) {
            return null;
        }
        List<ShowTimeSeat> showTimeSeats = showTimeSeatRepository.findByShowtimeId(showtimeId);
        List<ShowtimeSeatResponseDTO> showtimeSeatResponseDTOS = new ArrayList<>();
        for (ShowTimeSeat showTimeSeat : showTimeSeats) {
            showtimeSeatResponseDTOS.add(new ShowtimeSeatResponseDTO(showTimeSeat));
        }
        ChooseSeatResponseDTO responseDTO = new ChooseSeatResponseDTO(showtime, showtimeSeatResponseDTOS);
        return responseDTO;
    }

    public Booking paymentSuccessful(long bookingId) {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return null;
        }
        String bookingCode = CodeGenerator.generateBookingCode();
        booking.setCodeBooking(bookingCode);
        Booking booking1 = bookingRepository.save(booking);
        return booking1;
    }

    public String buildQRContent(long bookingId) throws Exception {
        Booking booking = bookingRepository.findById(bookingId).orElse(null);
        if (booking == null) {
            return null;
        }
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("bookingId", bookingId);
        data.put("name", booking.getUser().getName());
        data.put("movie", booking.getShowTime().getMovie().getNameMovie());
        data.put("time", booking.getShowTime().getStartTime().format(DateTimeFormatter.ofPattern("HH:mm dd/MM/yyyy")));
        data.put("seats", booking.getBookingSeats().stream()
                .map(s -> s.getSeat().getSeatNumber())
                .collect(Collectors.joining(",")));
        data.put("room", booking.getShowTime().getRoom().getRoomName());
        data.put("bookingCode", booking.getCodeBooking());
        ObjectMapper mapper = new ObjectMapper();
        return mapper.writeValueAsString(data);
    }

    public List<BookingCheckoutDto> getAllBookings() {
        List<BookingCheckoutDto> list = new ArrayList<>();
        List<Booking> bookings = bookingRepository.findByCodeBookingIsNotNull();
        for (Booking booking : bookings) {
            BookingCheckoutDto bookingCheckoutDto = new BookingCheckoutDto(booking);
            list.add(bookingCheckoutDto);
        }
        return list;
    }

    // public String createQR(PaymentRequestDTO dto){
    // String
    // qr="https://img.vietqr.io/image/BIDV-3148149366-compact.png?amount="+dto.getAmount()+
    // "&addInfo="+dto.getAddInfo();
    // return qr;
    // }
    @Transactional
    public BookingCheckoutDto applyPromotionToBooking(long bookingId,
            com.example.movie_booking.dto.promotion.ApplyPromotionRequest request) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Validate promotion again for security
        com.example.movie_booking.dto.promotion.PromotionValidationResult validationResult = promotionService
                .validatePromotion(request.getPromotionCode(),
                        request.getFinalAmount().add(request.getDiscountAmount()));

        if (!validationResult.isValid()) {
            throw new RuntimeException(validationResult.getErrorMessage());
        }

        Promotion promotion = validationResult.getPromotion();

        // Save original amount if not already saved
        if (booking.getOriginalAmount() == null) {
            booking.setOriginalAmount(booking.getTotalAmount());
        }

        // Apply promotion
        booking.setPromotion(promotion);
        booking.setDiscountAmount(request.getDiscountAmount().intValue());
        booking.setTotalAmount(request.getFinalAmount().intValue());

        // Increment usage count
        promotionService.incrementUsageCount(promotion);

        bookingRepository.save(booking);

        return new BookingCheckoutDto(booking);
    }

    public long countSeatsSoldByDate(LocalDate date) {
        return bookingSeatRepository.countSeatsSoldByDate(date);
    }

    public List<UserHistoryBooking> getBookingByUserId(long userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream().map(booking -> UserHistoryBooking.builder()
                .codeBooking(booking.getCodeBooking())
                .dateBooking(booking.getDateBooking().toString())
                .totalAmount(booking.getTotalAmount())
                .status(booking.getBookingStatus().getName())
                .movieTitle(booking.getShowTime().getMovie().getNameMovie())
                .startTime(booking.getShowTime().getStartTime().toString())
                .seatNames(
                        booking.getBookingSeats().stream().map(
                                seat -> seat.getSeat().getSeatNumber()).collect(Collectors.toList()))
                .build()).toList();
    }

    // Thống kê
    public List<RevenueStatusDTO> getRevenueStatus(String type, Integer year, Integer month) {
        List<Booking> bookings = bookingRepository.findByBookingStatus_Name("Confirmed");

        return switch (type.toLowerCase()) {
            case "daily" -> getDailyRevenue(bookings, year, month);
            case "monthly" -> getMonthRevenue(bookings, year);
            case "yearly" -> getYearRevenue(bookings);
            default -> throw new IllegalArgumentException("Invalid type: " + type);
        };
    }

    public Integer getTotalRevenue() {
        List<Booking> bookings = bookingRepository.findByBookingStatus_Name("Confirmed");
        return bookings.stream()
                .mapToInt(Booking::getTotalAmount)
                .sum();
    }

    public Integer getTotalTicketsSold() {
        List<Booking> bookings = bookingRepository.findByBookingStatus_Name("Confirmed");
        return bookings.stream()
                .flatMap(b -> b.getBookingSeats().stream())
                .mapToInt(seat -> 1)
                .sum();
    }

    private List<RevenueStatusDTO> getYearRevenue(List<Booking> bookings) {
        return bookings.stream()
                .collect(Collectors.groupingBy(
                        b -> String.valueOf(b.getDateBooking().getYear()),
                        Collectors.summingInt(Booking::getTotalAmount)))
                .entrySet()
                .stream()
                .map(e -> new RevenueStatusDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(RevenueStatusDTO::getDate))
                .toList();

    }

    private List<RevenueStatusDTO> getMonthRevenue(List<Booking> bookings, Integer year) {
        if (year == null) {
            throw new IllegalArgumentException("Year is required for monthly stats.");
        }

        return bookings.stream()
                .filter(b -> b.getDateBooking().getYear() == year)
                .collect(Collectors.groupingBy(
                        b -> String.format("%d-%02d", year, b.getDateBooking().getMonthValue()),
                        Collectors.summingInt(Booking::getTotalAmount)))
                .entrySet()
                .stream()
                .map(e -> new RevenueStatusDTO(e.getKey(), e.getValue()))
                .sorted(Comparator.comparing(RevenueStatusDTO::getDate))
                .toList();
    }

    private List<RevenueStatusDTO> getDailyRevenue(List<Booking> bookings, Integer year, Integer month) {
        if (year == null || month == null) {
            throw new IllegalArgumentException("Invalid year/month");
        }
        return bookings.stream()
                .filter(b -> b.getDateBooking().getYear() == year && b.getDateBooking().getMonthValue() == month)
                .collect(Collectors.groupingBy(
                        Booking::getDateBooking,
                        Collectors.summarizingInt(Booking::getTotalAmount)))
                .entrySet()
                .stream()
                .map(e -> new RevenueStatusDTO(e.getKey().toString(), Integer.valueOf((int) e.getValue().getSum())))
                .sorted(Comparator.comparing(RevenueStatusDTO::getDate))
                .toList();
    }

    public List<MovieViewCountDTO> getTop5MostMovies() {
        List<Object[]> res = bookingSeatRepository.findTop5MostWatchedMovies(PageRequest.of(0, 5));
        return res.stream()
                .map(row -> new MovieViewCountDTO(
                        (String) row[0], ((Number) row[1]).longValue()))
                .toList();
    }

    public void deleteById(long bookingId) {
        bookingRepository.deleteById(bookingId);
    }
    public void scheduleBookingStatusJob(Long bookingId, LocalDateTime runAt) throws SchedulerException {
        JobDetail jobDetail = JobBuilder.newJob(BookingStatusJob.class)
                .withIdentity("bookingJob-" + bookingId, "booking")
                .usingJobData("bookingId", bookingId)
                .build();

        Trigger trigger = TriggerBuilder.newTrigger()
                .withIdentity("bookingTrigger-" + bookingId, "booking")
                .startAt(Timestamp.valueOf(runAt))
                .build();

        scheduler.scheduleJob(jobDetail, trigger);
    }
    public List<Booking> findBookingbyBookingStatusIdNot(long bookingId) {
        return bookingRepository.findByBookingStatusIdNot(bookingId);
    }
    public BookingStatus findByBookingStatusId(long bookingStatusId){
        return bookingStatusRepository.findById(bookingStatusId).orElse(null);
    }
}
