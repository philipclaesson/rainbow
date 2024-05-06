import { AudioController } from "./audio";

const ac = new AudioController();
const nSquares = 16;
const nBalls = 4;
var isInitiated = false;
var mobileUsage = false;
var ballHome: HTMLElement | null = null;
var fxEnable = false;

function createUIElements() {
  // Create FX ui
  if (fxEnable) {
    const fxdiv = createElement("div", "fx", "fx", document.body);
    fxdiv.style.display = fxEnable ? "block" : "none";
    const fx1 = createElement("div", "fx1", "fx1", fxdiv);
    fx1.innerText = "🌊";
    const fxspacer = createElement("div", "fxspacer", "fxspacer", fxdiv);
    const fx2 = createElement("div", "fx2", "fx2", fxdiv);
    fx2.innerText = "🕥";
  }

  const matrix = createElement("div", "matrix", "matrix", document.body);
  for (let i = 0; i < nSquares; i++) {
    createElement("div", "square", `square-${i}`, matrix);
  }
  ballHome = createElement("div", "ballhome", "ballhome", document.body);

  for (let i = 0; i < nBalls; i++) {
    const ball = createElement("div", "ball", `ball-${i}`, ballHome);
    ball.draggable = true;
    ball.innerText = `🌈`;
  }
}

function initUILogic() {
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

function initFXUI() {
  if (!fxEnable) {
    return;
  }
  const fx1 = document.getElementById("fx1");
  if (!fx1) {
    throw new Error("fx1 not found");
  }
  fx1.draggable = true;
  const fx2 = document.getElementById("fx2");
  fx1?.addEventListener("dragstart", (e: DragEvent) => {
    const { x, y } = normalizedXY(e.x, e.y);
    ac.fx1(x, y);
    console.log("dragstart");
  });
  fx1?.addEventListener("drag", (e: DragEvent) => {
    const { x, y } = normalizedXY(e.x, e.y);
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
    const { x, y } = normalizedXY(touch.clientX, touch.clientY);
    ac.fx1(x, y);
    console.log("touchstart");
  });
  fx1?.addEventListener("touchmove", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    const touch = e.touches[0];
    const { x, y } = normalizedXY(touch.clientX, touch.clientY);
    ac.fx1(x, y);
    console.log("touchmove");
  });
  fx1?.addEventListener("touchend", (e: TouchEvent) => {
    if (e.touches.length != 1) {
      return;
    }
    ac.fx1(0, 0);
    console.log("touchend");
  });
}

function createElement(
  tag: string,
  cls: string,
  id: string,
  parent: HTMLElement
) {
  const element = document.createElement(tag);
  element.classList.add(cls);
  element.id = id;
  parent.appendChild(element);
  return element;
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
  return { x: x / width, y: y / height };
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
    createElement("div", "spinner", "spinner", document.body);
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
    createUIElements();
    initUILogic();
    initFXUI();
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
