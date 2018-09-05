module.exports = class Item{

    constructor(barcode, price, unit, name, quality, totalPrice){
        this.barcode = barcode;
        this.name = name;
        this.price = price;
        this.quality = quality;
        this.unit = unit;
        this.totalPrice = totalPrice;
    }
}

