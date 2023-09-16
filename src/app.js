
//NOme do banco de dados
function Tabela(tabela, dbVersion, config = {}) {
  const db = new Dexie(tabela);
  db.version(dbVersion).stores({
    [config.table]: config.index, // Nome da tabela e campos
  });
  return db;
}

// Criar instância do Dexie com a versão e configurações desejadas
const db = Tabela('RSPesqEnt', 1, {
  table: 'pesqEntDBLocal', // Nome da tabela personalizado
  index: '++id, name, age', // Esquema personalizado
});

class indexed {
  //Passar todos os tipos de parametros dos dados que vão ser salvos no indexedDB
  constructor(id, name, age) {
    this.id = id
    this.name = name;
    this.age = age;
  }

  static save(...args) { // metodo para salvar os dados de um array, objeto ou um unico dado
    if (args.length === 1 && Array.isArray(args[0])) {
      // Se for passada uma única matriz de objetos, use bulkAdd
      return db.pesqEntDBLocal.bulkAdd(args[0]);
    } else if (args.length > 0) {
      // Se forem passados um nome (string) e uma idade (number), crie um objeto e use add
      const objetos = args.map(obj => db.pesqEntDBLocal.add(obj));
      return Promise.all(objetos);
    } else {
      // Trate outros casos de uso aqui ou gere um erro se a chamada for inválida
      throw new Error('Chamada inválida para o método save.');
    }
  }

  static getAll() { // Essa função lista todos os dados do banco de dados selecionado
    return db.pesqEntDBLocal.toArray();
  }

  static getById(id) {
    alert('Função getById não implementada...')
  }

  static async updateId(UniqueData, newData) {
    // Atualizar o registro com novos dados
    if (UniqueData) {
      await db.pesqEntDBLocal.update(UniqueData.id, newData);
    } else {
      console.log('Registro não encontrado.');
    }
  }


  static async updateAll(newData) { // Essa função atualiza todos os dados do banco de dados

    let objectArray = [];

    const response = await indexed.getAll(); // Obtenha os dados primeiro

    objectArray.push(response);

    console.log(...objectArray);

    // Atualizar todos os registros

    const promises = response.map(async object => {
      await db.pesqEntDBLocal.update(object.id, newData); // Use a chave primária (person.id) para atualizar o registro específico.
    });

    // Aguardar a conclusão de todas as atualizações
    await Promise.all(promises);

    // Verificar se os dados foram atualizados
    const updatedData = await db.pesqEntDBLocal.toArray();
    console.log('Registros atualizados:', updatedData);
  }

  static deleteDB() { // metodo para deletar o banco de dados Inteiro
    return db.delete();
  }
}

// ? Chamada para salvar os dados no banco de dados

// const objeto = [
//   { name: 'Gabriel' },
//   { name: 'Gabriel', age: 21 },
//   { name: 'Gabriel', age: 22 },
//   { name: 'Gabriel', age: 23, city: 'São Paulo', state: 'SP' },
// ];

// const newPerson = { name: 'Alice', age: 25 };

// indexed.save(objeto);
// indexed.save([newPerson]);

// indexed.save({ name: 'Gabriel', age: 27, teste: 'teste' });

// indexed.save(
//   { name: 'Alice', age: 25 },
//   { name: 'Alice', age: 25 },
//   { name: 'Alice', age: 25 }
// );

// ? Chamada para pegar todos dados
// let pessoas = [];
// indexed.getAll().then(people => {
//   pessoas.push(people)

//   console.log(...pessoas)
// });

// ? Chamada para deletar a tabela completa do banco de dados
// indexed.deleteDB()

//? ? Chamada para pegar todos dados de um item em especifico e atualizar passando somente a proprietade que deseja atualizar
(async () => {
  const insertedData = await db.pesqEntDBLocal.where('name').equals('Gabriel').first();

  console.log('id', insertedData);
  if (insertedData) {
    const dados = { name: 'Gabri', age: 25 }
    
    await indexed.updateId(insertedData, dados);
  } else {
    console.log('Registro não encontrado.');
  }
})();







// ? Chamada para atualizar todos os dados do banco de dados

// const updatedData = { name: 'Gabriel', age: 25 };

// indexed.updateAll(updatedData);





