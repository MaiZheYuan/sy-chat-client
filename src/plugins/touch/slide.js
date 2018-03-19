export default function slideListrener (handler) {
    let startX, startY;
    //滑动处理
    function touchstartHandle(ev) {
        startX = ev.touches[0].pageX;
        startY = ev.touches[0].pageY;
    }
    
    function touchendHandle(ev) {
        let endX, endY;
        endX = ev.changedTouches[0].pageX;
        endY = ev.changedTouches[0].pageY;
        let direction = GetSlideDirection(startX, startY, endX, endY);
        typeof handler === 'function' && handler(direction);
    }
    return {
        startListener(elm) {
            elm.addEventListener('touchstart', touchstartHandle, false);
            elm.addEventListener('touchend', touchendHandle, false);
        },
        clearListener(elm) {
            elm.removeEventListener('touchstart', touchstartHandle);
            elm.removeEventListener('touchend', touchendHandle);
        },
    }
}

//返回角度
function GetSlideAngle(dx, dy) {
    return Math.atan2(dy, dx) * 180 / Math.PI;
}

//根据起点和终点返回方向 1：向上，2：向下，3：向左，4：向右,0：未滑动
function GetSlideDirection(startX, startY, endX, endY) {
    let dy = startY - endY;
    let dx = endX - startX;
    let result = 0;
    //如果滑动距离太短
    if (Math.abs(dx) < 2 && Math.abs(dy) < 2) {
        return result;
    }
    let angle = GetSlideAngle(dx, dy);
    if (angle >= -45 && angle < 45) {
        result = "right";
    } else if (angle >= 45 && angle < 135) {
        result = "up";
    } else if (angle >= -135 && angle < -45) {
        result = "down";
    }
    else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
        result = "left";
    }
    
    return result;
}
