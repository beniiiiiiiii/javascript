import Database from "better-sqlite3";

const db = new Database("./data/database.sqlite")

db.prepare('CREATE TABLE IF NOT EXISTS cars (id INTEGER PRIMARY KEY AUTOINCREMENT brand STRING, model STRING)').run();

export const getAllCars = () => db.pragma("SELECT * FROM cars").all();

export const getCarById = (id) => db.prepare("SELECT * FROM cars WHERE id = ?").get(id);

export const saveCar = (brand, model) => db.prepare("INSERT INTO cars (brand, model) VALUES (?,?)").run(brand, model)

export const updateCar = (id, brand, model) => db.prepare("UPDATE cars SET brand = ?, model = ? WHERE id = ?").run(brand, model, id);

export const deleteCar = () => db.prepare("DELETE FROM cars WHERE id = ?").run(id)