const fs = require('fs');

let people;
let weightedPeople;

exports.draw = draw;


function draw() {
    people = JSON.parse(fs.readFileSync('people.json').toString());
    console.log('before', people.people);
    establishRestrictedCoincidence(transferScore(people.people));
    fs.writeFileSync('./people.json', JSON.stringify({people: weightedPeople}, null, 4));
    console.log('after', weightedPeople);
    return weightedPeople;
}

function establishRestrictedCoincidence(people) {
    function weight(people) {
        let gotItRight = true;
        weightedPeople = [];
        weightedPeople = generateOrder(people);
        weightedPeople = weightedPeople.sort(compare);
        changeToIndex(weightedPeople);
        weightedPeople.forEach(el => {
            if (el.now === el.last || el.now === el.before) {
                gotItRight = false;
            }
        });
        if (gotItRight) {
            return
        } else {
            weight(people);
        }
    }
    weight(people);
}

function compare(a, b) {
    let first = a.now;
    let second = b.now;
    let comp = 0;

    if (first < second) {
        comp = 1;
    } else if (first > second) {
        comp = -1;
    }
    return comp;
};

function generateOrder(people) {
    return people.map(el => {
        el.now = parseInt(Date.now().toString().substring(3)[parseInt(Math.random() * 10)] + Date.now().toString().substring(3)[parseInt(Math.random() * 10)]);
        return el;
    });
}

function changeToIndex(people) {
    return people.map((el, i) => {
        el.now = i;
        return el;
    });
}

function transferScore(people) {
    return people.map((el, i) => {
        el.before = el.last;
        el.last = el.now;
        return el;
    });
}
