"use client";
import React, { useEffect, useRef } from "react";
import { Player } from "./helpers/classes/player";
import { handleKeyDown, handleKeyUp } from "./helpers/events/moving";
import { Sprite } from "./helpers/classes/sprite";
import { parsedCollision } from "./helpers/data/colisions";
import { setCollisionsBlocks } from "./utils/set-collisions-blocks";
import { SpriteWithAnimation } from "./helpers/classes/sprite-with-animation";
import { CollisionBlocks } from "./helpers/classes/collisions-block";

export interface IKeys {
  arrowUp: {
    pressed: boolean;
  };
  arrowLeft: {
    pressed: boolean;
  };
  arrowRight: {
    pressed: boolean;
  };
}

export const keys: IKeys = {
  arrowUp: {
    pressed: false,
  },
  arrowLeft: {
    pressed: false,
  },

  arrowRight: {
    pressed: false,
  },
};

const MainPageView = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    // its 16:9
    canvas.width = 64 * 16; //1024
    canvas.height = 64 * 9; //576

    let background: Sprite;

    // created collisions blocks
    let collisionsBlocks: CollisionBlocks[];

    let doors = [
      new SpriteWithAnimation({
        frameRate: 5,
        frameBuffer: 5,
        loop: false,
        autoplay: false,
        spritePosition: {
          x: 800,
          y: 270,
        },
        context,
        imageSrc: "/img/doorOpen.png",
      }),

      new SpriteWithAnimation({
        frameRate: 5,
        frameBuffer: 5,
        loop: false,
        autoplay: false,
        spritePosition: {
          x: 772,
          y: 336,
        },
        context,
        imageSrc: "/img/doorOpen.png",
      }),

      new SpriteWithAnimation({
        frameRate: 5,
        frameBuffer: 5,
        loop: false,
        autoplay: false,
        spritePosition: {
          x: 176,
          y: 335,
        },
        context,
        imageSrc: "/img/doorOpen.png",
      }),
    ];

    let door: SpriteWithAnimation;

    // lvl background
    let level = 3;
    let levels = {
      init: () => {
        player.preventInput = true;
        background = new Sprite({
          position: { x: 0, y: 0 },
          context,
          imageSrc: `/img/backgroundLevel${level}.png`,
        });

        const levelPlayerPosition = [
          { x: 200, y: 200 },
          { x: 100, y: 200 },
          { x: 700, y: 200 },
        ];

        player.spritePosition = levelPlayerPosition[level - 1];
        player.playerPosition = levelPlayerPosition[level - 1];

        // created collisions blocks
        collisionsBlocks = setCollisionsBlocks({
          numbers: parsedCollision(level),
          context,
        });

        player.collisionsBlocks = collisionsBlocks;

        door = doors[level - 1];
        door.stoptPlay();
      },
    };

    const overlay = {
      opacity: 0,
    };

    // player stats
    const player = new Player({
      context,
      imageSrc: "/img/king/idle.png",
      frameRate: 11,
      lastDirection: "idleRight",
      animation: {
        idleRight: {
          frameRate: 11,
          frameBuffer: 3,
          loop: true,
          imageSrc: "/img/king/idle.png",
          animationImage: new Image(),
        },
        idleLeft: {
          frameRate: 11,
          frameBuffer: 3,
          loop: true,
          imageSrc: "/img/king/idleLeft.png",
          animationImage: new Image(),
        },
        runRight: {
          frameRate: 8,
          frameBuffer: 3,
          loop: true,
          imageSrc: "/img/king/runRight.png",
          animationImage: new Image(),
        },
        runLeft: {
          frameRate: 8,
          frameBuffer: 3,
          loop: true,
          imageSrc: "/img/king/runLeft.png",
          animationImage: new Image(),
        },
        runInDoor: {
          frameRate: 8,
          frameBuffer: 3,
          loop: false,
          imageSrc: "/img/king/enterDoor.png",
          animationImage: new Image(),
          isActive: true,
          onComplete: async () => {
            while (overlay.opacity < 1) {
              overlay.opacity += 0.05;
              await new Promise((resolve) => setTimeout(resolve, 50)); // Introduce a delay of 100 milliseconds
            }
            if (player.currentAnimation) {
              if (level + 1 > 3) {
                level = 1;
              } else {
                level += 1;
              }
              levels.init();

              while (overlay.opacity > 0.2) {
                overlay.opacity = overlay.opacity - 0.2;
                await new Promise((resolve) => setTimeout(resolve, 100)); // Introduce a delay of 100 milliseconds
              }
            }
          },
        },
      },
    });

    const animate = () => {
      window.requestAnimationFrame(animate);
      player.velocity.x = 0;

      background.draw();
      door.draw();
      player.draw();
      collisionsBlocks.forEach((block) => block.draw());

      player.handleInput(keys);
      // replay
      player.update();

      context.save();
      context.globalAlpha = overlay.opacity;
      context.fillStyle = "black";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.restore();
    };

    levels.init();
    animate();

    document.addEventListener("keydown", (event) =>
      handleKeyDown({ event, player, keys, door })
    );
    document.addEventListener("keyup", (event) =>
      handleKeyUp({ event, player, keys, door })
    );

    return function cleanup() {
      document.removeEventListener("keydown", (event) =>
        handleKeyDown({ event, player, keys, door })
      );
      document.removeEventListener("keyup", (event) =>
        handleKeyUp({ event, player, keys, door })
      );
      window.cancelAnimationFrame(window.requestAnimationFrame(animate));
    };
  }, []);

  return (
    <div>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default MainPageView;
