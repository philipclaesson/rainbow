import { AudioController } from "./audio";

const ac = new AudioController();
const nSquares = 16;
const nBalls = 4;
var isInitiated = false;
var mobileUsage = false;
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

  const ballHome = createElement("div", "ballhome", "ballhome", document.body);
  for (let i = 0; i < nBalls; i++) {
    const ball = createElement("div", "ball", `ball-${i}`, ballHome);
    ball.draggable = true;
    ball.innerText = `🌈`;
  }
}

function initUILogic() {
  const balls: NodeListOf<HTMLElement> = document.querySelectorAll(".ball");

  // Drops a ball into a target element and mutes the track the ball came from
  const dropBall = (ball: HTMLElement, target: HTMLElement) => {
    console.log("Dropped:", ball.id, target.id);
    ac.enableTrack(getSquareId(target.id), true);
    target.appendChild(ball);
  };

  balls.forEach((ball) => {
    // Helper to extract position from event
    function getPositionFromEvent(e: MouseEvent | TouchEvent): {
      x: number;
      y: number;
    } {
      if (e instanceof TouchEvent && e.touches) {
        return { x: e.touches[0].clientX, y: e.touches[0].clientY };
      } else if (e instanceof MouseEvent) {
        return { x: e.clientX, y: e.clientY };
      } else {
        throw new Error("Unsupported event type");
      }
    }

    // Common function for starting the drag
    function startDrag(e: MouseEvent | TouchEvent) {
      const originSquare = ball.parentElement as HTMLElement;
      ball.setAttribute("origin-square", originSquare.id);
      ball.setAttribute("clicked", "true");
      mobileUsage = e.type === "touchstart";
      console.log(`[${e.type}] Lifted`, ball.id, "from", originSquare.id);
      e.preventDefault();
    }

    // Common function for dragging
    function doDrag(e: MouseEvent | TouchEvent) {
      if (ball.getAttribute("clicked") !== "true") return;
      const position = getPositionFromEvent(e);
      ball.style.left = `${position.x - 25}px`;
      ball.style.top = `${position.y - 25}px`;
      // console.log(`[${e.type}] Moving/Dragging`, ball.id);
      e.preventDefault();
    }

    // Common function for ending the drag
    function endDrag(e: MouseEvent | TouchEvent) {
      if (ball.getAttribute("clicked") !== "true") return;
      const position = getPositionFromEvent(e);
      const originSquareId = ball.getAttribute("origin-square");
      ac.enableTrack(getSquareId(originSquareId), false);
      ball.setAttribute("clicked", "false");
      showBalls(false);
      const targetElement = document.elementFromPoint(
        position.x,
        position.y
      ) as HTMLElement;
      showBalls(true);
      dropBall(ball, targetElement);
      console.log(`[${e.type}] Dropped`, ball.id, "from", originSquareId);
    }

    // Add event listeners
    ball.addEventListener("mousedown", startDrag);
    ball.addEventListener("mousemove", doDrag);
    ball.addEventListener("mouseup", endDrag);
    ball.addEventListener("touchstart", startDrag);
    ball.addEventListener("touchmove", doDrag);
    ball.addEventListener("touchend", endDrag);
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
