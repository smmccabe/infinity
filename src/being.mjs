import { v4 as uuidv4 } from 'uuid';
import empty from 'is-empty';
import _ from 'lodash';
import util from './util.mjs';
import Item from './item.mjs';

class being {
  constructor(name, attr = {}, level = 1) {
    this.id = uuidv4();
    this.name = name;
    this.age = 16;
    this.xp = 0;
    this.level = 0;
    this.baseAttr = {
      str: 1,
      agi: 1,
      con: 1,
      int: 1,
      wis: 1,
      cha: 1,
    };
    if (!empty(attr)) {
      this.baseAttr = _.clone(attr);
    }

    this.attr = {
      str: 0,
      agi: 0,
      con: 0,
      int: 0,
      wis: 0,
      cha: 0,
    };

    this.weapon = new Item('Empty', 'Empty', 0, 0);
    this.armour = new Item('Empty', 'Empty', 0, 0);

    this.inventory = [];

    while (this.level < level) {
      this.levelUp();
    }
  }

  addXp(xp) {
    this.xp += xp;
    const levelUp = this.getLevelUp();
    if (this.xp >= levelUp) {
      this.xp -= levelUp;
      this.levelUp();
    }
  }

  getLevelUp() {
    return 1000 + (1000 * (this.level / 30));
  }

  getDamage() {
    const weapon = this.getWeapon();

    const damage = weapon.attr.dmg + this.getAttr().str;

    return damage;
  }

  getDefense() {
    const armour = this.getArmour();

    const defense = armour.attr.arm;

    return defense;
  }

  getHealth() {
    return 10 * this.getAttr().con;
  }

  getWeapon() {
    let weapon = util.loadItem(this.weapon);
    if (typeof weapon === 'undefined') {
      weapon = new Item('Empty', 'Empty', 0, 0);
    }

    return weapon;
  }

  getArmour() {
    let armour = util.loadItem(this.armour);
    if (typeof armour === 'undefined') {
      armour = new Item('Empty', 'Empty', 0, 0);
    }

    return armour;
  }

  getAttack() {
    const attack = this.getAttr().agi;
    return attack;
  }

  getDodge() {
    const dodge = this.getAttr().agi;
    return dodge;
  }

  getAttr() {
    const weapon = this.getWeapon();
    const armour = this.getArmour();

    return {
      str: this.attr.str + weapon.attr.str + armour.attr.str,
      agi: this.attr.agi + weapon.attr.agi + armour.attr.agi,
      con: this.attr.con + weapon.attr.con + armour.attr.con,
      int: this.attr.int + weapon.attr.int + armour.attr.int,
      wis: this.attr.wis + weapon.attr.wis + armour.attr.wis,
      cha: this.attr.cha + weapon.attr.cha + armour.attr.cha,
    };
  }

  getPower() {
    const attr = this.getAttr();
    // int,wis and cha commented out since they currently don't do anything.
    let power = attr.str + attr.agi + attr.con; // + attr.int + attr.wis + attr.cha;
    power += this.getWeapon().getDamage();
    power += this.getArmour().getArmour();

    return power;
  }

  getLevel() {
    return this.level;
  }

  setWeapon(id) {
    this.weapon = id;
  }

  setArmour(id) {
    this.armour = id;
  }

  addToInv(id) {
    this.inventory.push(id);
    this.autoEquip();
  }

  autoEquip() {
    let weapon = this.getWeapon();
    let inventory = this.inventory.filter((item) => util.loadItem(item).type === 'Weapon');
    inventory.forEach((id) => {
      const item = util.loadItem(id);
      if (item.getPower() > weapon.getPower()) {
        this.setWeapon(item.id);
        weapon = item;
      }
    });

    let armour = this.getArmour();
    inventory = this.inventory.filter((item) => util.loadItem(item).type === 'Armour');
    inventory.forEach((id) => {
      const item = util.loadItem(id);

      if (item.getPower() > armour.getPower()) {
        this.setArmour(item.id);
        armour = item;
      }
    });
  }

  levelUp() {
    this.level += 1;

    this.levelUpStats();
  }

  levelUpStats() {
    this.attr.str += this.baseAttr.str * 10;
    this.attr.agi += this.baseAttr.agi * 10;
    this.attr.con += this.baseAttr.con * 10;
    this.attr.int += this.baseAttr.int * 10;
    this.attr.wis += this.baseAttr.wis * 10;
    this.attr.cha += this.baseAttr.wis * 10;
  }

  getSheet() {
    let sheet = `${this.name}\n`;
    sheet += `Level: ${this.getLevel()}\n`;
    sheet += `Health: ${this.getHealth()}\n`;
    sheet += `Damage: ${this.getDamage()}\n`;
    sheet += `Defense: ${this.getDefense()}\n`;
    sheet += `Dodge: ${this.getDodge()}\n`;
    sheet += 'ATTRIBUTES\n';
    sheet += `Strength: ${this.getAttr().str}\n`;
    sheet += `Agility: ${this.getAttr().agi}\n`;
    sheet += `Constitution: ${this.getAttr().con}\n`;
    sheet += `Intelligence: ${this.getAttr().int}\n`;
    sheet += `Wisdom: ${this.getAttr().wis}\n`;
    sheet += `Charisma: ${this.getAttr().cha}\n`;

    sheet += 'ITEMS\n';
    sheet += `Weapon: ${this.getWeapon().outputColored()}\n`;
    sheet += `Armour: ${this.getArmour().outputColored()}\n`;

    return sheet;
  }
}

export default being;
