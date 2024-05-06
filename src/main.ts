import { AudioController } from "./audio";

const ac = new AudioController();
const nSquares = 16;
const nBalls = 4;
var isPlaying = false;
var isInitiated = false;
var mobileUsage = false;
var ballHome: HTMLElement | null = null;
var fxEnable = false;

function createUI() {
  const fxdiv = document.createElement("div");
  fxdiv.classList.add("fx");
  fxdiv.id = "fx";
  document.body.appendChild(fxdiv);
  fxdiv.style.display = fxEnable ? "block" : "none";
  const fx1 = document.createElement("div");
  fx1.classList.add("fx1");
  fx1.id = "fx1";
  fx1.innerText = "🌊";
  fxdiv.appendChild(fx1);
  const fxspacer = document.createElement("div");
  fxspacer.classList.add("fxspacer");
  fxspacer.id = "fxspacer";
  fxdiv.appendChild(fxspacer);
  const fx2 = document.createElement("div");
  fx2.classList.add("fx2");
  fx2.id = "fx2";
  fx2.innerText = "🕥";
  fxdiv.appendChild(fx2);

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
    ball.innerText = `🌈`;
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

  // init fx
  const fx1 = document.getElementById("fx1");
  if (!fx1) {
    throw new Error("fx1 not found");
  }
  fx1.draggable = true;
  const fx2 = document.getElementById("fx2");
  fx1?.addEventListener("dragstart", (e: DragEvent) => {
    const {x, y} = normalizedXY(e.x, e.y)
    ac.fx1(x, y);
    console.log("dragstart");
  });
  fx1?.addEventListener("drag", (e: DragEvent) => {
    const {x, y} = normalizedXY(e.x, e.y)
    ac.fx1(x, y);
    console.log("dragmove");
  });
  fx1?.addEventListener("dragend", (e: DragEvent) => {
    ac.fx1(0, 0);
    console.log("dragend");
  });
  fx1?.addEventListener("touchstart", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    const touch = e.touches[0];
    const {x, y} = normalizedXY(touch.clientX, touch.clientY)
    ac.fx1(x, y)
    console.log("touchstart");
  });
  fx1?.addEventListener("touchmove", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    const touch = e.touches[0];
    const {x, y} = normalizedXY(touch.clientX, touch.clientY)
    ac.fx1(x, y)
    console.log("touchmove");
  });
  fx1?.addEventListener("touchend", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    ac.fx1(0, 0);
    console.log("touchend");
  });
  // doesnt work, we would need listeners across the whole screen
  // fx1?.addEventListener("click", () => {
  //     // Handle click event for fx1
  //     console.log("click");
  // });

  // fx1?.addEventListener("mousedown", () => {
  //     // Handle mouse down event for fx1
  //     console.log("mousedown");
  // });

  // fx1?.addEventListener("mouseup", () => {
  //     // Handle mouse up event for fx1
  //     console.log("mouseup");
  // });
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

function normalizedXY(x: number, y: number) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    return {x: x / width, y: y / height}
}

async function initAudio() {
  if (isInitiated) {
    return;
  }
  await ac.initAudio([
    "stems/4-on-floor.wav",
    "stems/bass.wav",
    "stems/dnb-124.wav",
    "stems/drums.wav",
    "stems/hats.wav",
    "stems/kick-hat.wav",
    "stems/smooth-chords.wav",
    "stems/toms.wav",
    "stems/guitar.wav",
    "stems/bass.wav",
    "stems/dnb-124.wav",
    "stems/drums.wav",
    "stems/hats.wav",
    "stems/kick-hat.wav",
    "stems/smooth-chords.wav",
    "stems/extacy.wav",
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
  const info = document.getElementById("info");
  startButton?.addEventListener("click", async () => {
    startButton.remove();
    info?.remove();
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
