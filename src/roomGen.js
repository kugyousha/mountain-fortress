let mapCols = 27;
let mapRows = 27;
let rawArray = Array(mapCols * mapRows).fill(1);
let generatedRooms = [];

function populateMap(array, cols, rows) {
  let roomsGenerated = 0;
  let tries = 0;
  while ((roomsGenerated < 7 && tries < 300) || tries > 300) {
    tries++;
    let room = generateRoom(array, cols, rows);
    if (room) {
      room.id = roomsGenerated;
      generatedRooms[roomsGenerated] = room;
      roomsGenerated++;
      console.log(generatedRooms);
    }
  }
  connectRooms(array, cols, rows, generatedRooms);
}

function generateRoom(array, cols, rows){
  let minWidth = 3;
  let minHeight = 3;
  let maxWidth = Math.ceil(cols / 6);
  let maxHeight = Math.ceil(rows / 6);
  let roomWidth = Math.ceil(Math.random() * maxWidth) + minWidth;
  let roomHeight = Math.ceil(Math.random() * maxHeight) + minHeight;
  let minDistAppart = 2;

  let roomStart = getRoomStart(array, cols, rows, roomWidth, roomHeight);
  let roomEnd = roomStart + roomWidth;
  let success = true;
  let validIndicies = [];
  let lastIndex;
  for(let i = 0; i < roomWidth; i++){
    for(let j = 0; j < roomHeight; j++){
      let index = roomStart + i + (j * cols);
      if(array[index] === 1) {
        if(i === 0 && array[index-minDistAppart] !== 1) { //left row down touching
          success = false;
          break;
        } else if (i === roomWidth - 1 && array[index+minDistAppart] !== 1) { //right row down touching
          success = false;
          break;
        }  else if (j === 0 && array[(index - (cols * minDistAppart))] !== 1) { //top row touching
          success = false;
          break;
        }  else if (j === roomHeight - 1 && array[(index + (cols * minDistAppart))] !== 1) { //bottom row touching
          success = false;
          break;
        }
        validIndicies.push(index);
        lastIndex = index;
      } else {
        success = false;
        break;
      }
    }
  }

  if (success) {
    for(let i = 0; i < validIndicies.length; i++){
      array[validIndicies[i]] = 0;
    }
    return {topLeft: indexToXY(roomStart, cols), bottomRight: indexToXY(lastIndex, cols), connected: false};
  }else{
    return false;
  }
}

const indexToXY = (index, cols) => {
  let x = index % cols;
  let y = Math.floor(index / cols);
  return { x, y };
};

function getRoomStart(array, cols, rows, roomWidth, roomHeight) {
  let start = null;
  let foundStart = false;
  let tries = 0;
  while (!foundStart) {
    let index = Math.floor(Math.random() * array.length);
    let coords = indexToXY(index, cols);

    // makes sure room doesn't start or end on map edge
    if (
      coords.x + roomWidth < cols - 1 &&
      coords.y + roomHeight < rows - 1 &&
      coords.x > 0 &&
      coords.y > 0
    ) {
      //console.log(index, coords);
      foundStart = true;
      start = index;
    }
    tries++;
    if (tries > 20) {
      foundStart = true; // or break?
    }
  }
  return start;
}

const xyToIndex = (coords, cols) => {
  return coords.y * cols + coords.x;
};

function connectRooms(array, cols, rows, rooms) {
  for (let i = 0; i < rooms.length; i++) {
    let room = rooms[i];
    let willBend = Math.random() > 0.51;
    let pathFound = false;
    let validIndicies = [];
    while (!pathFound) {
      let path = getPointOnSide(room);
      validIndicies = getPathBetweenRooms(array, cols, rows, path);
      // intelligent?
      //let path = findPath(room, rooms);
    }
    for (let i = 0; i < validIndicies.length; i++) {
      array[validIndicies[i]] = 0;
    }
  }
}

function getPointOnSide(room){
  let side = Math.random();
  let point;
  let direction;
  if (side < 0.25) {
    //top
    point = {
      x: getPointBetween(room.topLeft.x, room.bottomRight.x),
      y: room.topLeft.y,
    };
    direction = { x: 0, y: -1 };
  } else if (side < 0.5) {
    //bottom
    point = {
      x: getPointBetween(room.topLeft.x, room.bottomRight.x),
      y: room.bottomRight.y,
    };
    direction = { x: 0, y: 1 };
  } else if (side < 0.75) {
    //left
    point = {
      x: room.topLeft.x,
      y: getPointBetween(room.topLeft.y, room.bottomRight.y),
    };
    direction = { x: -1, y: 0 };
  } else {
    //right
    point = {
      x: room.bottomRight.x,
      y: getPointBetween(room.topLeft.y, room.bottomRight.y),
    };
    direction = { x: 1, y: 0 };
  }
  return {point, direction};
}

function getPathBetweenRooms(array, cols, rows, path){
  validIndicies = [];
      // brute force
  let chanceToBend = 0.1;
  let unconnected = true;
  while(unconnected){
    path.point.x += path.direction.x;
    path.point.y += path.direction.y;
    let currentIndex = xyToIndex(path.point, cols);
    if(path.point.x > 0 && path.point.y > 0
    && path.point.x < cols && path.point.y < rows){
      if(array[currentIndex] === 1){
        validIndicies.push(currentIndex);
      }else if(array[currentIndex] === 0){
        unconnected = false;
        pathFound = true;
      }
      chanceToBend += 0.1;

    }else{
      break;
    }
  }
  return validIndicies;
}

function getPointBetween(xy1, xy2) { //inclusive
  return Math.floor(Math.random() * (xy2 - xy1 + 1) + xy1);
}
