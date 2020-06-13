"use strict";

import Being from './being.mjs';
import Item from './item.mjs';
import util from './util.mjs';
import Battle from './battle.mjs';
import { promisify } from 'util';
import Load from './load.mjs';
import Loot from './loot.mjs';
import colors from 'colors';

const sleep = promisify(setTimeout)

let hero = new Being("Hero");

util.saveBeing(hero);

Load.load()

async function main() {
    while(true) {
        const mobTemplate = Load.randomMob(hero.getPower());
        const mob = new Being(mobTemplate.name, mobTemplate.attr)

        const result = Battle.battle(hero, mob);
        if(result) {
            console.log(colors.green('%s defeated %s'), hero.name, mob.name);
            
            const power = mob.getPower();
            hero.addXp(power);

            if(util.getRandomInt(10) < 2) {
                const loot = Loot.roll(power / 10);
                console.log('Looted: ' + loot.outputColored());
                
                hero.addToInv(loot.id);
            }
        }
        else {
            console.log(colors.red('%s defeated %s'), mob.name, hero.name);
        }

        //await sleep(500);
    }
}

main();