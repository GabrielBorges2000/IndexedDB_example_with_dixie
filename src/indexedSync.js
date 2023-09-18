// function createTable(tabela, dbVersion, config = {}) {
//   const request = indexedDB.open(tabela, dbVersion);

//   var db
//   request.onerror = function (event) {
//     console.error("Erro ao abrir o banco de dados", event.target.error);
//   };

//   request.onupgradeneeded = function (event) {
//     db = event.target.result;
//     const objectStore = db.createObjectStore(config.table, { keyPath: config.key });

//     if (Array.isArray(config.index)) {
//       config.index.forEach((field) => {
//         objectStore.createIndex(field, field, { unique: config.unique });
//       });
//     } else {
//       objectStore.createIndex(config.index, config.index, { unique: config.unique });
//     }

//   };

//   request.onsuccess = function (event) {
//     db = event.target.result;
//     // console.log("Banco de dados aberto com sucesso.");
//   }

//   return request; // Retornar o objeto de request
// }

class indexedSync {
  constructor(dbName, dbVersion, config = {}) {


    this.dbVersion = dbVersion;
    this.dbName = dbName;
    this.tableName = ''; // Nome da tabela a ser definido posteriormente
    this.dataToSave = null; // Dados a serem definidos posteriormente

    // Verifique se as configurações foram fornecidas e defina-as, caso contrário, use valores padrão
    this.config = {
      table: config.table,
      key: config.key,
      index: config.index,
      unique: config.unique || false,
    };

    this.createDatabaseAndTable();
  }

  createDatabaseAndTable() {
    const request = indexedDB.open(this.dbName, this.dbVersion);

    request.onerror = function (event) {
      console.error('Erro ao abrir o banco de dados', event.target.error);
    };

    request.onupgradeneeded = function (event) {
      const db = event.target.result;
      const objectStore = db.createObjectStore(this.config.table, { keyPath: this.config.key });

      if (Array.isArray(this.config.index)) {
        this.config.index.forEach((field) => {
          objectStore.createIndex(field, field, { unique: this.config.unique });
        });
      } else {
        objectStore.createIndex(this.config.index, this.config.index, { unique: this.config.unique });
      }
    }.bind(this);

    request.onsuccess = function (event) {
      // console.log('Banco de dados aberto com sucesso.');
    }.bind(this);
  }

  useTable(tableName) {
    this.tableName = tableName;
    return this;
  }

  dados(data) {
    this.dataToSave = data;
    return this;
  }

  save() {
    const self = this;

    const request = indexedDB.open(self.dbName, self.dbVersion);

    request.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction([self.tableName], 'readwrite');
      const store = transaction.objectStore(self.tableName);

      const addUniqueData = (item) => {
        const getRequest = store.get(item[self.config.key]);

        getRequest.onsuccess = function () {
          const existingData = getRequest.result;
          if (existingData) {
            // console.log('Dados já existentes:', existingData);
          } else {
            store.add(item);
            // console.log('Dados adicionados:', item);
          }
        };
      };

      if (Array.isArray(self.dataToSave)) {
        self.dataToSave.forEach(addUniqueData);
      } else if (typeof self.dataToSave === 'object') {
        addUniqueData(self.dataToSave);
      } else {
        console.error('Dados inválidos para salvar no banco de dados.');
      }

      transaction.oncomplete = function () {
        console.log('Operação concluída com sucesso!');
      };
    };

    request.onerror = function (event) {
      console.error('Erro ao abrir o banco de dados', event.target.error);
    };
  }

  getAll(callback) {
    const self = this;
    const request = indexedDB.open(this.dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction([self.tableName], 'readonly');
      const store = transaction.objectStore(self.tableName);

      const getRequest = store.getAll();

      getRequest.onsuccess = function () {
        callback(getRequest.result);
      };
    };

    request.onerror = function (event) {
      console.error("Erro ao abrir o banco de dados", event.target.error);
    };
  }

  getById(key, callback) {
    const self = this;
    const request = indexedDB.open(self.dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction([self.tableName], 'readonly');
      const store = transaction.objectStore(self.tableName);

      const getRequest = store.get([key]);

      getRequest.onsuccess = function () {
        const result = getRequest.result;
        callback(result);
      };

      transaction.oncomplete = function () {
        // console.log('Operação concluída com sucesso!');
      };
    };

    request.onerror = function (event) {
      console.error("Erro ao abrir o banco de dados", event.target.error);
    };
  }

  updateId(key, newData, callback) {
    const self = this;
    const request = indexedDB.open(this.dbName);

    request.onsuccess = function (event) {
      const db = event.target.result;

      const transaction = db.transaction([self.tableName], 'readwrite');
      const store = transaction.objectStore(self.tableName);

      const getRequest = store.get([key]);

      getRequest.onsuccess = function () {
        const existingData = getRequest.result;
        if (existingData) {
          // Atualize os campos desejados com os novos dados
          Object.assign(existingData, newData);

          const updateRequest = store.put(existingData);

          updateRequest.onsuccess = function () {
            // console.log('Registro atualizado com sucesso:', existingData);
            if (typeof callback === 'function') {
              callback(existingData);
            }
          };

          updateRequest.onerror = function () {
            console.error('Erro ao atualizar o registro:', updateRequest.error);
          };
        } else {
          console.error('Registro com a chave especificada não encontrado.');
        }
      };

      getRequest.onerror = function () {
        console.error('Erro ao obter o registro para atualização:', getRequest.error);
      };

      transaction.oncomplete = function () {
        // console.log('Operação concluída com sucesso!');
      };
    };

    request.onerror = function (event) {
      console.error('Erro ao abrir o banco de dados', event.target.error);
    };
  }

  updateAll(newData) {
    const self = this;

    // Abra o banco de dados em modo de leitura
    const request = indexedDB.open(self.dbName, self.dbVersion);

    request.onerror = function (event) {
      console.error('Erro ao abrir o banco de dados', event.target.error);
    };

    request.onsuccess = function (event) {
      const db = event.target.result;
      const transaction = db.transaction([self.tableName], 'readwrite');
      const store = transaction.objectStore(self.tableName);

      // Obtenha todos os registros do banco de dados
      const getRequest = store.getAll();

      getRequest.onsuccess = function () {
        const response = getRequest.result;

        // Atualize cada registro individualmente
        for (const object of response) {
          // Atualize os campos desejados com os novos dados
          Object.assign(object, newData);
          // Use a chave primária (object.id) para atualizar o registro específico.
          store.put(object);
        }

        // Após todas as atualizações, finalize a transação
        transaction.oncomplete = function () {
          // console.log('Registros atualizados com sucesso.');
        };
      };
    };
  }

  deleteDB(databaseName) {
    const request = indexedDB.deleteDatabase(databaseName);

    request.onsuccess = function () {
      console.log(`Banco de dados '${databaseName}' excluído com sucesso.`);
    };

    request.onerror = function (event) {
      console.error(`Erro ao excluir o banco de dados '${databaseName}':`, event.target.error);
    };

    request.onblocked = function () {
      console.warn(`A exclusão do banco de dados '${databaseName}' foi bloqueada por outra transação.`);
    };
  }

  saveImage(imageData) {
    if (!self.db) {
      throw new Error('Banco de dados não está aberto. Verifique se você chamou o construtor indexedSync com a configuração correta.');
    }

    const transaction = self.db.transaction([self.tableName], 'readwrite');
    const store = transaction.objectStore(self.tableName);

    // Crie um Blob a partir dos dados da imagem
    const imageBlob = new Blob([imageData], { type: 'image/jpeg' }); // Substitua 'image/jpeg' pelo tipo de imagem correto

    // Aqui você pode adicionar o Blob à tabela
    const data = { image: imageBlob };

    const addRequest = store.add(data);

    addRequest.onsuccess = function () {
      console.log('Imagem adicionada com sucesso.');
    };

    addRequest.onerror = function (event) {
      console.error('Erro ao adicionar a imagem:', event.target.error);
    };
  }
}

export default indexedSync


