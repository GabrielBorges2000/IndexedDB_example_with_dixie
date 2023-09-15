# Sistema de Gerenciamento de Dados IndexedDB com Dexie.js

Este é um sistema de gerenciamento de dados simples usando Dexie.js, um banco de dados indexedDB em JavaScript. O sistema inclui uma classe `Person` que facilita o armazenamento e a recuperação de dados no banco de dados indexedDB.

## Como Usar

Primeiro crie instância do Banco da forma que desejar:
```javascript

const version = 1;

const db = Tabela('your-table-name', version, {
  // Nome do schema personalizado
  table: 'pesqEntDBLocal', 

  // Passe um index para ajudar no filtro
  // O index deve existir na sua tabela
  index: '++id, name, age', 
});
```


## Salvar Dados

A classe Person fornece um método estático save que permite salvar dados no banco de dados. Você pode passar um ou mais objetos como argumento para inserir ou atualizar registros.


```javascript
// Você pode adicionar um array de objetos
const objeto = [
  { name: 'Gabriel' },
  { name: 'Gabriel', age: 21 },
  { name: 'Gabriel', age: 22 },
  { name: 'Gabriel', age: 23, city: 'São Paulo', state: 'SP' },
];

Person.save(objeto);

// Pode adicionar um objeto por variável
const newPerson = { name: 'Alice', age: 25 };

Person.save([newPerson]);

// Pode adiconar diretamente 
Person.save({ name: 'Gabriel', age: 27, teste: 'teste' });

// Pode passar varias objetos individualmente
Person.save(
  { name: 'Alice', age: 25 },
  { name: 'Alice', age: 25 },
  { name: 'Alice', age: 25 }
);
```

## Obter Todos os Dados

Você pode usar o método estático getAll da classe Person para obter todos os dados do banco de dados.

```javascript
let pessoas = [];

Person.getAll().then(people => {
    pessoas.push(people)
    console.log(...pessoas)
});

// ou 

Person.getAll().then(people => { console.log(pessoas)});
```

## Atualizar Dados
A classe Person fornece métodos para atualizar registros individualmente ou em massa.

Atualizar um Registro por ID
Você pode usar o método updateId para atualizar um registro específico por ID.

```javascript
(async () => {
  // Pegue um elemento em expecifico pelo seu valor usando where
  const insertedId = await db.pesqEntDBLocal.where('name').equals('Alice').first()
  console.log(insertedId.id)

  // Atualizar o registro com novos dados
  if (insertedId) {
    Atualizar o registro com novos dados usando updateId
    const updatedData = { name: 'Alikjkl', age: 25 };
    await Person.updateId(insertedId.id, updatedData);

    // Verificar se os dados foram atualizados
    Person.getAll().then(people => console.log(people));
  } else {
    console.log('Registro não encontrado.');
  }
})();
```

## Deletar Tabela

Você pode usar o método estático deleteDB para excluir a tabela inteira do banco de dados.

```javascript
// Cuidado essa chamada vai apagar todos os dados e a tabela vai deixar de existir no indexedDB

Person.deleteDB()
```

## Atualizar Dados
A classe Person fornece métodos para atualizar registros individualmente ou em massa.

Atualizar um Registro por ID
Você pode usar o método updateId para atualizar um registro específico por ID.

#### 🚧 Essa função ainda está em desenvolvimento ! 🚧

```javascript
(async () => {
  const allPeople = Person.getAll();

  // Atualizar todos os registros
  const updatedData = { age: 99 };
  const promises = allPeople.map((index, person) => {
    return db.pesqEntDBLocal.update(updatedData);
  });

  // Aguardar a conclusão de todas as atualizações
  await Promise.all(promises);

  // Verificar se os dados foram atualizados
  const updatedPeople = await db.pesqEntDBLocal.toArray();
  console.log('Registros atualizados:', updatedPeople);
})

```

## Atualizar Todos os Registros
Você pode usar o método updateAll para atualizar todos os registros ao mesmo tempo.

#### 🚧 Essa função ainda está em desenvolvimento ! 🚧

```javascript
// Atualizar todos os registros com novos dados
const updatedData = { age: 99 };
await Person.updateAll(updatedData);
```

## Licença
Este projeto está sob a [Licença MIT](LICENSE).