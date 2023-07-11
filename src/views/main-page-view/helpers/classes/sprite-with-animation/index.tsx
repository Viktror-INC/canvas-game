interface AnimationInner {
  frameRate: number;
  frameBuffer: number;
  loop: boolean;
  imageSrc: string;
  animationImage: HTMLImageElement;
}

export type ISpriteAnimation = {
  [key: string]: AnimationInner;
};

export interface ISpriteWithAnimation {
  spritePosition: { x: number; y: number };
  context: CanvasRenderingContext2D;
  imageSrc: string;
  frameRate: number;
  frameBuffer?: number;
  animation?: ISpriteAnimation;
  loop?: boolean;
  autoplay?: boolean;
}

export class SpriteWithAnimation {
  spritePosition;
  image;
  context;
  spriteSize;
  loaded;
  frameRate;
  currentFrame = 0;
  elapsedFrames = 0; // previous frames
  frameBuffer; // saved frames
  animation: ISpriteAnimation | null;
  loop;
  autoplay;

  constructor({
    spritePosition,
    context,
    imageSrc,
    frameRate,
    animation,
    frameBuffer = 3,
    loop = true,
    autoplay = true,
  }: ISpriteWithAnimation) {
    this.context = context;
    this.spritePosition = spritePosition;

    this.frameRate = frameRate;
    this.frameBuffer = frameBuffer;
    this.loop = loop;
    this.autoplay = autoplay;

    //player image
    this.image = new Image();
    this.image.src = imageSrc;
    this.spriteSize = { width: 0, height: 0 };

    this.image.onload = () => {
      this.loaded = true;
      this.spriteSize.width = this.image.width / frameRate; // we have 11 player on image on full weight
      this.spriteSize.height = this.image.height;
    };
    this.loaded = false;

    // animation when move left or right
    this.animation = animation || null;

    if (this.animation) {
      for (let key in this.animation) {
        const image = new Image();
        image.src = this.animation[key].imageSrc;
        this.animation[key].animationImage = image;
      }
    }
  }

  switchSprite(animationInner: AnimationInner) {
    if (this.image === animationInner.animationImage) {
      return;
    }
    this.currentFrame = 0;
    this.image = animationInner.animationImage;
    this.frameRate = animationInner.frameRate;
    this.frameBuffer = animationInner.frameBuffer;
  }

  play() {
    this.autoplay = true;
  }

  stoptPlay() {
    this.autoplay = false;
    if(this.currentFrame > 0) {
      this.currentFrame--;
    }
  }

  updateFrames() {
    if (!this.autoplay) {
      return;
    }
    this.elapsedFrames++;

    if (this.elapsedFrames % this.frameBuffer === 0) {
      if (this.currentFrame < this.frameRate - 1) {
        this.currentFrame++;
      } else if (this.loop) {
        this.currentFrame = 0;
      }
    }
  }

  draw() {
    if (!this.loaded) {
      return;
    }

    // this.currentFrame = this.image.width / this.spritePosition.x;
    const cropBox = {
      position: {
        x: this.spriteSize.width * this.currentFrame,
        y: 0,
      },
      width: this.spriteSize.width,
      height: this.spriteSize.height,
    };

    this.context.drawImage(
      this.image,
      cropBox.position.x,
      cropBox.position.y,
      cropBox.width,
      cropBox.height,
      this.spritePosition.x,
      this.spritePosition.y,
      this.spriteSize.width,
      this.spriteSize.height
    );

    this.updateFrames();
  }
}
