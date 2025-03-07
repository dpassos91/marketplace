# Grupo 5 | Projeto 3 | PAJ

### jorge-nuno-diogo-proj3

<ul>
  <li>Jorge Cruz</li>
  <li>Diogos Passos</li>
  <li>Nuno Gonçalves</li>
</ul>

# Tabela de Requisitos

| Categoria                      | Requisito                                                                          | Grupos     | Responsável |
| ------------------------------ | ---------------------------------------------------------------------------------- | ---------- | ----------- |
| Interface Funcional - Frontend | C1 - Alterar o seu perfil e imagem                                                 | Todos      | Nuno        |
| Interface Funcional - Frontend | C2 - Adicionar produto                                                             | Todos      | Jorge       |
| Interface Funcional - Frontend | C3 - Editar produto de sua autoria                                                 | Todos      | Jorge       |
| Interface Funcional - Frontend | C4 - Alterar o estado de um produto                                                | Todos      | Jorge       |
| Interface Funcional - Frontend | A1 - Editar produtos de outros utilizadores                                        | Todos      | Jorge/Diogo |
| Interface Funcional - Frontend | A2 - Apagar produtos (seus e de outros utilizadores)                               | Todos      | Jorge       |
| Interface Funcional - Frontend | A3 - Consultar o perfil de um utilizador específico                                | Todos      | Diogo       |
| Interface Funcional - Frontend | A4 - Filtrar lista de produtos criados por um utilizador                           | Todos      | Diogo       |
| Interface Funcional - Frontend | A5 - Filtrar lista de produtos PC categoria                                        | Todos      | Diogo       |
| Interface Funcional - Frontend | A6 - Consultar produtos alterados                                                  | Todos      | Diogo       |
| Interface Funcional - Frontend | A7 - Adicionar categoria de produtos                                               | Todos      | Diogo       |
| Interface Funcional - Frontend | A8 - Apagar um utilizador                                                          | Todos      | Diogo/Nuno  |
| Interface Funcional - Frontend | A9 - Apagar todos os produtos criados por um utilizador                            | Todos      | Diogo       |
| Interface Funcional - Frontend | A10 - Excluir permanentemente produtos                                             | Todos      | Jorge       |
| Interface Funcional - Frontend | A11 - Excluir permanentemente utilizadores                                         | Todos      | Nuno        |
| Interface Funcional - Frontend | AV1 - Adicionar avaliação de um vendedor                                           | Grupo de 3 | Jorge       |
| Interface Funcional - Frontend | AV2 - Editar avaliação de um vendedor                                              | Grupo de 3 | Jorge       |
| Interface Funcional - Frontend | AV3 - Excluir permanentemente uma avaliação de um vendedor                         | Grupo de 3 | Jorge       |
| Interface Funcional - Frontend | AV4 - Listar as avaliações de um vendedor                                          | Grupo de 3 | Diogo       |
| Persistência - Backend         | Modelo de dados                                                                    | Todos      | Jorge/Nuno  |
| Persistência - Backend         | Utilização do PostgreSQL                                                           | Todos      | Jorge/Nuno  |
| Persistência - Backend         | Entities segundo o modelo de dados                                                 | Todos      | Jorge/Nuno  |
| Persistência - Backend         | DAO's                                                                              | Todos      | Jorge/Nuno  |
| Persistência - Backend         | Utilização de Criteria API ou JPQL                                                 | Todos      | Jorge/Nuno  |
| Requisito Funcional - Backend  | Token                                                                              | Todos      | Nuno        |
| Requisito Funcional - Backend  | C1 - Alterar o seu perfil e imagem                                                 | Todos      | Nuno        |
| Requisito Funcional - Backend  | C2 - Adicionar produto                                                             | Todos      | Jorge       |
| Requisito Funcional - Backend  | C3 - Editar produto de sua autoria                                                 | Todos      | Jorge       |
| Requisito Funcional - Backend  | C4 - Alterar o estado de um produto                                                | Todos      | Jorge       |
| Requisito Funcional - Backend  | A1 - Editar produtos de outros utilizadores                                        | Todos      | Jorge       |
| Requisito Funcional - Backend  | A2 - Apagar produtos (seus e de outros utilizadores)                               | Todos      | Jorge       |
| Requisito Funcional - Backend  | A3 - Consultar o perfil de um utilizador específico                                | Todos      | Diogo       |
| Requisito Funcional - Backend  | A4 - Filtrar lista de produtos criados por um utilizador                           | Todos      | Jorge       |
| Requisito Funcional - Backend  | A5 - Filtrar lista de produtos por categoria                                       | Todos      | Jorge       |
| Requisito Funcional - Backend  | A6 - Consultar produtos alterados                                                  | Todos      | Jorge       |
| Requisito Funcional - Backend  | A7 - Adicionar categoria de produtos                                               | Todos      | Jorge       |
| Requisito Funcional - Backend  | A8 - Apagar um utilizador                                                          | Todos      | Nuno        |
| Requisito Funcional - Backend  | A9 - Apagar todos os produtos criados por um utilizador                            | Todos      | Nuno        |
| Requisito Funcional - Backend  | A10 - Excluir permanentemente produtos                                             | Todos      | Jorge       |
| Requisito Funcional - Backend  | A11 - Excluir permanentemente utilizadores                                         | Todos      | Nuno        |
| Requisito Funcional - Backend  | AV1 - Adicionar avaliação de um vendedor                                           | Grupo de 3 | Jorge       |
| Requisito Funcional - Backend  | AV2 - Editar avaliação de um vendedor                                              | Grupo de 3 | Jorge       |
| Requisito Funcional - Backend  | AV3 - Excluir permanentemente uma avaliação de um vendedor                         | Grupo de 3 | Jorge       |
| Requisito Funcional - Backend  | AV4 - Listar as avaliações de um vendedor                                          | Grupo de 3 | Jorge       |
| Testes                         | Tem de existir pelo menos um teste no postman para cada endpoint REST              | Todos      | Todos       |
| Testes                         | Pelo menos 10 testes da função principal em java usando Junit                      | Todos      | Jorge/Nuno  |
| Testes                         | Pelo menos 5 testes da função principal em java usando Jest                        | Todos      | Jorge       |
| Testes                         | Implementar testes no postman, 3 testes JUNIT e 2 testes Jest para a retrospetiva. | Grupo de 3 | Todos       |

### **Objetivo**

- Extensão da aplicação do projeto 2
- Utilização de PostgreSQL para persistência de dados no servidor
- Utilização de JPA e criação de endpoints REST
- Tecnologias: JAX-RS, EJBs, Git, Maven

### **Data de Entrega**

- 5 de março de 2025

### **Grupos**

- Definidos pelos docentes
- Composto por dois elementos

### **Arquitetura do Sistema**

- Backend: Projeto Maven interagindo com PostgreSQL usando Jakarta Persistence API e Hibernate
- API REST: Formato JSON, consumida por endpoints do Postman

### **Especificação de Funcionalidades**

#### **Tipos de Utilizadores**

- Cliente (Comprador/Vendedor)
- Administrador

#### **Dados a Persistir**

**Utilizadores:**

- Primeiro nome, último nome, username, password, email, número de telemóvel, fotografia (URL), token de autenticação

**Produtos:**

- Título, descrição, preço, categoria, localização, vendedor, estado, data de publicação

#### **Funcionalidades**

**Cliente:**

1. Alterar perfil e imagem
2. Adicionar produto
3. Editar produto de sua autoria
4. Alterar estado de produto

**Administrador (além das funcionalidades de Cliente):**

1. Editar produtos de outros utilizadores
2. Apagar produtos (seus e de outros)
3. Consultar perfil de utilizador específico
4. Filtrar lista de produtos por utilizador/categoria
5. Consultar produtos alterados
6. Adicionar/apagar categoria de produto
7. Apagar um utilizador (soft delete)
8. Apagar/excluir permanentemente produtos/utilizadores

### **Testes**

- Endpoints de teste no Postman
- Ficheiros de teste utilizando JUnit (mínimo 10 testes) e Mockito
- JavaScript testing com Jest (mínimo 5 testes)

### **Funcionalidades Adicionais para Grupo de 3**

- Implementação do sistema de avaliação de vendedores
- Guardar título, comentário, data da avaliação, nota da avaliação
- Funcionalidades: Adicionar, editar, excluir, listar avaliações
- Testes adicionais no Postman, JUnit (3) e Jest (2)

### **Entrega e Avaliação**

- Repositório Git com código final
- Defesa do projeto com inscrição prévia e duração de 45 minutos
