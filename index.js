const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const map = {
  '0': (s, c) => s.push(0),
  '1': (s, c) => s.push(1),
  '2': (s, c) => s.push(2),
  '3': (s, c) => s.push(3),
  '4': (s, c) => s.push(4),
  '5': (s, c) => s.push(5),
  '6': (s, c) => s.push(6),
  '7': (s, c) => s.push(7),
  '8': (s, c) => s.push(8),
  '9': (s, c) => s.push(9),
  '+': (s, c) => s.push(s.pop() + s.pop()),
  '-': (s, c) => {
    const [a, b] = [s.pop(), s.pop()];
    s.push(b - a);
  },
  '*': (s, c) => s.push(s.pop() * s.pop()),
  '/': (s, c) => {
    const [a, b] = [s.pop(), s.pop()];
    s.push(Math.floor(b / a));
  },
  '%': (s, c) => {
    const [a, b] = [s.pop(), s.pop()];
    s.push(a === 0 ? 0 : b % a);
  },
  '!': (s, c) => s.push(s.pop() === 0 ? 1 : 0),
  '`': (s, c) => {
    const [a, b] = [s.pop(), s.pop()];
    s.push(b > a ? 1 : 0);
  },
  '>': (s, c) => c.setDirection('right'),
  '<': (s, c) => c.setDirection('left'),
  '^': (s, c) => c.setDirection('up'),
  'v': (s, c) => c.setDirection('down'),
  '?': (s, c) => c.setDirection(),
  '_': (s, c) => c.setDirection(s.pop() === 0 ? 'right' : 'left'),
  '|': (s, c) => c.setDirection(s.pop() === 0 ? 'down' : 'up'),
  ':': (s, c) => {
    const val = s.pop();
    val == undefined ? s.push(0) : s.splice(s.length, 0, val, val);
  },
  '\\': (s, c) => s.splice(s.length, 0, s.pop(), s.pop() || 0),
  '$': (s, c) => s.pop(),
  '.': (s, c, o) => o.push(s.pop()),
  ',': (s, c, o) => o.push(String.fromCharCode(s.pop())),
  '#': (s, c) => c.next(),
  'p': (s, c) => c.put(s.pop(), s.pop(), s.pop()),
  'g': (s, c) => s.push(c.get(s.pop(), s.pop())),
  ' ': () => {}
};

class Cursor {
  constructor(plane) {
    this.plane = plane;
    this.x = -1;
    this.y = 0;
    this.direction = 'right';
    this.strMode = false;
  }
  next() {
    switch (this.direction) {
      case 'right':
        this.x++;
        break;
      case 'left':
        this.x--;
        break;
      case 'up':
        this.y--;
        break;
      case 'down':
        this.y++;
        break;
    }
    if (this.x > this.plane[this.y].length) this.x = 0;
    if (this.x < 0) this.x = this.plane[this.y].length - 1;
    if (this.y >= this.plane.length) this.y = 0;
    if (this.y < 0) this.y = this.plane.length - 1;
    return this.plane[this.y][this.x];
  }
  put(y, x, v) {
    this.plane[y][x] = String.fromCharCode(v % 256);
  }
  get(y, x) {
    return this.plane[y][x].charCodeAt(0);
  }
  setDirection(dir) {
    this.direction = dir || [
      'right',
      'left',
      'up',
      'down'
    ][rand(0, 3)];
  }
  stringMode() {
    return this.strMode;
  }
  toggleStringMode() {
    this.strMode = !this.strMode;
  }
}

function interpret(code) {
  const stack = [];
  const out = [];
  const plane = code.split('\n').map(l => l.split(''));
  const cursor = new Cursor(plane);
  let instruction = cursor.next();
  while (instruction !== '@') {
    if (instruction === '"') cursor.toggleStringMode();
    else if (cursor.stringMode()) stack.push(instruction.charCodeAt(0));
    else map[instruction](stack, cursor, out);
    instruction = cursor.next();
  }
  return out.join('');
}
