class util {
    static items = {};

    static beings = {};

    static randomAttr() {
      const attr = this.getRandomInt(6);

      switch (attr) {
        case 0:
          return 'str';
        case 1:
          return 'agi';
        case 2:
          return 'con';
        case 3:
          return 'int';
        case 4:
          return 'wis';
        case 5:
          return 'cha';
        default:
          return '';
      }
    }

    static getRandomInt(max) {
      return Math.floor(Math.random() * Math.floor(max));
    }

    static saveItem(item) {
      this.items[item.id] = item;
    }

    static loadItem(id) {
      return this.items[id];
    }

    static saveBeing(being) {
      this.beings[being.id] = being;
    }

    static loadBeing(id) {
      return this.being[id];
    }
}

export default util;
