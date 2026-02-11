const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/database.json');

const readData = () => {
    try {
        if (!fs.existsSync(dbPath)) {

            const initialData = { users: [], games: [] };
            saveData(initialData);
            return initialData;
        }
        const data = fs.readFileSync(dbPath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database:", err);
        return { users: [], games: [] };
    }
};

const saveData = (data) => {
    try {
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error("Error writing database:", err);
    }
};

module.exports = { readData, saveData };
