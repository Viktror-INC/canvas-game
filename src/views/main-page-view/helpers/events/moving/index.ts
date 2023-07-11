import { IKeys } from "@/views/main-page-view";
import { Player } from "../../classes/player";
import { SpriteWithAnimation } from "../../classes/sprite-with-animation";

interface IMoving {
  event: KeyboardEvent;
  player: Player;
  keys: IKeys;
  doors: SpriteWithAnimation[];
}

export const handleKeyDown = ({ event, player, keys, doors }: IMoving) => {
  switch (event.key) {
    case "ArrowUp":
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];

        // doors detect
        if (
          player.hitBox.position.x + player.hitBox.width <=
            door.spritePosition.x + door.spriteSize.width &&
          player.hitBox.position.x >= door.spritePosition.x &&
          player.hitBox.position.y + player.hitBox.height >=
            door.spritePosition.y &&
          player.hitBox.position.y <=
            door.spritePosition.y + door.spriteSize.height
        ) {
          player.velocity.y = 0;
          player.velocity.x = 0;
          
          door.play();
        } else {
          door.stoptPlay();
        }
      }

      if (player.velocity.y === 0) {
        player.velocity.y -= 20;
      }
      break;

    case "ArrowRight":
      keys.arrowRight.pressed = true;
      break;

    case "ArrowLeft":
      keys.arrowLeft.pressed = true;
      break;

    default:
      return null;
  }
};

// stop moving if unpressed button
export const handleKeyUp = ({ event, player, keys }: IMoving) => {
  switch (event.key) {
    case "ArrowRight":
      //moving player right
      keys.arrowRight.pressed = false;
      break;

    case "ArrowLeft":
      //moving player left
      keys.arrowLeft.pressed = false;
      break;

    default:
      return null;
  }
};
