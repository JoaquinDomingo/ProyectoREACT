const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData, saveData } = require('../utils/db');
// uuid removed


const register = (req, res) => {
    const { username, password } = req.body;
    const db = readData();

    if (db.users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
        id: Date.now().toString(),
        username,
        password: hashedPassword,
        role: req.body.role || 'user' // Default to user, but allow admin for testing if sent
    };

    db.users.push(newUser);
    saveData(db);

    res.status(201).json({ message: 'User registered successfully' });
};

const login = (req, res) => {
    const { username, password } = req.body;
    const db = readData();

    const user = db.users.find(u => u.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
};

module.exports = { register, login };
