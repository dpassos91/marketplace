package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class AvaliacaoDto {
    private String autor;
    private String data;
    private String texto;
    private int estrelas;

    public AvaliacaoDto() {
    }

    public AvaliacaoDto(String autor, String data, String texto, int estrelas) {
        this.autor = autor;
        this.data = data;
        this.texto = texto;
        this.estrelas = estrelas;
    }

    @XmlElement
    public String getAutor() {
        return autor;
    }

    @XmlElement
    public String getData() {
        return data;
    }

    @XmlElement
    public String getTexto() {
        return texto;
    }

    @XmlElement
    public int getEstrelas() {
        return estrelas;
    }

    public void setAutor(String autor) {
        this.autor = autor;
    }

    public void setData(String data) {
        this.data = data;
    }

    public void setTexto(String texto) {
        this.texto = texto;
    }

    public void setEstrelas(int estrelas) {
        this.estrelas = estrelas;
    }
}
