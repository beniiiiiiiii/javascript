import express from "express";
import * as db from './data/db.js'
import { json } from "body-parser";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/cars", (req, res => {
    const cars = db.getAllCars()
    res.statu(200).json(cars)
}))
app.get("/cars/:id", (req, res => {
    const car = db.getCarById(+req.params.id)
    if(!car){
        return res.status(404).json({message: "car not found"});
    }
    res.status(200).json(car);
}))
app.post("/cars", (req, res => {
    const {brand, model} = req.body;
    if(!brand || !model){
        return res.status(404),json({message: "not found"})
    }
    const saved = db.saveCar(brand, model)
    const car = db.getCarById(saved.lastInsertRowid)
    res.status(200).json(car);
}))
app.put("/cars", (req, res => {
    const id = req.params.id
    let car = db.getCarById(id);
    if(!car){
        return res.status(404),json({message: "not found"})
    }
    const {brand, model} = req.body;
    if(!brand || !model){
        return res.status(400),json({message: "invalid"})
    }
    const updated = db.saveCar(brand, model)
    res.status(200).json(car);
}))
app.delete("/cars/:id", (req, res => {
    db.deleteCar(+req.params.id)
    res.status(200).json("success")
}))



app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});