export function parse2D(arr: number[]) {
    let rows: number[][] = [];
    for (let i = 0; i < arr.length; i += 16) {
      rows = [...rows, arr.slice(i, i + 16)];
    }
  
    return rows;
  }