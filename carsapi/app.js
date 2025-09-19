import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const cars = [
  { id: 1, brand: "bmw", model: "sedam" },
  { id: 1, brand: "kia", model: "sportage" },
  { id: 1, brand: "toyota", model: "supra" },
  { id: 1, brand: "nissan", model: "gtr" },
  { id: 1, brand: "audi", model: "r8" },
];

//getall
app.get("/cars", (req, res) => {
  res.status(200).json(cars);
});

//get by id
app.get("/cars/:id", (req, res) => {
  const id = req.params.id;
  const car = cars.find((car) => car.id === id);
  if (!car) {
    res.status(404).json({ message: "Car not found" });
  }
  res.status(200).json(car);
});

//post
app.post("/cars", (req, res) => {
  const { brand, model } = req.body;
  if (!brand || !model) {
    res.status(400).json({ message: "Invalid creds" });
  }
  const id = cars.length ? cars[cars.length - 1].id + 1 : 1;
  const car = { id, brand, model };
  cars.push(car);
  res.status(200).json(car);
});

//put
app.put("/cars/:id", (req, res) => {
  const id = Number(req.params.id);
  let car = cars.find((car) => car.id === id);
  if (!car) {
    res.status(404).json({ message: "car not found" });
  }
  const { brand, model } = req.body;
  if (!brand || !model) {
    res.status(400).json({ message: "invalid creds" });
  }
  const index = cars.indexOf(car);
  car = {
    id: user.id,
    brand: brand,
    model: model,
  };
  cars[index] = car;
  res.status(200).json(car);
});

//delete
app.delete("/cars/:id", (req, res) => {
  const id = Number(req.params.id);
  const car = cars.find((car) => car.id === id);
  if (!car) {
    res.status(404).json({ message: "car not found" });
  }
  const index = cars.indexOf(car);
  cars.splice(index, 1);
  res.status(200).json({ message: "car deleted successfully" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});