const Item = require('./Item.js');
const Promotion = require('./Promotion.js');

const data = require('./datbase.js');

module.exports = function main(input) {
    mapSpecInputToNormal(input);
    let all = data.loadAllItems();
    let itemList = createItemList(all, input);
    let itemListWithQuality = itemList.filter(item => item.quality !== 0);
    let promotionList = createPromotionList(all, input);
    let displayItemString = itemListWithQuality.reduce((result, item) => result + displayItem(item, promotionList), "");
    let promotionString = promotionList.reduce((result, promotion) => result + displayPromotion(promotion), "");
    console.log(createTitle() + displayItemString + displayPromotionFooter() + promotionString + createFooter(itemList, promotionList));
};

function mapSpecInputToNormal(input) {
    let filter = input.filter(value => value.indexOf("-") !== -1);
    let spec = filter.map(value => value.split("-"));
    spec.forEach(value => {
        for (let i = 0; i < +value[1]; i++) {
            input.push(value[0]);
        }
    });
}

function displayItem(item, promotionList) {
    let promotion = promotionList.find(value => value.barcode === item.barcode);
    let count = promotion ? promotion.count : 0;
    return `名称：${item.name}，数量：${item.quality}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${(item.price * (item.quality - count)).toFixed(2)}(元)\n`;
}

function displayPromotion(promotion) {
    return `名称：${promotion.name}，数量：${promotion.count}${promotion.unit}\n`;
}

function displayPromotionFooter() {
    return "----------------------\n" +
        "挥泪赠送商品：\n";
}

function createTitle() {
    return '***<没钱赚商店>购物清单***\n';
}

function createFooter(itemList, promotionList) {
    let footer = '----------------------\n';
    footer += createTotal(itemList, promotionList);
    footer += createPromotionPrice(promotionList);
    return footer += '**********************'
}

function calculateTotalPrice(itemList, promotionList) {
    return itemList.map(item => {
        let promotionItem = promotionList.find(value => item.barcode === value.barcode);
        let promotionPrice = promotionItem?promotionItem.count*promotionItem.price:0;
        return item.totalPrice - promotionPrice;
    }).reduce((a, b) => a + b);
}

function createPromotionPrice(promotionList) {
    let totalPromotionPrice = promotionList.map(item => item.price).reduce((a, b) => a + b);
    return "节省：" + totalPromotionPrice.toFixed(2) + "(元)\n";
}

function createTotal(itemList, promotionList) {
    let totalPrice = calculateTotalPrice(itemList, promotionList);
    return "总计：" + totalPrice.toFixed(2) + "(元)\n";
}

function createItemList(allItem, input) {

    let itemList = [];
    allItem.forEach(value => {
        let itemObject = new Item(value.barcode, value.price, value.unit, value.name);
        itemObject.quality = input.filter(item => value.barcode === item).length;
        itemObject.totalPrice = itemObject.quality * itemObject.price;
        itemList.push(itemObject);
    });
    return itemList;
}

function createPromotionList(allItem, input) {
    let promotionList = data.loadPromotions();
    let itemList = createItemList(allItem, input);
    let promotionItemList = [];

    promotionList.forEach(value => {
        if (value.type === 'BUY_TWO_GET_ONE_FREE') {
            value.barcodes.forEach(barcode => {
                let item = itemList.find(item => item.barcode === barcode);
                let count = item.quality >= 2 ? 1 : 0;
                let promotion = new Promotion(barcode, item.unit, item.name, count, value.type, item.price);
                promotionItemList.push(promotion);
            })
        }
    });

    return promotionItemList.filter(item => item.count !== 0);
}