package aor.paj.dto;

public enum EstadosDoProduto {
  RASCUNHO(1),
  DISPONIVEL(2),
  RESERVADO(3),
  COMPRADO(4);

  private final int stateId;

  EstadosDoProduto(int stateId) {
    this.stateId = stateId;
  }

  public int getStateId() {
    return stateId;
  }

  public static EstadosDoProduto fromStateId(int stateId) {
    for (EstadosDoProduto estado : values()) {
      if (estado.getStateId() == stateId) {
        return estado;
      }
    }
    throw new IllegalArgumentException("Invalid stateId: " + stateId);
  }
}
