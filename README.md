# IndexedDB com Dexie - Documentação

O projeto IndexedDB com Dexie é uma aplicação de exemplo que demonstra como usar o IndexedDB com a biblioteca Dexie em JavaScript. O IndexedDB é um banco de dados de objetos JavaScript incorporado em navegadores da web modernos.

## Criando um Banco de Dados

Para começar, você pode criar um banco de dados IndexedDB usando a função `Tabela`. Ela aceita três parâmetros:

```javascript
function Tabela(tabela, dbVersion, config = {})

```

* `tabela`: Nome do banco de dados.
* `dbVersion`: Versão do banco de dados.
* `config`: Um objeto de configuração opcional que define o nome da tabela e o esquema dos campos.

#### Exemplo:

```javascript
const db = Tabela('RSPesqEnt', 1, {
  table: 'pesqEntDBLocal', // Nome personalizado da tabela
  index: '++id, name, age', // Esquema personalizado
});
```

## Salvando Dados

Você pode salvar dados no IndexedDB usando o método `save` da classe `indexed`. Ele aceita vários tipos de parâmetros, como arrays de objetos ou dados individuais.

#### Exemplos:

```javascript
const objeto = [{ name: 'Gabriel' }, { name: 'Alice', age: 25 }];
indexed.save(objeto);
indexed.save({ name: 'João', age: 30 });
```

## Recuperando Dados

Para recuperar todos os dados da tabela, você pode usar o método `getAll` da classe indexed.

#### Exemplos:

```javascript
indexed.getAll().then(people => {
  console.log(people);
});
```

## Atualizando Dados Pelo Id

Você pode atualizar dados no IndexedDB usando o método `updateId` da classe `indexed`. Este método aceita um objeto que representa o registro a ser atualizado e um objeto com os novos dados.

#### Exemplo:

```javascript
const insertedData = await db.pesqEntDBLocal.where('name').equals('Gabriel').first();
if (insertedData) {
  const newData = { name: 'Gabri', age: 25 };
  await indexed.updateId(insertedData, newData);
} else {
  console.log('Registro não encontrado.');
}
```

## Atualizando Todos os Dados

Para atualizar todos os dados na tabela, você pode usar o método `updateAll` da classe `indexed`. Este método aceita um objeto com os novos dados que serão aplicados a todos os registros.

#### Exemplo:

```javascript
const updatedData = { name: 'Gabriel', age: 25 };
indexed.updateAll(updatedData);
```
## Deletando o Banco de Dados

Para excluir o banco de dados inteiro, você pode usar o método `deleteDB` da classe `indexed`.

#### Exemplo:

```javascipt
indexed.deleteDB();
```

## Licença
Este projeto está sob a [Licença MIT](LICENSE).