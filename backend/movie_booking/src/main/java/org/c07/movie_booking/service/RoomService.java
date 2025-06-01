package org.c07.movie_booking.service;

import org.c07.movie_booking.dto.admin.RoomAddDTO;
import org.c07.movie_booking.model.Room;
import org.c07.movie_booking.repository.IRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class RoomService {
    @Autowired
    IRoomRepository roomRepository;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    public void delete(long id){
        roomRepository.updateStatusById(id);
    }
    public Room update(Room room){
        try {
            Room savedRoom = roomRepository.save(room);
            return savedRoom;
        } catch (DataIntegrityViolationException ex) {
            return null;
        } catch (Exception ex) {
            return null;

        }

    }
    public void add(RoomAddDTO dto){
        Room room=new Room();
        room.setRoomName(dto.getRoomName());
        room.setStatus(dto.getStatus());
        room.setQuatitySeat(dto.getQuantitySeat());
        room.setDescription(dto.getDescription());
        roomRepository.save(room);
    }
}
