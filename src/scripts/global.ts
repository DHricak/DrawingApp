window.gcd = function (a: number, b: number) {
  return (b == 0) ? a : gcd (b, a%b);
}
window.aspectRatio = function (a:number, b:number) {
  let dif = gcd(a, b);
  return [a/dif, b/dif]
}

class Vector {
  x: number;
  y: number;

  constructor(x = 1, y = 1) {
    this.x = x;
    this.y = y;
  }

  len() {
    return Math.sqrt(this.x**2+this.y**2);
  }

  norm() {
    let lenght = this.len();
    return new Vector(this.x/lenght, this.y/lenght);
  }

  distance(vec: Vector) {
    var a = this.x - vec.x;
    var b = this.y - vec.y;
  
    var c = Math.sqrt( a*a + b*b );
    return Math.abs(c);
  }

  angle(vec: Vector) {
    return ( ( ( -(Math.atan2((this.x-vec.x),(this.y-vec.y))*(180/Math.PI)) % 360) + 360) % 360)
  }

  add(vec: Vector) {
    let x = this.x + vec.x;
    let y = this.y + vec.y;
    return new Vector(x, y);
  }

  sub (vec: Vector) {
    let x = this.x - vec.x;
    let y = this.y - vec.y;
    return new Vector(x, y);
  }

  mul(n: number) {
    return new Vector(this.x*n, this.y*n);
  }

  clone() {
    return new Vector(this.x, this.y)
  }
}

window.newVector = (x = 0, y = 0) => new Vector(x, y);

export {};