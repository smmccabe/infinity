import Load from './load.mjs';
import Item from './item.mjs';
import util from './util.mjs';

class Loot {
  static roll(power) {
    let item = Load.randomItem(power);
    item = new Item(item.name, item.type, item.damage, item.armour);

    const magic = util.getRandomInt(10);
    if (magic < 3) {
      item = this.magic(item);
    }

    util.saveItem(item);

    return item;
  }

  static magic(item) {
    const roll = util.getRandomInt(100);
    if (roll < 50) {
      const prefix = Load.randomItemPrefix();
      item.enchantPrefix(prefix);
      item.magic = 'Uncommon';
      return item;
    }

    let suffix = Load.randomItemSuffix();
    item.enchantSuffix(suffix);
    item.magic = 'Magic';

    if (roll > 85) {
      suffix = Load.randomItemPrefix();
      item.enchantPrefix(suffix);
      item.magic = 'Rare';
    }

    if (roll > 98) {
      item.lengendary();
      item.magic = 'Legendary';
    }

    return item;
  }
}

export default Loot;
