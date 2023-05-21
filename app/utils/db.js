const mysql = require('mysql2');

class DB {
    /**
     * @description Constructor
     */
    constructor() {
        this.host = 'localhost';
        this.user = 'root';
        this.pass = 'root';
        this.database = 'mydiet';
        this.port = 3306;
    }

    /**
     * @description Conection to the database
     */
    connect() {
        this.connection = mysql.createConnection({
            host: this.host,
            user: this.user,
            password: this.pass,
            database: this.database,
            port: this.port
        });

        this.connection.connect((err) => {
            if (err) {
                console.log('Error connecting to the database. => ' + err.stack);
                return;
            }
            console.log('*** Connected database ***');
        });
    }

    /**
     * @description Disconnection of the database
     */
    disconnect() {
        this.connection.end((err) => {
            if (err) {
                console.log('Could not connect to the database. => ' + err.stack);
                return;
            }
            console.log("*** Disconnected database ***");
        });
    }

    /**
     * @description Searches the database to see if the user exists and if so, returns the record
     */
    async getUser(data, callback) {
        await this.connect();
        const request = 'SELECT * FROM users WHERE USERNAME = ? AND PASSWORD = ?';

        // Performs the SQL query
        this.connection.execute(request, [data.username, data.password], (err, results, fields) => {
            if (err) throw err;

            return callback(results);
        });
        await this.disconnect();
    }

    /**
     * @description Inserts the new user into the database.
     */
    async insertUser(data, callback) {
        // First check if the user already exists.
        await this.checkUser(data.username, (res) => {
            if(res[0] === 'success') {
                this.connect();
                const request = 'INSERT INTO users (USERNAME, PASSWORD, AGE, HEIGHT, WEIGHT) VALUES (?, ?, ?, ?, ?)';
                // Performs the SQL query to insert the user.
                this.connection.execute(request, [data.username, data.password, data.age, data.height, data.weight], (err, results, fields) => {
                    if (err) {
                        throw err;
                    }
                    return callback(['success', 'Registration completed']);
                });
                this.disconnect();
            } else {
                return callback(res); // Will return ['error', 'Username not available']
            }
        });
    }

    /**
     * @description Checks if a user name is already registered.
     */
    async checkUser(userName, callback) {
        await this.connect();
        const request = 'SELECT * FROM users WHERE USERNAME = ?';
        // Performs SQL query to check if the username already exist.
        this.connection.execute(request, [userName], (err, results, fields) => {
            if (err) {
                throw err;
            }
            if (results.length !== 0) {
                return callback(['error', 'Username not available.']);
            } else {
                return callback(['success']);
            }
        });
        await this.disconnect();
    }
}
module.exports = { DB };