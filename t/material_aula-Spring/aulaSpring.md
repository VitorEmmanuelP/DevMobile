# CONFIGURANDO O AMBIENTE NO GITHUB CODESPACES

CENTRO UNIVERSITÁRIO DE PATOS DE MINAS – UNIPAM

BACHARELADO EM SISTEMAS DE INFORMAÇÃO

TURMA: 7º PERÍODO

DESENVOLVIMENTO DE SISTEMAS DE INFORMAÇÃO AVANÇADOS II

PROFESSOR RAFAEL MARINHO E SILVA

## Passo 1: Preparação do Repositório

Crie um novo repositório no GitHub: Inicie um repositório vazio e, em seguida, acesse a aba Codespaces para criar um novo Codespace para esse repositório.

Adicione o arquivo `docker-compose.yml`: Coloque em seu repositório o seguinte arquivo para garantir que o container do PostgreSQL seja iniciado junto com a aplicação:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres_spring3
    restart: always
    environment:
      POSTGRES_USER: root
      POSTGRES_PASSWORD: root
      POSTGRES_DB: bd_spring
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

Imagem: utiliza o `postgres:15` disponível no Docker Hub.

Variáveis de ambiente: definem usuário, senha e nome do banco.

Volumes: persistem os dados mesmo que o contêiner seja reiniciado.

Ports: mapeiam a porta 5432 do contêiner para a máquina host.

Com o Codespaces configurado, abra o terminal integrado e, se necessário, execute o comando para subir o ambiente Docker:

```bash
docker-compose up -d
```

(Assim, o container do PostgreSQL será iniciado e ficará disponível na porta 5432.)

## CRIANDO O PROJETO SPRING BOOT

### Passo 2: Inicialização do Projeto

Inicialize o projeto Spring Boot usando o Spring Initializr. Você encontrará alguns campos para definir as configurações iniciais do projeto. Segue os valores usados nesse projeto:

Project: Maven Project (Alternativamente, você pode optar por Gradle, mas Maven é bastante comum e tem uma boa integração com muitos ambientes de desenvolvimento.)

Language: Java (Como o projeto usa o framework Spring Boot, a opção Java é a mais utilizada.)

Spring Boot: Versão atual estável (por exemplo 3.X)

Group: `com.example` (É um identificador do pacote, você pode personalizar conforme sua organização.)

Artifact: `projeto` (O nome do módulo, que pode ser alterado conforme sua preferência.)

Name: `projeto` (Normalmente igual ao artifact, mas pode ter variações de acordo com sua nomenclatura.)

Description: Projeto de cadastro e listagem de pessoas com Spring Boot e PostgreSQL (Uma breve descrição do propósito do projeto.)

Package Name: `com.example.projeto` (Esse é formado automaticamente pela concatenação do grupo com o nome do projeto, mas pode ser editado.)

Packaging: Jar (Normalmente escolhido para aplicações Spring Boot; se for uma aplicação web tradicional, você pode optar por War, mas Jar é a escolha padrão atualmente.)

Java: Versão 17 ou superior (Recomenda-se usar pelo menos Java 17.)

Para o desenvolvimento desse projeto, você deve adicionar as seguintes dependências:

**Spring Web**

Essa dependência é fundamental para o desenvolvimento de aplicações web.

Ela traz suporte para construir controllers, gerenciar requisições HTTP e integrar com a camada de view.

Permite a criação de endpoints REST ou a utilização de um padrão MVC para renderização de páginas.

**Spring Data JPA**

Facilita a integração com bancos de dados relacionais utilizando o padrão ORM (Object-Relational Mapping) com o Hibernate.

Permite o uso de repositórios que já fornecem métodos prontos para operações CRUD (create, read, update, delete).

Simplifica a persistência de dados, abstraindo detalhes da implementação do banco.

**PostgreSQL Driver**

Necessário para conectar sua aplicação Spring Boot com o banco de dados PostgreSQL.

Garante que o Spring Data JPA possa interagir com o PostgreSQL utilizando o driver adequado.

**Thymeleaf**

Essencial para a renderização dos templates HTML no padrão MVC.

Permite a criação dinâmica de páginas web utilizando a linguagem de template do Thymeleaf.

Facilita a manipulação dos dados enviados pelo controlador e a integração com o HTML, possibilitando a criação das telas de cadastro e listagem de pessoas.

**Spring Boot DevTools (opcional)**

Fornece funcionalidades para reinicialização automática e monitoramento de mudanças de código, acelerando o processo de desenvolvimento.

Embora opcional, pode ser muito útil durante a fase de desenvolvimento para reduzir o tempo de build e deploy.

Após gerar o projeto, faça o upload do código para o seu repositório.

### Passo 3: Configuração da aplicação (application.properties)

No arquivo `src/main/resources/application.properties`, configure a conexão com o PostgreSQL:

```properties
spring.application.name=projeto
spring.datasource.url=jdbc:postgresql://localhost:5432/bd_spring
spring.datasource.username=root
spring.datasource.password=root
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.cache=false
server.forward-headers-strategy=framework
```

spring.application.name: Nome da aplicação usado no contexto Spring (por exemplo, em logs ou no Actuator).

spring.datasource.*: Configura o DataSource do Spring Boot para conectar-se ao PostgreSQL:

url: endereço JDBC do banco (`localhost:5432/bd_spring`)

username/password: credenciais definidas no docker-compose.

spring.jpa.hibernate.ddl-auto: Modo de geração/atualização do esquema no banco:

`update` faz o Hibernate ajustar tabelas conforme suas entidades, sem apagar dados.

spring.jpa.show-sql: Quando `true`, exibe no console todas as instruções SQL geradas pelo Hibernate (útil para depuração).

spring.thymeleaf.*: Configurações do Thymeleaf:

prefix: pasta onde ficam os templates (`src/main/resources/templates/`).

suffix: extensão padrão dos arquivos (`.html`).

cache: desativado para que mudanças nos templates reflitam imediatamente, sem reiniciar a aplicação.

server.forward-headers-strategy: Necessário quando a aplicação roda atrás de um proxy reverso, como o GitHub Codespaces. Com o valor `framework`, o Spring Boot lê os cabeçalhos `X-Forwarded-Host` e `X-Forwarded-Proto` enviados pelo proxy e os usa para gerar URLs corretas nos redirecionamentos. Sem essa configuração, o Spring Boot gera redirects apontando para `http://localhost:8080`, que não é acessível fora do Codespace.

#### Configuração de CORS (CorsConfig)

CORS (Cross-Origin Resource Sharing) é um mecanismo de segurança dos navegadores que bloqueia requisições feitas por um cliente com origem diferente do servidor. Sem essa configuração, o app mobile (Expo Go, navegador web) não consegue se comunicar com a API REST, mesmo que a URL esteja correta e a porta esteja pública.

`@Configuration`: indica ao Spring que essa classe contém definições de beans gerenciados pelo contêiner.

`WebMvcConfigurer`: interface do Spring MVC que permite personalizar o comportamento padrão do framework, incluindo as regras de CORS.

`addMapping("/api/**")`: aplica a política de CORS a todas as rotas que começam com `/api/`.

`allowedOrigins("*")`: aceita requisições de qualquer origem, necessário para clientes externos como o app mobile.

`allowedMethods(...)`: lista os métodos HTTP permitidos. O `OPTIONS` é obrigatório porque o `axios` envia uma requisição de preflight antes de `POST` e `PUT`.

`allowedHeaders("*")`: aceita qualquer cabeçalho enviado pelo cliente.

Crie a classe `CorsConfig` no pacote `com.example.projeto.config`:

```java
package com.example.projeto.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                    .allowedOrigins("*")
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                    .allowedHeaders("*");
            }
        };
    }
}
```

Após criar o arquivo, reinicie o Spring Boot para que a configuração entre em vigor.

#### Redirecionamento da Raiz (HomeController)

Por padrão, o Spring Boot não possui nenhuma rota mapeada para `/` (raiz). Ao acessar apenas o endereço base da aplicação (ex.: `https://SEU-CODESPACE-8080.app.github.dev`), o framework exibe a página de erro **Whitelabel Error Page** com status `404`, porque não encontrou nenhum recurso estático ou controller responsável por aquela URL.

A solução é criar um controller dedicado que captura a requisição da raiz e redireciona o usuário para a página inicial da interface web.

`@Controller`: declara um controlador MVC que retorna nomes de views ou redirecionamentos.

`@GetMapping("/")`: mapeia exclusivamente a rota raiz da aplicação.

`"redirect:/pessoas/listar"`: instrui o Spring MVC a enviar uma resposta HTTP `302 Found` ao navegador, que então faz uma nova requisição para `/pessoas/listar`.

Crie a classe `HomeController` no pacote `com.example.projeto.controller`:

```java
package com.example.projeto.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "redirect:/pessoas/listar";
    }
}
```

Com essa classe criada, ao acessar o endereço raiz da aplicação o usuário é redirecionado automaticamente para a listagem de pessoas, sem precisar digitar o caminho completo.

### Passo 4: Desenvolvendo

#### Camada de Modelo (Model)

Entidade Pessoa

`@Entity`: registra a classe no contexto JPA como uma entidade persistente.

`@Table`: mapeia para a tabela pessoas no banco.

`@Id` e `@GeneratedValue`: definem a chave primária e estratégia de geração automática.

Encapsulamento: atributos privados com getters e setters para acesso controlado.

Crie a classe `Pessoa` no pacote `com.example.projeto.model`:

```java
package com.example.projeto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "pessoas")
public class Pessoa{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Integer idade;

    public Pessoa() {}

    public Pessoa(String nome, Integer idade){
        this.nome = nome;
        this.idade = idade;
    }

    public Long getId() {
        return id;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getNome() {
        return nome;
    }

    public void setIdade(Integer idade) {
        this.idade = idade;
    }

    public Integer getIdade() {
        return idade;
    }
}
```

#### Camada de Persistência (Repository)

A interface `PessoaRepository` estende a `JpaRepository`, que já fornece métodos prontos para operações CRUD. A anotação `@Repository` indica ao Spring que essa interface é um componente de acesso a dados e pode ser injetada em outros componentes.

`JpaRepository`: fornece imediatamente métodos CRUD (`findAll()`, `findById()`, `save()`, `deleteById()`, etc.).

Injection: será injetado em camadas superiores para acesso ao banco sem necessidade de implementação explícita.

Crie uma interface de repositório para a entidade. No pacote `com.example.projeto.repository`:

```java
package com.example.projeto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.projeto.model.Pessoa;

public interface PessoaRepository extends JpaRepository<Pessoa, Long> {
}
```

### Passo 5: Implementação da Lógica de Negócio e Injeção de Dependências

#### Camada de Serviço (Service) - Classe PessoaService

`@Service`: define um bean de serviço, onde concentramos a lógica de negócio.

Injeção por construtor: promove classes imutáveis e facilita testes.

Optional: representa possibilidade de valor ausente, evitando null.

`atualizarPessoa`: busca a pessoa pelo `id`; se encontrada, atualiza os campos e persiste; se não encontrada, retorna `Optional.empty()` para que o controller responda com `404`.

Crie uma classe de serviço em `com.example.projeto.service` para encapsular a lógica de negócio:

```java
package com.example.projeto.service;

import org.springframework.stereotype.Service;
import com.example.projeto.repository.PessoaRepository;
import com.example.projeto.model.Pessoa;

import java.util.List;
import java.util.Optional;

@Service
public class PessoaService{
    private final PessoaRepository pessoaRepository;

    public PessoaService(PessoaRepository pessoaRepository){
        this.pessoaRepository = pessoaRepository;
    }

    public List<Pessoa> listarPessoas(){
        return pessoaRepository.findAll();
    }

    public Optional<Pessoa> buscarPorId(Long id){
        return pessoaRepository.findById(id);
    }

    public Pessoa salvarPessoa(Pessoa pessoa){
        return pessoaRepository.save(pessoa);
    }

    public Optional<Pessoa> atualizarPessoa(Long id, Pessoa pessoaAtualizada){
        return pessoaRepository.findById(id)
            .map(pessoaExistente -> {
                pessoaExistente.setNome(pessoaAtualizada.getNome());
                pessoaExistente.setIdade(pessoaAtualizada.getIdade());
                return pessoaRepository.save(pessoaExistente);
            });
    }

    public void deletarPessoa(Long id){
        pessoaRepository.deleteById(id);
    }
}
```

Injeção de Dependências: O Spring automaticamente injeta a instância de `PessoaRepository` no construtor do `PessoaService` quando o contexto é iniciado. Isso é possível porque ambos os componentes estão anotados com `@Repository` e `@Service` respectivamente.

Gerenciamento de Transações: A anotação `@Transactional` no método salvar garante que a operação de persistência seja tratada dentro de uma transação. Se algo der errado, o Spring fará rollback automaticamente, mantendo a consistência dos dados.

Método `atualizarPessoa`: usa `findById` para recuperar a entidade gerenciada pelo JPA. Ao chamar `save` dentro do `map`, o Hibernate detecta que o objeto já existe no banco (por ter um `id` definido) e executa um `UPDATE` em vez de um `INSERT`. Se o `id` não for encontrado, o `Optional` estará vazio e o controller poderá retornar `404 Not Found` sem lançar exceção.

### Passo 6: Criando API REST (Controller)

#### Camada Controller (API Rest )- Classe PessoaController

`@RestController`: combina `@Controller` e `@ResponseBody`, tornando cada método um endpoint REST.

`@RequestMapping`: prefixa todas as rotas com `/api/pessoas`.

`@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: mapeiam métodos HTTP para as operações de leitura, criação, atualização e exclusão do CRUD.

`ResponseEntity`: constrói respostas HTTP completas, com status e corpo.

`@PathVariable` e `@RequestBody`: extraem dados da URL e do corpo da requisição.

Crie um controller para gerenciar as requisições web. Em `com.example.projeto.controller`, crie a classe:

```java
package com.example.projeto.controller;

import java.util.List;  
import org.springframework.http.ResponseEntity;  
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;  
import org.springframework.web.bind.annotation.RequestBody;   

import com.example.projeto.service.PessoaService;
import com.example.projeto.model.Pessoa;

@RestController
@RequestMapping("/api/pessoas")
public class PessoaController{

    private final PessoaService pessoaService;

    public PessoaController(PessoaService pessoaService){
        this.pessoaService = pessoaService;
    }

    @GetMapping
    public List<Pessoa> listarPessoas(){
        return pessoaService.listarPessoas();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pessoa> buscarPessoa(@PathVariable Long id){
        return pessoaService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Pessoa criarPessoa(@RequestBody Pessoa pessoa){
        return pessoaService.salvarPessoa(pessoa);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pessoa> atualizarPessoa(
            @PathVariable Long id,
            @RequestBody Pessoa pessoaAtualizada) {
        return pessoaService.atualizarPessoa(id, pessoaAtualizada)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPessoa(@PathVariable Long id){
        pessoaService.deletarPessoa(id);
        return ResponseEntity.noContent().build();
    }
}
```

`@PutMapping("/{id}")`: mapeia requisições HTTP `PUT` para `/api/pessoas/{id}`. Recebe o `id` pela URL e o objeto atualizado pelo corpo da requisição (`@RequestBody`). Delega ao serviço, que busca a entidade no banco e atualiza os campos. Se a pessoa existir, retorna `200 OK` com o objeto atualizado; se não existir, retorna `404 Not Found`.

### Passo 6: Criando Interface Web com Thymeleaf (Controller + Views)

#### Camada Controller - Classe PessoaWebController

`@Controller`: controlador MVC padrão, retorna nomes de views.

Thymeleaf: motor de templates que processa arquivos HTML em `src/main/resources/templates/pessoas/`.

Model: transporta objetos para a view.

`@Valid` e `BindingResult`: validam dados de entrada e tratam erros de formulário.

`RedirectAttributes`: transmitem mensagens de sucesso na próxima requisição.

```java
package com.example.projeto.controller;

import jakarta.validation.Valid;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import com.example.projeto.model.Pessoa;
import com.example.projeto.service.PessoaService;

import org.springframework.http.HttpStatus;

@Controller
@RequestMapping("/pessoas")
public class PessoaWebController {

    private final PessoaService pessoaService;

    public PessoaWebController(PessoaService pessoaService) {
        this.pessoaService = pessoaService;
    }

    // Mapeia GET /pessoas → redireciona para /pessoas/listar
    @GetMapping
    public String index() {
        return "redirect:/pessoas/listar";
    }

    // 1. Página de cadastro
    @GetMapping("/cadastrar")
    public String exibirFormCadastro(Model model) {
        model.addAttribute("pessoa", new Pessoa());
        return "pessoas/form";
    }

    @PostMapping("/cadastrar")
    public String cadastrarPessoa(
            @Valid @ModelAttribute("pessoa") Pessoa pessoa,
            BindingResult result,
            RedirectAttributes ra) {

        if (result.hasErrors()) {
            // repopula o objeto no formulário em caso de erro
            return "pessoas/form";
        }
        pessoaService.salvarPessoa(pessoa);
        ra.addFlashAttribute("success", "Pessoa cadastrada com sucesso!");
        return "redirect:/pessoas/listar";
    }

    // 2. Página de listagem
    @GetMapping("/listar")
    public String listarPessoas(Model model) {
        model.addAttribute("lista", pessoaService.listarPessoas());
        return "pessoas/lista";
    }

    // 3. Detalhes e exclusão
    @GetMapping("/{id}")
    public String detalhesPessoa(@PathVariable Long id, Model model) {
        Pessoa p = pessoaService.buscarPorId(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Pessoa não encontrada, id: " + id
            ));
        model.addAttribute("pessoa", p);
        return "pessoas/detalhe";
    }

    @PostMapping("/{id}/excluir")
    public String excluirPessoa(@PathVariable Long id, RedirectAttributes ra) {
        pessoaService.deletarPessoa(id);
        ra.addFlashAttribute("success", "Pessoa excluída com sucesso!");
        return "redirect:/pessoas/listar";
    }
}
```

### Passo 7: Templates de Visão (Thymeleaf)

#### Fragmento de Navbar (fragments/navbar.html)

`th:fragment="navbar"`: define um fragmento reutilizável chamado navbar.

`th:href="@{…}"`: gera URLs relativas ao contexto da aplicação.

O checkbox + label permitem um menu “hamburger” responsivo em telas pequenas (toggle via CSS).

Em `aulaSpring03/projeto/src/main/resources/templates/fragments` insira o código:

```html
<!-- src/main/resources/templates/fragments/navbar.html -->
<nav th:fragment="navbar" xmlns:th="http://www.thymeleaf.org" class="navbar" >
  <!-- checkbox para toggle -->
  <input type="checkbox" id="menu-checkbox" hidden>
  <label for="menu-checkbox" class="menu-toggle">☰</label>

  <ul class="nav-list">
    <li><a th:href="@{/pessoas/listar}" class="nav-link">Lista</a></li>
    <li><a th:href="@{/pessoas/cadastrar}" class="nav-link">Cadastrar</a></li>
  </ul>
</nav>
```

Em cada página, incluiremos a navbar assim:

```html
<div th:replace="fragments/navbar :: navbar"></div>
```

#### Detalhe de Pessoa (`aulaSpring03/projeto/src/main/resources/templates/pessoas/detalhe.html`)

`${pessoa.xxx}`: expressão OGNL que obtém valores do objeto pessoa enviado pelo controller.

`th:action`: ao submeter, chama o método POST de exclusão (`/pessoas/{id}/excluir`).

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">

<head>
    <meta charset="UTF-8">
    <title>Detalhes da Pessoa</title>
    <!-- link para seu CSS -->
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>

<body>
    <!-- navbar -->
    <div th:replace="fragments/navbar :: navbar"></div>
    <main class="main-content">
        <h1>Detalhes da Pessoa</h1>

        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td th:text="${pessoa.id}"></td>
                    <td th:text="${pessoa.nome}"></td>
                    <td th:text="${pessoa.idade}"></td>
                    <td>
                        <form th:action="@{/pessoas/{id}/excluir(id=${pessoa.id})}" method="post">
                            <button type="submit" class="botao">Excluir</button>
                        </form>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>
    <!-- footer opcional -->
    <footer>
        <p>(c) 2025 Meu App</p>
    </footer>
</body>

</html>
```

#### Formulário de Cadastro (`aulaSpring03/projeto/src/main/resources/templates/pessoas/form.html`)

`th:object="${pessoa}"`: vincula o formulário a um objeto Pessoa.

`th:field="*{…}"`: gera automaticamente o name, id e o value do campo.

`BindingResult` & `Valid`: o controller repassa erros de validação; `th:errors` exibe mensagens padrão do Bean Validation.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">

<head>
    <title>Cadastrar Pessoa</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>

<body>
    <!-- navbar -->
    <div th:replace="fragments/navbar :: navbar"></div>

    <!-- conteúdo principal -->
    <main class="main-content">
        <h1>Cadastrar Pessoa</h1>
        <form th:action="@{/pessoas/cadastrar}" th:object="${pessoa}" method="post">
            <div>
                <label>Nome:</label>
                <input type="text" th:field="*{nome}" placeholder="Nome completo" />
                <div th:if="${#fields.hasErrors('nome')}" th:errors="*{nome}"></div>
            </div>
            <div>
                <label>Idade:</label>
                <input type="number" th:field="*{idade}" />
                <div th:if="${#fields.hasErrors('idade')}" th:errors="*{idade}"></div>
            </div>
            <button type="submit" class="botao">Salvar</button>
        </form>
    </main>

    <!-- footer opcional -->
    <footer>
        <p>(c) 2025 Meu App</p>
    </footer>
</body>

</html>
```

#### Listagem de Pessoas (`aulaSpring03/projeto/src/main/resources/templates/pessoas/lista.html`)

`th:each`: itera sobre a lista de `Pessoa` fornecida pelo controller.

Cada linha exibe dados e um link para a página de detalhes.

```html
<!DOCTYPE html>
<html xmlns:th="http://www.thymeleaf.org">

<head>
    <meta charset="UTF-8">
    <title>Lista de Pessoas</title>
    <link rel="stylesheet" th:href="@{/css/style.css}">
</head>

<body>
    <div th:replace="fragments/navbar :: navbar"></div>

    <!-- conteúdo principal -->
    <main class="main-content">
        <h1>Lista de Pessoas</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Idade</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                <tr th:each="pessoa : ${lista}">
                    <td th:text="${pessoa.id}"></td>
                    <td th:text="${pessoa.nome}"></td>
                    <td th:text="${pessoa.idade}"></td>
                    <td>
                        <a th:href="@{/pessoas/{id}(id=${pessoa.id})}" class="botao">Detalhes</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </main>

    <!-- footer opcional -->
    <footer>
        <p>(c) 2025 Meu App</p>
    </footer>
</body>

</html>
```

#### CSS Básico (`aulaSpring03/projeto/src/main/resources/static/css/style.css`)

Reset: zera margens/paddings para consistência.

Classes utilitárias: `.botao`, `.navbar`, `.main-content` e responsividade via media query.

```css
/* Reset e tipografia */
* { margin:0; padding:0; box-sizing:border-box; font-family:Arial,sans-serif; }

/* Tabela */
table { border-collapse:collapse; width:50%; }
th, td { border:1px solid #000; padding:6px; text-align:center; }
th { background-color:#f2f2f2; }

/* Botão */
.botao {
  background-color:#4CAF50; border:none; color:white;
  padding:8px 16px; font-size:14px; border-radius:5px;
  transition:background-color .3s ease;
}
.botao:hover { background-color:#45a049; box-shadow:0 2px 4px rgba(0,0,0,0.2); }

/* Navbar */
.navbar { background:#333; padding:1rem; }
.nav-list { list-style:none; display:flex; gap:1rem; }
.nav-link { color:white; text-decoration:none; padding:.5rem 1rem; }
.nav-link:hover, .nav-link.active { background:#555; border-radius:4px; }

/* Layout principal */
.main-content {
  padding:2rem; min-height:80vh;
  display:flex; flex-direction:column;
  align-items:center; gap:1.5rem;
}

/* Footer */
footer { background:#333; color:white; text-align:center; padding:1rem; }

/* Mobile menu */
.menu-toggle { display:none; cursor:pointer; color:white; font-size:1.5rem; }
@media (max-width:768px) {
  .menu-toggle { display:block; }
  .nav-list { display:none; flex-direction:column; width:100%; text-align:center; }
  #menu-checkbox:checked~.nav-list { display:flex; }
}
```

### Passo 8: Testando a API com REST Client (`pessoa.http`)

Arquivo `.http` integrado ao VS Code (extensão REST Client).

Variável `@base_url` centraliza o host da aplicação.

Cada bloco envia requisições para nossos métodos CRUD do `PessoaController`.

```http
# Definição de variáveis (ambiente "local" do REST Client)
@base_url = INSERIR A URL DA SUA PORTA 8080 (PÚBLIC)

### Inserir nova pessoa
POST {{ base_url }}/api/pessoas
Content-Type: application/json

{
  "nome": "Gabriel",
  "idade": 28
}

### Listar todas as pessoas
GET {{ base_url }}/api/pessoas
Accept: application/json

### Buscar pessoa por ID
GET {{ base_url }}/api/pessoas/1
Accept: application/json

### Atualizar pessoa (PUT)
PUT {{ base_url }}/api/pessoas/1
Content-Type: application/json

{
  "nome": "Rafael Marinho",
  "idade": 35
}

### Remover pessoa (DELETE)
DELETE {{ base_url }}/api/pessoas/1
Accept: */*
```

### Passo 9: Executando a Aplicação no Codespace

O Maven Wrapper (`mvnw` no Linux/macOS, `mvnw.cmd` no Windows) é um pequeno “script bootstrap” que garante que todos os desenvolvedores usem exatamente a mesma versão do Maven, sem precisar instalá-lo globalmente. Assim, evitamos problemas de incompatibilidade de versões entre diferentes máquinas ou ambientes CI/CD.

Liberando permissão de execução: Antes de tudo, verifique se o script `mvnw` possui permissão de execução. No Linux e macOS, abra o terminal na raiz do projeto e execute:

```bash
chmod +x mvnw
```

Iniciando a aplicação com o Maven Wrapper, na raiz do projeto, execute:

```bash
./mvnw spring-boot:run
```

Iniciando a aplicação com o Maven instalado globalmente.

Se você já tiver o Maven instalado e configurado no seu PATH, pode usar:

```bash
mvn spring-boot:run
```

Ambos os comandos irão:

Compilar o código (`compile`).

Executar quaisquer testes (`test`).

Iniciar o servidor embarcado (por padrão, o Tomcat) na porta 8080.

### Passo 10: Configurando a porta 8080 no GitHub Codespaces

Se estiver usando um GitHub Codespace, será preciso expor a porta 8080 para acessá-la via navegador:

No canto inferior direito do Codespace, clique em Ports.

Localize a porta 8080 na lista.

Altere o Visibility para Public (ou Public on Internet, conforme a versão do IDE).

A partir daí, o Codespace fornecerá uma URL pública, algo como:

```text
https://<identificador-do-codespace>-8080.githubpreview.dev
```

Com o servidor já rodando e a porta aberta:

Abra seu navegador.

Cole a URL pública do Codespace (ou, se for local, http://localhost:8080).

Navegue até os endpoints que criamos, por exemplo:

Listagem web: http://localhost:8080/pessoas/listar

API REST: http://localhost:8080/api/pessoas

### Passo 11: Acessar o banco PostgreSQL

Comando para acessar o banco PostgreSQL:

```bash
docker exec -it postgres_spring3 psql -U root -d bd_spring
```

```sql
SELECT * FROM sua_tabela;
```

### Passo 12: Salve o Projeto no GitHub

No terminal do Codespaces, compile e execute os seguinte comandos:

O comando `git add .` adiciona todas as alterações feitas nos arquivos ao staging area (área de preparação). O ponto (`.`) significa que todas as alterações no diretório atual serão incluídas. Se quiser adicionar apenas um arquivo específico, substitua o `.` pelo nome do arquivo. Segue o comando:

```bash
git add .
```

O comando `git commit -m "mensagem"` cria um commit com as alterações que foram adicionadas ao staging area. A flag `-m` permite que uma mensagem descritiva seja adicionada ao commit. A mensagem deve ser clara e objetiva, explicando o que foi alterado. Por exemplo:

```bash
git commit -m "Aula JPA classes concretas"
```

O comando `git push origin main` envia os commits do seu repositório local para o repositório remoto no GitHub. O `origin` é o nome padrão do repositório remoto, e `main` é o branch principal.

```bash
git push origin main
```

---

## PRODUTO – Cadastro de produtos com Spring Boot REST

Esta seção apresenta a implementação completa do CRUD de produtos, seguindo a mesma arquitetura em camadas utilizada no cadastro de pessoas. A entidade `Produto` possui três atributos além do identificador: `nome`, `quantidade` e `valor`.

### Camada de Modelo (Model) – Entidade Produto

`@Entity` e `@Table`: registram a classe no JPA e mapeiam para a tabela `produtos`.

`@Id` e `@GeneratedValue`: definem a chave primária com geração automática pelo banco.

`Double` para `valor`: tipo adequado para representar valores monetários simples sem precisão decimal rigorosa. Para sistemas financeiros de produção, prefira `BigDecimal`.

Crie a classe `Produto` no pacote `com.example.projeto.model`:

```java
package com.example.projeto.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "produtos")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private Integer quantidade;
    private Double valor;

    public Produto() {}

    public Produto(String nome, Integer quantidade, Double valor) {
        this.nome = nome;
        this.quantidade = quantidade;
        this.valor = valor;
    }

    public Long getId() {
        return id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Double getValor() {
        return valor;
    }

    public void setValor(Double valor) {
        this.valor = valor;
    }
}
```

### Camada de Persistência (Repository) – ProdutoRepository

`JpaRepository<Produto, Long>`: fornece os métodos CRUD prontos (`findAll`, `findById`, `save`, `deleteById`) sem necessidade de implementação explícita.

Crie a interface no pacote `com.example.projeto.repository`:

```java
package com.example.projeto.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.projeto.model.Produto;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
```

### Camada de Serviço (Service) – ProdutoService

`@Service`: declara a classe como componente de serviço gerenciado pelo Spring.

Injeção por construtor: garante imutabilidade da dependência e facilita testes unitários.

`atualizarProduto`: busca o produto pelo `id`; se encontrado, atualiza os três campos e persiste; se não encontrado, retorna `Optional.empty()` para que o controller responda com `404 Not Found`.

Crie a classe no pacote `com.example.projeto.service`:

```java
package com.example.projeto.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.example.projeto.model.Produto;
import com.example.projeto.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    public Produto salvarProduto(Produto produto) {
        return produtoRepository.save(produto);
    }

    public Optional<Produto> atualizarProduto(Long id, Produto produtoAtualizado) {
        return produtoRepository.findById(id)
            .map(produtoExistente -> {
                produtoExistente.setNome(produtoAtualizado.getNome());
                produtoExistente.setQuantidade(produtoAtualizado.getQuantidade());
                produtoExistente.setValor(produtoAtualizado.getValor());
                return produtoRepository.save(produtoExistente);
            });
    }

    public void deletarProduto(Long id) {
        produtoRepository.deleteById(id);
    }
}
```

Método `atualizarProduto`: usa `findById` para recuperar a entidade gerenciada pelo JPA. Ao chamar `save` dentro do `map`, o Hibernate detecta que o objeto já possui `id` e executa um `UPDATE` em vez de um `INSERT`. Se o `id` não for encontrado, o `Optional` estará vazio e o controller retornará `404 Not Found` sem lançar exceção.

### Camada Controller (API REST) – ProdutoController

`@RestController`: combina `@Controller` e `@ResponseBody`, fazendo com que cada método retorne JSON diretamente.

`@RequestMapping("/api/produtos")`: prefixa todas as rotas com `/api/produtos`.

`@GetMapping`, `@PostMapping`, `@PutMapping`, `@DeleteMapping`: mapeiam os métodos HTTP para as operações de leitura, criação, atualização e exclusão do CRUD.

`ResponseEntity`: constrói respostas HTTP completas com código de status e corpo.

`@PathVariable` e `@RequestBody`: extraem dados da URL e do corpo da requisição, respectivamente.

Crie a classe no pacote `com.example.projeto.controller`:

```java
package com.example.projeto.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.projeto.model.Produto;
import com.example.projeto.service.ProdutoService;

@RestController
@RequestMapping("/api/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @GetMapping
    public List<Produto> listarProdutos() {
        return produtoService.listarProdutos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> buscarProduto(@PathVariable Long id) {
        return produtoService.buscarPorId(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Produto criarProduto(@RequestBody Produto produto) {
        return produtoService.salvarProduto(produto);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> atualizarProduto(
            @PathVariable Long id,
            @RequestBody Produto produtoAtualizado) {
        return produtoService.atualizarProduto(id, produtoAtualizado)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable Long id) {
        produtoService.deletarProduto(id);
        return ResponseEntity.noContent().build();
    }
}
```

`@GetMapping` sem parâmetro: lista todos os produtos, retornando `200 OK` com array JSON.

`@GetMapping("/{id}")`: busca um produto pelo identificador. Retorna `200 OK` com o objeto ou `404 Not Found` caso não exista.

`@PostMapping`: recebe o corpo da requisição como `Produto`, persiste e retorna o objeto salvo (com `id` gerado pelo banco).

`@PutMapping("/{id}")`: recebe o `id` pela URL e os novos dados pelo corpo. Delega ao serviço, que atualiza apenas os campos alterados. Retorna `200 OK` com o objeto atualizado ou `404 Not Found`.

`@DeleteMapping("/{id}")`: remove o produto pelo `id` e retorna `204 No Content`, indicando que a operação foi bem-sucedida sem corpo de resposta.

### Testando a API com REST Client (produto.http)

Com a aplicação em execução, utilize o arquivo `produto.http` para testar todos os endpoints. O bloco `###` separa cada requisição dentro do mesmo arquivo.

```http
# Definição de variáveis (ambiente "local" do REST Client)
@base_url = INSERIR A URL DA SUA PORTA 8080 (PÚBLICA)

### Inserir novo produto
POST {{ base_url }}/api/produtos
Content-Type: application/json

{
  "nome": "Notebook",
  "quantidade": 10,
  "valor": 3899.99
}

### Listar todos os produtos
GET {{ base_url }}/api/produtos
Accept: application/json

### Buscar produto por ID
GET {{ base_url }}/api/produtos/1
Accept: application/json

### Atualizar produto (PUT)
PUT {{ base_url }}/api/produtos/1
Content-Type: application/json

{
  "nome": "Notebook Pro",
  "quantidade": 5,
  "valor": 4299.99
}

### Remover produto (DELETE)
DELETE {{ base_url }}/api/produtos/1
Accept: */*
```

A variável `@base_url` centraliza o endereço do backend. Substitua pelo valor real da URL pública gerada ao expor a porta 8080 no Codespace. Cada bloco separado por `###` representa uma operação independente do CRUD.