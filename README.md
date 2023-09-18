# IndexedDB Utility

Este é um utilitário simples para trabalhar com o IndexedDB no navegador. Ele permite criar e gerenciar bancos de dados, tabelas, salvar dados e até mesmo imagens no IndexedDB.

## Modo de Uso

1. Inclua o arquivo `indexeddb-utility.js` em seu projeto.

2. Crie uma instância da classe `indexedSync` com as configurações necessárias:

```javascript
 new indexedSync(tabela, dbVersion, config = {})

```

* `tabela`: Nome do banco de dados.
* `dbVersion`: Versão do banco de dados.
* `config`: Um objeto de configuração opcional que define o nome da tabela e o esquema dos campos.

#### Exemplo:

```javascript
const meuBanco = new indexedSync('NomeDoSeuBanco', 1, {
  table: 'your-schema-table-name', // Nome da tabela
  key: 'chave', // Chave primária
  index: ['nomeproduto'], // Campos para criar índices
  unique: false, // Defina como true se necessário
});
```

## Salvando dados

Você pode salvar dados no IndexedDB usando o método `save` da classe `indexedAsync`. Ele aceita vários tipos de parâmetros, como arrays de objetos ou dados individuais.

#### Exemplos:

```javascript
const dados = [
  // ...seus dados aqui
];
meuBanco.useTable('you-schema').dados(dados).save();
```

## Obter todos os dados

Para recuperar todos os dados da tabela, você pode usar o método `getAll` da classe `indexedAsync`.

#### Exemplos:

```javascript
meuBanco.useTable('you-schema').getAll(function (dados) {
  // Faça algo com os dados obtidos
});

```

## Obter dados pela Key
Para recuperar todos os dados da tabela, você pode usar o método `getById` da classe `indexedAsync`.


```javascript
meuBanco.useTable('you-schema').getById('your-key', function (result) {
  // Faça algo com o registro encontrado
});
```

## Atualizando Dados Pelo Id

Você pode atualizar dados no indexedAsync usando o método `updateId` da classe `indexedAsync`. Este método aceita um objeto que representa o registro a ser atualizado e um objeto com os novos dados.

#### Exemplo:

```javascript
meuBanco.updateId('chave', { nomeproduto: 'Novo Nome', codigobarra: 'Novo Código' }, function (updatedData) {
  // Faça algo após a atualização, se necessário se necessário
});

```

## Atualizando Todos os Dados de uma Schema

Para atualizar todos os dados na tabela, você pode usar o método `updateAll` da classe `indexedAsync`. Este método aceita um objeto com os novos dados que serão aplicados a todos os registros.

#### Exemplo:

```javascript
const objeto = {
  // Campos a serem atualizados
};
meuBanco.updateAll(objeto);

```
## Deletando o Banco de Dados

Para excluir o banco de dados inteiro, você pode usar o método `deleteDB` da classe`indexedAsync`.

#### Exemplo:

```javascipt
meuBanco.deleteDB('NomeDoBanco');
```

## Salvar Imagens

Este utilitário também permite salvar imagens no IndexedDB. Você pode capturar uma imagem da câmera do usuário e salvá-la da seguinte forma:

### Exemplo: 

```javascript
// Capture uma imagem da câmera e salve-a no IndexedDB
function captureImage() {
  // ...Código para capturar a imagem da câmera

  // Converta o canvas para um Blob (imagem)
  canvas.toBlob(function (blob) {
    // Chame o método saveImage para armazenar a imagem no IndexedDB
    meuBanco.saveImage(blob);
  }, 'image/jpeg'); // Especifique o tipo de imagem desejado (pode variar)
}

// Exemplo de uso:
const meuBanco = new indexedSync('NomeDoSeuBanco', 1, {
  table: 'imagens',
  key: 'id', // Chave primária adequada para as imagens
  index: ['id'], // Campos para criar índices
  unique: true, // Defina como true se desejar que os IDs das imagens sejam únicos
});

// Capture uma imagem da câmera e salve-a no IndexedDB
captureImage();

```

Lembre-se de substituir os nomes do banco de dados, tabela, chave primária e outros detalhes com os seus próprios.

## Licença
Este utilitário é fornecido sob a [Licença MIT](LICENSE).