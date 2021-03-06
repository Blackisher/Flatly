package edu.pw.react.project.backend.model;

import lombok.Data;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Entity

@Table(name = "room_image", schema = "public")
@Data
public class ImageEntity {

    private static final long serialVersionUID = -1098893507296828123L;

    public static ImageEntity EMPTY = new ImageEntity();

    @Id
    //@GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "room_image_id", updatable = false, nullable = false)
    private Long id;

    @Column(name = "room_id")
    private Long room_id;

    @Lob
    @Type(type = "org.hibernate.type.BinaryType")
    @Column(name = "content")
    private byte[] content;

}
