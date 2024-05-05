import { AudioController } from "./audio";

const ac = new AudioController();
const nSquares = 16;
const nBalls = 3;
var isPlaying = false;
var isInitiated = false;
var mobileUsage = false;
var ballHome: HTMLElement | null = null;

function createUI() {
  const matrix = document.createElement("div");
  matrix.classList.add("matrix");
  matrix.id = "matrix";
  document.body.appendChild(matrix);
  for (let i = 0; i < nSquares; i++) {
    const square = document.createElement("div");
    square.classList.add("square");
    square.id = `square-${i}`;
    matrix.appendChild(square);
  }
  ballHome = document.createElement("div");
  ballHome.classList.add("ballhome");
  ballHome.id = "ballhome";
  document.body.appendChild(ballHome);

  for (let i = 0; i < nBalls; i++) {
    const ball = document.createElement("div");
    ball.classList.add("ball");
    ball.id = `ball-${i}`;
    ball.draggable = true;
    ballHome.appendChild(ball);
  }
}

function initUI() {
  const balls: NodeListOf<HTMLElement> = document.querySelectorAll(".ball");
  const squares: NodeListOf<HTMLElement> = document.querySelectorAll(".square");
  let activeBall: HTMLElement | null = null;
  let originSquare: HTMLElement | null = null;

  const dropBall = (target: HTMLElement) => {
    if (activeBall) {
      console.log("Dropped:", activeBall.id, target.id);
      ac.unMuteTrack(getSquareId(target.id));
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
      console.log("[Dragstart]: Lifted", ball.id, "from", originSquare.id);
      ac.muteTrack(getSquareId(originSquare.id));
    });

    ball.addEventListener("touchstart", (e: TouchEvent) => {
      mobileUsage = true;
      activeBall = ball;
      originSquare = ball.parentElement as HTMLElement;
      console.log("[Touchstart] Lifted", ball.id, "from", originSquare.id);
      ac.muteTrack(getSquareId(originSquare.id));
    });

    ball.addEventListener("touchmove", (e: TouchEvent) => {
      console.log("[Touchmove] Dragging", ball.id, e.touches.length);
      e.preventDefault();
      mobileUsage = true;
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        ball.style.left = `${touch.clientX - 25}px`; // Adjust for center of the ball
        ball.style.top = `${touch.clientY - 25}px`;
      }
    });

    ball.addEventListener("touchend", (e: TouchEvent) => {
      console.log("[Touchend] Dropped", ball.id);
      if (!activeBall) return;
      showBalls(false);
      const touch = e.changedTouches[0];
      const targetElement = document.elementFromPoint(
        touch.clientX,
        touch.clientY
      ) as HTMLElement;
      showBalls(true);
      dropBall(targetElement);
    });
  });

  squares.forEach((square) => {
    square.addEventListener("dragover", (e: DragEvent) => {
      e.preventDefault();
    });

    square.addEventListener("drop", (e: DragEvent) => {
      e.preventDefault();
      dropBall(square);
    });
  });

  if (!ballHome) {
    throw new Error("Ball home not found");
  }
  ballHome.addEventListener("dragover", (e: DragEvent) => {
    e.preventDefault();
  });

  ballHome.addEventListener("drop", (e: DragEvent) => {
    e.preventDefault();
    if (!ballHome) {
      throw new Error("Ball home not found");
    }
    dropBall(ballHome);
  });

  document.addEventListener("dragover", (e) => {
    if (!mobileUsage) {
      e.preventDefault(); // This allows the drop to be accepted.
    }
  });
  document.addEventListener("drop", (e) => {
    if (!mobileUsage) {
      const ballHome = document.getElementById("ballhome") as HTMLElement;
      dropBall(ballHome);
    }
  });
}

function showBalls(show: boolean) {
  const balls: NodeListOf<HTMLElement> = document.querySelectorAll(".ball");
  balls.forEach((ball) => {
    ball.style.display = show ? "block" : "none";
  });
}

function getSquareId(id: string | null): number {
  if (!id) {
    return -1;
  }
  const parts = id.split("square-");
  if (parts.length < 2) {
    return -1;
  }
  return parseInt(parts[1]);
}

async function initAudio() {
  if (isInitiated) {
    return;
  }
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
  isInitiated = true;
}

function spinner(show: boolean) {
  if (show) {
    const spinner = document.createElement("div");

    spinner.classList.add("spinner");
    spinner.id = "spinner";
    document.body.appendChild(spinner);
  } else {
    const spinner = document.getElementById("spinner");
    spinner?.remove();
  }
}

function createStartButton() {
  const startButton = document.getElementById("start-button");
  startButton?.addEventListener("click", async () => {
    startButton.remove();
    spinner(true);
    await initAudio();
    spinner(false);
    createUI();
    initUI();
    draw();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createStartButton();
});

function draw() {
  requestAnimationFrame(draw);
  if (!isInitiated) {
    return;
  }
  for (let i = 0; i < nSquares; i++) {
    const square = document.getElementById(`square-${i}`) as HTMLElement;
    if (square) {
      square.style.backgroundColor = ac.getFrequencyColor(i);
    }
  }
}
