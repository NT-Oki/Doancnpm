package org.c07.movie_booking.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
@Entity
public class Seat {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String seatNumber;
    private String description;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    private int price;

    private boolean available;
}
