import { CollisionBlocks } from "../../helpers/classes/collisions-block";

interface ISetCollisionsBlocks {
  numbers: number[][];
  context: CanvasRenderingContext2D;
  collisionNumber?: number;
}

export const setCollisionsBlocks = ({
  numbers,
  context,
  collisionNumber = 292,
}: ISetCollisionsBlocks) => {
  let collisionsBlocks: CollisionBlocks[] = [];

  numbers.forEach((row, y) =>
    row.forEach((number, x) => {
      if (number === collisionNumber) {
        // push number to collisionBlocks
        collisionsBlocks = [
          ...collisionsBlocks,
          new CollisionBlocks({
            position: { x: x * 64, y: y * 64 },
            context,
          }),
        ];
      }
    })
  );

  return collisionsBlocks;
};
