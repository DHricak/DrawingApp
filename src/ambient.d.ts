
declare global {
  type shapes = "circle"
  type tools = "move" | "pen" | "eraser" | "line" | "ink" | shapes

  interface penprops {
    width: number = 1;
    color: string = "#101010",
    drag: boolean
  }

  interface settings {}
  interface gridPosition {
    x: number = 0,
    y: number = 0
  }
  interface uiblock {
    x: number,
    y: number,
    element?: HTMLCanvasElement
  }
  interface Dict<T> {
    [key: string]: T;
  }

  interface saveRow {
    id: number,
    name: string,
    blocks: Dict<ImageData>,
    position: number[],
    blockSize: number,
    createdData: Date
  }


  function aspectRatio(a:number, b:number);
  function gcd(a:number, b:number);
  class Vector {
    x: number;
    y: number;
  
    constructor(x = 0, y = 0);
    len(): number;
    norm(): Vector;
    distance(vec: Vector): number;
    angle(vec: Vector): number;
    add(vec: Vector): Vector;
    sub (vec: Vector): Vector;
    mul(n: number): Vector;
    clone(): Vector;
  }
  function newVector(x = 0, y = 0): Vector;
};
export {};