import { v4 as uuidv4 } from 'uuid';
import colors from 'colors';
import util from './util.mjs';

colors.setTheme({
  Common: 'grey',
  Uncommon: 'green',
  Magic: 'blue',
  Rare: 'magenta',
  Legendary: 'yellow',
});

class item {
  constructor(name, type, damage, armour) {
    this.id = uuidv4();
    this.name = name;
    this.type = type;
    this.attr = {
      dmg: damage,
      arm: armour,
      str: 0,
      agi: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    };
    this.owner = '';
    this.lineage = [];

    this.major = 'dmg';
    if (type === 'Armour') {
      this.major = 'arm';
    }
    this.minor = util.randomAttr();

    this.magic = 'Common';
  }

  getDamage() {
    return this.attr.dmg;
  }

  getArmour() {
    return this.attr.arm;
  }

  getPower() {
    let power = 0;
    for (const attr in this.attr) {
      power += this.attr[attr];
    }
    return power;
  }

  enchantPrefix(prefix) {
    this.name = `${prefix.name} ${this.name}`;
    this.enchant(prefix);
  }

  enchantSuffix(suffix) {
    this.name = `${this.name} ${suffix.name}`;
    this.enchant(suffix);
  }

  lengendary() {
    this.name = `Legendary ${this.name}`;
    const legendary = {
      multiply: {
        dmg: 2,
        arm: 2,
        str: 2,
        agi: 2,
        con: 2,
        int: 2,
        wis: 2,
        cha: 2,
      },
      add: {
        dmg: 1,
        arm: 1,
        str: 1,
        agi: 1,
        con: 1,
        int: 1,
        wis: 1,
        cha: 1,
      },
    };

    this.enchant(legendary);
  }

  enchant(enchantment) {
    for (const attr in enchantment.add) {
      this.attr[attr] += (this.attr.dmg + this.attr.arm) * enchantment.add[attr];
    }

    for (const attr in enchantment.multiply) {
      this.attr[attr] += this.attr[attr] * enchantment.multiply[attr];
    }
  }

  outputColored() {
    return colors[this.magic](this.name);
  }

  setOwner(id) {
    this.owner = id;
  }

  levelUp() {
    const random = util.getRandomInt(10);

    if (random < 7) {
      this.attr[this.major] += 1;
      return;
    }

    if (random < 9) {
      this.attr[this.minor] += 1;
      return;
    }

    this.attr[util.randomAttr()] += 1;
  }
}

export default item;
