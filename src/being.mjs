import { v4 as uuidv4 } from 'uuid';
import util from './util.mjs';
import item from './item.mjs';
import empty from 'is-empty';

class being {
    constructor(name, attr = {}, level=1) {
        this.id = uuidv4();
        this.name = name;
        this.age = 16;
        this.xp = 0;
        this.level = 1;
        while(this.level < level) {
            this.levelUp();
        }
        this.attr = {
            str: 10,
            agi: 10,
            con: 10,
            int: 10,
            wis: 10,
            cha: 10
        };
        if(!empty(attr)){
            this.attr = attr;
        }

        this.weapon = new item("Empty", "Empty", 0, 0);;
        this.armour = new item("Empty", "Empty", 0, 0);;

        this.major = util.randomAttr();
        this.minor = util.randomAttr();

        this.inventory = [];
    }

    addXp(xp) {
        this.xp += xp;
        const levelUp = 1000 + (1000 * (this.level / 30));
        if(this.xp >= levelUp) {
            this.xp -= levelUp;
            this.levelUp();
        }
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
        if(typeof weapon == 'undefined') {
            weapon = new item("Empty", "Empty", 0, 0);
        }
        
        return weapon;
    }

    getArmour() {
        let armour = util.loadItem(this.armour);
        if(typeof armour == 'undefined') {
            armour = new item("Empty", "Empty", 0, 0);
        }
        
        return armour;
    }

    getAttack() {
        let attack = this.getAttr().agi;
        return attack;
    }

    getDodge() {
        let dodge = this.getAttr().agi;
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
        let power = attr.str + attr.agi + attr.con + attr.int + attr.wis + attr.cha;
        power += this.getWeapon().getDamage();
        power += this.getArmour().getArmour();

        return power;
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
        let inventory = this.inventory.filter(item => util.loadItem(item).type == "Weapon");
        inventory.forEach( (id) => {
            const item = util.loadItem(id);
            if(item.getPower() > weapon.getPower()) {
                this.setWeapon(item.id);
                weapon = item;
                console.log(`Equipped ${item.name}`);
            }
        });
        
        
        let armour = this.getArmour();
        inventory = this.inventory.filter(item => util.loadItem(item).type == "Armour");
        inventory.forEach( (id) => {
            const item = util.loadItem(id);

            if(item.getPower() > armour.getPower()) {
                this.setArmour(item.id);
                armour = item;
                console.log(`Equipped ${item.name}`);
            }
        });
    }

    levelUp() {
        this.level++;

        this.levelUpStats();

        console.log(`Ding! ${this.level}`);
        console.log(this.sheet());
    }

    levelUpStats() {
        const random = util.getRandomInt(10);

        if(random < 2) {
            this.attr[this.major] += 1;
            return;
        }

        if(random < 3) {
            this.attr[this.minor] += 1;
            return;
        }

        this.attr[util.randomAttr()] += 1;
    }

    sheet() {
        return {
            attr: this.getAttr(),
            weapon: this.getWeapon(),
            armour: this.getArmour()
        }
    }
}

export default being;