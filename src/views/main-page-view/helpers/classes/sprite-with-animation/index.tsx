interface AnimationInner {
  frameRate: number;
  frameBuffer: number;
  loop: boolean;
  imageSrc: string;
  animationImage: HTMLImageElement;
  isActive?: boolean;
  onComplete?: () => void;
}

export type ISpriteAnimation = {
  [key: string]: AnimationInner;
};

export interface ISpriteWithAnimation {
  spritePosition: { x: number; y: number };
  spriteSize: { width: number; height: number };
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
  currentAnimation: AnimationInner | null = null;

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
    this.loaded = false; // Set loaded to false initially

    this.spriteSize = { width: 0, height: 0 }; // Initialize spriteSize

    //player image
    this.image = new Image();
    this.image.src = imageSrc;

    this.loadImage(this.image, this.frameRate);

    // animation when move left or right
    this.animation = animation || null;

    if (this.animation) {
      for (let key in this.animation) {
        const animationImage = new Image();
        animationImage.src = this.animation[key].imageSrc;
        this.animation[key].animationImage = animationImage;
      }
    }
  }

  loadImage(image: HTMLImageElement, frameRate: number) {
    if (this.image !== image) {
      this.image = image;
    }

    this.image.onload = () => {
      this.loaded = true; // Update loaded to true when the image is loaded
      this.spriteSize.width = this.image.width / frameRate;
      this.spriteSize.height = this.image.height;
    };
  }

  switchSprite(animationInner: AnimationInner) {
    if (this.image === animationInner.animationImage) {
      return;
    }
    this.currentFrame = 0;

    this.loadImage(animationInner.animationImage, animationInner.frameRate);

    this.frameRate = animationInner.frameRate;
    this.frameBuffer = animationInner.frameBuffer;
    this.loop = animationInner.loop;
    this.currentAnimation = animationInner;
  }

  play() {
    this.autoplay = true;
  }

  stoptPlay() {
    this.autoplay = false;
    this.currentFrame = 0;
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
