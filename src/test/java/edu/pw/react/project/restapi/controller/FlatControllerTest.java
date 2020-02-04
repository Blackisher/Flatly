package edu.pw.react.project.restapi.controller;

import edu.pw.react.project.FlatlyApplication;
import edu.pw.react.project.backend.dao.FlatRepository;
import edu.pw.react.project.backend.model.FlatEntity;
import edu.pw.react.project.backend.model.ImageEntity;
import edu.pw.react.project.backend.model.PaymentMethodsEntity;
import gherkin.deps.com.google.gson.Gson;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.io.*;
import java.util.Optional;
import java.util.Set;

import static edu.pw.react.project.utils.TestConstants.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = FlatlyApplication.class)
@ActiveProfiles(profiles = {"dev"})//FIXME zmienic na IT
public class FlatControllerTest {

    private static final String FLAT_PATH = "flats/";

    private MockMvc mockMvc;

    @Autowired
    private FlatRepository repository;
    @Autowired
    private FlatController flatController;

    @Before
    public void setup() {
        this.mockMvc = MockMvcBuilders.standaloneSetup(this.flatController).build();
    }

    @Test
    public void whenNoSecurityHeader_thenStatusCode403() throws Exception {
        MockHttpServletRequestBuilder getCompany = get("/flats/1");
        mockMvc.perform(getCompany).andExpect(status().isUnauthorized());
    }

    public String loadJsonFromFileAsString(String path, String filename) {
        try {
            BufferedReader buf = new BufferedReader(new InputStreamReader(
                    new FileInputStream(path + filename), "UTF-8"));
            String line = buf.readLine();
            StringBuilder sb = new StringBuilder();

            while (line != null) {
                sb.append(line).append("\n");
                line = buf.readLine();
            }

            String fileAsString = sb.toString();
            return fileAsString;
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    public String loadJsonFromFileAsObject(String path, String filename) {
        //JSON parser object to parse read file
        JSONParser jsonParser = new JSONParser();

        try (FileReader reader = new FileReader(path + filename))
        {
            //Read JSON file
            Object obj = jsonParser.parse(reader);

            JSONArray employeeList = (JSONArray) obj;
            System.out.println(employeeList);

            //Iterate over employee array
            employeeList.forEach( emp -> parseEmployeeObject( (JSONObject) emp ) );

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static void parseEmployeeObject(JSONObject employee)
    {
        //Get employee object within list
        JSONObject employeeObject = (JSONObject) employee.get("employee");

        //Get employee first name
        String firstName = (String) employeeObject.get("firstName");
        System.out.println(firstName);

        //Get employee last name
        String lastName = (String) employeeObject.get("lastName");
        System.out.println(lastName);

        //Get employee website name
        String website = (String) employeeObject.get("website");
        System.out.println(website);
    }

    @Test
    public void whenPostNewRoom_thenThatRoomIsInsertedIntoDatabase() throws Exception {
        Long returnedID = 999999L;

        String content = loadJsonFromFileAsString(PATH + FLAT_PATH, "FlatControllerTest_001.JSON");
        content = content.replace("DESCRIPTION", DESCRIPTION);
        MockHttpServletRequestBuilder post = post("/flats")
                .contentType(MediaType.APPLICATION_JSON)
                .header(PASSWORD_HEADER, PASSWORD)
                .content(content);
        String responseContentForPost = mockMvc.perform(post)
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        /*
        //FIXME for autogenerated ID

        String[] splited = responseContentForPost.split("\"");
        String dirtyId = splited[2];
        Long returnedID = new Long(dirtyId.substring(1, dirtyId.length()-1));*/
        /*FIXME
        Gson g = new Gson();
        FlatEntity returnedFlat = g.fromJson(responseContentForPost, FlatEntity.class);*/


        Optional<FlatEntity> fromRepository = repository.findById(returnedID);
        assertThat(fromRepository.isPresent()).isEqualTo(true);
        FlatEntity flatInDb = fromRepository.get();
        ImageEntity image = flatInDb.getRoom_image();

        assertThat(flatInDb.getId()).isEqualTo(returnedID);
        //FIXME assertThat(flatInDb.getOwner_of_room()).isNotNull();
        assertThat(flatInDb.getName_of_room()).isEqualTo("Room_for_test");
        //FIXME assertThat(flatInDb.getStart_date()).isEqualTo("2020-01-01");
        assertThat(flatInDb.getActive()).isEqualTo('T');
        assertThat(flatInDb.getEnd_date()).isNull();
        assertThat(flatInDb.getDescription()).isEqualTo(DESCRIPTION);
        assertThat(flatInDb.getCity()).isEqualTo("Warsaw");
        assertThat(flatInDb.getStreet()).isEqualTo("Marszałkowska");
        assertThat(flatInDb.getNumber_of_street()).isEqualTo("15");
        assertThat(flatInDb.getNumber_of_block()).isEqualTo("7");
        assertThat(flatInDb.getZip_code()).isEqualTo("01-234");
        assertThat(flatInDb.getCountry()).isEqualTo("Poland");
        assertThat(flatInDb.getPrice()).isEqualTo(123456789);

//        java.lang.AssertionError: Failed to parse 01:23:01 with any of these date formats:
//   [yyyy-MM-dd'T'HH:mm:ss.SSS,
//                yyyy-MM-dd HH:mm:ss.SSS,
//                yyyy-MM-dd'T'HH:mm:ssX,
//                yyyy-MM-dd'T'HH:mm:ss,
//                yyyy-MM-dd]
        //FIXME assertThat(flatInDb.getCheck_in_from()).isEqualTo("01:23:01");
        //FIXME assertThat(flatInDb.getCheck_in_to()).isEqualTo("12:45:02");
        //FIXME assertThat(flatInDb.getCheck_out()).isEqualTo("17:34:03");
        assertThat(flatInDb.getLimit_of_quests()).isEqualTo(5);

        //FIXME assertThat(image).isNotNull();
        //FIXME assertThat(image.getId()).isEqualTo(2);
        //assertThat(image.getContent().equals());

        Set<PaymentMethodsEntity> paymentMethods = flatInDb.getPayment_methods();
        //FIXME assertThat(paymentMethods.size()).isEqualTo(2);
        //assertThat(paymentMethods.containsAll());

        //FIXME assertThat(flatInDb.getRoom_bookings()).isNull();



        //PUT
        content = loadJsonFromFileAsString(PATH + FLAT_PATH, "FlatControllerTest_002.JSON");
        content = content.replace("DESCRIPTION", "UPDATED" + DESCRIPTION);
        content = content.replace("{\"name_of_room", "{\"id\":\"" + returnedID + "\", \"name_of_room");
        MockHttpServletRequestBuilder post_updated = post("/flats/" + returnedID)
                .contentType(MediaType.APPLICATION_JSON)
                .header(PASSWORD_HEADER, PASSWORD)
                .content(content);

        String responseContentOfPut = mockMvc.perform(post_updated).andExpect(status().isOk()).andReturn().getResponse().getContentAsString();


        fromRepository = repository.findById(returnedID);
        assertThat(fromRepository.isPresent()).isEqualTo(true);
        flatInDb = fromRepository.get();
        image = flatInDb.getRoom_image();

        assertThat(flatInDb.getId()).isEqualTo(returnedID);
        //FIXME assertThat(flatInDb.getOwner_of_room()).isNotNull();
        assertThat(flatInDb.getName_of_room()).isEqualTo("Updated Room_for_test");
        //FIXME assertThat(flatInDb.getStart_date()).isEqualTo("2021-02-03");
        assertThat(flatInDb.getActive()).isEqualTo('T');
        //FIXME assertThat(flatInDb.getEnd_date()).isEqualTo("3132-12-14");
        assertThat(flatInDb.getDescription()).isEqualTo("UPDATED" + DESCRIPTION);
        assertThat(flatInDb.getCity()).isEqualTo("Updated Warsaw");
        assertThat(flatInDb.getStreet()).isEqualTo("Updated Marszałkowska");
        assertThat(flatInDb.getNumber_of_street()).isEqualTo("26");
        assertThat(flatInDb.getNumber_of_block()).isEqualTo("8");
        assertThat(flatInDb.getZip_code()).isEqualTo("12-654");
        assertThat(flatInDb.getCountry()).isEqualTo("Updated Poland");
        assertThat(flatInDb.getPrice()).isEqualTo(1234567890);

//        java.lang.AssertionError: Failed to parse 01:23:01 with any of these date formats:
//   [yyyy-MM-dd'T'HH:mm:ss.SSS,
//                yyyy-MM-dd HH:mm:ss.SSS,
//                yyyy-MM-dd'T'HH:mm:ssX,
//                yyyy-MM-dd'T'HH:mm:ss,
//                yyyy-MM-dd]
        //FIXME assertThat(flatInDb.getCheck_in_from()).isEqualTo("12:34:12");
        //FIXME assertThat(flatInDb.getCheck_in_to()).isEqualTo("13:56:12");
        //FIXME assertThat(flatInDb.getCheck_out()).isEqualTo("18:45:14");
        assertThat(flatInDb.getLimit_of_quests()).isEqualTo(50);

        //FIXME assertThat(image).isNotNull();
        //FIXME assertThat(image.getId()).isEqualTo(3);
        //assertThat(image.getContent().equals());

        paymentMethods = flatInDb.getPayment_methods();
        //FIXME assertThat(paymentMethods.size()).isEqualTo(1);
        //assertThat(paymentMethods.containsAll());

        //FIXME assertThat(flatInDb.getRoom_bookings()).isNull();



        //GET
        MockHttpServletRequestBuilder flatFromGet = post("/flats/" + returnedID)
                .contentType(MediaType.APPLICATION_JSON)
                .header(PASSWORD_HEADER, PASSWORD)
                .content(content);

        String returnedContetAsString = mockMvc.perform(post)
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        /*FIXME Gson g = new Gson();
        FlatEntity returnedFlat = g.fromJson(returnedContetAsString, FlatEntity.class);
        assertThat(flatInDb).isEqualTo(returnedFlat);*/



        //DELETE
        MockHttpServletRequestBuilder deleteFlat = delete("/flats/" + returnedID)
                .contentType(MediaType.APPLICATION_JSON)
                .header(PASSWORD_HEADER, PASSWORD)
                .content(content);
        mockMvc.perform(deleteFlat)
                .andExpect(status().isOk())
                .andExpect(content().string("Flat with id " +returnedID + " was deleted."));

        Optional<FlatEntity> afterDeleteflatInDb = repository.findById(returnedID);
        assertThat(afterDeleteflatInDb.isPresent()).isTrue();
        assertThat(afterDeleteflatInDb.get().getActive()).isEqualTo('F');
    }
}
