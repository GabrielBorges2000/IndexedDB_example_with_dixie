
//NOme do banco de dados
export function Tabela(tabela, dbVersion, config = {}) {
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

export class indexedAsync {
  //Passar todos os tipos de parametros dos dados que vão ser salvos no indexedDB
  constructor(id, name, age) {
    this.id = id
    this.name = name
    this.age = age
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

    const response = await indexedAsync.getAll(); // Obtenha os dados primeiro

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
