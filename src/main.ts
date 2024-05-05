import { AudioController } from "./audio";

const ac = new AudioController();
const nSquares = 16;
const nBalls = 3;
var isPlaying = false;
var isInitiated = false;

function createUI() {
  const matrix = document.createElement("div");
  matrix.classList.add("matrix");
  matrix.id = "matrix";
  document.body.appendChild(matrix);
  for (let i = 0; i < nSquares; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    // square.id = `square-${i}`;
    matrix.appendChild(square);
  }
  for (let i = 0; i < nBalls; i++) {
    const ball = document.createElement("div");
    ball.classList.add("ball");
    ball.id = `ball-${i}`;
    document.body.appendChild(ball);
  }
}

function initUI() {
  const balls: NodeListOf<HTMLElement> = document.querySelectorAll(".ball");
  const squares: NodeListOf<HTMLElement> = document.querySelectorAll(".square");
  let activeBall: HTMLElement | null = null;
  let originSquare: HTMLElement | null = null;

  const dropBall = (target: HTMLElement) => {
    if (activeBall && target.classList.contains("square")) {
      console.log("Dropped:", activeBall.id, target.id);
      ac.unMuteTrack(idToInt(target.id));
      target.appendChild(activeBall);
      originSquare = null;
      activeBall.style.display = "block"; // Make sure to display the ball again
      activeBall = null;
    }
  };

  balls.forEach((ball) => {
    ball.addEventListener("dragstart", (e: DragEvent) => {
      activeBall = ball;
      originSquare = ball.parentElement as HTMLElement;
      e.dataTransfer?.setData("text/plain", ball.id);
      console.log("Lifted:", ball.id, "from", originSquare.id);
      ac.muteTrack(idToInt(originSquare.id));
    });

    ball.addEventListener("touchstart", (e: TouchEvent) => {
      activeBall = ball;
      originSquare = ball.parentElement as HTMLElement;
      console.log("Lifted:", ball.id, "from", originSquare.id);
      e.preventDefault();
      ac.muteTrack(idToInt(originSquare.id));
    });

    ball.addEventListener("touchmove", (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        ball.style.left = `${touch.clientX - 25}px`; // Adjust for center of the ball
        ball.style.top = `${touch.clientY - 25}px`;
      }
    });

    ball.addEventListener("touchend", (e: TouchEvent) => {
      if (!activeBall) return;
      activeBall.style.display = "none"; // Temporarily hide the ball to get element underneath
      const touch = e.changedTouches[0];
      const targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      ) as HTMLElement;
      activeBall.style.display = "block"; // Re-display the ball
      dropBall(targetElement);
      //   console.log("Dropped:", ball.id, targetElement.id);
    });
  });

  squares.forEach((square) => {
    if (!square.id) {
      square.id = `square-${Array.from(squares).indexOf(square)}`;
    }
    square.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
    });

    square.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      const data = e.dataTransfer?.getData("text");
      if (data) {
        const ball = document.getElementById(data) as HTMLElement;
        dropBall(square);
      }
    });
  });
}

function idToInt(id: string): number {
  const parts = id.split("-");
  if (parts.length < 2) {
    return -1;
  }
  return parseInt(parts[1]);
}

async function initAudio() {
  if (isInitiated) {
    return;
  }
  isInitiated = true;
  await ac.initAudio([
    "stems/drums.wav",
    "stems/hats.wav",
    "stems/kick-hat.wav",
    "stems/toms.wav",
    "stems/acid-and-chord.wav",
    "stems/bass.wav",
    "stems/drums.wav",
    "stems/hats.wav",
    "stems/kick-hat.wav",
    "stems/toms.wav",
    "stems/acid-and-chord.wav",
    "stems/bass.wav",
    "stems/drums.wav",
    "stems/hats.wav",
    "stems/kick-hat.wav",
    "stems/toms.wav",
  ]);
  //   ac.unMuteTrack(0);
}

function createStartButton() {
  const startButton = document.getElementById("start-button");
  startButton?.addEventListener("click", () => {
    startButton.remove();
    createUI();
    initUI();
    initAudio();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createStartButton();
});
