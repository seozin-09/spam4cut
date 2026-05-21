import frame1 from "./assets/frame1.png";
import frame2 from "./assets/frame2.png";
import frame3 from "./assets/frame3.png";
import frame4 from "./assets/frame4.png";
import frame5 from "./assets/frame5.png";
import frame6 from "./assets/frame6.png";

const FRAME_LAYOUTS = [
  {
    src: frame1,
  top: '3%',   // 👈 줄이면 위로 올라감 (기존 7%)
  left: '3%',  // 👈 줄이면 왼쪽으로 감 (기존 7%)
  right: '3%',
  bottom: '7%',
  cols: '1fr 1fr', rows: '1fr 1fr',
  photoScale: 0.9,
  defaultPhotoOffsets: [
    { x: 10.5, y: 10 },  // 1번 사진 (왼쪽위) - x 줄이면 왼쪽, y 줄이면 위로
    { x: -10, y: 10 },  // 2번 사진 (오른쪽위)
    { x: 10.5, y: -25 },  // 3번 사진 (왼쪽아래)
    { x: -10, y: -23 },  // 4번 사진 (오른쪽아래)
  ],
  },
  {
    src: frame2,
    top: '4%', left: '4%', right: '4%', bottom: '4%',
    cols: '1fr 1fr', rows: '1fr 1fr',
    photoScale: 0.92,
    defaultPhotoOffsets: [
      { x: 6, y: 3 },  // 1번 사진 (왼쪽위) - x 줄이면 왼쪽, y 줄이면 위로
    { x: -7, y: 3 },  // 2번 사진 (오른쪽위)
    { x: 6, y: -37 },  // 3번 사진 (왼쪽아래)
    { x: -7, y: -37 },
    ],
  },
  {
    src: frame3,
    top: '4%', left: '4%', right: '4%', bottom: '4%',
    cols: '1fr 1fr', rows: '1fr 1fr',
    photoScale: 0.92,
    defaultPhotoOffsets: [
      { x: 6, y: 3 },  // 1번 사진 (왼쪽위) - x 줄이면 왼쪽, y 줄이면 위로
    { x: -7, y: 3 },  // 2번 사진 (오른쪽위)
    { x: 6, y: -37 },  // 3번 사진 (왼쪽아래)
    { x: -7, y: -37 },
    ],
  },
  {
    src: frame4,
    top: '4%', left: '4%', right: '4%', bottom: '4%',
    cols: '1fr 1fr', rows: '1fr 1fr',
    photoScale: 0.82,
    defaultPhotoOffsets: [
      { x: 0, y: 33 }, { x: 0, y: -8 }, { x: 0, y: 0 }, { x: 0, y: -40 },
    ],
  },
  {
    src: frame5,
    top: '4%', left: '4%', right: '4%', bottom: '4%',
    cols: '1fr 1fr', rows: '1fr 1fr',
    photoScale: 0.92,
    defaultPhotoOffsets: [
      { x: -1, y: 33 }, { x: 2, y: -8 }, { x: -1, y: 0 }, { x: 2, y: -40 },
    ],
  },
  {
    src: frame6,
    top: '4%', left: '4%', right: '4%', bottom: '4%',
    cols: '1fr 1fr', rows: '1fr 1fr',
    photoScale: 0.92,
    defaultPhotoOffsets: [
      { x: -2, y: 33 }, { x: -1, y: -8 }, { x: -2, y: 0 }, { x: -1, y: -40 },
    ],
  },
];

export function getDefaultPhotoOffsets(frameSrc) {
  const layout = FRAME_LAYOUTS.find(f => f.src === frameSrc);
  return layout?.defaultPhotoOffsets || [
    { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 }, { x: 0, y: 0 },
  ];
}

export function getPhotoScale(frameSrc) {
  const layout = FRAME_LAYOUTS.find(f => f.src === frameSrc);
  return layout?.photoScale || 1.15;
}

export function getPhotoSlots(frameSrc) {
  const layout = FRAME_LAYOUTS.find(f => f.src === frameSrc);
  return layout?.slots || null;
}

export function getPhotoGridStyle(frameSrc, extraStyle = {}) {
  const layout = FRAME_LAYOUTS.find(f => f.src === frameSrc) || FRAME_LAYOUTS[0];
  return {
    position: 'absolute',
    top: layout.top,
    left: layout.left,
    right: layout.right,
    bottom: layout.bottom,
    display: 'grid',
    gridTemplateColumns: layout.cols,
    gridTemplateRows: layout.rows,
    columnGap: layout.colGap || layout.gap || '0',
    rowGap: layout.rowGap || layout.gap || '0',
    ...extraStyle,
  };
}
