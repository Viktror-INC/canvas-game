import { IKeys } from "@/views/main-page-view";
import { CollisionBlocks } from "../collisions-block";
import {
  SpriteWithAnimation,
  ISpriteAnimation,
} from "../sprite-with-animation";

export interface IPlayer {
  context: CanvasRenderingContext2D;
  collisionsBlocks?: CollisionBlocks[];
  imageSrc: string;
  frameRate: number;
  animation: ISpriteAnimation;
  lastDirection: string;
  preventInput?: boolean;
}

export class Player extends SpriteWithAnimation {
  playerPosition;
  playerSize;
  context;
  sides;
  velocity;
  gravity;
  speed;
  collisionsBlocks;
  hitBox;
  lastDirection;
  preventInput;

  constructor({
    context,
    collisionsBlocks = [],
    imageSrc,
    frameRate,
    animation,
    lastDirection,
    preventInput = true,
  }: IPlayer) {
    const playerPosition = {
      x: 200,
      y: 200,
    };

    const playerSize = {
      width: 25,
      height: 25,
    };

    super({
      spritePosition: playerPosition,
      imageSrc,
      context,
      frameRate,
      animation,
      spriteSize: playerSize,
    });

    console.log("context", context);

    this.playerPosition = playerPosition;

    this.hitBox = {
      position: {
        x: this.playerPosition.x + 55,
        y: this.playerPosition.y + 33,
      },
      width: 50,
      height: 55,
    };

    this.playerSize = playerSize;
    this.context = context;
    this.sides = {
      bottom: this.playerPosition.y + this.playerSize.height,
    };

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.gravity = 1;
    this.speed = 10;
    this.collisionsBlocks = collisionsBlocks;

    this.animation = animation;
    this.lastDirection = lastDirection;

    this.preventInput = preventInput;
  }

  checkHorizontalCollision() {
    for (let i = 0; i < this.collisionsBlocks.length; i++) {
      const collisionBlock = this.collisionsBlocks[i];

      // if collision exists
      // we watch if x not in block
      if (
        this.hitBox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitBox.position.x + this.hitBox.width >=
          collisionBlock.position.x &&
        this.hitBox.position.y + this.hitBox.height >=
          collisionBlock.position.y &&
        this.hitBox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.x < 0) {
          // we move out box on width between inner block x and outer block x
          const offset = this.hitBox.position.x - this.playerPosition.x;
          this.playerPosition.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }

        if (this.velocity.x > 0) {
          const offset =
            this.hitBox.position.x - this.playerPosition.x + this.hitBox.width;
          this.playerPosition.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
      }
    }
  }

  checkVerticalCollision() {
    for (let i = 0; i < this.collisionsBlocks.length; i++) {
      const collisionBlock = this.collisionsBlocks[i];
      // if collision exists
      if (
        this.hitBox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitBox.position.x + this.hitBox.width >=
          collisionBlock.position.x &&
        this.hitBox.position.y + this.hitBox.height >=
          collisionBlock.position.y &&
        this.hitBox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        if (this.velocity.y < 0) {
          this.velocity.y = 0;

          // distance between inner box y and outbox y
          const offset = this.hitBox.position.y - this.playerPosition.y;

          this.playerPosition.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }

        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          const offset =
            this.hitBox.position.y - this.playerPosition.y + this.hitBox.height;
          this.playerPosition.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    // moving from top to bottom
    this.velocity.y += this.gravity;
    this.playerPosition.y += this.velocity.y;
  }

  updateHitBox() {
    this.hitBox = {
      ...this.hitBox,
      position: {
        x: this.playerPosition.x + 55,
        y: this.playerPosition.y + 33,
      },
    };
  }

  update() {
    // test player blue box

    // this.context.fillStyle = "rgba(0, 0, 255, 0.5)";
    // this.context.fillRect(
    //   this.playerPosition.x,
    //   this.playerPosition.y,
    //   this.playerSize.width,
    //   this.playerSize.height
    // );

    this.playerPosition.x += this.velocity.x;

    // we use double updateHitBox because checkHorizontalCollision clear ours x and y
    this.updateHitBox();

    // check horizontal collision
    this.checkHorizontalCollision();

    // need apply gravity before check horizontal, it will be bugs
    this.applyGravity();

    this.updateHitBox();

    this.checkVerticalCollision();
    // check vertical collisions
  }

  handleInput(keys: IKeys) {
    if (!this.preventInput) {
      return;
    }

    if (this.animation) {
      if (keys.arrowRight.pressed) {
        this.switchSprite(this.animation.runRight);
        this.lastDirection = "runRight";
        this.velocity.x = 4;
      } else if (keys.arrowLeft.pressed) {
        this.switchSprite(this.animation.runLeft);
        this.lastDirection = "runLeft";
        this.velocity.x = -4;
      } else {
        if (this.lastDirection === "runRight") {
          this.switchSprite(this.animation.idleRight);
        } else {
          this.switchSprite(this.animation.idleLeft);
        }
      }
    }
  }
}
