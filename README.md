# api-movies

## Requisitos

-   Node + NPM;
-   Banco de dados do tipo postgres

## Como rodar o projeto:

-   Clone o projeto:

    ```bash
    $ git clone https://github.com/gabriel-amorim1/api-movies.git
    ```

-   Instale as dependências:

    ```bash
    $ npm i
    ```

-   Crie um arquivo chamado _.env_ e preencha com os campos informados no _.env.example_

-   Faça o build do projeto:

    ```bash
    $ npm run build
    ```

-   Rode as migrations:

    ```bash
    $ npm run m:run
    ```

-   Para rodar o projeto basta usar o seguinte comando:
    ```bash
    $ npm run dev
    ```

## Documentação

A documentação do projeto se encontra na rota **/api-docs**. Na raiz do projeto está o arquivo **requestsInsomnia.json** com todas as requests do projeto.

## Tecnologias utilizadas

-   NodeJs
    -   ExpressJs
    -   Typeorm
    -   JWT
    -   Jest
    -   Swagger
    -   Typescript
-   Prettier
-   Eslint

## Testes

É possível executar os testes com o comando:

```bash
$ npm run test
```
