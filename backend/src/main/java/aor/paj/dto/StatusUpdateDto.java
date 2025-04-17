package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlRootElement;
import jakarta.xml.bind.annotation.XmlElement;

@XmlRootElement
public class StatusUpdateDto {
    private boolean active;

    public StatusUpdateDto() {}

    @XmlElement
    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}


