
import { promisify, inspect } from 'util';
import colors from 'colors';
import blessed from 'blessed';

import Being from './being.mjs';
import util from './util.mjs';
import Battle from './battle.mjs';
import Load from './load.mjs';
import Loot from './loot.mjs';


const sleep = promisify(setTimeout);

const hero = new Being('Hero');

util.saveBeing(hero);

Load.load();

// Create a screen object.
let screen = blessed.screen({
  smartCSR: true
});

screen.title = 'Infinity';

// Create a box perfectly centered horizontally and vertically.
let boxBattle = blessed.log({
  top: '',
  left: '75%',
  width: '25%',
  height: '50%',
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    border: {
      fg: '#f0f0f0'
    },
    hover: {
      bg: 'green'
    }
  }
});

let boxLoot = blessed.log({
  top: '50%',
  left: '75%',
  width: '25%',
  height: '50%',
  border: {
    type: 'line'
  }
})

let boxHero = blessed.box({
  top: '0%',
  left: '50%',
  width: '25%',
  height: '50%',
  border: {
    type: 'line'
  }
});

screen.append(boxBattle);
screen.append(boxLoot);
screen.append(boxHero);
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Render the screen.
screen.render();

async function main() {
  while (true) {
    const mobTemplate = Load.randomMob(hero.getPower());
    const mob = new Being(mobTemplate.name, mobTemplate.attr);

    const result = Battle.battle(hero, mob);
    if (result) {
      boxBattle.log(`${hero.name} defeated ${mob.name}`);

      const power = mob.getPower();
      hero.addXp(power);

      if (util.getRandomInt(10) < 2) {
        const loot = Loot.roll(power / 10);
        boxLoot.log(`Looted: ${loot.outputColored()}`);

        hero.addToInv(loot.id);
      }
    } else {
      boxBattle.log(`${mob.name} defeated ${hero.name}`);
    }

    const sheet = hero.getSheet();
    let heroData = `Level: ${hero.getLevel()}\n`;
    heroData += 'ATTRIBUTES\n';
    heroData += `Strength: ${sheet.attr.str}\n`;
    heroData += `Agility: ${sheet.attr.agi}\n`;
    heroData += `Constitution: ${sheet.attr.con}\n`;
    heroData += `Intelligence: ${sheet.attr.int}\n`;
    heroData += `Wisdom: ${sheet.attr.wis}\n`;
    heroData += `Charisma: ${sheet.attr.cha}\n`;

    heroData += 'ITEMS\n';
    heroData += `Weapon: ${sheet.weapon.name}\n`;
    heroData += `Armour: ${sheet.armour.name}\n`;
    boxHero.setContent(heroData);

    await sleep(500);
  }
}

main();
