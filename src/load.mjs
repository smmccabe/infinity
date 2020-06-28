import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import util from './util.mjs';

class load {
    static items = {
      weapons: [],
      armour: [],
      prefixes: [],
      suffixes: [],
    };

    static beings = {
      mobs: [],
    };

    static loadFiles(dir) {
      const nodes = [];
      fs.readdirSync(dir).forEach((file) => {
        const filepath = path.join(dir, file);
        if (fs.lstatSync(filepath).isDirectory()) return;

        try {
          const doc = yaml.safeLoad(fs.readFileSync(filepath, 'utf8'));
          nodes.push(doc);
        } catch (e) {
          console.log(e);
        }
      });

      return nodes;
    }

    static load() {
      this.loadWeapons();
      this.loadArmour();
      this.loadItemPrefixes();
      this.loadItemSuffixes();
      this.loadMobs();
    }

    static loadWeapons() {
      this.items.weapons = this.loadItems('data/items/weapons');
    }

    static loadArmour() {
      this.items.armour = this.loadItems('data/items/armour');
    }

    static loadItems(dir) {
      const items = this.loadFiles(dir);
      items.sort((a, b) => this.powerItem(a) - this.powerItem(b));

      return items;
    }

    static loadMobs() {
      this.beings.mobs = this.loadFiles('data/beings/mobs');

      this.beings.mobs.sort((a, b) => this.powerBeing(a) - this.powerBeing(b));
    }

    static loadItemPrefixes() {
      this.items.prefixes = this.loadFiles('data/items/prefixes');
    }

    static loadItemSuffixes() {
      this.items.suffixes = this.loadFiles('data/items/suffixes');
    }

    static randomItem(power) {
      let items = [];

      let segment = this.items.weapons.filter((item) => this.powerItem(item) <= power);
      items = items.concat(segment);

      segment = this.items.armour.filter((item) => this.powerItem(item) <= power);
      items = items.concat(segment);

      const rand = util.getRandomInt(items.length);
      return items[rand];
    }

    static randomMob(power) {
      const segment = this.beings.mobs.filter((mob) => this.powerBeing(mob) <= power);

      const rand = util.getRandomInt(segment.length);
      return segment[rand];
    }

    static randomItemPrefix() {
      const rand = util.getRandomInt(this.items.prefixes.length);
      return this.items.prefixes[rand];
    }

    static randomItemSuffix() {
      const rand = util.getRandomInt(this.items.suffixes.length);
      return this.items.suffixes[rand];
    }

    static powerItem(item) {
      return item.damage + item.armour;
    }

    static powerBeing(being) {
      return being.attr.str + being.attr.agi + being.attr.con + being.attr.int + being.attr.wis + being.attr.cha;
    }
}

export default load;
