module.exports = class Promotion{

    constructor(barcode, unit, name, count, type, price){
        this.barcode = barcode;
        this.name = name;
        this.count = count;
        this.unit = unit;
        this.type = type;
        this.price = price;
    }
}

