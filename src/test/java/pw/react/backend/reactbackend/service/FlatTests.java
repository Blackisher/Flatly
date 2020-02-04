/*
package pw.react.backend.reactbackend.service;
import edu.pw.react.project.backend.dao.FlatRepository;
import edu.pw.react.project.backend.model.FlatEntity;
import edu.pw.react.project.middleware.service.FlatlyServiceImpl;
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
public class FlatTests {

        @Mock
        private FlatRepository repository;
        @Spy
        @InjectMocks
        private FlatlyServiceImpl FlatlyService;


        @Test
        public void givenNotExistingId_whenupdateFlat_theReturnFlatEMPTY() {
            when(repository.existsById(anyLong())).thenReturn(false);

            FlatEntity actual = FlatlyService.updateFlat(1L, new FlatEntity());

            assertThat(actual).isEqualTo(FlatEntity.EMPTY);
            verify(repository, times(1)).existsById(eq(1L));
            verify(repository, times(0)).save(any(FlatEntity.class));
        }

        @Test
        public void givenExistingId_whenupdateFlat_theReturnUpdatedFlat() {
            FlatEntity updatedFlat = new FlatEntity();
            when(repository.existsById(anyLong())).thenReturn(true);
            when(repository.save(any(FlatEntity.class))).thenReturn(updatedFlat);

            FlatEntity actual = FlatlyService.updateFlat(1L, updatedFlat);

            assertThat(actual).isEqualTo(updatedFlat);
            verify(repository, times(1)).existsById(eq(1L));
            verify(repository, times(1)).save(eq(updatedFlat));
        }


    }

*/
