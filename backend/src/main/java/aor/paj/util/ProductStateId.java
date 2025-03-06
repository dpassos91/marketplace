package aor.paj.util;

public enum ProductStateId {
  RASCUNHO(1, "Rascunho"),
  DISPONIVEL(2, "Disponível"),
  RESERVADO(3, "Reservado"),
  COMPRADO(4, "Comprado"),
  INATIVO(5, "Inativo");

  private final int stateId;
  private final String description;

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
    for (ProductStateId state : values()) {
      if (state.getStateId() == stateId) {
        return state;
      }
    }
    throw new IllegalArgumentException("Invalid stateId: " + stateId);
  }

  public static ProductStateId fromDescription(String description) {
    if (description == null) {
      return null;
    }

    for (ProductStateId state : values()) {
      if (state.getDescription().equalsIgnoreCase(description)) {
        return state;
      }
    }
    return null;
  }

  public static boolean isValidStateDescription(String description) {
    return fromDescription(description) != null;
  }

  /**
   * Checks if the state represents an active product state
   * (any state except INATIVO)
   */
  public boolean isActive() {
    return this != INATIVO;
  }
}