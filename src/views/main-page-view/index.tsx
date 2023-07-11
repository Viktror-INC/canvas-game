"use client";
import React, { useEffect, useRef } from "react";
import { Player } from "./helpers/classes/player";
import { handleKeyDown, handleKeyUp } from "./helpers/events/moving";
import { Sprite } from "./helpers/classes/sprite";
import { parsedCollision } from "./helpers/data/colisions";
import { setCollisionsBlocks } from "./utils/set-collisions-blocks";
import { SpriteWithAnimation } from "./helpers/classes/sprite-with-animation";

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

    // lvl background
    let backgroundLvl = 1;
    const background = new Sprite({
      position: { x: 0, y: 0 },
      context,
      imageSrc: `/img/backgroundLevel1.png`,
    });

    // created collisions blocks
    let collisionsBlocks = setCollisionsBlocks({
      numbers: parsedCollision,
      context,
    });

    // player stats
    const player = new Player({
      context,
      collisionsBlocks,
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
      },
    });

    const doors = [
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
    ];

    const keys: IKeys = {
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

    const animate = () => {
      window.requestAnimationFrame(animate);

      player.velocity.x = 0;
      background.image.src = `/img/backgroundLevel${backgroundLvl}.png`;

      background.draw();
      doors.forEach((door) => door.draw());
      player.draw();
      collisionsBlocks.forEach((block) => block.draw());

      if (player.animation) {
        if (keys.arrowRight.pressed) {
          player.switchSprite(player.animation.runRight);
          player.lastDirection = "runRight";
          player.velocity.x = 4;
        } else if (keys.arrowLeft.pressed) {
          player.switchSprite(player.animation.runLeft);
          player.lastDirection = "runLeft";
          player.velocity.x = -4;
        } else {
          if (player.lastDirection === "runRight") {
            player.switchSprite(player.animation.idleRight);
          } else {
            player.switchSprite(player.animation.idleLeft);
          }
        }
      }

      // replay
      player.update();
    };

    animate();

    document.addEventListener("keydown", (event) =>
      handleKeyDown({ event, player, keys, doors })
    );
    document.addEventListener("keyup", (event) =>
      handleKeyUp({ event, player, keys, doors })
    );

    return function cleanup() {
      document.removeEventListener("keydown", (event) =>
        handleKeyDown({ event, player, keys, doors })
      );
      document.removeEventListener("keyup", (event) =>
        handleKeyUp({ event, player, keys, doors })
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
