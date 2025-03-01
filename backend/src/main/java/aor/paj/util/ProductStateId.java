package aor.paj.util;

public enum ProductStateId {
  RASCUNHO(1, "Rascunho"),
  DISPONIVEL(2, "Disponível"),
  RESERVADO(3, "Reservado"),
  COMPRADO(4, "Comprado");

  private final int stateId;
  private final String description;

  ProductStateId(int stateId) {
    this(stateId, null);
  }

  ProductStateId(int stateId, String description) {
    this.stateId = stateId;
    this.description = description != null ? description : name();
  }

  public int getStateId() {
    return stateId;
  }

  public String getDescription() {
    return this.description;
  }

  public static ProductStateId fromStateId(int stateId) {
    for (ProductStateId estado : values()) {
      if (estado.getStateId() == stateId) {
        return estado;
      }
    }
    throw new IllegalArgumentException("Invalid stateId: " + stateId);
  }
}