
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
  left: '25%',
  width: '25%',
  height: '100%',
  tags: true,
  border: {
    type: 'line'
  }
});

let boxLoot = blessed.log({
  top: '',
  left: '75%',
  width: '25%',
  height: '100%',
  border: {
    type: 'line'
  }
})

let boxHero = blessed.box({
  top: '0%',
  left: '0%',
  width: '25%',
  height: '100%',
  border: {
    type: 'line'
  }
});

let levelBar = blessed.progressbar({
  height: 1,
  filled: 50,
  pch: ' ',
  style: {
    bg: 'grey',
    bar: {
      bg: 'blue',
    }
  }
});
boxHero.append(levelBar);

let boxHeroSub = blessed.box({
  top: 1
});
boxHero.append(boxHeroSub);

let boxMob = blessed.box({
  top: '0%',
  left: '50%',
  width: '25%',
  height: '100%',
  border: {
    type: 'line'
  }
});

screen.append(boxBattle);
screen.append(boxLoot);
screen.append(boxHero);
screen.append(boxMob);
// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});

// Render the screen.
screen.render();

async function main() {
  let offset = 0;
  const quest = Load.quests[0];

  let i = 0;
  const cap = quest.mobs.length;
  while (true) {
    if(i == cap) {
      i = 0;
      offset += cap;
    }

    const mobBase = quest.mobs[i];
    const mobTemplate = Load.loadMobByName(mobBase.name);
    const mob = new Being(mobTemplate.name, mobTemplate.attr, mobBase.level + offset);

    const result = Battle.battle(hero, mob);
    if (result) {
      boxBattle.log(colors.green(`${hero.name} defeated ${mob.name} (${mob.level})`));

      const power = mob.getPower();
      hero.addXp(power);
      levelBar.setProgress((hero.xp / hero.getLevelUp()) * 100);

      if (util.getRandomInt(10) < 2) {
        const loot = Loot.roll(power / 10);
        boxLoot.log(`Looted: ${loot.outputColored()}`);

        hero.addToInv(loot.id);
      }
      i += 1;
    } else {
      boxBattle.log(colors.red(`${mob.name} (${mob.level}) defeated ${hero.name}`));
      i = 0;
      if(offset > 0) {
        offset -= cap;
      }
    }

    boxHeroSub.setContent(hero.getSheet());

    boxMob.setContent(mob.getSheet());

    await sleep(500);
  }
}

main();
