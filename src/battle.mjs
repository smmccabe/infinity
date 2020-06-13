import util from './util.mjs';

class Battle {

    static battle(hero, villain) {
        let red = {
            hp: hero.getHealth(),
            damage: hero.getDamage(),
            armour: hero.getDefense(),
            attack: hero.getAttack(),
            dodge: hero.getDodge()
        };

        let blue = {
            hp: villain.getHealth(),
            damage: villain.getDamage(),
            armour: villain.getDefense(),
            attack: villain.getAttack(),
            dodge: villain.getDodge() 
        }

        while(red.hp > 0 && blue.hp > 0) {
            let damage = this.attack(red, blue);
            blue.hp -= damage;
            //console.log('%s attacked for %s damage', hero.name, damage);

            if(blue.hp <= 0) {
                return true;
            }

            damage = this.attack(blue, red);
            red.hp -= damage;
            //console.log('%s attacked for %s damage', villain.name, damage);

            if(red.hp <= 0) {
                return false;
            }
        }
    }

    static attack(attacker, defender) {
        const crit = util.getRandomInt(10);
        let damage = attacker.damage;
        if(crit < 3) {
            damage *= 2;
        }

        damage -= defender.armour;
        if(damage < 0) {
            damage = 0;
        }

        return damage;
    }
}

export default Battle;