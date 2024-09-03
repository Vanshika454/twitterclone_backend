
const bcrypt = require('bcryptjs');

const saltRounds = 10;

const PasswordManager = {
    toHash: async(plainPassword) => {
        try {
            const hash = await bcrypt.hash(plainPassword, saltRounds);
            return hash;
        } catch (err) {
            throw new Error('something worng with Password');
        }
    },
    compare: async(plainPassword, hashPassword) => {
        try {
            const match = await bcrypt.compare(plainPassword, hashPassword);
            return match;
        } catch (err) {
            throw new Error('something worng with Password');
        }
    }
}

module.exports = PasswordManager;