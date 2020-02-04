/*
package pw.react.backend.reactbackend.service;

import edu.pw.react.project.backend.dao.BookingRepository;
import edu.pw.react.project.backend.model.BookingEntity;
import edu.pw.react.project.middleware.service.BookingServiceImpl;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.MockitoJUnitRunner;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@RunWith(MockitoJUnitRunner.class)
public class BookingTests {

    @Mock
    private BookingRepository repository;
    @Spy
    @InjectMocks
    private BookingServiceImpl bookingService;

    @Test
    public void givenNotExistingId_whenUpdateBooking_theReturnbookingEMPTY() {
        when(repository.existsById(anyLong())).thenReturn(false);

        BookingEntity actual = bookingService.updateBooking(1L, new BookingEntity());

        assertThat(actual).isEqualTo(BookingEntity.EMPTY);
        verify(repository, times(1)).existsById(eq(1L));
        verify(repository, times(0)).save(any(BookingEntity.class));
    }

    @Test
    public void givenExistingId_whenUpdateBooking_theReturnUpdatedBooking() {
        BookingEntity updatedBooking = new BookingEntity();
        when(repository.existsById(anyLong())).thenReturn(true);
        when(repository.save(any(BookingEntity.class))).thenReturn(updatedBooking);

        BookingEntity actual = bookingService.updateBooking(1L, updatedBooking);

        assertThat(actual).isEqualTo(updatedBooking);
        verify(repository, times(1)).existsById(eq(1L));
        verify(repository, times(1)).save(eq(updatedBooking));
    }

}



*/
