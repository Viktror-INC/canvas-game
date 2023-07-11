interface ICollisionBlocks {
  position: {
    x: number;
    y: number;
  };
  context: CanvasRenderingContext2D;
}

export class CollisionBlocks {
  position;
  width;
  height;
  context;

  constructor({ position, context }: ICollisionBlocks) {
    this.position = position;
    this.width = 64;
    this.height = 64;
    this.context = context;
  }

  draw() {
    this.context.fillStyle = "rgba(255, 0,0, 0.3)";
    this.context.fillRect(
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
}
