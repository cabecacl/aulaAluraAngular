var ConnectionFactory = (function () {

    const stores = ['negociacoes'];
    const version = 4;
    const dbName = 'aluraFrame';

    var connection = null;
    var close = null;

    return class ConnectionFactory {

        constructor() {
            throw new Error('Não é possivel criar instancias de ConnectionFactory');
        }

        static getConnection() {
            return new Promise((resolve, reject) => {

                let openRequest = window.indexedDB.open('aluraFrame', 4);

                openRequest.onupgradeneeded = e => {

                    ConnectionFactory._createStores(e.target.result);
                };

                openRequest.onsuccess = e => {
                    if (!connection) {
                        connection = e.target.result;
                        close = connection.close.bind(connection);
                        connection.close = function () {
                            throw new Error('Você não pode fechar diretamente a conexão');
                        };
                    }
                    resolve(connection);
                }

                openRequest.onerror = e => {
                    console.log(e.target.error)
                    reject(e.target.error.name);
                }

            });
        }

        static _createStores(connection) {

            // criando nossos stores!

            stores.forEach(store => {

                if (connection.objectStoreNames.contains(store)) connection.deleteObjectStore(store);
                connection.createObjectStore(store, { autoIncrement: true });
            });
        }

        static closeConnection() {

            if (connection) {
                connection.close();
                connection = null;

            }
        }

    }
})();

// var ConnectionFactory = tmp();