import input from "../javascript/input.js"

//feladat 1
class Student{
    constructor(name, email){
        this.name = name,
        this.email = email
    }
    kiir(){
        console.log(this.name, this.email)
    }
}

let number = await input("Hany adatot adnal meg: ")
let counter = 0;
let array = [];

while (counter < number) {
    let name = await input("Enter student name: ");
    let email = await input("Enter student email: ");
    
    let student = new Student(name, email);
    array.push(student);
    
    counter++;
}

for (const i of array){
    i.kiir()
}

//Feladat 2
class Timetable{
    constructor(){
        this.week = {
            "Monday": [],
            "Tuesday": [],
            "Wednesday": [],
            "Thursday": [],
            "Friday": [],
        }
    }
    addLesson(lesson, day){
        if (this.week[day]){
            this.week[day].push(lesson);
        }
        else {
            console.log("Nincs ilyen nap a hétben");
        }
    }

    printTimeTable() {
        console.log("Heti Orarend:")
        for(const day in this.week) {
            console.log(`${day}: ${this.week[day].join(', ')}`);
        }
    }
}

let timetable = new Timetable()
let num  = await input("Hány órát adnal meg: ")
let count = 0;

while (count < num) {
    let lesson = await input("Add meg az órát: ");
    let day = await input("Add meg a napot: ");
    timetable.addLesson(lesson, day);
    count++;
}

timetable.printTimeTable();