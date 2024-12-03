import { count } from 'console'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const filePath = path.join(__dirname, "dobasok.txt")


let content = '';

try{
    content = fs.readFileSync(filePath, 'utf-8')
} catch (err){
    console.log(err)
}
console.log('1. Feladat::')
console.log(content)

let position = 0;
const target = 45;
let results = [];
let counter = 0;
let endString = 'A jatekot abbahagyta';

const array = content.split(', ');
for(let i = 0; i < array.length; i++){
    position += parseInt(array[i]);

    if (position % 10 === 0){
        position -= 3;
        counter++;
    }

    if (position >= target){
        position = target;
        results.push(position);
        endString = 'A jatekot befejezte'
        break;
    }

    results.push(position)
}
console.log('2. Feladat:')
console.log(results.join(' '));
console.log(`3. Feladat:\nA jatek soran ${counter} alkalommal lepett vissza`)
console.log('4.Feladat: ')
console.log(endString)



try {
    const resultsString ='\n' + results.join(', ') + '\n';

    fs.appendFileSync(filePath, resultsString);
} catch (err) {
    console.log(err);
}