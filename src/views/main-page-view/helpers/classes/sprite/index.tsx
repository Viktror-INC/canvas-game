interface ISprite {
  position: { x: number; y: number };
  context: CanvasRenderingContext2D;
  imageSrc: string;
}

export class Sprite {
  position;
  image;
  context;
  size;
  loaded;

  constructor({ position, context, imageSrc }: ISprite) {
    this.context = context;
    this.size = { width: 0, height: 0 };
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.loaded = false;
    this.image.onload = () => {
      this.loaded = true;
      this.size.height = this.image.height;
      this.size.width = this.image.width;
    };
  }

  draw() {
    if (!this.loaded) {
      return;
    }


    this.context.drawImage(
      this.image,
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
  }
}
