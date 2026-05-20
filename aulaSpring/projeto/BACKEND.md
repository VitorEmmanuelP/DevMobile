# 🔙 Backend - Spring Boot API

## 📋 Visão Geral

API REST desenvolvida em Spring Boot para gerenciar Pessoas e Produtos.

**Endereço Base:** `https://orange-yodel-6j45wj49jr5cx66p-8080.app.github.dev`

---

## 📁 Estrutura do Backend

```
projeto/
├── src/
│   └── main/
│       ├── java/com/example/projeto/
│       │   ├── ProjetoApplication.java        # Classe principal
│       │   │
│       │   ├── config/
│       │   │   └── CorsConfig.java            # Configuração CORS
│       │   │
│       │   ├── controller/
│       │   │   ├── HomeController.java
│       │   │   ├── PessoaController.java      # REST API de Pessoas
│       │   │   ├── ProdutoController.java     # REST API de Produtos
│       │   │   ├── MensagemController.java
│       │   │   └── PessoaWebController.java
│       │   │
│       │   ├── model/
│       │   │   ├── Pessoa.java                # Entity de Pessoa
│       │   │   └── Produto.java               # Entity de Produto
│       │   │
│       │   ├── repository/
│       │   │   ├── PessoaRepository.java      # JPA Repository
│       │   │   ├── ProdutoRepository.java     # JPA Repository
│       │   │   └── MensagemRepository.java
│       │   │
│       │   ├── service/
│       │   │   ├── PessoaService.java         # Lógica de negócio
│       │   │   ├── ProdutoService.java        # Lógica de negócio
│       │   │   └── MensagemService.java
│       │   │
│       │   └── PagController.java
│       │
│       └── resources/
│           ├── application.properties         # Configurações
│           └── static/css/style.css
│
├── pom.xml                                     # Dependências Maven
└── docker-compose.yml                         # Orquestração Docker
```

---

## 🔌 Endpoints da API

### Produtos

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| GET | `/api/produtos` | Listar todos | ✅ |
| GET | `/api/produtos/{id}` | Obter por ID | ✅ |
| POST | `/api/produtos` | Criar novo | ✅ |
| PUT | `/api/produtos/{id}` | Atualizar | ✅ |
| DELETE | `/api/produtos/{id}` | Deletar | ✅ |

### Pessoas

| Método | Endpoint | Descrição | Status |
|--------|----------|-----------|--------|
| GET | `/api/pessoas` | Listar todos | ✅ |
| GET | `/api/pessoas/{id}` | Obter por ID | ✅ |
| POST | `/api/pessoas` | Criar novo | ✅ |
| PUT | `/api/pessoas/{id}` | Atualizar | ✅ |
| DELETE | `/api/pessoas/{id}` | Deletar | ✅ |

---

## 📊 Modelos de Dados

### Produto
```java
@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;              // Nome do produto
    private Integer quantidade;        // Quantidade em estoque
    private BigDecimal preco;          // Preço (CORRIGIDO: era 'valor')
}
```

**Campo Corrigido:** `valor` → `preco` para alinhar com frontend

### Pessoa
```java
@Entity
@Table(name = "pessoas")
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String nome;              // Nome da pessoa
    private Integer idade;             // Idade (opcional)
}
```

---

## 🔍 Controllers

### ProdutoController
```java
@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {
    
    @GetMapping
    public List<Produto> listarProdutos()
    
    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProduto(@PathVariable Long id)
    
    @PostMapping
    public Produto criarProduto(@RequestBody Produto produto)
    
    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(
        @PathVariable Long id,
        @RequestBody Produto produtoAtualizado)
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id)
}
```

### PessoaController
```java
@RestController
@RequestMapping("/api/pessoas")
public class PessoaController {
    // Mesmos endpoints que Produto
}
```

---

## 💼 Services

### ProdutoService
```java
@Service
public class ProdutoService {
    
    public List<Produto> listarProdutos()
    public Optional<Produto> buscarPorId(Long id)
    public Produto salvarProduto(Produto produto)
    public Optional<Produto> atualizarProduto(Long id, Produto produtoAtualizado)
    public void deletarProduto(Long id)
}
```

---

## 🔧 Configuração

### application.properties
```properties
# Banco de dados
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driverClassName=org.h2.Driver

# JPA
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=create-drop

# H2 Console
spring.h2.console.enabled=true
```

### CorsConfig
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .allowCredentials(true)
                .maxAge(3600);
    }
}
```

---

## 📝 Exemplos de Requisições

### Listar Produtos
```bash
curl -X GET \
  https://orange-yodel-6j45wj49jr5cx66p-8080.app.github.dev/api/produtos \
  -H 'Content-Type: application/json'
```

**Resposta:**
```json
[
  {
    "id": 1,
    "nome": "Notebook",
    "quantidade": 5,
    "preco": 2500.00
  },
  {
    "id": 2,
    "nome": "Mouse",
    "quantidade": 20,
    "preco": 45.50
  }
]
```

### Criar Produto
```bash
curl -X POST \
  https://orange-yodel-6j45wj49jr5cx66p-8080.app.github.dev/api/produtos \
  -H 'Content-Type: application/json' \
  -d '{
    "nome": "Teclado",
    "quantidade": 10,
    "preco": 150.00
  }'
```

### Atualizar Produto
```bash
curl -X PUT \
  https://orange-yodel-6j45wj49jr5cx66p-8080.app.github.dev/api/produtos/1 \
  -H 'Content-Type: application/json' \
  -d '{
    "nome": "Notebook Gamer",
    "quantidade": 3,
    "preco": 3500.00
  }'
```

### Deletar Produto
```bash
curl -X DELETE \
  https://orange-yodel-6j45wj49jr5cx66p-8080.app.github.dev/api/produtos/1 \
  -H 'Content-Type: application/json'
```

---

## 🐛 Correção: Campo de Preço

### Problema Identificado
- Campo original: `valor` (BigDecimal)
- Campo atualizado: `preco` (BigDecimal)
- Motivo: Alinhamento com nomenclatura do frontend em português

### Arquivos Atualizados
1. ✅ `model/Produto.java` - Renomeou `valor` → `preco`
2. ✅ `service/ProdutoService.java` - Atualizado método setter
3. ✅ Banco de dados será recriado (H2 memory)

### Migração de Dados
Se estiver usando banco de dados persistente:
```sql
ALTER TABLE produtos RENAME COLUMN valor TO preco;
```

---

## 🚀 Como Executar

### Opção 1: Maven
```bash
cd projeto
./mvnw spring-boot:run
```

### Opção 2: Docker Compose
```bash
docker-compose up
```

### Opção 3: JAR
```bash
./mvnw clean package
java -jar target/projeto-0.0.1-SNAPSHOT.jar
```

---

## 📊 Banco de Dados

### H2 Console
- URL: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (deixe em branco)

---

## 📦 Dependências Principais
- Spring Boot 3.x
- Spring Data JPA
- Spring Web
- H2 Database
- Lombok (opcional)

---

## 🔐 Segurança

- ✅ CORS habilitado para aceitar requisições cross-origin
- ⚠️ Sem autenticação (adicionar no futuro)
- ⚠️ Sem validação de entrada (adicionar no futuro)
- ⚠️ Sem rate limiting (adicionar no futuro)

---

## 📋 Checklist de Implementação

- ✅ CRUD de Produtos
- ✅ CRUD de Pessoas
- ✅ Controllers REST
- ✅ Services com lógica
- ✅ Repositories JPA
- ✅ CORS configurado
- ✅ Campo de preço corrigido (valor → preco)
- ⏳ Autenticação JWT
- ⏳ Validações customizadas
- ⏳ Exception handling
- ⏳ Testes unitários

---

## 🔗 Integrações

### Frontend (React Native)
O frontend se conecta via `produtoService` e `pessoaService` usando Axios.

```typescript
const response = await api.get('/api/produtos')
```

---

## 📞 Troubleshooting

### CORS Error
**Solução:** Verifique `CorsConfig.java`

### Banco não carrega dados
**Solução:** Use `spring.jpa.hibernate.ddl-auto=create`

### Porta 8080 em uso
**Solução:** `server.port=9090` em `application.properties`

---
