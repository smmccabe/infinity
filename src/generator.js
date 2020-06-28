import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';
import commandLineArgs from 'command-line-args';

const optionDefinitions = [
  { name: 'input', alias: 'i', type: String },
  { name: 'output', alias: 'o', type: String },
];
const options = commandLineArgs(optionDefinitions);

const template = yaml.safeLoad(fs.readFileSync(options.input, 'utf8'));

console.log(template);

let { damage } = template.start;
let { armour } = template.start;
template.bases.forEach((base) => {
  template.materials.forEach((material) => {
    const contents = {
      name: `${material} ${base}`,
      type: template.type,
      subtype: template.subtype,
      damage,
      armour,
    };

    const filename = `${material}_${base}.yml`;
    const filepath = path.join(options.output, filename.toLowerCase());
    console.log(filepath);
    fs.writeFile(filepath, yaml.dump(contents), (err) => {
      if (err) console.log(err);
    });

    damage += template.increment.damage;
    armour += template.increment.armour;
  });
});
