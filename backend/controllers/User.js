// DB for post
const bcrypt = require('bcrypt');
const saltRounds = 11;
const db = require('../models/dbConnection');

const User = {
    /**
     * Get all based on query
     * @param {object} query 
     */
    get: function (query) {
        return new Promise(async function(resolve, reject) {
            try {
                const [rows, fields] = await db.query('SELECT id, username, added FROM `user`');
                resolve(rows, fields);
            } catch (error) {
                reject(error);
            }
        });
    },
    
    /**
     * Get specific user by id
     * @param {number} id 
     */
    getById: function (id) {
        return new Promise(async function(resolve, reject) {
            try {
                const sql = `
                    SELECT u.id, u.username, u.added,
                        COUNT(DISTINCT ufollowing.user_id) AS following_num,
                        COUNT(DISTINCT ufollowers.follow_id) AS followers_num,
                        COUNT(DISTINCT p.id) AS posts_num
                    FROM user AS u
                    LEFT JOIN user_follow AS ufollowing
                        ON ufollowing.user_id = u.id
                    LEFT JOIN user_follow AS ufollowers
                        ON ufollowers.follow_id = u.id
                    LEFT JOIN post AS p
                        on p.user_id = u.id
                    WHERE u.id = ?
                `;
                const [rows, fields] = await db.query(sql, [id]);
                resolve(rows[0], fields[0]);
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Save a new user from data object.
     * @param {object} data
     * @return {promise} user object
     */
    save: function (data) {
        let self = this;
        return new Promise(async function(resolve, reject) {
            try {
                self.hash(data.password)
                    .then(async (hash) => {
                        const newUser = {
                            username: data.username,
                            email: data.email,
                            password: hash
                        };
                        const [result, fields] = await db.query('INSERT INTO `user` SET ?', newUser);
                        self.getById(result.insertId)
                            .then(user => {
                                resolve(user);
                            })
                            .catch(err => {
                                reject(err);
                            });
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Update user by id from data object.
     * @param {number} id
     * @param {object} data
     * @return {promise}
     */
    updateById: function (id, data) {
        const self = this;
        return new Promise(async function (resolve, reject) {
            try {
                let editedUser = {};
                if (data.username) {
                    editedUser.username = data.username;
                }
                if (data.email) {
                    editedUser.email = data.email;
                }
                if (data.password) {
                    editedUser.password = await self.hash(data.password);
                }
                if (data.admin) {
                    editedUser.admin = data.admin;
                }
                db.query('UPDATE `user` SET ? WHERE id = ?', [editedUser, id])
                    .then(function (result) {
                        resolve(result[0]);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            } catch (error) {
                reject(error);
            }
        });
    },

    /**
     * Delete user by id.
     * @param {number} id
     * @return {promise}
     */
    deleteById: function (id) {
        return new Promise(function (resolve, reject) {
            db.query('DELETE FROM `user` WHERE id = ?', id)
                .then(result => {
                    resolve(result[0]);
                })
                .catch(error => {
                    reject(error);
                })
        });
    },

    /**
     * Get followers by userid.
     * @param {number} id
     * @return {promise}
     */
    getFollowersById: function (id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.username AS user_username, u.id AS user_id, f.username AS follower_username, f.id AS follower_id
                FROM user_follow AS uf
                JOIN user AS u on u.id = uf.user_id
                JOIN user AS f on f.id = uf.follow_id
                WHERE uf.follow_id = ?
            `;
            console.log(db.format(sql, id));
            db.query(sql, id)
            .then((results, fields) => {
                resolve(results[0], fields);
            })
            .catch(err => {
                reject(err);
            })
        });
    },
    
    /**
     * Get following by userid.
     * @param {number} id
     * @return {promise}
     */
    getFollowingById: function (id) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT u.username AS user_username, u.id AS user_id, f.username AS follower_username, f.id AS follower_id
                FROM user_follow AS uf
                JOIN user AS u on u.id = uf.user_id
                JOIN user AS f on f.id = uf.follow_id
                WHERE uf.user_id = ?
            `;
            console.log(db.format(sql, id));
            db.query(sql, id)
            .then((results, fields) => {
                resolve(results[0], fields);
            })
            .catch(err => {
                reject(err);
            })
        });
    },

    /**
     * Follow followId from userId
     * @param {number} userId 
     * @param {number} followId 
     * @return {promise}
     */
    follow: function (userId, followId) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO user_follow SET user_id = ?, follow_id = ?', [userId, followId])
            .then((results, fields) => {
                resolve(results, fields);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * Unfollow followId from userId
     * @param {number} userId 
     * @param {number} followId 
     * @return {promise}
     */
    unfollow: function (userId, followId) {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM user_follow WHERE user_id = ? AND follow_id = ?', [userId, followId])
            .then((results, fields) => {
                resolve(results, fields);
            })
            .catch((err) => {
                reject(err);
            })
        });
    },

    /**
     * Hash a password with bcrypt.
     * @param {string} password 
     * @return {promise} bcrypt promise
     * @throws error
     */
    hash: async function (password) {
        return await bcrypt.hash(password, saltRounds);
    },

    /**
     * Check username and password, throws error if false username, password, etc.
     * @param {string} username 
     * @param {string} password 
     * @return {promise} user object
     */
    compareUsernamePassword: function (username, password) {
        let self = this;
        return new Promise(async function(resolve, reject) {
            try {
                const [rows, fields] = await db.query('SELECT * FROM `user` WHERE `username` = ?', [username]);
                
                if (rows[0]) {
                    let user = rows[0];
                    console.log(user);
                    self.comparePassword(password, user.password)
                        .then((res) => {
                            if (res) {
                                resolve(user);
                            } else {
                                reject({message: "Password is wrong"});
                            }
                        })
                        .catch((err) => {
                            reject(err);
                        });
                } else {
                    // TODO: Change error message to look like mysql2 error
                    reject({message: "Did not find username"});
                }
            } catch (error) {
                reject(error);     
            }
        });
    },
    
    /**
     * Compare password with hash, throws error if error
     * @param {string} password 
     * @param {string} hash 
     * @return {boolean} True if correct password, false if not
     */
    comparePassword: async function (password, hash) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hash, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });
    },
};

module.exports = User;